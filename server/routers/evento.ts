import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import pkg from "pg";
const { Pool } = pkg;

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

// Generate a unique 6-char attendee code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Send confirmation email via Resend
async function sendConfirmationEmail(email: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Evento] RESEND_API_KEY not set — skipping email");
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:32px;font-weight:900;color:#D4AF37;margin:0;">La Noche Chyrris</h1>
    <p style="color:rgba(255,255,255,0.5);margin-top:8px;">Tu lugar está confirmado</p>
  </div>
  
  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      Tu registro para <strong style="color:#D4AF37;">La Noche Chyrris</strong> ha sido confirmado. 
      Estamos emocionados de tenerte como parte de esta noche especial.
    </p>
    
    <div style="text-align:center;margin:32px 0;padding:24px;background:rgba(212,175,55,0.1);border-radius:12px;border:1px solid rgba(212,175,55,0.3);">
      <p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Tu código de asistente</p>
      <p style="color:#D4AF37;font-size:36px;font-weight:900;letter-spacing:4px;margin:0;">${code}</p>
    </div>
    
    <p style="color:rgba(255,255,255,0.7);line-height:1.6;">
      <strong style="color:#fff;">📅 Fecha:</strong> 28 o 29 de Mayo, 2026 (te confirmaremos la fecha exacta pronto)<br>
      <strong style="color:#fff;">📍 Lugar:</strong> Solano County, California (dirección exacta por confirmar)<br>
      <strong style="color:#fff;">🕕 Hora:</strong> 6:00 PM
    </p>
  </div>
  
  <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:24px;">
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;line-height:1.6;">
      Recibirás un email adicional con la dirección exacta del venue una semana antes del evento. 
      Si tienes preguntas, contáctanos en <a href="mailto:info@chyrris.com" style="color:#D4AF37;">info@chyrris.com</a>
    </p>
  </div>
  
  <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;">
    © 2026 Chyrris · Owl Fenc LLC · Todos los derechos reservados
  </p>
</body>
</html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "La Noche Chyrris <noreply@owlfenc.com>",
        to: [email],
        subject: `✅ Tu lugar está confirmado — La Noche Chyrris | Código: ${code}`,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Evento] Resend error:", err);
    }
  } catch (e) {
    console.error("[Evento] Failed to send email:", e);
  }
}

