# IMPLEMENTATION REPORT — BRIEF A (Contención Urgente)

**Fecha:** 2026-07-18 (UTC) · **Repo:** g3lasio/leadprime-landing @ main · **Base:** abd522e
**Alcance ejecutado:** A1 (claims falsos), A2 (saneamiento Evento), A3 (Mervin→KEEN), A4 (superlativos).
**Validación runtime:** build `pnpm build` exitoso + smoke test del server compilado (evidencia abajo).

---

## FASE A1 — "90-day free trial" eliminado ✅

Todas las ocurrencias vivían en `client/index.html` (el SEO); ninguna en componentes visibles.

| Ubicación | Antes | Después |
|---|---|---|
| `client/index.html:9` (meta description) | "Start free for 90 days — no credit card required." | "$0 Pay-As-You-Go · $15 welcome credits — no credit card required." |
| `client/index.html:24` (og:description) | "90 days free — no credit card." | "$0 Pay-As-You-Go · $15 welcome credits." |
| `client/index.html:35` (twitter:description) | "90 days free." | "$0 Pay-As-You-Go · $15 welcome credits." |
| FAQ JSON-LD "How much does LeadPrime cost?" | "starts at $15/month (pay-as-you-go)... OWL FENC Suite with $500 credits... All plans include a 90-day free trial." | "starts at $0/month with the Pay-As-You-Go plan, which includes $15 in welcome credits — no credit card required. LeadPrime Pro is $15/month with $20 in monthly credits. The Network Elite plan is $249/month with $250 in monthly credits and includes full B2B network access, the OWL FENC Suite, business financing access, and more." |
| FAQ JSON-LD "Founding Member program" | "includes 90 days completely free — no credit card required." | "Getting started is free with the $0 Pay-As-You-Go plan — no credit card required." |
| Offers del SoftwareApplication JSON-LD | "Plan Base" $15 (sin PAYG) | Añadido offer "Pay-As-You-Go" $0.00 + renombrado "Plan Base"→"LeadPrime Pro" $15.00 |

