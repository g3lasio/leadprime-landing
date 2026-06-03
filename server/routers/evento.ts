import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import pkg from "pg";
const { Pool } = pkg;
import QRCode from "qrcode";
import { buildApproveToken } from "./eventoApprove.js";

// Neon PostgreSQL connection — uses NEON_DATABASE_URL env var
let _pool: InstanceType<typeof Pool> | null = null;
function getPool() {
  if (!_pool) {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not configured" });
    _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  }
  return _pool;
}

// Event constants
const EVENT_NAME = "LeadPrime Networking";
const EVENT_DATE = "Jueves 2 de Julio, 2026";
const EVENT_TIME = "7:00 PM – 8:30 PM";
const EVENT_VENUE = "Fairfield, California";
const EVENT_ADDRESS = "1000 Webster Street, Fairfield, CA 94533";

// Generate a unique 6-char attendee code
async function ensureEventRegistrationColumns() {
  const pool = getPool();
  await pool.query(`
    ALTER TABLE event_registrations
      ADD COLUMN IF NOT EXISTS bringing_guest BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS guest_name TEXT,
      ADD COLUMN IF NOT EXISTS guest_role TEXT
  `);
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// 3-minute auto-approval delay
const AUTO_APPROVE_MS = 3 * 60 * 1000;

// Send PENDING (application received) email via Resend
async function sendPendingEmail(email: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("[Evento] RESEND_API_KEY not set — skipping email"); return; }
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:32px;font-weight:900;color:#D4AF37;margin:0;">LeadPrime Networking</h1>
    <p style="color:rgba(255,255,255,0.5);margin-top:8px;">Solicitud recibida ✅</p>
  </div>
  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:0;">¡Hola <strong style="color:#fff;">${name}</strong>! 👋</p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      Recibimos tu solicitud para <strong style="color:#D4AF37;">LeadPrime Networking</strong>.<br>
      En <strong style="color:#fff;">unos minutos</strong> recibirás tu invitación oficial con todos los detalles y tu código QR de entrada.
    </p>
    <div style="text-align:center;margin:28px 0;padding:20px;background:rgba(212,175,55,0.1);border-radius:12px;border:1px solid rgba(212,175,55,0.3);">
      <p style="color:rgba(255,255,255,0.5);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px;">Tu código de asistente</p>
      <p style="color:#D4AF37;font-size:38px;font-weight:900;letter-spacing:4px;margin:0;">LPN-${code}</p>
    </div>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      <strong style="color:#fff;">📅</strong> ${EVENT_DATE} &nbsp;·&nbsp; <strong style="color:#fff;">🕖</strong> ${EVENT_TIME}<br>
      <strong style="color:#fff;">📍</strong> ${EVENT_VENUE} — ${EVENT_ADDRESS}
    </p>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.3);font-size:12px;margin-bottom:8px;">¿Preguntas? <a href="mailto:info@chyrris.com" style="color:#D4AF37;">info@chyrris.com</a></p>
  <p style="text-align:center;color:rgba(255,255,255,0.15);font-size:12px;">© 2026 Chyrris · LeadPrime · Todos los derechos reservados</p>
</body></html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "LeadPrime Networking <evento@chyrris.com>",
        to: [email],
        subject: `✅ Recibimos tu solicitud — LeadPrime Networking | LPN-${code}`,
        html,
      }),
    });
    if (!res.ok) console.error("[Evento] Resend pending email error:", await res.text());
  } catch (e) { console.error("[Evento] Failed to send pending email:", e); }
}

// Generate QR code as base64 data URL
async function generateQRDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: { dark: '#0a1628', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
  } catch (e) {
    console.error('[QR] Failed to generate QR:', e);
    return '';
  }
}

