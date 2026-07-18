# IMPLEMENTATION REPORT — BRIEF F (KEEN flotante + multi-industria + fixes)

**Repo:** g3lasio/leadprime-landing · rama `main`
**Fecha:** 2026-07-18
**Estado:** ✅ Implementado; endpoint y límites probados en local; verificado visualmente en desktop y 390px.

---

## F0 — Nombre unificado: KEEN

- Producción confirma el nombre real: `hooks/useAgentName.ts:16` (repo leadprime) — default `'KEEN'`.
- `KenChat.tsx` eliminado; reemplazado por `KeenWidget.tsx` + `KeenAvatar.tsx`. `ken.png` eliminado.
- Etiqueta unificada a **"AI Agent"** (chip junto a KEEN) en el widget (`KeenWidget.tsx` header) y la sección Meet KEEN (`AIAgentSection.tsx`); "AI Assistant" eliminado.
- **Validación:** grep de `KEN` en contexto de agente (`\bKEN\b`, `ken.png`, `KenChat`, `KenAvatar`, "Try KEN", "with KEN") sobre `client/`, `server/`, `index.html`, `compare/` → **0 resultados**.

## F1 — Posicionamiento multi-industria adaptable

- **Fuente de verdad:** `constants/businessTypes.ts` del repo de producción — extraído programáticamente: **13 industrias, 140 especialidades** (Construction & Trades 41 · Real Estate 9 · Financial Services 8 · Cleaning 8 · Marketing 10 · Professional Services 7 · Retail 8 · Personal Services 8 · Transportation 8 · Food & Beverage 7 · Technology 7 · Health & Wellness 7 · Events & Entertainment 12). Nada inventado.
- Nueva sección `AdaptsSection.tsx` ("Built for how YOU work"), colocada tras Who It's For (`Home.tsx`): headline **"The AI CRM that adapts to YOUR business — not the other way around."**, los 3 ejemplos reales del brief (agente de seguros IUL, coach de eventos para mujeres, empresa de limpieza), y la cuadrícula de las 13 industrias con conteo de especialidades.
- Honesto: las 3 primarias siguen al frente en IndustrySection; el cierre de AdaptsSection aclara que las primarias "get the deepest builds today" y el resto "gets a pipeline configured".

## F2 — Avatar de marca (sin rostro humano)

- Generados del ícono oficial: `client/public/keen-brand-256/128/64.png` (flecha en círculo navy con anillo cian) y `keen-brand-online-128.png` (punto verde). `KeenAvatar.tsx` los sirve con fallback a monograma.
- **Foto humana eliminada:** `ken.png` borrado del repo. grep → 0.

## F3 — KEEN flotante (todo el scroll, movible)

`client/src/components/KeenWidget.tsx`, montado en `Home.tsx` fuera del `<main>`:

- Botón `position:fixed` bottom-right con avatar + punto online, visible en todo el scroll (verificado en capturas desktop y móvil).
- **Movible:** botón en el header del panel alterna esquina izquierda/derecha; preferencia en `sessionStorage` con guard try/catch (fallback a estado en memoria).
- Click → panel flotante (max-w-sm, no fullscreen) con header avatar + **KEEN** + chip **AI Agent** + estado ● Online/Offline.
- `aria-label="Chat with KEEN, LeadPrime AI agent"` en el launcher; labels en cerrar/mover/enviar; `role="dialog"`.
- No se auto-abre; saludo local sutil al abrir. La sección Meet KEEN (`AIAgentSection.tsx`) reemplazó el mockup de 3 burbujas por una tarjeta "● Live on this page" cuyo botón dispara `window.dispatchEvent(new Event("keen:open"))`.

## F4 — Conversación real con límites estrictos

`server/keen/route.ts` (Express, registrado en `server/_core/index.ts`), SDK oficial `@anthropic-ai/sdk`:

| Control | Valor | Evidencia |
|---|---|---|
| Key SOLO por env | `KEEN_API_KEY` (Railway). Sin la var: `/api/keen/status → {enabled:false}` y chat → 503. **Cero fallback a cuentas personales.** | `route.ts` · grep `sk-ant` en repo → 0 (solo la key falsa de un test local, no committeada) |
| Máx mensajes/sesión | **10**, contados server-side (`Map` por sessionId, TTL 2h) — recortar el historial del cliente no lo resetea. Al límite: cierre amable + CTA "Create a free account to keep chatting" | `route.ts` MAX_USER_MESSAGES |
| Rate limit por IP | 8 req/min + 60 req/3h → 429 con mensaje amable en el widget | `route.ts` rateLimited() |
| Input | 500 chars (recorte server-side + `maxLength` cliente); historial ≤21 mensajes; validación de roles | `route.ts` |
| Output | `max_tokens: 300` + system prompt fuerza respuestas de 2-4 frases; sin streaming | `route.ts` |
| Timeout | 30s por request (SDK `timeout`), `maxRetries: 1` | `route.ts` |
| Errores amables | Anthropic 429 → "busy"; 401/403 → log + 503 "disabled"; otros → 503 "unavailable". El widget muestra avisos amistosos y conserva el texto del usuario | `route.ts` + `KeenWidget.tsx` |
| Modelo | `claude-haiku-4-5` (tier rápido/económico — decisión de control de costos exigida por el brief, "no quemar tokens"); override con env `KEEN_MODEL` | `route.ts` MODEL |