**Verificación:** `grep -riE "90.day|90 día"` sobre client/server/shared/*.md → **0 ocurrencias**. ✅
Los precios corregidos coinciden con producción (`plan_definitions`, migración 099: PAYG $0 / Pro $15+$20 créditos / Elite $249+$250 créditos; welcome credit runtime $15 en `walletService.ts`).

## FASE A2 — Módulo Evento saneado ✅ (A2.1 bloqueado en sandbox, ver nota)

### A2.1 — Export de PII: ⚠️ BLOQUEADO EN ESTE SANDBOX — NINGÚN DATO FUE BORRADO
- El sandbox no tiene salida TCP hacia Neon (el proxy solo permite HTTPS; `psql` a `*.neon.tech` expira). **No se pudo exportar desde aquí.**
- **Cumplimiento de la regla "nada de PII se borra sin exportar":** ninguno de los cambios de este brief toca datos — la tabla `event_registrations` queda 100% intacta en Neon. Solo se cerró la superficie pública.
- **Comandos para Gelasio/Manus** (correr donde exista `NEON_DATABASE_URL`, p.ej. shell de Railway):
  ```bash
  # Count para que Manus valide contra el CSV:
  psql "$NEON_DATABASE_URL" -tAc "SELECT COUNT(*) FROM event_registrations;"
  # Export completo (NO commitear, NO dejar en /public):
  psql "$NEON_DATABASE_URL" -c "\copy (SELECT * FROM event_registrations ORDER BY created_at) TO 'event_registrations_export.csv' CSV HEADER"
  ```

### A2.2 — Formulario oculto + galería de eventos pasados ✅
- `client/src/pages/EventoPage.tsx` **reescrita por completo** (1,011 → 178 líneas): galería "Eventos realizados" con la tarjeta del evento del 2-jul-2026 (foto, fecha, hora, dirección, descripción, badge "Evento realizado"), placeholder "¿Próximo evento?" sin registro, y CTA único "Conocer LeadPrime" → app. **Cero formularios, cero llamadas tRPC, cero CTAs "Solicitar"** (`grep Solicitar` → 0).
- `client/src/components/Navbar.tsx`: eliminado el link dorado "◆ LeadPrime Networking" en desktop (ex líneas 61-69) y móvil (ex 127-133). `grep /evento Navbar.tsx` → 0. La ruta `/evento` sigue existiendo (galería).

### A2.3 — PIN hardcodeado eliminado ✅
- Nuevo gate `requireAdminPin()` en `server/routers/evento.ts` (tras imports): lee **solo** `process.env.EVENTO_ADMIN_PIN`, **falla cerrado** si no está definida (`PRECONDITION_FAILED`), compara en tiempo constante (`timingSafeEqual`) y **rate-limita** (10 intentos fallidos / 15 min → `TOO_MANY_REQUESTS`).
- Reemplazados los 8 sitios `?? "6289"` de `evento.ts` (ex líneas 579,614,638,661,718,735,757,774) por `requireAdminPin(input.pin)`. Los 2 sitios de `eventoApprove.ts` (ex 145,163): fallback eliminado.
- `todo.md:16`: valor del PIN borrado del texto. **`grep 6289` en todo el repo → 0.** El PIN vive únicamente en Railway y es rotable (⚠️ **rotar ya: el valor viejo está quemado en la historia de git**).

### A2.4 — Superficie de endpoints cerrada ✅
- **Procedures públicos de escritura** (`register`, `registerFull`, `completeProfile`): ahora rechazan siempre con "El registro para este evento está cerrado." (`REGISTRATION_CLOSED = true` — flip documentado para eventos futuros).
- **Procedures admin** (adminList/adminUpdateStatus/adminBatchUpdate/checkIn/adminDelete/adminUpdateContact/adminResendInvitation/attendanceStats): todos pasan por `requireAdminPin` server-side con rate limit. `/admin/evento` sigue funcionando para Gelasio con el PIN de Railway.
- **`GET /api/evento/action`** (token base64 sin firmar): **deshabilitado — 410 Gone**; el handler legacy fue eliminado (77 líneas).
- **`GET /api/qr/:code`**: **410 Gone** salvo `EVENTO_QR_ENABLED=true` (documentado que una reactivación futura debe firmar el código).
- **Código muerto pre-rebrand eliminado:** `client/src/components/evento/RegistrationModal.tsx`, `EventoNavbar.tsx`, `EventoFooter.tsx` (git rm; ningún import los referenciaba).

## FASE A3 — Mervin → KEEN (solo SEO) ✅
- `client/index.html:10`: keywords "Mervin AI" → **"KEEN AI"**.
- `client/index.html:87`: featureList "AI Agent Mervin" → **"AI Agent KEEN"** (nombre vigente confirmado en `prod:hooks/useAgentName.ts:16`).
- Emails `mervin@chyrris.com` / `mervin@owlfenc.com` en `evento.ts` **intactos** (correos personales, según instrucción).
- `grep Mervin client/index.html` → **0**. (dist/ no está commiteado — se regenera en cada deploy de Railway.)

## FASE A4 — Superlativos ✅
- `index.html:9`: "the #1 AI-powered CRM" → "the AI-powered CRM".
- `index.html:24`: "The only CRM built specifically for..." → "AI-powered CRM built for...".
- `grep -iE "#1|the only" client/index.html` → **0**.

---

## VALIDACIÓN EJECUTADA (self-report — cierre final lo confirma Manus)

| Check del brief | Resultado local |
|---|---|
| Cero "90 day" en el repo | ✅ grep = 0 (fuente; dist se regenera) |
| CSV exportado + count vs Neon | ⚠️ **Bloqueado en sandbox** — comandos entregados; **cero filas tocadas** |
| Formulario no accesible en runtime | ✅ Página sin form + `registerFull` responde "registro cerrado" (probado contra server compilado) |
| Navbar sin link al evento | ✅ grep `/evento` en Navbar = 0 |
| grep "6289" → 0 | ✅ |
| PIN desde env, fail-closed | ✅ Sin env → PRECONDITION_FAILED; smoke test con `EVENTO_ADMIN_PIN=test-pin-9911`: PIN malo → UNAUTHORIZED, PIN correcto → pasa el gate |
| Endpoints admin rechazan sin PIN | ✅ + rate limit verificado (11 intentos → TOO_MANY_REQUESTS) |
| Cero "Mervin" en index.html | ✅ |
| Sin "#1"/"the only" | ✅ |
| `pnpm build` | ✅ exit 0 |
| Smoke runtime | ✅ `/api/evento/action`→410 · `/api/qr/:code`→410 · registro→cerrado |

**Pendientes para Manus/Gelasio:** (1) correr el export CSV + count en Railway; (2) **definir/rotar `EVENTO_ADMIN_PIN` en Railway** — sin la variable, el panel admin queda cerrado (fail-closed por diseño); (3) confirmar deploy y estado en producción.

## NO SE TOCÓ (según brief)
Emails personales mervin@ · tablas de producción/Neon (cero escrituras) · copy de secciones de producto (Hero/Features/Network/Industry/Pricing quedan para Brief B).