// Send APPROVED email via Resend (with QR code) — fully redesigned
async function sendApprovedEmail(email: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("[Evento] RESEND_API_KEY not set — skipping email"); return; }
  try {
    const qrDataUrl = await generateQRDataUrl(`LPN-${code}`);
    const qrBlock = qrDataUrl
      ? `<div style="text-align:center;margin:24px 0 8px;">
          <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Escanea para entrar</p>
          <div style="display:inline-block;background:#ffffff;padding:12px;border-radius:16px;border:3px solid rgba(212,175,55,0.5);">
            <img src="${qrDataUrl}" alt="QR LPN-${code}" style="width:180px;height:180px;display:block;" />
          </div>
          <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:10px 0 0;">Presenta este QR en la entrada del evento</p>
        </div>`
      : '';
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:32px 20px;max-width:600px;margin:0 auto;">

  <div style="text-align:center;margin-bottom:28px;">
    <p style="color:rgba(255,255,255,0.3);font-size:12px;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px;">Chyrris · Evento Privado</p>
    <h1 style="font-size:30px;font-weight:900;color:#D4AF37;margin:0;">LeadPrime Networking</h1>
    <p style="color:rgba(255,255,255,0.4);margin-top:6px;font-size:14px;">${EVENT_DATE} · ${EVENT_VENUE}</p>
  </div>

  <div style="background:linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04));border:1px solid rgba(212,175,55,0.35);border-radius:20px;padding:32px;margin-bottom:20px;text-align:center;">
    <p style="font-size:44px;margin:0 0 10px;">🔥</p>
    <h2 style="font-size:26px;font-weight:900;color:#fff;margin:0 0 6px;">¡Estás dentro, ${name}!</h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin:0 0 28px;">Tu lugar en LeadPrime Networking está <strong style="color:#D4AF37;">confirmado</strong>. Esta noche va a ser diferente.</p>

    <div style="background:rgba(0,0,0,0.35);border-radius:14px;padding:18px 24px;display:inline-block;margin:0 auto;">
      <p style="color:rgba(255,255,255,0.35);font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 4px;">Tu pase de entrada</p>
      <p style="color:#D4AF37;font-size:42px;font-weight:900;letter-spacing:5px;margin:0;line-height:1.1;">LPN-${code}</p>
    </div>

    ${qrBlock}
  </div>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px 24px;margin-bottom:20px;">
    <p style="color:#D4AF37;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 14px;font-weight:700;">Detalles del evento</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;width:32px;">📅</td><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;width:80px;">Fecha</td><td style="color:#fff;padding:5px 0;font-size:14px;font-weight:600;">${EVENT_DATE}</td></tr>
      <tr><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">🕖</td><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">Hora</td><td style="color:#fff;padding:5px 0;font-size:14px;font-weight:600;">${EVENT_TIME}</td></tr>
      <tr><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">📍</td><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">Lugar</td><td style="color:#fff;padding:5px 0;font-size:14px;font-weight:600;">${EVENT_VENUE}</td></tr>
      <tr><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">📌</td><td style="color:rgba(255,255,255,0.45);padding:5px 0;font-size:14px;">Dirección</td><td style="color:#fff;padding:5px 0;font-size:14px;">${EVENT_ADDRESS}</td></tr>
    </table>
  </div>

  <div style="border-left:3px solid #D4AF37;padding:16px 20px;margin-bottom:20px;background:rgba(212,175,55,0.05);border-radius:0 12px 12px 0;">
    <p style="color:#fff;font-size:17px;font-weight:700;line-height:1.5;margin:0;font-style:italic;">"El siguiente nivel de tu negocio empieza con las personas correctas en el cuarto correcto."</p>
    <p style="color:rgba(255,255,255,0.35);font-size:13px;margin:8px 0 0;">Ven listo para conectar, aprender y crecer 🚀</p>
  </div>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px 24px;margin-bottom:20px;">
    <p style="color:#D4AF37;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;font-weight:700;">Antes de llegar — léelo 👇</p>

    <div style="display:flex;gap:14px;margin-bottom:14px;align-items:flex-start;">
      <span style="font-size:22px;flex-shrink:0;">🔒</span>
      <div><p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 3px;">Evento privado — sin QR no hay entrada</p><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">Nadie entra sin estar registrado. Guarda este email o el código LPN-${code}.</p></div>
    </div>

    <div style="display:flex;gap:14px;margin-bottom:14px;align-items:flex-start;">
      <span style="font-size:22px;flex-shrink:0;">👥</span>
      <div><p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 3px;">¿Traes invitado? Regístralo antes</p><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">Cada persona necesita su propio registro. Sin registro no puede entrar al evento.</p></div>
    </div>

    <div style="display:flex;gap:14px;margin-bottom:14px;align-items:flex-start;">
      <span style="font-size:22px;flex-shrink:0;">📱</span>
      <div><p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 3px;">Lleva tu tablet o teléfono móvil</p><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">Habrá contenido interactivo esa noche — tu dispositivo te va a servir.</p></div>
    </div>

    <div style="display:flex;gap:14px;align-items:flex-start;">
      <span style="font-size:22px;flex-shrink:0;">⏰</span>
      <div><p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 3px;">Llega puntual — 7:00 PM</p><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">El networking abre a las 7 PM en punto y cierra formalmente a las 8:30 PM.</p></div>
    </div>
  </div>

  <div style="text-align:center;padding:16px;margin-bottom:20px;">
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">¿Tienes preguntas? <a href="mailto:info@chyrris.com" style="color:#D4AF37;font-weight:600;">info@chyrris.com</a></p>
  </div>

  <p style="text-align:center;color:rgba(255,255,255,0.15);font-size:12px;">© 2026 Chyrris · LeadPrime · Todos los derechos reservados</p>
</body></html>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "LeadPrime Networking <evento@chyrris.com>",
        to: [email],
        subject: `🎉 ¡Estás dentro! Tu invitación a LeadPrime Networking — LPN-${code}`,
        html,
      }),
    });
    if (!res.ok) console.error("[Evento] Resend approved email error:", await res.text());
  } catch (e) { console.error("[Evento] Failed to send approved email:", e); }
}