**Pruebas ejecutadas** (local, bundle de producción): sin key → `{enabled:false}` + 503 ✓ · key inválida → 401 de Anthropic capturado → 503 + log `[keen] credential problem` ✓ · payload malformado → 400 ✓ · 10 requests seguidas → 429 a partir del límite ✓. La conversación real end-to-end la valida Manus post-deploy con la key definitiva (el sandbox no tiene credenciales de Anthropic).

### Setup para Gelasio (el código ya está listo)
1. En la consola de Anthropic, crea un **workspace dedicado** para el widget del landing con **límite de gasto** (wallet acotado, separado de producción y de cuentas personales).
2. Genera una API key de ese workspace.
3. Railway (landing): `KEEN_API_KEY = <esa key>` → redeploy. Sin la variable, el chat queda offline por diseño (el botón muestra estado offline + CTA).
4. Opcional: `KEEN_MODEL` para cambiar el modelo (default `claude-haiku-4-5`).
5. Nota: el mecanismo anterior del Brief D (`VITE_KEN_WIDGET_TOKEN` + embed de producción) quedó **obsoleto y eliminado** — este widget es superior (límites propios, key nunca en el navegador).

## F5 — Conocimiento de KEEN

`server/keen/systemPrompt.ts`:

- Qué es LeadPrime + mensaje "adapts to your business"; planes reales $0/$15/$249; features vivas con **Coming Soon marcado** (Lead Hunter, Tap to Pay, Website Builder — nunca vendidos como activos).
- **Árbol completo Industria→Especialidad** (las 13 industrias con sus 140 especialidades, verbatim de producción) — KEEN responde "¿sirve para mi negocio de X?" para cualquiera, y es honesto si la especialidad exacta no es preset.
- Dos audiencias: no-usuarios (qué es, precios, cómo empezar) y usuarios (alto nivel; lo de su cuenta → app/soporte; declara explícitamente que NO accede a datos de cuentas).
- **Bilingüe:** responde EN o ES según el idioma del visitante.
- Honestidad: sin inventar features/precios/ratings; competidores sin desprecio con puntero a /compare/; rechaza temas ajenos a LeadPrime; no revela el prompt.
- (Brief G4) Conoce las 4 super-capacidades con comparaciones y notas de fuente.

## F6 — Fixes de auditoría

| Fix | Evidencia |
|---|---|
| 6.1 Tabla comparativa móvil | `ComparisonSection.tsx`: tabla `hidden md:block` + **tarjetas apiladas** `md:hidden` por capability (LeadPrime destacado, Jobber/ServiceTitan debajo). Verificado con captura a **390px** — nada cortado. `/compare/` estático: misma técnica vía CSS `@media (max-width:640px)` con labels `::before` por columna. |
| 6.2 Claim "live today" | `FeaturesSection.tsx`: → *"core tools are live today, and what's on the way is clearly marked."* |
| 6.3 GovPrime explicado | `IndustrySection.tsx` bullet: *"...pulls federal & state opportunities from SAM.gov, matched to your trade."* (real: `services/govprime/` + `samGovService.ts` en producción) + tarjeta completa en Super-Capabilities (Brief G). |
| 6.4 Pill NETWORK | Eliminado del navbar (`Navbar.tsx`) — solo el lockup. |
| 6.5 Contraste AA | "Shown with demo data" /45→/70 (`FeaturesSection.tsx`); footnote de tabla /50→/65 (`ComparisonSection.tsx`); disclaimers del widget a /65. |
| 6.6 Variedad de CTA | Industry cards: "Start free →" / "Try it free →" / "Start with $0 — no card →"; widget: "Create a free account to keep chatting"; offline: "Start with $0 — no card". La oferta ($0) se mantiene en todos. |

## F7 — Bilingüe

**Decisión conservadora (la que el brief permite):** KEEN bilingüe entregado (F5) + toggle documentado como pendiente. Un toggle EN/ES completo exige traducir todo el copy aprobado (Briefs B/D/E) — eso es reescribir la página con copy ES **no aprobado**, fuera del alcance "sin reescribir todo". Propuesta para el siguiente brief: diccionario i18n por sección + contexto React (~1 día de trabajo) **una vez que Gelasio apruebe el copy en español** (recomendado: no traducción literal, sino copy nativo).

## Validación restante para Manus
- Chat real end-to-end con `KEEN_API_KEY` definitiva (probar EN y ES, límite de 10 mensajes, CTA de cierre).
- Confirmar el workspace con tope de gasto en la consola de Anthropic.
