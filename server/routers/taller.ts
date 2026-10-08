/**
 * Taller virtual LeadPrime (sábado 17 de octubre de 2026, por Zoom).
 *
 * Registro público (/taller) y registro por el equipo de llamadas
 * (/taller/equipo). Cada registro:
 *   1. se guarda en Neon (tabla taller_registrations, se crea sola),
 *   2. recibe al instante la invitación por correo (Resend, desde
 *      leadprime@chyrris.com) con el enlace de Zoom y el archivo de calendario,
 *   3. avisa al equipo (TALLER_OWNER_EMAIL),
 *   4. recibe dos recordatorios automáticos (viernes 9:00 AM y sábado 7:15 AM,
 *      hora de California) que manda el planificador de este mismo proceso.
 *
 * Secretos: solo variables de Railway (RESEND_API_KEY, NEON_DATABASE_URL,
 * EVENTO_ADMIN_PIN / TALLER_TEAM_PIN). Nunca en el repo.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Express } from "express";
import pkg from "pg";
import { timingSafeEqual } from "node:crypto";
import { publicProcedure, router } from "../_core/trpc";
import {
  TALLER,
  TALLER_SLUG,
  TALLER_TEAM_MEMBERS,
  TALLER_TRADES,
  googleCalendarUrl,
} from "@shared/taller";

const { Pool } = pkg;

// ── Configuración ──────────────────────────────────────────────────────────
const FROM_EMAIL = () =>
  process.env.TALLER_FROM_EMAIL ?? "LeadPrime <leadprime@chyrris.com>";
const REPLY_TO = () => process.env.TALLER_REPLY_TO ?? "leadprime@chyrris.com";
const OWNER_EMAILS = () =>
  (process.env.TALLER_OWNER_EMAIL ?? "leadprime@chyrris.com")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
const ZOOM_URL = () => process.env.TALLER_ZOOM_URL ?? TALLER.zoomUrl;
const SITE = () => process.env.TALLER_SITE_URL ?? "https://leadprimecrm.chyrris.com";

// ── Base de datos ──────────────────────────────────────────────────────────
let _pool: InstanceType<typeof Pool> | null = null;
function getPool() {
  if (!_pool) {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Base de datos no configurada",
      });
    }
    _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  }
  return _pool;
}

let _tableReady: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (!_tableReady) {
    _tableReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS taller_registrations (
          id SERIAL PRIMARY KEY,
          event_slug TEXT NOT NULL DEFAULT '${TALLER_SLUG}',
          full_name TEXT NOT NULL,
          business_name TEXT,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          trade TEXT,
          city TEXT,
          note TEXT,
          registered_by TEXT NOT NULL DEFAULT 'web',
          channel_pref TEXT NOT NULL DEFAULT 'email',
          consent_contact BOOLEAN NOT NULL DEFAULT false,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          gclid TEXT,
          referrer TEXT,
          attendee_code TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'registered',
          invite_email_id TEXT,
          invite_sent_at TIMESTAMPTZ,
          invite_error TEXT,
          reminder1_sent_at TIMESTAMPTZ,
          reminder2_sent_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS taller_registrations_event_email
           ON taller_registrations (event_slug, LOWER(email))`
      );
    })().catch(e => {
      _tableReady = null;
      throw e;
    });
  }
  return _tableReady;
}

export type TallerRegistration = {
  id: number;
  event_slug: string;
  full_name: string;
  business_name: string | null;
  phone: string;
  email: string;
  trade: string | null;
  city: string | null;
  note: string | null;
  registered_by: string;
  channel_pref: string;
  consent_contact: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  referrer: string | null;
  attendee_code: string;
  status: string;
  invite_email_id: string | null;
  invite_sent_at: string | null;
  invite_error: string | null;
  reminder1_sent_at: string | null;
  reminder2_sent_at: string | null;
  created_at: string;
};

// ── PIN del equipo / admin ─────────────────────────────────────────────────
// El formulario del equipo y el panel usan TALLER_TEAM_PIN; si no existe, el
// mismo PIN del admin del evento (EVENTO_ADMIN_PIN). Falla cerrado.
const PIN_MAX_ATTEMPTS = 10;
const PIN_WINDOW_MS = 15 * 60 * 1000;
let pinAttempts = { count: 0, windowStart: 0 };

function requirePin(pin: string): void {
  const expected = process.env.TALLER_TEAM_PIN || process.env.EVENTO_ADMIN_PIN;
  if (!expected) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "PIN del equipo no configurado (TALLER_TEAM_PIN)",
    });
  }
  const now = Date.now();
  if (now - pinAttempts.windowStart > PIN_WINDOW_MS) {
    pinAttempts = { count: 0, windowStart: now };
  }
  if (pinAttempts.count >= PIN_MAX_ATTEMPTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Demasiados intentos. Espera 15 minutos.",
    });
  }
  const a = Buffer.from(String(pin));
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    pinAttempts.count++;
    throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
  }
  pinAttempts.count = 0;
}

// ── Utilidades ─────────────────────────────────────────────────────────────
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function firstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildIcs(zoomUrl: string = ZOOM_URL()): string {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const now = fmt(new Date().toISOString());
  const description = `${TALLER.title}\n\nEnlace de Zoom: ${zoomUrl}\nID de reunión: ${TALLER.meetingId} · Passcode: ${TALLER.passcode}\n\n${TALLER.disclaimer}\n${TALLER.organizer}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LeadPrime//Taller 17 oct 2026//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${TALLER_SLUG}@leadprimecrm.chyrris.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${fmt(TALLER.startIso)}`,
    `DTEND:${fmt(TALLER.endIso)}`,
    `SUMMARY:${icsEscape(`${TALLER.shortName} — taller gratis por Zoom (LeadPrime)`)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `LOCATION:${icsEscape(zoomUrl)}`,
    `URL:${zoomUrl}`,
    `ORGANIZER;CN=LeadPrime:mailto:${REPLY_TO()}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape("En 30 minutos empieza el taller de LeadPrime")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// ── Correos ────────────────────────────────────────────────────────────────
const GOLD = "#D4AF37";
const BG = "#080C14";

type EmailPayload = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  attachIcs?: boolean;
};

async function sendResend(payload: EmailPayload): Promise<{ id: string | null; error: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Taller] RESEND_API_KEY no está definida — correo omitido");
    return { id: null, error: "RESEND_API_KEY no definida" };
  }
  const body: Record<string, unknown> = {
    from: FROM_EMAIL(),
    to: payload.to,
    reply_to: REPLY_TO(),
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  };
  if (payload.attachIcs) {
    body.attachments = [
      {
        filename: "taller-leadprime-17-oct.ics",
        content: Buffer.from(buildIcs()).toString("base64"),
        content_type: "text/calendar",
      },
    ];
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const textBody = await res.text();
    if (!res.ok) {
      console.error("[Taller] Resend error:", res.status, textBody);
      return { id: null, error: `Resend ${res.status}: ${textBody.slice(0, 300)}` };
    }
    try {
      const json = JSON.parse(textBody) as { id?: string };
      return { id: json.id ?? null, error: null };
    } catch {
      return { id: null, error: null };
    }
  } catch (e) {
    console.error("[Taller] Resend fetch failed:", e);
    return { id: null, error: String(e) };
  }
}

function layout(innerHtml: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LeadPrime</title></head>
<body style="margin:0;padding:0;background:${BG};">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:Inter,Helvetica,Arial,sans-serif;color:#ffffff;">
${innerHtml}
<tr><td style="padding:22px 8px 0;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">¿Preguntas? Responda a este correo o escriba a <a href="mailto:${REPLY_TO()}" style="color:${GOLD};text-decoration:none;">${REPLY_TO()}</a> · ${TALLER.contactPhone}</p>
  <p style="margin:10px 0 0;color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;">${escapeHtml(TALLER.disclaimer)}</p>
  <p style="margin:10px 0 0;color:rgba(255,255,255,0.2);font-size:12px;">© 2026 ${escapeHtml(TALLER.organizer)}</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function zoomBlock(zoomUrl: string, label = "Entrar al taller por Zoom"): string {
  return `
<tr><td style="padding:6px 8px 18px;text-align:center;">
  <a href="${zoomUrl}" style="display:inline-block;background:${GOLD};color:#0a1628;text-decoration:none;font-weight:900;font-size:17px;padding:16px 30px;border-radius:12px;">${escapeHtml(label)} →</a>
  <p style="margin:12px 0 0;color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;">Si el botón no abre, copie este enlace:<br><a href="${zoomUrl}" style="color:${GOLD};word-break:break-all;">${zoomUrl}</a><br>ID de reunión: <strong style="color:#fff;">${TALLER.meetingId}</strong> · Passcode: <strong style="color:#fff;">${TALLER.passcode}</strong></p>
</td></tr>`;
}

function detailsBlock(): string {
  const row = (icon: string, label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.45);font-size:14px;width:36px;">${icon}</td><td style="padding:6px 0;color:rgba(255,255,255,0.45);font-size:14px;width:90px;">${label}</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${value}</td></tr>`;
  return `
<tr><td style="padding:0 8px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
  <tr><td style="padding:18px 22px;">
    <p style="margin:0 0 10px;color:${GOLD};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Los datos</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("📅", "Fecha", escapeHtml(TALLER.dateLabel))}
      ${row("🕗", "Hora", escapeHtml(TALLER.timeLabel))}
      ${row("⏱", "Duración", `${escapeHtml(TALLER.durationLabel)} (entre 10 minutos antes)`)}
      ${row("💻", "Dónde", "Por Zoom, desde su celular o computadora")}
      ${row("🗣", "Idioma", "Español")}
    </table>
  </td></tr></table>
</td></tr>`;
}

function calendarBlock(): string {
  const gcal = googleCalendarUrl(ZOOM_URL());
  const ics = `${SITE()}/api/taller/invite.ics`;
  return `
<tr><td style="padding:0 8px 18px;text-align:center;">
  <a href="${gcal}" style="display:inline-block;margin:4px;padding:11px 18px;border:1px solid rgba(212,175,55,0.5);border-radius:10px;color:${GOLD};text-decoration:none;font-weight:700;font-size:14px;">📆 Agregar a Google Calendar</a>
  <a href="${ics}" style="display:inline-block;margin:4px;padding:11px 18px;border:1px solid rgba(255,255,255,0.2);border-radius:10px;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">📎 Guardar en mi calendario (iPhone/Outlook)</a>
</td></tr>`;
}

export function invitationEmail(reg: Pick<TallerRegistration, "full_name" | "attendee_code">): EmailPayload & { to: string[] } {
  const zoomUrl = ZOOM_URL();
  const name = escapeHtml(firstName(reg.full_name) || reg.full_name);
  const bullets = TALLER.bullets
    .map(
      (b, i) => `
      <tr><td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.07);">
        <p style="margin:0 0 4px;color:#fff;font-size:15px;font-weight:700;"><span style="color:${GOLD};">${i + 1}.</span> ${escapeHtml(b.title)}</p>
        <p style="margin:0;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;">${escapeHtml(b.text)}</p>
      </td></tr>`
    )
    .join("");
  const html = layout(
    `
<tr><td style="padding:0 8px 18px;text-align:center;">
  <p style="margin:0 0 8px;color:rgba(255,255,255,0.35);font-size:12px;letter-spacing:3px;text-transform:uppercase;">${escapeHtml(TALLER.series)} · Taller gratis por Zoom</p>
  <h1 style="margin:0;font-size:30px;line-height:1.2;font-weight:900;color:${GOLD};">Su lugar está apartado, ${name}.</h1>
  <p style="margin:12px 0 0;color:rgba(255,255,255,0.7);font-size:16px;line-height:1.6;">${escapeHtml(TALLER.dateLabel)} · ${escapeHtml(TALLER.timeLabel)} · ${escapeHtml(TALLER.durationLabel)}</p>
</td></tr>
<tr><td style="padding:0 8px 18px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(212,175,55,0.14),rgba(212,175,55,0.04));border:1px solid rgba(212,175,55,0.35);border-radius:20px;">
  <tr><td style="padding:26px 24px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:54px;line-height:1;font-weight:900;letter-spacing:-1px;">${escapeHtml(TALLER.hook.number)}</p>
    <p style="margin:12px 0 0;color:rgba(255,255,255,0.75);font-size:15px;line-height:1.6;">${escapeHtml(TALLER.hook.text)}</p>
    <p style="margin:14px 0 0;color:#fff;font-size:16px;line-height:1.6;font-weight:700;">El sábado le decimos qué le van a pedir, cómo dejar su contrato en regla y cómo cobrar el depósito con tarjeta antes de empezar. En 40 minutos, sin rodeos.</p>
  </td></tr></table>
</td></tr>
${zoomBlock(zoomUrl, "Guardar mi enlace de Zoom")}
${detailsBlock()}
<tr><td style="padding:0 8px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
  <tr><td style="padding:18px 22px;">
    <p style="margin:0 0 6px;color:${GOLD};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Con qué se va a ir</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bullets}</table>
  </td></tr></table>
</td></tr>
<tr><td style="padding:0 8px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${GOLD};background:rgba(212,175,55,0.05);border-radius:0 12px 12px 0;">
  <tr><td style="padding:14px 18px;">
    <p style="margin:0;color:#fff;font-size:15px;font-weight:700;line-height:1.5;">Tenga a la mano su contrato actual y la última factura que le deban.</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:14px;line-height:1.6;">Lo da ${escapeHtml(TALLER.host)}. No es una clase de leyes: es lo que a él le pidieron y cómo lo resolvió. Al final hay preguntas, y a quien quiera dejar su contrato y su enlace de cobro listos lo ayudamos ese mismo día.</p>
  </td></tr></table>
</td></tr>
${calendarBlock()}
<tr><td style="padding:0 8px 8px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;">Le recordaremos el viernes y el sábado temprano. Su código de asistente: <strong style="color:${GOLD};letter-spacing:2px;">${escapeHtml(reg.attendee_code)}</strong></p>
</td></tr>`,
    `Sábado 17 de octubre, 8:00 AM por Zoom. Aquí está su enlace y lo que se va a llevar en 40 minutos.`
  );
  const text = [
    `Su lugar está apartado, ${firstName(reg.full_name) || reg.full_name}.`,
    ``,
    `${TALLER.series} · ${TALLER.shortName}`,
    `${TALLER.title}`,
    ``,
    `${TALLER.dateLabel} · ${TALLER.timeLabel} · ${TALLER.durationLabel} · Por Zoom, en español`,
    ``,
    `${TALLER.hook.number} ${TALLER.hook.text}`,
    `El sábado le decimos qué le van a pedir, cómo dejar su contrato en regla y cómo cobrar el depósito con tarjeta antes de empezar.`,
    ``,
    `Enlace de Zoom: ${zoomUrl}`,
    `ID de reunión: ${TALLER.meetingId} · Passcode: ${TALLER.passcode}`,
    ``,
    `Con qué se va a ir:`,
    ...TALLER.bullets.map((b, i) => `${i + 1}. ${b.title}: ${b.text}`),
    ``,
    `Tenga a la mano su contrato actual y la última factura que le deban. Lo da ${TALLER.host}.`,
    `Agregar a Google Calendar: ${googleCalendarUrl(zoomUrl)}`,
    ``,
    `Le recordaremos el viernes y el sábado temprano. Código de asistente: ${reg.attendee_code}`,
    `¿Preguntas? Responda a este correo o escriba a ${REPLY_TO()} · ${TALLER.contactPhone}`,
    `${TALLER.disclaimer}`,
    `${TALLER.organizer}`,
  ].join("\n");
  return {
    to: [],
    subject: `✅ Su lugar está apartado: taller gratis el sábado 17 a las 8:00 AM (reglas de 2026 y cómo cobrar)`,
    html,
    text,
    attachIcs: true,
  };
}

export function reminderEmail(
  reg: Pick<TallerRegistration, "full_name">,
  which: 1 | 2
): EmailPayload {
  const zoomUrl = ZOOM_URL();
  const name = escapeHtml(firstName(reg.full_name) || reg.full_name);
  const isTomorrow = which === 1;
  const headline = isTomorrow
    ? `Mañana a las 8:00 AM, ${name}. Aquí está su enlace.`
    : `Empezamos en 45 minutos, ${name}.`;
  const sub = isTomorrow
    ? `El taller gratis «${TALLER.shortName}» es mañana sábado a las 8:00 AM, hora de California. Dura 40 minutos. Entre 10 minutos antes y tenga a la mano su contrato actual.`
    : `Entre ya por Zoom; abrimos la sala 10 minutos antes. 40 minutos y se va con su contrato en regla y una forma de cobrar el depósito antes de empezar.`;
  const html = layout(
    `
<tr><td style="padding:0 8px 18px;text-align:center;">
  <p style="margin:0 0 8px;color:rgba(255,255,255,0.35);font-size:12px;letter-spacing:3px;text-transform:uppercase;">${escapeHtml(TALLER.series)} · ${escapeHtml(TALLER.shortName)}</p>
  <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:900;color:${GOLD};">${headline}</h1>
  <p style="margin:12px 0 0;color:rgba(255,255,255,0.7);font-size:16px;line-height:1.6;">${escapeHtml(sub)}</p>
</td></tr>
${zoomBlock(zoomUrl)}
${detailsBlock()}
<tr><td style="padding:0 8px 8px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;font-weight:700;">${escapeHtml(TALLER.hook.number)} es la multa mínima desde julio. En 40 minutos sabe cómo no pagarla.</p>
</td></tr>`,
    isTomorrow
      ? "Mañana sábado 8:00 AM por Zoom. Su enlace adentro."
      : "Empezamos en 45 minutos. Entre por Zoom."
  );
  const text = [
    headline.replace(/&[a-z]+;/g, ""),
    ``,
    sub,
    ``,
    `Enlace de Zoom: ${zoomUrl}`,
    `ID de reunión: ${TALLER.meetingId} · Passcode: ${TALLER.passcode}`,
    `${TALLER.dateLabel} · ${TALLER.timeLabel} · ${TALLER.durationLabel}`,
    ``,
    `¿Preguntas? Responda a este correo o escriba a ${REPLY_TO()} · ${TALLER.contactPhone}`,
    TALLER.disclaimer,
  ].join("\n");
  return {
    to: [],
    subject: isTomorrow
      ? `⏰ Mañana 8:00 AM: su taller gratis por Zoom (enlace adentro)`
      : `🔴 En 45 minutos empezamos — entre aquí a su taller`,
    html,
    text,
  };
}

function ownerEmail(reg: TallerRegistration, total: number): EmailPayload {
  const rows: Array<[string, string]> = [
    ["Nombre", reg.full_name],
    ["Negocio", reg.business_name ?? "—"],
    ["Teléfono", reg.phone],
    ["Correo", reg.email],
    ["Oficio", reg.trade ?? "—"],
    ["Ciudad", reg.city ?? "—"],
    ["Nota", reg.note ?? "—"],
    ["Registró", reg.registered_by],
    ["Prefiere", reg.channel_pref],
    ["Código", reg.attendee_code],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.5);font-size:14px;width:34%;border-bottom:1px solid rgba(255,255,255,0.06);">${escapeHtml(k)}</td><td style="padding:6px 0;color:#fff;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.06);">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  const html = layout(
    `<tr><td style="padding:0 8px 16px;">
      <h2 style="margin:0 0 4px;color:${GOLD};font-size:20px;">🎟 Registro #${total} al taller del 17</h2>
      <p style="margin:0 0 14px;color:rgba(255,255,255,0.5);font-size:13px;">La invitación ya salió al correo del contratista${reg.channel_pref !== "email" ? " · pidió también mensaje de texto" : ""}.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
      <p style="margin:16px 0 0;color:rgba(255,255,255,0.4);font-size:12px;">Lista completa: <a href="${SITE()}/admin/taller" style="color:${GOLD};">${SITE()}/admin/taller</a></p>
    </td></tr>`,
    `Registro #${total}: ${reg.full_name} (${reg.registered_by})`
  );
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nTotal de registrados: ${total}\n${SITE()}/admin/taller`;
  return {
    to: OWNER_EMAILS(),
    subject: `🎟 Registro #${total} al taller del 17: ${reg.full_name} (${reg.registered_by})`,
    html,
    text,
  };
}

// ── Envío de invitación (con registro del resultado) ───────────────────────
async function sendInvitation(reg: TallerRegistration): Promise<{ ok: boolean; error: string | null }> {
  const pool = getPool();
  const mail = invitationEmail(reg);
  const result = await sendResend({ ...mail, to: [reg.email] });
  await pool.query(
    `UPDATE taller_registrations
       SET invite_email_id = COALESCE($1, invite_email_id),
           invite_sent_at = CASE WHEN $1 IS NULL THEN invite_sent_at ELSE NOW() END,
           invite_error = $2
     WHERE id = $3`,
    [result.id, result.error, reg.id]
  );
  return { ok: !result.error, error: result.error };
}

// ── Planificador de recordatorios (mismo proceso, estado en la base) ───────
let schedulerStarted = false;
let schedulerBusy = false;

export async function runReminderPass(now = new Date()): Promise<{ r1: number; r2: number }> {
  const pool = getPool();
  await ensureTable();
  const eventStart = new Date(TALLER.startIso).getTime();
  const r1At = new Date(TALLER.reminder1Iso).getTime();
  const r2At = new Date(TALLER.reminder2Iso).getTime();
  const counts = { r1: 0, r2: 0 };
  if (now.getTime() >= eventStart + 40 * 60 * 1000) return counts; // el taller ya pasó
  const due: Array<{ which: 1 | 2; column: string }> = [];
  if (now.getTime() >= r1At && now.getTime() < r2At) due.push({ which: 1, column: "reminder1_sent_at" });
  if (now.getTime() >= r2At) due.push({ which: 2, column: "reminder2_sent_at" });
  for (const d of due) {
    const pending = await pool.query<TallerRegistration>(
      `SELECT * FROM taller_registrations
        WHERE event_slug = $1 AND status = 'registered' AND ${d.column} IS NULL
        ORDER BY id ASC LIMIT 200`,
      [TALLER_SLUG]
    );
    for (const reg of pending.rows) {
      const mail = reminderEmail(reg, d.which);
      const result = await sendResend({ ...mail, to: [reg.email] });
      if (!result.error) {
        await pool.query(`UPDATE taller_registrations SET ${d.column} = NOW() WHERE id = $1`, [reg.id]);
        if (d.which === 1) counts.r1++;
        else counts.r2++;
      }
    }
  }
  return counts;
}

export function startTallerScheduler(): void {
  if (schedulerStarted) return;
  if (!process.env.NEON_DATABASE_URL) {
    console.warn("[Taller] Sin NEON_DATABASE_URL — planificador de recordatorios apagado");
    return;
  }
  schedulerStarted = true;
  const tick = async () => {
    if (schedulerBusy) return;
    schedulerBusy = true;
    try {
      const sent = await runReminderPass();
      if (sent.r1 || sent.r2) console.log(`[Taller] Recordatorios enviados: viernes ${sent.r1}, sábado ${sent.r2}`);
    } catch (e) {
      console.error("[Taller] Error en el planificador de recordatorios:", e);
    } finally {
      schedulerBusy = false;
    }
  };
  setTimeout(tick, 30 * 1000);
  setInterval(tick, 5 * 60 * 1000);
}

// ── Rutas Express (calendario y salud) ─────────────────────────────────────
export function registerTallerRoutes(app: Express): void {
  app.get("/api/taller/invite.ics", (_req, res) => {
    res.set("Content-Type", "text/calendar; charset=utf-8");
    res.set("Content-Disposition", 'attachment; filename="taller-leadprime-17-oct.ics"');
    res.set("Cache-Control", "public, max-age=3600");
    res.send(buildIcs());
  });
  app.get("/api/taller/health", async (_req, res) => {
    let db = false;
    let registrations: number | null = null;
    try {
      await ensureTable();
      const r = await getPool().query(
        `SELECT COUNT(*)::int AS n FROM taller_registrations WHERE event_slug = $1 AND status = 'registered'`,
        [TALLER_SLUG]
      );
      db = true;
      registrations = r.rows[0]?.n ?? 0;
    } catch {
      db = false;
    }
    res.json({
      ok: true,
      event: TALLER_SLUG,
      db,
      mail: Boolean(process.env.RESEND_API_KEY),
      pin: Boolean(process.env.TALLER_TEAM_PIN || process.env.EVENTO_ADMIN_PIN),
      registrations,
      scheduler: schedulerStarted,
    });
  });
}

// ── tRPC ───────────────────────────────────────────────────────────────────
const registerInput = z.object({
  full_name: z.string().trim().min(2).max(100),
  business_name: z.string().trim().max(120).optional().nullable(),
  phone: z.string().trim().min(7).max(25),
  email: z.string().trim().email().max(160),
  trade: z.string().trim().max(80).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  note: z.string().trim().max(600).optional().nullable(),
  consent_contact: z.boolean().default(true),
  channel_pref: z.enum(["email", "sms", "both"]).default("email"),
  /** 'web' para el registro público; nombre del agente para el equipo (requiere teamPin). */
  registered_by: z.string().trim().max(40).default("web"),
  teamPin: z.string().max(20).optional(),
  utm_source: z.string().max(120).optional().nullable(),
  utm_medium: z.string().max(120).optional().nullable(),
  utm_campaign: z.string().max(120).optional().nullable(),
  gclid: z.string().max(200).optional().nullable(),
  referrer: z.string().max(300).optional().nullable(),
});