// Send REJECTED / WAITLIST email via Resend
async function sendRejectedEmail(email: string, name: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("[Evento] RESEND_API_KEY not set — skipping email"); return; }
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:32px;font-weight:900;color:#D4AF37;margin:0;">LeadPrime Networking</h1>
  </div>
  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      Gracias por tu interés en <strong style="color:#D4AF37;">LeadPrime Networking</strong>. 
      En este momento el evento está al límite de capacidad y no podemos confirmar tu lugar para esta edición.
    </p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      Te agregaremos a nuestra lista de espera y serás de los primeros en enterarte del próximo evento Chyrris en tu área.
    </p>
  </div>
  <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;line-height:1.6;">
      Si tienes preguntas, contáctanos en <a href="mailto:info@chyrris.com" style="color:#D4AF37;">info@chyrris.com</a>
    </p>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;">© 2026 Chyrris · LeadPrime · Owl Fenc LLC · Todos los derechos reservados</p>
</body>
</html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "LeadPrime Networking <evento@chyrris.com>",
        to: [email],
        subject: `LeadPrime Networking — Actualización de tu solicitud`,
        html,
      }),
    });
    if (!res.ok) console.error("[Evento] Resend rejected email error:", await res.text());
  } catch (e) { console.error("[Evento] Failed to send rejected email:", e); }
}

