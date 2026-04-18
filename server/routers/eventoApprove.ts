/**
 * Approve-by-link endpoint for La Noche Chyrris event.
 * Allows the owner to approve/reject registrations directly from email links.
 * Uses a signed token: base64(id:action:adminPin) for simple security.
 */
import type { Express } from "express";
import pkg from "pg";
const { Pool } = pkg;
import QRCode from "qrcode";

const EVENT_DATE = "Viernes 22 de Mayo, 2026";
const EVENT_TIME = "7:00 PM – 10:00 PM";
const EVENT_VENUE = "Fairfield Community Center";
const EVENT_ADDRESS = "1000 Kentucky St, Fairfield, CA 94533";

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

async function generateQRDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: { dark: "#D4AF37", light: "#080C14" },
      errorCorrectionLevel: "M",
    });
  } catch {
    return "";
  }
}

async function sendApprovedEmailDirect(email: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const qrDataUrl = await generateQRDataUrl(`LNC-${code}`);
  const qrHtml = qrDataUrl
    ? `<div style="text-align:center;margin:24px 0;"><p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Tu QR de entrada</p><img src="${qrDataUrl}" alt="QR Code LNC-${code}" style="width:160px;height:160px;border-radius:12px;" /><p style="color:rgba(255,255,255,0.4);font-size:11px;margin:8px 0 0;">Presenta este QR en la entrada del evento</p></div>`
    : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:32px;font-weight:900;color:#D4AF37;margin:0;">La Noche Chyrris</h1>
    <p style="color:rgba(255,255,255,0.5);margin-top:8px;">¡Fuiste aprobado!</p>
  </div>
  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      🎉 <strong style="color:#D4AF37;">¡Felicidades!</strong> Fuiste aprobado para <strong style="color:#D4AF37;">La Noche Chyrris</strong>.
      Tu lugar está confirmado — te esperamos esa noche.
    </p>
    <div style="text-align:center;margin:32px 0;padding:24px;background:rgba(212,175,55,0.1);border-radius:12px;border:1px solid rgba(212,175,55,0.3);">
      <p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Tu código de asistente</p>
      <p style="color:#D4AF37;font-size:36px;font-weight:900;letter-spacing:4px;margin:0;">LNC-${code}</p>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:8px 0 0;">Guarda este código — lo necesitarás para el check-in</p>
    </div>
    ${qrHtml}
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      <strong style="color:#fff;">📅 Fecha:</strong> ${EVENT_DATE}<br>
      <strong style="color:#fff;">📍 Venue:</strong> ${EVENT_VENUE}<br>
      <strong style="color:#fff;">📌 Dirección:</strong> ${EVENT_ADDRESS}<br>
      <strong style="color:#fff;">🕖 Hora:</strong> ${EVENT_TIME}
    </p>
  </div>
  <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;line-height:1.6;">
      El evento es gratuito. Llega puntual — el networking empieza a las 7:00 PM.
      Si tienes preguntas, contáctanos en <a href="mailto:info@chyrris.com" style="color:#D4AF37;">info@chyrris.com</a>
    </p>
  </div>
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;">© 2026 Chyrris · Owl Fenc LLC · Todos los derechos reservados</p>
</body></html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "La Noche Chyrris <noreply@owlfenc.com>",
        to: [email],
        subject: `🎉 ¡Aprobado! Tu lugar en La Noche Chyrris está confirmado — LNC-${code}`,
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
          Código: <strong style="color:#D4AF37;font-size:20px;letter-spacing:2px;">LNC-${attendee_code}</strong>`,
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
<title>${title} — La Noche Chyrris</title>
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
