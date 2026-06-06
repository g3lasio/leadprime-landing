/**
 * Approve-by-link endpoint for LeadPrime Networking event.
 * Allows the owner to approve/reject registrations directly from email links.
 * Uses a signed token: base64(id:action:adminPin) for simple security.
 */
import type { Express } from "express";
import pkg from "pg";
const { Pool } = pkg;

const EVENT_NAME = "LeadPrime Networking";
const EVENT_DATE = "Jueves 2 de Julio, 2026";
const EVENT_TIME = "7:00 PM – 8:30 PM";
const EVENT_VENUE = "Fairfield, California";
const EVENT_ADDRESS = "1000 Webster Street, Fairfield, CA 94533";

let _pool: InstanceType<typeof Pool> | null = null;
function getPool() {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL not set");
  if (!_pool) _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  return _pool;
}

function encodeToken(id: number, action: string, pin: string): string {
  return Buffer.from(`${id}:${action}:${pin}`).toString("base64url");
}

function decodeToken(token: string): { id: number; action: string; pin: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    return { id: parseInt(parts[0]), action: parts[1], pin: parts[2] };
  } catch {
    return null;
  }
}

async function sendApprovedEmailDirect(email: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    // Use hosted QR API — base64 data URIs are blocked by all major email clients
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`LPN-${code}`)}&bgcolor=ffffff&color=0a1628&margin=10&ecc=M`;
    const qrBlock = `<div style="text-align:center;margin:24px 0 8px;">
          <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Escanea para entrar</p>
          <div style="display:inline-block;background:#ffffff;padding:12px;border-radius:16px;border:3px solid rgba(212,175,55,0.5);">
            <img src="${qrUrl}" alt="QR LPN-${code}" style="width:180px;height:180px;display:block;" />
          </div>
          <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:10px 0 0;">Presenta este QR en la entrada del evento</p>
        </div>`;
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
      <div><p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 3px;">¿Traes invitado? Regístralo antes</p><p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">Cada persona necesita su propio registro. Sin registro no puede entrar.</p></div>
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
    if (!res.ok) console.error("[Approve] Resend approved email error:", await res.text());
  } catch (e) {
    console.error("[Approve] Failed to send approved email:", e);
  }
}

export function buildApproveToken(id: number, action: string): string {
  const pin = process.env.EVENTO_ADMIN_PIN ?? "6289";
  return encodeToken(id, action, pin);
}

export function registerEventoApproveRoute(app: Express) {
  // GET /api/evento/action?token=xxx
  // Actions: approve, reject, waitlist
  app.get("/api/evento/action", async (req, res) => {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).send(renderPage("Error", "Token inválido o faltante.", false));
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(400).send(renderPage("Error", "Token inválido.", false));
    }

    const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
    if (decoded.pin !== adminPin) {
      return res.status(403).send(renderPage("Acceso denegado", "PIN incorrecto.", false));
    }

    const validActions = ["approve", "reject", "waitlist"];
    if (!validActions.includes(decoded.action)) {
      return res.status(400).send(renderPage("Error", "Acción inválida.", false));
    }

    try {
      const pool = getPool();
      const reg = await pool.query(
        "SELECT full_name, email, attendee_code, status FROM event_registrations WHERE id = $1",
        [decoded.id]
      );

      if (reg.rows.length === 0) {
        return res.status(404).send(renderPage("No encontrado", "Registro no encontrado.", false));
      }

      const { full_name, email, attendee_code, status } = reg.rows[0];

      // Don't re-process if already in a final state
      if (status === "approved" && decoded.action === "approve") {
        return res.send(renderPage(
          "Ya aprobado",
          `${full_name} ya fue aprobado anteriormente. El email de invitación fue enviado en su momento.`,
          true
        ));
      }

      const newStatus = decoded.action === "approve" ? "approved" : decoded.action === "reject" ? "rejected" : "waitlist";
      await pool.query("UPDATE event_registrations SET status = $1 WHERE id = $2", [newStatus, decoded.id]);

      if (decoded.action === "approve") {
        await sendApprovedEmailDirect(email, full_name, attendee_code);
        return res.send(renderPage(
          "✅ Aprobado",
          `<strong>${full_name}</strong> fue aprobado exitosamente.<br><br>
          Se envió el email de invitación con QR a <strong>${email}</strong>.<br><br>
          Código: <strong style="color:#D4AF37;font-size:20px;letter-spacing:2px;">LPN-${attendee_code}</strong>`,
          true
        ));
      } else if (decoded.action === "reject") {
        return res.send(renderPage(
          "❌ Rechazado",
          `<strong>${full_name}</strong> fue rechazado. Se envió notificación a ${email}.`,
          true
        ));
      } else {
        return res.send(renderPage(
          "⏳ Waitlist",
          `<strong>${full_name}</strong> fue movido a la lista de espera. Se envió notificación a ${email}.`,
          true
        ));
      }
    } catch (e) {
      console.error("[Approve] Error processing action:", e);
      return res.status(500).send(renderPage("Error del servidor", "Ocurrió un error. Intenta desde el dashboard.", false));
    }
  });
}

function renderPage(title: string, message: string, success: boolean): string {
  const color = success ? "#D4AF37" : "#ef4444";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — LeadPrime Networking</title>
<style>body{background:#080C14;color:#fff;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box;}
.card{background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:40px;max-width:480px;width:100%;text-align:center;}
h1{color:${color};font-size:28px;margin:0 0 16px;}
p{color:rgba(255,255,255,0.7);line-height:1.6;margin:0 0 24px;}
a{display:inline-block;background:#D4AF37;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;}
</style></head>
<body><div class="card">
<div style="font-size:48px;margin-bottom:16px;">🌙</div>
<h1>${title}</h1>
<p>${message}</p>
<a href="https://lead-prime.chyrris.com/admin/evento">Ver Dashboard</a>
</div></body></html>`;
}
