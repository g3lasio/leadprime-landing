# LeadPrime Landing — TODO

## La Noche Chyrris Event Page

- [x] Upgrade project from static to web-db-user template (tRPC + Express + DB)
- [x] Create event_registrations table in Neon PostgreSQL DB
- [x] Build /evento page (EventoPage.tsx) with 8 sections: Hero, Problem, Timeline, Benefits, Host, FAQ, Registration form
- [x] Build /admin/evento dashboard (AdminEventoPage.tsx) with PIN auth, stats, filters, CSV export
- [x] Build server/routers/evento.ts with register mutation, duplicate email check, USA phone validation, attendee code generation
- [x] Send confirmation email to registrant via Resend (noreply@chyrris.com)
- [x] Send notification email to gelasio@chyrris.com on new registration via Resend
- [x] Send Manus push notification to owner on new registration
- [x] Add La Noche Chyrris link to main Navbar (desktop + mobile, gold color)
- [x] Register /evento and /admin/evento routes in App.tsx
- [x] Upload hero background image and Gelasio photo to CDN
- [x] EVENTO_ADMIN_PIN env var set (6289)
- [x] RESEND_API_KEY env var set
- [x] NEON_DATABASE_URL env var set

## Main Landing Page

- [x] Hero section with LeadPrime branding
- [x] Features section (12 features)
- [x] Network section
- [x] Industry tabs (6 industries)
- [x] AI Agent Mervin section
- [x] Pricing section (2 plans: $15 base + $249 Elite)
- [x] Footer
- [x] Dark theme with Space Grotesk + Inter typography

## Pending / Future

- [x] Test form submission in production (waiting for Gelasio to publish)
- [x] Fix email sender: change from noreply@chyrris.com to noreply@owlfenc.com (verified domain)
- [x] Fix notification recipient: change from gelasio@chyrris.com to info@owlfenc.com
- [x] Update notification recipient to mervin@owlfenc.com (info@owlfenc.com had issues)
- [x] Confirm event date — VIERNES 22 de Mayo, 2026
- [ ] Add more cities to the registration form dropdown if needed
- [x] Improve owner notification email to include all fields: phone, city, brokerage, years in business, referral source, dietary restriction, language

## Actualizaciones Evento La Noche Chyrris (Apr 17, 2026)

- [x] PRIORIDAD 1: Diagnosticar y resolver error 403 en /evento para usuarios con VPN/proxy — Browser Check desactivado en Cloudflare (chyrris.com)
- [x] CAMBIO 1: Actualizar fecha a "Viernes 22 de Mayo, 2026" en hero, sticky bar, modal, SMS, email
- [x] CAMBIO 1: Actualizar horario a "7:00 PM – 10:00 PM" en todas las secciones
- [x] CAMBIO 1: Agregar venue "Fairfield Community Center · 1000 Kentucky St, Fairfield, CA 94533" en hero y FAQ
- [x] CAMBIO 2: Rework agenda con horarios 7:00-10:00 PM
- [x] CAMBIO 3: Agregar campo status (pending/approved/rejected/waitlist) en tabla event_registrations
- [x] CAMBIO 3: Dashboard admin con UI de aprobación/rechazo/waitlist individual y batch
- [x] CAMBIO 3: Email y SMS templates para pending y approved
- [x] CAMBIO 3: Actualizar copy landing: "150 cupos exclusivos · Solo por invitación" y CTA "Solicitar mi Invitación"
- [x] CAMBIO 4: Formulario de 2 pasos (Paso 1: 6 campos básicos, Paso 2: perfil completo opcional)
- [x] CAMBIO 4: Campo dietary_restriction como opcional con default "Ninguna"
- [x] CAMBIO 4: Preseleccionar "Español" como idioma por default

## Event Updates - La Noche Chyrris (Apr 17, 2026 Brief)

- [x] Fix 403 Cloudflare Browser Check (disabled zone-wide)
- [x] CAMBIO 1: Update date to "Viernes 22 de Mayo, 2026" everywhere (hero, sticky, modal, email, server)
- [x] CAMBIO 1: Update time to "7:00 PM – 10:00 PM" everywhere
- [x] CAMBIO 1: Add venue "Fairfield Community Center · 1000 Kentucky St, Fairfield, CA 94533" in hero and FAQ
- [x] CAMBIO 1: Update FAQ "¿Dónde exactamente va a ser?" with full address
- [x] CAMBIO 2: Rework agenda with new 7:00-10:00 PM schedule
- [x] CAMBIO 3: Add `status` field to event_registrations table (pending/approved/rejected/waitlist)
- [x] CAMBIO 3: Update registration flow - submit creates pending status, not confirmed
- [x] CAMBIO 3: Update post-registration copy to "Recibimos tu solicitud. Te avisaremos en 48 horas."
- [x] CAMBIO 3: Update CTA copy to "Solicitar mi Invitación" / "Aplicar para Asistir"
- [x] CAMBIO 3: Update badge copy to "150 cupos exclusivos · Solo por invitación"
- [x] CAMBIO 3: Add approve/reject/waitlist UI in admin dashboard
- [x] CAMBIO 3: Email/SMS templates for pending, approved, rejected
- [x] CAMBIO 4: 2-step form - Step 1 (6 fields, instant pending), Step 2 (optional profile completion)
- [x] CAMBIO 4: Make dietary_restriction optional with default "Ninguna"
- [x] CAMBIO 4: Pre-select "Español" as default language
-- [x] CORRECCIÓN: Evento es VIERNES 22 de Mayo — corregido en todo el código, emails y landing