// Notify owner: email to mervin@chyrris.com with approve/reject action buttons
async function notifyOwnerNewRegistration(name: string, role: string, email: string, code: string, extra: {
  id?: number;
  phone: string;
  city: string;
  preferred_language: string;
  years_in_business?: string | null;
  brokerage_name?: string | null;
  business_name?: string | null;
  units_managed?: string | null;
  referral_source: string;
  dietary_restriction: string;
  bringing_guest?: boolean | null;
  guest_name?: string | null;
  guest_role?: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

  const baseUrl = process.env.VITE_APP_ID ? `https://lead-prime.chyrris.com` : `https://lead-prime.chyrris.com`;
  const approveToken = extra.id ? buildApproveToken(extra.id, "approve") : "";
  const rejectToken = extra.id ? buildApproveToken(extra.id, "reject") : "";
  const waitlistToken = extra.id ? buildApproveToken(extra.id, "waitlist") : "";
  const approveUrl = `${baseUrl}/api/evento/action?token=${approveToken}`;
  const rejectUrl = `${baseUrl}/api/evento/action?token=${rejectToken}`;
  const waitlistUrl = `${baseUrl}/api/evento/action?token=${waitlistToken}`;
  const actionButtons = extra.id ? `
  <div style="text-align:center;margin:32px 0;">
    <p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Acción rápida</p>
    <a href="${approveUrl}" style="display:inline-block;background:#D4AF37;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:900;font-size:15px;margin:0 8px 8px;">✅ Aprobar Invitación</a>
    <a href="${waitlistUrl}" style="display:inline-block;background:rgba(255,165,0,0.2);color:#FFA500;border:1px solid #FFA500;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:0 8px 8px;">⏳ Waitlist</a>
    <a href="${rejectUrl}" style="display:inline-block;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid #ef4444;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:0 8px 8px;">❌ Rechazar</a>
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:12px 0 0;">Al aprobar se envía automáticamente el email de invitación con QR al asistente</p>
  </div>` : '';

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "LeadPrime Networking <evento@chyrris.com>",
          to: [process.env.EVENTO_OWNER_EMAIL ?? "mervin@chyrris.com"],
          subject: `🎟 Nueva solicitud: ${name} (${role}) — LeadPrime Networking`,
          html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;"><h2 style="color:#D4AF37;">🎟 Nueva solicitud — LeadPrime Networking</h2><p style="color:orange;font-weight:bold;">Estado: PENDIENTE — requiere aprobación manual</p>${actionButtons}<table style="width:100%;border-collapse:collapse;margin-top:16px;">
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);width:40%">Nombre</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><strong>${name}</strong></td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Email</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${email}</td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Teléfono</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.phone}</td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Rol</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${role}</td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Ciudad</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.city}</td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Idioma</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.preferred_language}</td></tr>
${extra.brokerage_name ? `<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Brokerage</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.brokerage_name}</td></tr>` : ''}
${extra.business_name ? `<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Empresa</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.business_name}</td></tr>` : ''}
${extra.units_managed ? `<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Unidades</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.units_managed}</td></tr>` : ''}
${extra.years_in_business ? `<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Años en negocio</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.years_in_business}</td></tr>` : ''}
${extra.bringing_guest ? `<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Invitado</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.guest_name || 'Sí, sin nombre'}${extra.guest_role ? ' · ' + extra.guest_role : ''}</td></tr>` : ''}
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Referido por</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${extra.referral_source}</td></tr>
<tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;">Código</td><td style="color:#D4AF37;padding:8px 0;font-weight:900;font-size:20px;letter-spacing:2px;">LPN-${code}</td></tr>
</table><p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:32px;">Aprobar/rechazar en: <a href="https://lead-prime.chyrris.com/admin/evento" style="color:#D4AF37;">lead-prime.chyrris.com/admin/evento</a></p></body></html>`,
        }),
      });
      if (!res.ok) console.error("[Evento] Owner notification error:", await res.text());
    } catch (e) { console.error("[Evento] Failed to notify owner:", e); }
  }

  // Manus push notification (best-effort)
  if (forgeApiUrl && forgeApiKey) {
    try {
      await fetch(`${forgeApiUrl}/notification/notify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${forgeApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `🎟 Nueva solicitud: ${name}`,
          content: `${name} (${role}) solicitó asistir a LeadPrime Networking.\nEmail: ${email}\nCódigo: LPN-${code}\nEstado: PENDIENTE`,
        }),
      });
    } catch (e) { console.error("[Evento] Failed to send Manus notification:", e); }
  }
}

// Step 1 schema: minimal fields for initial registration
// Full registration schema (used by RegistrationModal - single step)
const registerFullInput = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  role: z.enum(["Contratista", "Property Manager", "Realtor", "Otro profesional de la industria"]),
  city: z.string().min(1),
  city_other: z.string().optional(),
  preferred_language: z.string().default("Español"),
  consent_contact: z.boolean(),
  consent_photo: z.boolean().optional(),
  business_name: z.string().nullable().optional(),
  trade_types: z.string().nullable().optional(),
  has_cslb_license: z.string().nullable().optional(),
  cslb_license_number: z.string().nullable().optional(),
  years_in_business: z.string().nullable().optional(),
  team_size: z.string().nullable().optional(),
  current_estimating_tool: z.string().nullable().optional(),
  units_managed: z.string().nullable().optional(),
  property_types: z.string().nullable().optional(),
  has_real_estate_license: z.string().nullable().optional(),
  current_pm_software: z.string().nullable().optional(),
  brokerage_name: z.string().nullable().optional(),
  dre_license_number: z.string().nullable().optional(),
  also_property_manager: z.string().nullable().optional(),
  service_areas: z.string().nullable().optional(),
  profession_description: z.string().nullable().optional(),
  referral_source: z.string().nullable().optional(),
  referral_name: z.string().nullable().optional(),
  dietary_restriction: z.string().nullable().optional(),
  bringing_guest: z.boolean().optional().default(false),
  guest_name: z.string().max(100).nullable().optional(),
  guest_role: z.string().max(100).nullable().optional(),
});

const step1Input = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  role: z.enum(["Contratista", "Property Manager", "Realtor", "Otro profesional de la industria"]),
  city: z.string().min(1),
  city_other: z.string().optional(),
  preferred_language: z.string().default("Español"),
  consent_contact: z.boolean(),
  bringing_guest: z.boolean().optional().default(false),
  guest_name: z.string().max(100).nullable().optional(),
  guest_role: z.string().max(100).nullable().optional(),
});

// Step 2 schema: optional profile completion
const step2Input = z.object({
  code: z.string().length(6),
  business_name: z.string().nullable().optional(),
  trade_types: z.string().nullable().optional(),
  has_cslb_license: z.string().nullable().optional(),
  cslb_license_number: z.string().nullable().optional(),
  years_in_business: z.string().nullable().optional(),
  team_size: z.string().nullable().optional(),
  current_estimating_tool: z.string().nullable().optional(),
  units_managed: z.string().nullable().optional(),
  property_types: z.string().nullable().optional(),
  has_real_estate_license: z.string().nullable().optional(),
  current_pm_software: z.string().nullable().optional(),
  brokerage_name: z.string().nullable().optional(),
  dre_license_number: z.string().nullable().optional(),
  also_property_manager: z.string().nullable().optional(),
  service_areas: z.string().nullable().optional(),
  profession_description: z.string().nullable().optional(),
  referral_source: z.string().nullable().optional(),
  referral_name: z.string().nullable().optional(),
  dietary_restriction: z.string().nullable().optional(),
  consent_photo: z.boolean().optional(),
  bringing_guest: z.boolean().optional().default(false),
  guest_name: z.string().max(100).nullable().optional(),
  guest_role: z.string().max(100).nullable().optional(),
});

export const eventoRouter = router({
  // Step 1: Register with minimal info — creates pending registration
  register: publicProcedure.input(step1Input).mutation(async ({ input }) => {
    const pool = getPool();
    await ensureEventRegistrationColumns();
    const existing = await pool.query("SELECT id FROM event_registrations WHERE email = $1", [input.email.toLowerCase()]);
    if (existing.rows.length > 0) {
      throw new TRPCError({ code: "CONFLICT", message: "Este email ya está registrado. Si tienes dudas, contáctanos en info@chyrris.com" });
    }
    const cleanPhone = input.phone.replace(/[\s\-\(\)]/g, "");
    const usaPhone = /^\+?1?\d{10}$/.test(cleanPhone);
    if (!usaPhone) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Por favor ingresa un número de teléfono de USA válido" });
    }
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const codeCheck = await pool.query("SELECT id FROM event_registrations WHERE attendee_code = $1", [code]);
      if (codeCheck.rows.length === 0) break;
      code = generateCode();
      attempts++;
    }
    const city = input.city === "Otra" ? (input.city_other ?? input.city) : input.city;
    const insertResult = await pool.query(
      `INSERT INTO event_registrations (
        full_name, phone, email, role, city, preferred_language,
        referral_source, dietary_restriction, consent_contact, consent_photo,
        bringing_guest, guest_name, guest_role, attendee_code, is_early_bird, status
      ) VALUES ($1,$2,$3,$4,$5,$6, NULL, 'Ninguna', $7, false, $8, $9, $10, $11,
        (SELECT COUNT(*) < 20 FROM event_registrations), 'pending') RETURNING id`,
      [input.full_name, input.phone, input.email.toLowerCase(), input.role, city, input.preferred_language, input.consent_contact, input.bringing_guest ?? false, input.guest_name ?? null, input.guest_role ?? null, code]
    );
    const newId = insertResult.rows[0]?.id;
    sendPendingEmail(input.email, input.full_name, code).catch(console.error);
    notifyOwnerNewRegistration(input.full_name, input.role, input.email, code, {
      id: newId, phone: input.phone, city, preferred_language: input.preferred_language,
      years_in_business: null, brokerage_name: null, business_name: null, units_managed: null,
      referral_source: "No especificado", dietary_restriction: "Ninguna",
      bringing_guest: input.bringing_guest ?? false, guest_name: input.guest_name ?? null, guest_role: input.guest_role ?? null,
    }).catch(console.error);
    // Auto-approve after 3 minutes if still pending
    if (newId) {
      setTimeout(async () => {
        try {
          const pool = getPool();
          const check = await pool.query(
            "SELECT status FROM event_registrations WHERE id = $1", [newId]
          );
          if (check.rows[0]?.status === "pending") {
            await pool.query("UPDATE event_registrations SET status = 'approved' WHERE id = $1", [newId]);
            await sendApprovedEmail(input.email, input.full_name, code);
            console.log(`[Evento] Auto-approved: ${input.full_name} (${code})`);
          }
        } catch (e) { console.error("[Evento] Auto-approval error:", e); }
      }, AUTO_APPROVE_MS);
    }
    return { success: true, code };
  }),

  // Step 2: Complete profile (optional)
  completeProfile: publicProcedure.input(step2Input).mutation(async ({ input }) => {
    const pool = getPool();
    await ensureEventRegistrationColumns();
    const existing = await pool.query("SELECT id FROM event_registrations WHERE attendee_code = $1", [input.code]);
    if (existing.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Código no encontrado" });
    await pool.query(
      `UPDATE event_registrations SET
        business_name = COALESCE($1, business_name), trade_types = COALESCE($2, trade_types),
        has_cslb_license = COALESCE($3, has_cslb_license), cslb_license_number = COALESCE($4, cslb_license_number),
        years_in_business = COALESCE($5, years_in_business), team_size = COALESCE($6, team_size),
        current_estimating_tool = COALESCE($7, current_estimating_tool), units_managed = COALESCE($8, units_managed),
        property_types = COALESCE($9, property_types), has_real_estate_license = COALESCE($10, has_real_estate_license),
        current_pm_software = COALESCE($11, current_pm_software), brokerage_name = COALESCE($12, brokerage_name),
        dre_license_number = COALESCE($13, dre_license_number), also_property_manager = COALESCE($14, also_property_manager),
        service_areas = COALESCE($15, service_areas), profession_description = COALESCE($16, profession_description),
        referral_source = COALESCE($17, referral_source), referral_name = COALESCE($18, referral_name),
        dietary_restriction = COALESCE($19, dietary_restriction), consent_photo = COALESCE($20, consent_photo),
        bringing_guest = COALESCE($21, bringing_guest), guest_name = COALESCE($22, guest_name), guest_role = COALESCE($23, guest_role)
      WHERE attendee_code = $24`,
      [input.business_name ?? null, input.trade_types ?? null, input.has_cslb_license ?? null,
       input.cslb_license_number ?? null, input.years_in_business ?? null, input.team_size ?? null,
       input.current_estimating_tool ?? null, input.units_managed ?? null, input.property_types ?? null,
       input.has_real_estate_license ?? null, input.current_pm_software ?? null, input.brokerage_name ?? null,
       input.dre_license_number ?? null, input.also_property_manager ?? null, input.service_areas ?? null,
       input.profession_description ?? null, input.referral_source ?? null, input.referral_name ?? null,
       input.dietary_restriction ?? null, input.consent_photo ?? null,
       input.bringing_guest ?? null, input.guest_name ?? null, input.guest_role ?? null, input.code]
    );
    return { success: true };
  }),

  // Full registration in one step (used by RegistrationModal)
  registerFull: publicProcedure.input(registerFullInput).mutation(async ({ input }) => {
    const pool = getPool();
    await ensureEventRegistrationColumns();
    const existing = await pool.query("SELECT id FROM event_registrations WHERE email = $1", [input.email.toLowerCase()]);
    if (existing.rows.length > 0) {
      throw new TRPCError({ code: "CONFLICT", message: "Este email ya está registrado. Si tienes dudas, contáctanos en info@chyrris.com" });
    }
    const cleanPhone = input.phone.replace(/[\s\-\(\)]/g, "");
    if (!/^\+?1?\d{10}$/.test(cleanPhone)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Por favor ingresa un número de teléfono de USA válido" });
    }
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const codeCheck = await pool.query("SELECT id FROM event_registrations WHERE attendee_code = $1", [code]);
      if (codeCheck.rows.length === 0) break;
      code = generateCode();
      attempts++;
    }
    const city = input.city === "Otra" ? (input.city_other ?? input.city) : input.city;
    await pool.query(
      `INSERT INTO event_registrations (
        full_name, phone, email, role, city, preferred_language,
        business_name, trade_types, has_cslb_license, cslb_license_number,
        years_in_business, team_size, current_estimating_tool, units_managed,
        property_types, has_real_estate_license, current_pm_software, brokerage_name,
        dre_license_number, also_property_manager, service_areas, profession_description,
        referral_source, referral_name, dietary_restriction,
        consent_contact, consent_photo, bringing_guest, guest_name, guest_role, attendee_code, is_early_bird, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,
        (SELECT COUNT(*) < 20 FROM event_registrations), 'pending')`,
      [
        input.full_name, input.phone, input.email.toLowerCase(), input.role, city, input.preferred_language,
        input.business_name ?? null, input.trade_types ?? null, input.has_cslb_license ?? null, input.cslb_license_number ?? null,
        input.years_in_business ?? null, input.team_size ?? null, input.current_estimating_tool ?? null, input.units_managed ?? null,
        input.property_types ?? null, input.has_real_estate_license ?? null, input.current_pm_software ?? null, input.brokerage_name ?? null,
        input.dre_license_number ?? null, input.also_property_manager ?? null, input.service_areas ?? null, input.profession_description ?? null,
        input.referral_source ?? null, input.referral_name ?? null, input.dietary_restriction ?? "Ninguna",
        input.consent_contact, input.consent_photo ?? false, input.bringing_guest ?? false, input.guest_name ?? null, input.guest_role ?? null, code
      ]
    );
    const insertResult2 = await pool.query(
      `SELECT id FROM event_registrations WHERE attendee_code = $1`, [code]
    );
    const newId2 = insertResult2.rows[0]?.id;
    sendPendingEmail(input.email, input.full_name, code).catch(console.error);
    notifyOwnerNewRegistration(input.full_name, input.role, input.email, code, {
      id: newId2, phone: input.phone, city, preferred_language: input.preferred_language,
      years_in_business: input.years_in_business ?? null,
      brokerage_name: input.brokerage_name ?? null,
      business_name: input.business_name ?? null,
      units_managed: input.units_managed ?? null,
      referral_source: input.referral_source ?? "No especificado",
      dietary_restriction: input.dietary_restriction ?? "Ninguna",
      bringing_guest: input.bringing_guest ?? false, guest_name: input.guest_name ?? null, guest_role: input.guest_role ?? null,
    }).catch(console.error);
    // Auto-approve after 3 minutes if still pending
    if (newId2) {
      setTimeout(async () => {
        try {
          const pool = getPool();
          const check = await pool.query(
            "SELECT status FROM event_registrations WHERE id = $1", [newId2]
          );
          if (check.rows[0]?.status === "pending") {
            await pool.query("UPDATE event_registrations SET status = 'approved' WHERE id = $1", [newId2]);
            await sendApprovedEmail(input.email, input.full_name, code);
            console.log(`[Evento] Auto-approved: ${input.full_name} (${code})`);
          }
        } catch (e) { console.error("[Evento] Auto-approval error:", e); }
      }, AUTO_APPROVE_MS);
    }
    return { success: true, code };
  }),


  // Admin: list all registrations (PIN protected)
  adminList: publicProcedure
    .input(z.object({ pin: z.string() }))
    .query(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      await ensureEventRegistrationColumns();
      const result = await pool.query(
        `SELECT id, full_name, phone, email, role, city, preferred_language,
          business_name, trade_types, years_in_business, team_size,
          units_managed, brokerage_name, referral_source, referral_name,
          dietary_restriction, consent_contact, consent_photo,
          bringing_guest, guest_name, guest_role,
          attendee_code, is_early_bird, status, created_at
        FROM event_registrations ORDER BY created_at DESC`
      );
      return {
        registrations: result.rows,
        total: result.rows.length,
        byRole: result.rows.reduce((acc: Record<string, number>, r: { role: string }) => {
          acc[r.role] = (acc[r.role] || 0) + 1; return acc;
        }, {}),
        earlyBird: result.rows.filter((r: { is_early_bird: boolean }) => r.is_early_bird).length,
        byStatus: result.rows.reduce((acc: Record<string, number>, r: { status: string }) => {
          acc[r.status] = (acc[r.status] || 0) + 1; return acc;
        }, {}),
      };
    }),

  // Admin: update status with optional email notification
  adminUpdateStatus: publicProcedure
    .input(z.object({
      pin: z.string(),
      id: z.number(),
      status: z.enum(["pending", "approved", "rejected", "waitlist", "confirmed", "cancelled", "attended"]),
      sendEmail: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      const reg = await pool.query("SELECT full_name, email, attendee_code, status AS prev_status FROM event_registrations WHERE id = $1", [input.id]);
      if (reg.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      const { full_name, email, attendee_code, prev_status } = reg.rows[0];
      await pool.query("UPDATE event_registrations SET status = $1 WHERE id = $2", [input.status, input.id]);
      // Only send email if transitioning TO this status (not already in it)
      if (input.sendEmail && prev_status !== input.status) {
        if (input.status === "approved") sendApprovedEmail(email, full_name, attendee_code).catch(console.error);
        else if (input.status === "rejected" || input.status === "waitlist") sendRejectedEmail(email, full_name).catch(console.error);
      }
      return { success: true };
    }),

  // Admin: batch approve/reject
  adminBatchUpdate: publicProcedure
    .input(z.object({
      pin: z.string(),
      ids: z.array(z.number()),
      status: z.enum(["pending", "approved", "rejected", "waitlist"]),
      sendEmail: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      // Only fetch registrations that are NOT already in the target status (to avoid duplicate emails)
      const regs = await pool.query("SELECT full_name, email, attendee_code, status AS prev_status FROM event_registrations WHERE id = ANY($1)", [input.ids]);
      await pool.query("UPDATE event_registrations SET status = $1 WHERE id = ANY($2)", [input.status, input.ids]);
      if (input.sendEmail) {
        for (const reg of regs.rows) {
          if (reg.prev_status === input.status) continue; // Skip if already in this status
          if (input.status === "approved") sendApprovedEmail(reg.email, reg.full_name, reg.attendee_code).catch(console.error);
          else if (input.status === "rejected" || input.status === "waitlist") sendRejectedEmail(reg.email, reg.full_name).catch(console.error);
        }
      }
      return { success: true, updated: input.ids.length };
    }),

  // Check-in: scan QR code on event day, mark attendee as attended
  checkIn: publicProcedure
    .input(z.object({
      pin: z.string(),
      code: z.string(), // attendee_code (with or without LPN- prefix)
    }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      // Normalize code: strip LPN- prefix if present
      const rawCode = input.code.trim().toUpperCase().replace(/^LPN-?/, "").replace(/^LNC-?/, "");
      const reg = await pool.query(
        "SELECT id, full_name, role, city, status, attendee_code FROM event_registrations WHERE UPPER(attendee_code) = $1",
        [rawCode]
      );
      if (reg.rows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Código no encontrado. Verifica el código e intenta de nuevo." });
      }
      const attendee = reg.rows[0];
      if (attendee.status === "attended") {
        // Already checked in — return info but flag as duplicate
        return {
          success: true,
          alreadyCheckedIn: true,
          attendee: {
            id: attendee.id,
            full_name: attendee.full_name,
            role: attendee.role,
            city: attendee.city,
            code: attendee.attendee_code,
            status: attendee.status,
          },
        };
      }
      if (attendee.status !== "approved" && attendee.status !== "confirmed") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Este asistente tiene estado "${attendee.status}" — solo se pueden registrar asistentes aprobados.`,
        });
      }
      // Mark as attended and record check-in time
      await pool.query(
        "UPDATE event_registrations SET status = 'attended', checked_in_at = NOW() WHERE id = $1",
        [attendee.id]
      );
      return {
        success: true,
        alreadyCheckedIn: false,
        attendee: {
          id: attendee.id,
          full_name: attendee.full_name,
          role: attendee.role,
          city: attendee.city,
          code: attendee.attendee_code,
          status: "attended",
        },
      };
    }),

  // Admin: delete a single registration (for test cleanup)
  adminDelete: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      const result = await pool.query("DELETE FROM event_registrations WHERE id = $1 RETURNING id", [input.id]);
      if (result.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      return { success: true };
    }),

  // Admin: update name/email for a registration
  adminUpdateContact: publicProcedure
    .input(z.object({
      pin: z.string(),
      id: z.number(),
      full_name: z.string().min(2).max(100),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      const conflict = await pool.query(
        "SELECT id FROM event_registrations WHERE LOWER(email) = LOWER($1) AND id != $2",
        [input.email, input.id]
      );
      if (conflict.rows.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Este email ya está registrado por otro asistente" });
      }
      const result = await pool.query(
        "UPDATE event_registrations SET full_name = $1, email = $2 WHERE id = $3 RETURNING id",
        [input.full_name, input.email.toLowerCase(), input.id]
      );
      if (result.rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      return { success: true };
    }),

  // Attendance stats: for the check-in dashboard
  attendanceStats: publicProcedure
    .input(z.object({ pin: z.string() }))
    .query(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      const pool = getPool();
      const stats = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('approved','confirmed','attended')) AS total_approved,
          COUNT(*) FILTER (WHERE status = 'attended') AS total_attended,
          COUNT(*) FILTER (WHERE status = 'pending') AS total_pending
        FROM event_registrations
      `);
      const recentCheckins = await pool.query(`
        SELECT full_name, role, city, attendee_code, checked_in_at
        FROM event_registrations
        WHERE status = 'attended'
        ORDER BY checked_in_at DESC
        LIMIT 50
      `);
      return {
        totalApproved: parseInt(stats.rows[0].total_approved) || 0,
        totalAttended: parseInt(stats.rows[0].total_attended) || 0,
        totalPending: parseInt(stats.rows[0].total_pending) || 0,
        recentCheckins: recentCheckins.rows.map((r: { full_name: string; role: string; city: string; attendee_code: string; checked_in_at: string }) => ({
          full_name: r.full_name,
          role: r.role,
          city: r.city,
          code: r.attendee_code,
          checked_in_at: r.checked_in_at,
        })),
      };
    }),
});
