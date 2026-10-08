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
import { createHmac, timingSafeEqual } from "node:crypto";
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
const SMS_GATEWAY_URL = () => String(process.env.TALLER_SMS_GATEWAY_URL ?? "").trim();
const SMS_SHARED_SECRET = () => String(process.env.TALLER_SMS_SHARED_SECRET ?? "").trim();
const SMS_GATEWAY_SCOPE = "taller-sms.v1";
const SMS_CALLBACK_SCOPE = "taller-sms-status.v1";
const SMS_CONSENT_VERSION = "taller-sms-consent-2026-10-08";

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
          sms_consent BOOLEAN NOT NULL DEFAULT false,
          sms_consent_at TIMESTAMPTZ,
          sms_consent_version TEXT,
          sms_consent_by TEXT,
          sms_status TEXT NOT NULL DEFAULT 'not_requested',
          sms_provider_id TEXT,
          sms_sent_at TIMESTAMPTZ,
          sms_delivered_at TIMESTAMPTZ,
          sms_error TEXT,
          sms_manual_sent_at TIMESTAMPTZ,
          sms_reminder1_sent_at TIMESTAMPTZ,
          sms_reminder2_sent_at TIMESTAMPTZ,
          sms_last_reply TEXT,
          sms_last_reply_at TIMESTAMPTZ,
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
      await pool.query(`
        ALTER TABLE taller_registrations
          ADD COLUMN IF NOT EXISTS sms_consent BOOLEAN NOT NULL DEFAULT false,
          ADD COLUMN IF NOT EXISTS sms_consent_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_consent_version TEXT,
          ADD COLUMN IF NOT EXISTS sms_consent_by TEXT,
          ADD COLUMN IF NOT EXISTS sms_status TEXT NOT NULL DEFAULT 'not_requested',
          ADD COLUMN IF NOT EXISTS sms_provider_id TEXT,
          ADD COLUMN IF NOT EXISTS sms_sent_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_delivered_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_error TEXT,
          ADD COLUMN IF NOT EXISTS sms_manual_sent_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_reminder1_sent_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_reminder2_sent_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS sms_last_reply TEXT,
          ADD COLUMN IF NOT EXISTS sms_last_reply_at TIMESTAMPTZ
      `);
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
  sms_consent: boolean;
  sms_consent_at: string | null;
  sms_consent_version: string | null;
  sms_consent_by: string | null;
  sms_status: string;
  sms_provider_id: string | null;
  sms_sent_at: string | null;
  sms_delivered_at: string | null;
  sms_error: string | null;
  sms_manual_sent_at: string | null;
  sms_reminder1_sent_at: string | null;
  sms_reminder2_sent_at: string | null;
  sms_last_reply: string | null;
  sms_last_reply_at: string | null;
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

// ── SMS del taller ─────────────────────────────────────────────────────────
// El landing nunca habla con Twilio. Firma una petición corta al backend core,
// que aplica el remitente de sistema, STOP e idempotencia antes de enviar.
type TallerSmsKind = "confirmation" | "reminder1" | "reminder2" | "resend";
type TallerSmsOutcome = {
  ok: boolean;
  status: string;
  error: string | null;
  providerMessageId: string | null;
};

function requestedSms(reg: Pick<TallerRegistration, "sms_consent" | "channel_pref">): boolean {
  return reg.sms_consent && (reg.channel_pref === "sms" || reg.channel_pref === "both");
}

export function manualSmsText(reg: Pick<TallerRegistration, "full_name">): string {
  const name = firstName(reg.full_name) || "amigo";
  return `LeadPrime: ${name}, ya quedó registrado para el taller gratis por Zoom del sábado 17 de octubre a las 8:00 AM, hora de California. Revise su correo para entrar y guardar el calendario. Responda STOP para dejar de recibir textos.`;
}

function statusFromGateway(value: unknown): string {
  const allowed = new Set(["processing", "sent", "delivered", "failed", "suppressed", "manual_ready", "pending_configuration"]);
  const status = String(value || "").toLowerCase();
  return allowed.has(status) ? status : "failed";
}