export const tallerRouter = router({
  /** Datos públicos del evento (para la página). */
  info: publicProcedure.query(() => ({
    ...TALLER,
    zoomUrl: ZOOM_URL(),
    trades: TALLER_TRADES,
    team: TALLER_TEAM_MEMBERS,
    googleCalendarUrl: googleCalendarUrl(ZOOM_URL()),
    icsUrl: `${SITE()}/api/taller/invite.ics`,
    registrationOpen: Date.now() < new Date(TALLER.startIso).getTime(),
  })),

  /** Registro (público o del equipo). Reenvía la invitación si el correo ya estaba. */
  register: publicProcedure.input(registerInput).mutation(async ({ input }) => {
    if (Date.now() >= new Date(TALLER.endIso).getTime()) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "El registro para este taller ya cerró." });
    }
    const byTeam = input.registered_by !== "web";
    if (byTeam) requirePin(input.teamPin ?? "");
    const phone = normalizePhone(input.phone);
    if (!phone) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Escriba un teléfono de 10 dígitos de Estados Unidos." });
    }
    const email = input.email.toLowerCase();
    const pool = getPool();
    await ensureTable();

    const existing = await pool.query<TallerRegistration>(
      `SELECT * FROM taller_registrations WHERE event_slug = $1 AND LOWER(email) = $2`,
      [TALLER_SLUG, email]
    );
    if (existing.rows.length > 0) {
      const reg = existing.rows[0];
      if (reg.status !== "registered") {
        await pool.query(`UPDATE taller_registrations SET status = 'registered' WHERE id = $1`, [reg.id]);
      }
      const resent = await sendInvitation(reg);
      return {
        success: true,
        alreadyRegistered: true,
        code: reg.attendee_code,
        email: reg.email,
        inviteSent: resent.ok,
        zoomUrl: ZOOM_URL(),
      };
    }

    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const dup = await pool.query(`SELECT 1 FROM taller_registrations WHERE attendee_code = $1`, [code]);
      if (dup.rows.length === 0) break;
      code = generateCode();
    }
    const inserted = await pool.query<TallerRegistration>(
      `INSERT INTO taller_registrations (
         event_slug, full_name, business_name, phone, email, trade, city, note,
         registered_by, channel_pref, consent_contact,
         utm_source, utm_medium, utm_campaign, gclid, referrer, attendee_code
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        TALLER_SLUG,
        input.full_name,
        input.business_name || null,
        phone,
        email,
        input.trade || null,
        input.city || null,
        input.note || null,
        byTeam ? input.registered_by : "web",
        input.channel_pref,
        input.consent_contact,
        input.utm_source || null,
        input.utm_medium || null,
        input.utm_campaign || null,
        input.gclid || null,
        input.referrer || null,
        code,
      ]
    );
    const reg = inserted.rows[0];
    const invite = await sendInvitation(reg);
    const total = await pool.query(
      `SELECT COUNT(*)::int AS n FROM taller_registrations WHERE event_slug = $1 AND status = 'registered'`,
      [TALLER_SLUG]
    );
    sendResend(ownerEmail(reg, total.rows[0]?.n ?? 0)).catch(e => console.error("[Taller] aviso al equipo falló:", e));
    return {
      success: true,
      alreadyRegistered: false,
      code,
      email,
      inviteSent: invite.ok,
      zoomUrl: ZOOM_URL(),
    };
  }),

  /** Panel: lista completa (PIN). */
  adminList: publicProcedure.input(z.object({ pin: z.string() })).query(async ({ input }) => {
    requirePin(input.pin);
    const pool = getPool();
    await ensureTable();
    const result = await pool.query<TallerRegistration>(
      `SELECT * FROM taller_registrations WHERE event_slug = $1 ORDER BY created_at DESC`,
      [TALLER_SLUG]
    );
    const rows = result.rows;
    const byRegisteredBy: Record<string, number> = {};
    const byTrade: Record<string, number> = {};
    let today = 0;
    const startOfTodayPT = new Date(
      new Date().toLocaleString("en-US", { timeZone: TALLER.timezone })
    );
    startOfTodayPT.setHours(0, 0, 0, 0);
    for (const r of rows) {
      byRegisteredBy[r.registered_by] = (byRegisteredBy[r.registered_by] ?? 0) + 1;
      const t = r.trade ?? "Sin oficio";
      byTrade[t] = (byTrade[t] ?? 0) + 1;
      const createdPT = new Date(new Date(r.created_at).toLocaleString("en-US", { timeZone: TALLER.timezone }));
      if (createdPT >= startOfTodayPT) today++;
    }
    return {
      registrations: rows,
      total: rows.filter(r => r.status === "registered").length,
      today,
      byRegisteredBy,
      byTrade,
      invitesFailed: rows.filter(r => r.invite_error).length,
    };
  }),

  /** Panel: reenviar la invitación (PIN). */
  adminResend: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      const pool = getPool();
      const r = await pool.query<TallerRegistration>(`SELECT * FROM taller_registrations WHERE id = $1`, [input.id]);
      if (r.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      const sent = await sendInvitation(r.rows[0]);
      if (!sent.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: sent.error ?? "No se pudo enviar" });
      return { success: true };
    }),

  /** Panel: cambiar estado (cancelado / asistió / registrado) (PIN). */
  adminUpdateStatus: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number(), status: z.enum(["registered", "cancelled", "attended"]) }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      const pool = getPool();
      const r = await pool.query(`UPDATE taller_registrations SET status = $1 WHERE id = $2 RETURNING id`, [input.status, input.id]);
      if (r.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      return { success: true };
    }),

  /** Panel: borrar un registro de prueba (PIN). */
  adminDelete: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      const pool = getPool();
      const r = await pool.query(`DELETE FROM taller_registrations WHERE id = $1 RETURNING id`, [input.id]);
      if (r.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      return { success: true };
    }),

  /** Panel: correr ahora el pase de recordatorios (PIN). */
  adminRunReminders: publicProcedure
    .input(z.object({ pin: z.string() }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      return runReminderPass();
    }),
});
