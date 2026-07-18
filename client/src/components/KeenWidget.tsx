/**
 * KEEN floating chat widget (Brief F3/F4) — real conversation, not a mockup.
 *
 *  · Fixed floating button with the brand avatar + online dot, present
 *    through the whole scroll. Movable: the user can dock it to the
 *    bottom-left or bottom-right corner; preference kept in sessionStorage
 *    (guarded — falls back to in-memory state).
 *  · Click opens a floating panel (not fullscreen). Header is honest:
 *    avatar + "KEEN" + an "AI Agent" chip.
 *  · Talks to the landing server's /api/keen/chat — the Anthropic key never
 *    reaches the browser. Limits are enforced server-side (10 msgs/session,
 *    per-IP rate limit); the UI mirrors them with a friendly close + CTA.
 *  · If the server reports disabled (no KEEN_API_KEY in Railway), the button
 *    still renders and the panel shows an offline note + CTA.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { appLink } from "@/lib/appLinks";
import KeenAvatar from "@/components/KeenAvatar";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm KEEN, LeadPrime's AI agent. Ask me anything about the product, pricing, or whether it fits your business — English o español. 👷";

function safeSession(key: string, value?: string): string | null {
  try {
    if (value !== undefined) {
      window.sessionStorage.setItem(key, value);
      return value;
    }
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function makeSessionId(): string {
  const existing = safeSession("keen-session");
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `s-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  return safeSession("keen-session", id) ?? id;
}

export default function KeenWidget() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"right" | "left">(
    () => (safeSession("keen-side") === "left" ? "left" : "right"),
  );
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const sessionIdRef = useRef<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = makeSessionId();
    fetch("/api/keen/status")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  // Other sections can open the widget (e.g. the "Meet KEEN" section CTA).
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("keen:open", handler);
    return () => window.removeEventListener("keen:open", handler);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, sending, open]);

  const toggleSide = useCallback(() => {
    setSide((s) => {
      const next = s === "right" ? "left" : "right";
      safeSession("keen-side", next);
      return next;
    });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim().slice(0, 500);
    if (!text || sending || done) return;
    setInput("");
    setNotice(null);
    const history = [...messages, { role: "user" as const, content: text }];
    setMessages(history);
    setSending(true);
    try {
      const r = await fetch("/api/keen/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, messages: history }),
      });
      if (r.status === 429) {
        setNotice("KEEN is getting a lot of questions right now — try again in a minute.");
        setMessages(history.slice(0, -1));
        setInput(text);
        return;
      }
      if (!r.ok) {
        setNotice("KEEN is offline right now — but you can start free below.");
        setMessages(history.slice(0, -1));
        return;
      }
      const d = await r.json();
      setMessages([...history, { role: "assistant", content: d.reply }]);
      if (d.limitReached) setDone(true);
    } catch {
      setNotice("Connection hiccup — please try again.");
      setMessages(history.slice(0, -1));
      setInput(text);
    } finally {
      setSending(false);
    }
  }, [input, sending, done, messages]);

  const sideClass = side === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

  return (
    <>
      {/* Floating launcher — visible through the whole scroll */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with KEEN, LeadPrime AI agent"
          className={`fixed bottom-4 sm:bottom-6 ${sideClass} z-50 rounded-full shadow-lg shadow-[#00D4FF]/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]`}
        >
          <KeenAvatar size={56} online />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed bottom-4 sm:bottom-6 ${sideClass} z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl border border-[#00D4FF]/25 bg-[#071224]/98 shadow-2xl shadow-black/50 backdrop-blur`}
          style={{ maxHeight: "min(560px, calc(100vh - 3rem))" }}
          role="dialog"
          aria-label="KEEN chat — LeadPrime AI agent"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
            <KeenAvatar size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                KEEN
                <span className="ml-2 align-middle text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF] font-semibold uppercase tracking-wide">
                  AI Agent
                </span>
              </p>
              <p className="text-[11px] leading-tight" style={{ color: enabled ? "#10B981" : "rgba(255,255,255,0.5)" }}>
                {enabled === false ? "Offline" : "● Online"}
              </p>
            </div>
            <button
              onClick={toggleSide}
              aria-label={side === "right" ? "Move chat to the left corner" : "Move chat to the right corner"}
              title={side === "right" ? "Move to left corner" : "Move to right corner"}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {side === "right" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close KEEN chat"
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 180 }}>
            {enabled === false ? (
              <div className="text-sm text-white/70 leading-relaxed">
                <p className="mb-3">
                  KEEN is taking a break right now. The product never does —
                  start free and see it work your pipeline.
                </p>
                <a
                  href={appLink("keen-widget-offline", "signup")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-primary px-4 py-2.5 rounded-lg text-sm font-bold inline-block"
                >
                  Start with $0 — no card
                </a>
              </div>
            ) : (
              <>
                <Bubble role="assistant" content={GREETING} />
                {messages.map((m, i) => (
                  <Bubble key={i} role={m.role} content={m.content} />
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10 flex items-center gap-1.5">
                      <span className="lp-typing-dot" />
                      <span className="lp-typing-dot" style={{ animationDelay: "0.18s" }} />
                      <span className="lp-typing-dot" style={{ animationDelay: "0.36s" }} />
                    </div>
                  </div>
                )}
                {done && (
                  <div className="pt-1">
                    <a
                      href={appLink("keen-widget-limit", "signup")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lp-btn-primary px-4 py-2.5 rounded-lg text-sm font-bold inline-block w-full text-center"
                    >
                      Create a free account to keep chatting
                    </a>
                  </div>
                )}
                {notice && <p className="text-xs text-amber-400/90">{notice}</p>}
              </>
            )}
          </div>

          {/* Input */}
          {enabled !== false && !done && (
            <div className="border-t border-white/10 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  rows={1}
                  maxLength={500}
                  placeholder="Ask about pricing, features, your trade…"
                  aria-label="Message KEEN"
                  className="flex-1 resize-none rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/60"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  onClick={() => void send()}
                  disabled={sending || !input.trim()}
                  aria-label="Send message to KEEN"
                  className="lp-btn-primary rounded-xl p-2.5 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-6 6m6-6l6 6" />
                  </svg>
                </button>
              </div>
              <p className="text-[10.5px] text-white/65 mt-2 leading-snug">
                AI agent · public product info only — no account data. Usage
                limits apply per visitor.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Bubble({ role, content }: Msg) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          role === "user"
            ? "bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-white"
            : "bg-white/5 border border-white/10 text-white/85"
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {content}
      </div>
    </div>
  );
}