async function saveSmsOutcome(registrationId: number, outcome: TallerSmsOutcome): Promise<void> {
  const pool = getPool();
  await pool.query(
    `UPDATE taller_registrations
        SET sms_status = CASE
              WHEN sms_status IN ('suppressed', 'delivered') THEN sms_status
              WHEN sms_status = 'sent' AND $1 IN ('processing', 'pending_configuration', 'manual_ready') THEN sms_status
              ELSE $1
            END,
            sms_provider_id = COALESCE($2, sms_provider_id),
            sms_sent_at = CASE WHEN $1 = 'sent' THEN COALESCE(sms_sent_at, NOW()) ELSE sms_sent_at END,
            sms_delivered_at = CASE WHEN $1 = 'delivered' THEN COALESCE(sms_delivered_at, NOW()) ELSE sms_delivered_at END,
            sms_error = $3
      WHERE id = $4 AND sms_status <> 'suppressed'`,
    [outcome.status, outcome.providerMessageId, outcome.error, registrationId]
  );
}

async function sendTallerSms(
  reg: TallerRegistration,
  kind: TallerSmsKind,
  idempotencySuffix = "v1"
): Promise<TallerSmsOutcome> {
  if (!requestedSms(reg)) {
    return { ok: false, status: "not_requested", error: null, providerMessageId: null };
  }

  const url = SMS_GATEWAY_URL();
  const secret = SMS_SHARED_SECRET();
  if (!url || secret.length < 32) {
    const status = reg.registered_by === "web" ? "pending_configuration" : "manual_ready";
    const outcome = {
      ok: false,
      status,
      error: "El SMS automático aún no está configurado.",
      providerMessageId: null,
    };
    await saveSmsOutcome(reg.id, outcome);
    return outcome;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && process.env.NODE_ENV === "production") {
      throw new Error("El gateway SMS debe usar HTTPS.");
    }
  } catch (error) {
    const outcome = {
      ok: false,
      status: "failed",
      error: "La configuración del gateway SMS es inválida.",
      providerMessageId: null,
    };
    await saveSmsOutcome(reg.id, outcome);
    return outcome;
  }

  const requestBody = JSON.stringify({
    eventSlug: TALLER_SLUG,
    registrationId: reg.id,
    phone: reg.phone,
    firstName: firstName(reg.full_name) || reg.full_name,
    kind,
    idempotencyKey: `${TALLER_SLUG}:${reg.id}:${kind}:${idempotencySuffix}`,
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signed = createHmac("sha256", secret)
    .update(`${SMS_GATEWAY_SCOPE}.${timestamp}.${requestBody}`)
    .digest("hex");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Taller-Timestamp": timestamp,
        "X-Taller-Signature": signed,
      },
      body: requestBody,
      signal: controller.signal,
    });
    const raw = await response.text();
    let payload: { success?: boolean; status?: string; error?: string; providerMessageId?: string | null } = {};
    try { payload = JSON.parse(raw); } catch { /* respuesta no JSON: se maneja abajo */ }
    const outcome: TallerSmsOutcome = {
      ok: response.ok && payload.success !== false && statusFromGateway(payload.status) !== "failed",
      status: statusFromGateway(payload.status || (response.ok ? "sent" : "failed")),
      error: payload.error ? String(payload.error).slice(0, 500) : response.ok ? null : `Gateway SMS ${response.status}`,
      providerMessageId: payload.providerMessageId ? String(payload.providerMessageId).slice(0, 100) : null,
    };
    await saveSmsOutcome(reg.id, outcome);
    return outcome;
  } catch (error: any) {
    const outcome: TallerSmsOutcome = {
      ok: false,
      status: "failed",
      error: error?.name === "AbortError" ? "El gateway SMS no respondió a tiempo." : "No se pudo contactar el gateway SMS.",
      providerMessageId: null,
    };
    await saveSmsOutcome(reg.id, outcome);
    return outcome;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Planificador de recordatorios (mismo proceso, estado en la base) ───────
let schedulerStarted = false;
let schedulerBusy = false;

export async function runReminderPass(now = new Date()): Promise<{ r1: number; r2: number; sms1: number; sms2: number }> {
  const pool = getPool();
  await ensureTable();
  const eventStart = new Date(TALLER.startIso).getTime();
  const r1At = new Date(TALLER.reminder1Iso).getTime();
  const r2At = new Date(TALLER.reminder2Iso).getTime();
  const counts = { r1: 0, r2: 0, sms1: 0, sms2: 0 };
  if (now.getTime() >= eventStart + 40 * 60 * 1000) return counts; // el taller ya pasó
  const due: Array<{ which: 1 | 2; emailColumn: string; smsColumn: string }> = [];
  if (now.getTime() >= r1At && now.getTime() < r2At) due.push({ which: 1, emailColumn: "reminder1_sent_at", smsColumn: "sms_reminder1_sent_at" });
  if (now.getTime() >= r2At) due.push({ which: 2, emailColumn: "reminder2_sent_at", smsColumn: "sms_reminder2_sent_at" });
  for (const d of due) {
    const pending = await pool.query<TallerRegistration>(
      `SELECT * FROM taller_registrations
        WHERE event_slug = $1
          AND status = 'registered'
          AND (
            ${d.emailColumn} IS NULL
            OR (sms_consent = true AND sms_status <> 'suppressed' AND ${d.smsColumn} IS NULL)
          )
        ORDER BY id ASC LIMIT 200`,
      [TALLER_SLUG]
    );
    for (const reg of pending.rows) {
      const emailSent = d.which === 1 ? Boolean(reg.reminder1_sent_at) : Boolean(reg.reminder2_sent_at);
      if (!emailSent) {
        const mail = reminderEmail(reg, d.which);
        const result = await sendResend({ ...mail, to: [reg.email] });
        if (!result.error) {
          await pool.query(`UPDATE taller_registrations SET ${d.emailColumn} = NOW() WHERE id = $1`, [reg.id]);
          if (d.which === 1) counts.r1++;
          else counts.r2++;
        }
      }

      const smsSent = d.which === 1 ? Boolean(reg.sms_reminder1_sent_at) : Boolean(reg.sms_reminder2_sent_at);
      if (requestedSms(reg) && reg.sms_status !== "suppressed" && !smsSent) {
        const sms = await sendTallerSms(reg, d.which === 1 ? "reminder1" : "reminder2");
        if (sms.ok && (sms.status === "sent" || sms.status === "delivered")) {
          await pool.query(`UPDATE taller_registrations SET ${d.smsColumn} = NOW() WHERE id = $1`, [reg.id]);
          if (d.which === 1) counts.sms1++;
          else counts.sms2++;
        }
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
      if (sent.r1 || sent.r2 || sent.sms1 || sent.sms2) {
        console.log(`[Taller] Recordatorios enviados: correo viernes ${sent.r1}, correo sábado ${sent.r2}, SMS viernes ${sent.sms1}, SMS sábado ${sent.sms2}`);
      }
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
  // Core llama aquí después de que Twilio acepta, entrega, falla o recibe STOP.
  // El cuerpo crudo se preserva en _core/index.ts para comprobar el HMAC exacto.
  app.post("/api/taller/sms-status", async (req, res) => {
    const secret = SMS_SHARED_SECRET();
    const timestamp = String(req.headers["x-taller-timestamp"] ?? "").trim();
    const received = String(req.headers["x-taller-signature"] ?? "").trim();
    const rawBody = String((req as typeof req & { rawBody?: string }).rawBody ?? "");
    const seconds = Number(timestamp);
    if (!secret || secret.length < 32 || !timestamp || !received || !rawBody || !Number.isFinite(seconds)) {
      return res.status(401).json({ error: "Callback SMS no autorizado" });
    }
    if (Math.abs(Math.floor(Date.now() / 1000) - seconds) > 5 * 60) {
      return res.status(401).json({ error: "Callback SMS vencido" });
    }
    const expected = createHmac("sha256", secret)
      .update(`${SMS_CALLBACK_SCOPE}.${timestamp}.${rawBody}`)
      .digest("hex");
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return res.status(401).json({ error: "Callback SMS inválido" });
    }

    const parsed = z.object({
      eventSlug: z.literal(TALLER_SLUG),
      registrationId: z.number().int().positive(),
      providerMessageId: z.string().max(100).nullable(),
      status: z.enum(["processing", "sent", "delivered", "failed", "suppressed", "received"]),
      error: z.string().max(500).nullable(),
      inboundBody: z.string().max(600).nullable().optional(),
      inboundAt: z.string().datetime().nullable().optional(),
    }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Callback SMS inválido" });
    }

    try {
      await ensureTable();
      const value = parsed.data;
      await getPool().query(
        `UPDATE taller_registrations
            SET sms_status = CASE
                  -- START llega como un callback firmado "sent" con texto
                  -- entrante. Sólo ese evento puede reactivar un STOP.
                  WHEN sms_status = 'suppressed' AND $1 = 'sent' AND $4 IS NOT NULL THEN 'sent'
                  WHEN sms_status IN ('suppressed', 'delivered') THEN sms_status
                  -- Un callback de un intento anterior no puede degradar el
                  -- estado del proveedor que el registro ya muestra.
                  WHEN sms_provider_id IS NOT NULL AND $2 IS NOT NULL AND sms_provider_id <> $2 THEN sms_status
                  WHEN sms_status = 'failed' AND $1 = 'sent' THEN sms_status
                  WHEN $1 IN ('sent', 'delivered', 'failed', 'suppressed') THEN $1
                  ELSE sms_status
                END,
                sms_provider_id = CASE
                  WHEN sms_provider_id IS NOT NULL AND $2 IS NOT NULL AND sms_provider_id <> $2 THEN sms_provider_id
                  ELSE COALESCE($2, sms_provider_id)
                END,
                sms_delivered_at = CASE WHEN $1 = 'delivered' THEN COALESCE(sms_delivered_at, NOW()) ELSE sms_delivered_at END,
                sms_error = CASE WHEN $1 = 'failed' THEN $3 ELSE sms_error END,
                sms_last_reply = COALESCE($4, sms_last_reply),
                sms_last_reply_at = CASE WHEN $4 IS NULL THEN sms_last_reply_at ELSE COALESCE($5::timestamptz, NOW()) END
          WHERE event_slug = $6 AND id = $7`,
        [
          value.status,
          value.providerMessageId,
          value.error,
          value.inboundBody ?? null,
          value.inboundAt ?? null,
          value.eventSlug,
          value.registrationId,
        ]
      );
      return res.json({ ok: true });
    } catch (error) {
      console.error("[Taller] callback SMS no pudo guardar el estado", error);
      return res.status(503).json({ error: "No se pudo guardar el callback SMS" });
    }
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
      smsGateway: Boolean(SMS_GATEWAY_URL() && SMS_SHARED_SECRET().length >= 32),
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
  sms_consent: z.boolean().default(false),
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
    if (input.sms_consent && input.channel_pref === "email") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Elija SMS o ambos canales después de recibir el consentimiento para mensajes de texto." });
    }
    if (byTeam && input.channel_pref !== "email" && !input.sms_consent) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Confirme que la persona aceptó recibir SMS antes de seleccionarlo." });
    }
    const email = input.email.toLowerCase();
    const pool = getPool();
    await ensureTable();

    const existing = await pool.query<TallerRegistration>(
      `SELECT * FROM taller_registrations WHERE event_slug = $1 AND LOWER(email) = $2`,
      [TALLER_SLUG, email]
    );
    if (existing.rows.length > 0) {
      let reg = existing.rows[0];
      if (reg.status !== "registered") {
        await pool.query(`UPDATE taller_registrations SET status = 'registered' WHERE id = $1`, [reg.id]);
      }
      // Una persona anónima que conoce un correo no puede elevar el canal de un
      // registro existente ni provocar un SMS. Sólo un agente autenticado por
      // PIN puede dejar evidencia de un consentimiento renovado.
      if (byTeam && input.sms_consent && input.channel_pref !== "email") {
        const updated = await pool.query<TallerRegistration>(
          `UPDATE taller_registrations
              SET sms_consent = true,
                  sms_consent_at = NOW(),
                  sms_consent_version = $1,
                  sms_consent_by = $2,
                  channel_pref = CASE
                    WHEN channel_pref = 'email' THEN $3
                    WHEN channel_pref <> $3 THEN 'both'
                    ELSE channel_pref
                  END
            WHERE id = $4
            RETURNING *`,
          [SMS_CONSENT_VERSION, input.registered_by, input.channel_pref, reg.id]
        );
        reg = updated.rows[0];
      }
      const resent = await sendInvitation(reg);
      const maySendSms = byTeam && input.sms_consent && requestedSms(reg);
      const sms = maySendSms
        ? await sendTallerSms(reg, "confirmation")
        : { ok: false, status: reg.sms_status, error: null, providerMessageId: reg.sms_provider_id };
      return {
        success: true,
        alreadyRegistered: true,
        code: reg.attendee_code,
        email: reg.email,
        inviteSent: resent.ok,
        smsRequested: requestedSms(reg),
        smsStatus: sms.status,
        smsError: sms.error,
        smsCopyText: byTeam && requestedSms(reg) && !sms.ok ? manualSmsText(reg) : null,
        registrationId: reg.id,
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
         registered_by, channel_pref, consent_contact, sms_consent, sms_consent_at, sms_consent_version,
         sms_consent_by, utm_source, utm_medium, utm_campaign, gclid, referrer, attendee_code
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CASE WHEN $12 THEN NOW() ELSE NULL END,CASE WHEN $12 THEN $13 ELSE NULL END,CASE WHEN $12 THEN $14 ELSE NULL END,$15,$16,$17,$18,$19,$20)
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
        input.sms_consent,
        SMS_CONSENT_VERSION,
        byTeam ? input.registered_by : "web_self",
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
    const sms = requestedSms(reg)
      ? await sendTallerSms(reg, "confirmation")
      : { ok: false, status: "not_requested", error: null, providerMessageId: null };
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
      smsRequested: requestedSms(reg),
      smsStatus: sms.status,
      smsError: sms.error,
      smsCopyText: byTeam && requestedSms(reg) ? manualSmsText(reg) : null,
      registrationId: reg.id,
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
      smsConsented: rows.filter(r => requestedSms(r)).length,
      smsSent: rows.filter(r => ["sent", "delivered"].includes(r.sms_status)).length,
      smsDelivered: rows.filter(r => r.sms_status === "delivered").length,
      smsFailed: rows.filter(r => r.sms_status === "failed").length,
      smsSuppressed: rows.filter(r => r.sms_status === "suppressed").length,
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

  /** Panel: reintento explícito del SMS automático, sólo si existe consentimiento. */
  adminResendSms: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      const pool = getPool();
      const r = await pool.query<TallerRegistration>(
        `SELECT * FROM taller_registrations WHERE event_slug = $1 AND id = $2`,
        [TALLER_SLUG, input.id]
      );
      const reg = r.rows[0];
      if (!reg) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      if (!requestedSms(reg)) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "No hay consentimiento SMS para este registro." });
      }
      if (reg.sms_status === "suppressed") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "La persona pidió no recibir más SMS." });
      }
      // Ventana de cinco minutos: protege contra doble clic sin impedir que el
      // equipo haga otro reintento consciente más tarde.
      const sent = await sendTallerSms(reg, "resend", String(Math.floor(Date.now() / (5 * 60 * 1000))));
      if (!sent.ok) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: sent.error ?? "No se pudo enviar el SMS" });
      }
      return { success: true, status: sent.status };
    }),

  /** Equipo/panel: registra que el agente confirmó el envío manual tras copiarlo. */
  markSmsManualSent: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      requirePin(input.pin);
      const pool = getPool();
      const r = await pool.query<TallerRegistration>(
        `UPDATE taller_registrations
            SET sms_status = CASE WHEN sms_status IN ('sent', 'delivered', 'suppressed') THEN sms_status ELSE 'manual_sent' END,
                sms_manual_sent_at = CASE WHEN sms_status IN ('sent', 'delivered', 'suppressed') THEN sms_manual_sent_at ELSE NOW() END
          WHERE event_slug = $1 AND id = $2 AND sms_consent = true
          RETURNING id, sms_status`,
        [TALLER_SLUG, input.id]
      );
      if (r.rows.length === 0) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "El registro no tiene consentimiento SMS." });
      }
      return { success: true, status: r.rows[0].sms_status };
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
