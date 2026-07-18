/**
 * KEEN live chat endpoint (Brief F4). Security posture:
 *
 *  · The Anthropic API key comes ONLY from the KEEN_API_KEY Railway env var
 *    (a DEDICATED key from a capped workspace, separate from production and
 *    from any personal account). Never hardcoded. Without it the endpoint
 *    reports disabled and the widget shows an offline state — no fallback
 *    to any other credential, ever.
 *  · Strict limits so a public endpoint cannot burn tokens:
 *      - max 10 user messages per session (server-tracked, not client-trusted)
 *      - per-IP rate limit: 8 req/min and 60 req/3h
 *      - input capped at 500 chars per message, history capped at 21 messages
 *      - output capped at 300 tokens, short-answer system prompt
 *  · Friendly degradation on rate limit / wallet exhaustion / provider errors.
 */
import type { Express, Request } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { KEEN_SYSTEM_PROMPT } from "./systemPrompt.js";

const MAX_USER_MESSAGES = 10;
const MAX_INPUT_CHARS = 500;
const MAX_HISTORY_MESSAGES = 21;
const MAX_OUTPUT_TOKENS = 300;
const RATE_PER_MINUTE = 8;
const RATE_PER_WINDOW = 60;
const RATE_WINDOW_MS = 3 * 60 * 60 * 1000;
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

// Cost-control choice per Brief F ("no quemar tokens"): Haiku 4.5 is the
// fast, low-cost tier — right-sized for a public marketing Q&A widget.
// Override with KEEN_MODEL in Railway if a stronger model is ever wanted.
const MODEL = process.env.KEEN_MODEL || "claude-haiku-4-5";

const LIMIT_REPLY_EN =
  "I've loved chatting, but this demo caps out here! To keep talking with me — and put me to work on your actual pipeline — create a free account: $0 Pay-As-You-Go, no credit card. See you inside! 🚀";
const LIMIT_REPLY_NOTE_ES =
  " / ¡Me encantó platicar! Para seguir, crea tu cuenta gratis — $0, sin tarjeta.";

type SessionEntry = { count: number; last: number };
type RateEntry = { minuteStart: number; minuteCount: number; windowStart: number; windowCount: number };

const sessions = new Map<string, SessionEntry>();
const rates = new Map<string, RateEntry>();

function sweep() {
  const now = Date.now();
  sessions.forEach((v, k) => {
    if (now - v.last > SESSION_TTL_MS) sessions.delete(k);
  });
  rates.forEach((v, k) => {
    if (now - v.windowStart > RATE_WINDOW_MS) rates.delete(k);
  });
}
setInterval(sweep, 10 * 60 * 1000).unref();

function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0];
  return (first || req.socket.remoteAddress || "unknown").trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  let r = rates.get(ip);
  if (!r || now - r.windowStart > RATE_WINDOW_MS) {
    r = { minuteStart: now, minuteCount: 0, windowStart: now, windowCount: 0 };
    rates.set(ip, r);
  }
  if (now - r.minuteStart > 60_000) {
    r.minuteStart = now;
    r.minuteCount = 0;
  }
  r.minuteCount += 1;
  r.windowCount += 1;
  return r.minuteCount > RATE_PER_MINUTE || r.windowCount > RATE_PER_WINDOW;
}

export function registerKeenRoutes(app: Express) {
  const apiKey = process.env.KEEN_API_KEY;
  const client = apiKey
    ? new Anthropic({ apiKey, timeout: 30_000, maxRetries: 1 })
    : null;

  app.get("/api/keen/status", (_req, res) => {
    res.json({ enabled: Boolean(client) });
  });

  app.post("/api/keen/chat", async (req, res) => {
    if (!client) {
      return res.status(503).json({ error: "disabled" });
    }

    const ip = clientIp(req);
    if (rateLimited(ip)) {
      return res.status(429).json({ error: "rate_limited" });
    }

    const { sessionId, messages } = req.body ?? {};
    if (
      typeof sessionId !== "string" ||
      sessionId.length < 8 ||
      sessionId.length > 64 ||
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_HISTORY_MESSAGES
    ) {
      return res.status(400).json({ error: "bad_request" });
    }

    const history: { role: "user" | "assistant"; content: string }[] = [];
    for (const m of messages) {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
        return res.status(400).json({ error: "bad_request" });
      }
      const content =
        m.role === "user" ? m.content.slice(0, MAX_INPUT_CHARS) : m.content.slice(0, 2000);
      if (!content.trim()) return res.status(400).json({ error: "bad_request" });
      history.push({ role: m.role, content });
    }
    if (history[history.length - 1].role !== "user") {
      return res.status(400).json({ error: "bad_request" });
    }

    // Session cap — tracked server-side so trimming client history can't
    // reset it. The stored counter wins over whatever the client sends.
    const now = Date.now();
    const entry = sessions.get(sessionId) ?? { count: 0, last: now };
    entry.count += 1;
    entry.last = now;
    sessions.set(sessionId, entry);
    const userMsgCount = Math.max(entry.count, history.filter((m) => m.role === "user").length);
    if (userMsgCount > MAX_USER_MESSAGES) {
      return res.json({ reply: LIMIT_REPLY_EN + LIMIT_REPLY_NOTE_ES, limitReached: true, remaining: 0 });
    }

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: KEEN_SYSTEM_PROMPT,
        messages: history,
      });
      const reply = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      const remaining = Math.max(0, MAX_USER_MESSAGES - userMsgCount);
      return res.json({
        reply: reply || "Sorry — try me again in a moment.",
        remaining,
        limitReached: remaining === 0,
      });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        return res.status(429).json({ error: "busy" });
      }
      if (
        err instanceof Anthropic.AuthenticationError ||
        err instanceof Anthropic.PermissionDeniedError
      ) {
        console.error("[keen] credential problem — check KEEN_API_KEY");
        return res.status(503).json({ error: "disabled" });
      }
      if (err instanceof Anthropic.APIError) {
        console.error(`[keen] API error ${err.status ?? "?"}: ${err.message}`);
        return res.status(503).json({ error: "unavailable" });
      }
      console.error("[keen] unexpected error", err);
      return res.status(503).json({ error: "unavailable" });
    }
  });
}