// Notify owner: email to info@owlfenc.com + Manus push notification
async function notifyOwnerNewRegistration(name: string, role: string, email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

  // 1. Email to info@owlfenc.com via Resend
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "La Noche Chyrris <noreply@owlfenc.com>",
          to: ["info@owlfenc.com"],
          subject: `🎉 Nuevo registro: ${name} — La Noche Chyrris`,
          html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#080C14;color:#fff;font-family:'Inter',sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;"><h2 style="color:#D4AF37;">🎉 Nuevo registro — La Noche Chyrris</h2><table style="width:100%;border-collapse:collapse;margin-top:16px;"><tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Nombre</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><strong>${name}</strong></td></tr><tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Email</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${email}</td></tr><tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Rol</td><td style="color:#fff;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${role}</td></tr><tr><td style="color:rgba(255,255,255,0.5);padding:8px 0;">Código</td><td style="color:#D4AF37;padding:8px 0;font-weight:900;font-size:20px;letter-spacing:2px;">${code}</td></tr></table><p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:32px;">Dashboard admin: leadprime.chyrris.com/admin/evento</p></body></html>`,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[Evento] Resend owner notification error:", err);
      } else {
        console.log("[Evento] Owner notification email sent to info@owlfenc.com");
      }
    } catch (e) {
      console.error("[Evento] Failed to send owner email:", e);
    }
  }

  // 2. Manus push notification (best-effort)
  if (forgeApiUrl && forgeApiKey) {
    try {
      await fetch(`${forgeApiUrl}/notification/notify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${forgeApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `🎉 Nuevo registro: ${name}`,
          content: `${name} (${role}) se registró para La Noche Chyrris.\nEmail: ${email}\nCódigo: ${code}`,
        }),
      });
    } catch (e) {
      console.error("[Evento] Failed to send Manus notification:", e);
    }
  }
}

const registerInput = z.object({
  full_name: z.string().min(3).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  role: z.string().min(1),
  city: z.string().min(1),
  preferred_language: z.string().min(1),
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
  referral_source: z.string().min(1),
  referral_name: z.string().nullable().optional(),
  dietary_restriction: z.string().min(1),
  consent_contact: z.boolean(),
  consent_photo: z.boolean().optional(),
});

export const eventoRouter = router({
  register: publicProcedure.input(registerInput).mutation(async ({ input }) => {
    const pool = getPool();

    // Check for duplicate email
    const existing = await pool.query(
      "SELECT id FROM event_registrations WHERE email = $1",
      [input.email.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Este email ya está registrado. Si tienes dudas, contáctanos en info@chyrris.com",
      });
    }

    // Validate USA phone
    const cleanPhone = input.phone.replace(/[\s\-\(\)]/g, "");
    const usaPhone = /^\+?1?\d{10}$/.test(cleanPhone);
    if (!usaPhone) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Por favor ingresa un número de teléfono de USA válido",
      });
    }

    // Generate unique code
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const codeCheck = await pool.query(
        "SELECT id FROM event_registrations WHERE attendee_code = $1",
        [code]
      );
      if (codeCheck.rows.length === 0) break;
      code = generateCode();
      attempts++;
    }

    // Insert registration
    await pool.query(
      `INSERT INTO event_registrations (
        full_name, phone, email, role, city, preferred_language,
        business_name, trade_types, has_cslb_license, cslb_license_number,
        years_in_business, team_size, current_estimating_tool,
        units_managed, property_types, has_real_estate_license, current_pm_software,
        brokerage_name, dre_license_number, also_property_manager, service_areas,
        profession_description, referral_source, referral_name,
        dietary_restriction, consent_contact, consent_photo,
        attendee_code, is_early_bird, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,
        $14,$15,$16,$17,
        $18,$19,$20,$21,
        $22,$23,$24,
        $25,$26,$27,
        $28,
        (SELECT COUNT(*) < 20 FROM event_registrations),
        'confirmed'
      )`,
      [
        input.full_name, input.phone, input.email.toLowerCase(), input.role, input.city, input.preferred_language,
        input.business_name ?? null, input.trade_types ?? null, input.has_cslb_license ?? null, input.cslb_license_number ?? null,
        input.years_in_business ?? null, input.team_size ?? null, input.current_estimating_tool ?? null,
        input.units_managed ?? null, input.property_types ?? null, input.has_real_estate_license ?? null, input.current_pm_software ?? null,
        input.brokerage_name ?? null, input.dre_license_number ?? null, input.also_property_manager ?? null, input.service_areas ?? null,
        input.profession_description ?? null, input.referral_source, input.referral_name ?? null,
        input.dietary_restriction, input.consent_contact, input.consent_photo ?? false,
        code,
      ]
    );

    // Fire-and-forget: email + owner notification
    sendConfirmationEmail(input.email, input.full_name, code).catch(console.error);
    notifyOwnerNewRegistration(input.full_name, input.role, input.email, code).catch(console.error);

    return { success: true, code };
  }),

  // Admin: list all registrations (PIN protected)
  adminList: publicProcedure
    .input(z.object({ pin: z.string() }))
    .query(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      }

      const pool = getPool();
      const result = await pool.query(
        `SELECT 
          id, full_name, phone, email, role, city, preferred_language,
          business_name, trade_types, years_in_business, team_size,
          units_managed, brokerage_name, referral_source, referral_name,
          dietary_restriction, consent_contact, consent_photo,
          attendee_code, is_early_bird, status, created_at
        FROM event_registrations
        ORDER BY created_at DESC`
      );

      return {
        registrations: result.rows,
        total: result.rows.length,
        byRole: result.rows.reduce((acc: Record<string, number>, r: { role: string }) => {
          acc[r.role] = (acc[r.role] || 0) + 1;
          return acc;
        }, {}),
        earlyBird: result.rows.filter((r: { is_early_bird: boolean }) => r.is_early_bird).length,
      };
    }),

  // Admin: update status
  adminUpdateStatus: publicProcedure
    .input(z.object({ pin: z.string(), id: z.number(), status: z.enum(["confirmed", "cancelled", "attended"]) }))
    .mutation(async ({ input }) => {
      const adminPin = process.env.EVENTO_ADMIN_PIN ?? "6289";
      if (input.pin !== adminPin) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
      }

      const pool = getPool();
      await pool.query(
        "UPDATE event_registrations SET status = $1 WHERE id = $2",
        [input.status, input.id]
      );
      return { success: true };
    }),
});
