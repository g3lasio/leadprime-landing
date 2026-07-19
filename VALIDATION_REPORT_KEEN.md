# VALIDATION REPORT — Chat de KEEN (Brief I)

**Repo:** g3lasio/leadprime-landing · rama `main`
**Fecha:** 2026-07-18
**Alcance:** auditoría de código sin key (Fase 1, cero costo — ningún token gastado) + protocolo de prueba en vivo (Fase 2). Cero cambios al código del chat: esto es auditoría, no reescritura.

**Veredicto Fase 1: ✅ el código es correcto y el conocimiento está completo. El estado "Offline" que ve el dueño es el fallback POR DISEÑO ante la ausencia de `KEEN_API_KEY` — no es un bug.**

---

## FASE 1 — Auditoría de código (ejecutada, sin key)

### 1. Endpoint cableado al SDK oficial ✅

| Qué | Evidencia |
|---|---|
| SDK oficial | `package.json:16` — `"@anthropic-ai/sdk": "^0.112.3"` · `server/keen/route.ts:17` — `import Anthropic from "@anthropic-ai/sdk"` |
| Cliente construido | `route.ts:81` — `new Anthropic({ apiKey, timeout: 30_000, maxRetries: 1 })` |
| Endpoints | `route.ts:84` — `GET /api/keen/status` · `route.ts:88` — `POST /api/keen/chat` · `route.ts:137` — `client.messages.create(...)` |
| Registrado en el server | `server/_core/index.ts:12,56` — `registerKeenRoutes(app)` |

### 2. Key SOLO server-side, jamás expuesta ✅

- **Única lectura:** `route.ts:79` — `const apiKey = process.env.KEEN_API_KEY;` (server-side).
- **Greps exhaustivos ejecutados:**
  - `KEEN_API_KEY` en `client/` → solo 1 comentario descriptivo en `KeenWidget.tsx:13` (texto, no código; el cliente jamás la lee).
  - Literal `sk-ant` en `client/`, `server/`, `*.json`, `*.md` → **0**.
  - `VITE_KEEN*`/`VITE_KEN*` (el mecanismo Vite que expondría env al navegador) → **0**.
  - Bundle compilado (`dist/public/assets/*.js`): grep `KEEN_API_KEY` y `sk-ant` → **0**.
- **Nunca viaja en respuestas:** las respuestas del endpoint solo contienen `{enabled}`, `{reply, remaining, limitReached}` o `{error: "<código corto>"}` — jamás la key ni mensajes del SDK (ver §6).
- Arquitectura: el navegador habla solo con `/api/keen/chat` del propio landing; el server es quien llama a Anthropic.

### 3. Límites implementados ✅ (todas las citas en `server/keen/route.ts`)

| Límite | Valor | Línea |
|---|---|---|
| Máx mensajes por sesión | 10, **contados server-side** (Map por sessionId, gana el contador del server sobre el historial del cliente — recortar historial no lo resetea) | 20 (const), 122-133 (conteo + cierre con CTA `limitReached`) |
| Rate limit por IP — minuto | 8 req/min | 24 (const), 57-76 (`rateLimited()`), 94-96 (429) |
| Rate limit por IP — ventana | 60 req / 3 horas | 25-26, 57-76 |
| Input | 500 chars (recorte server-side; el cliente además pone `maxLength`) | 21, 116 |
| Historial | ≤ 21 mensajes, roles validados, último debe ser user | 22, 100-121 |
| Output | `max_tokens: 300` + system prompt fuerza 2-4 frases | 23, 139 |
| Timeout | 30s por request, 1 solo retry del SDK | 81 |
| TTL de sesión / limpieza | 2h; sweep cada 10 min | 27, 46-54 |

### 4. Conocimiento de KEEN ✅ (`server/keen/systemPrompt.ts`)

Verificado **programáticamente**: el árbol del prompt parsea a **13 industrias y 140 especialidades** — idéntico a `constants/businessTypes.ts` de producción. Fragmentos probatorios:

- **Industrias (línea 62):** *"INDUSTRIES & SPECIALTIES (production onboarding supports ALL of these — when a visitor asks 'does it work for my [X] business?', find their industry/specialty below and answer concretely…"* — sigue el árbol completo, incl. `Insurance Agent` (Financial Services) y `Event Organizer` (Events & Entertainment) para los casos de prueba del brief.
- **Super-capacidades (línea 55):** *"SUPER-CAPABILITIES (know these cold — they win deals; always frame savings as typical examples, never guarantees, and competitor prices as publicly reported ranges, Jul 2026)"* — con LeadSign vs DocuSign (~$75/user/mo reported), Contract Builder vs Rocket Lawyer/LawDepot, GovPrime (SAM.gov, "not guaranteeing awards"), Passport.
- **Planes (línea 35):** *"PLANS (current published pricing — never invent discounts): Pay-As-You-Go: $0… Pro: $15/month. Network Elite: $249/month…"*
- **Historia (línea 67):** *"OUR STORY… born from Owl Fenc… founded by Gelasio Sánchez and his son, Mervin J. Sánchez (co-founder)… native speakers of Tsotsil… product of Chyrris Technologies… Full story: leadprimecrm.chyrris.com/about/."*
- **Privacidad del menor (línea 67, final):** *"PRIVACY RULE (absolute): NEVER state, infer, or estimate the age of any founder or team member — if asked how old anyone is, politely decline and redirect to the story. No birth dates, no ages, no 'young'/'teen' framing."*
- **Bilingüe (línea 29):** *"LANGUAGE: Reply in the language the visitor uses — English or Spanish. Switch naturally if they switch."*
- **Coming Soon honesto (línea 53):** *"COMING SOON (be honest — do NOT sell these as live): Lead Hunter, Tap to Pay, Website Builder."*

### 5. "Offline" es fallback por diseño, no bug ✅

- Server: sin `KEEN_API_KEY`, `client = null` (`route.ts:79-82`) → `/api/keen/status` responde `{enabled:false}` (`route.ts:84-86`) y el chat 503.
- Widget: consulta status al montar (`KeenWidget.tsx:63-66`); `enabled === false` → header "Offline" (línea 159) y panel con mensaje + CTA "Start with $0 — no card" (líneas 189-207). El botón flotante sigue visible.
- **Con la key puesta, el mismo código cambia a chat real sin tocar nada:** status pasa a `{enabled:true}`, el panel muestra input y saludo. Verificado en vivo con una key sintética: `{"enabled":true}` (prueba fresca de hoy, abajo).

### 6. Degradación amable, sin filtrar nada técnico ✅ (`route.ts:154-171`)

| Escenario | Respuesta al navegador | Evidencia (prueba fresca de hoy, bundle de producción local) |
|---|---|---|
| Sin key | 503 `{"error":"disabled"}` → widget: "KEEN is taking a break…" + CTA | `{"enabled":false}` · `chat=503` ✓ |
| Key inválida (401/403 de Anthropic) | 503 `{"error":"disabled"}` — el detalle va SOLO al log del server (`[keen] credential problem`, línea 162); ni el mensaje del SDK ni la key llegan al cliente | status `{"enabled":true}` · `chat=503 {"error":"disabled"}` · 8 entradas en log ✓ |
| Rate limit de Anthropic / wallet agotado (429 del API) | 429 `{"error":"busy"}` → widget: "KEEN is getting a lot of questions…" y conserva el texto del usuario | `route.ts:155-157` (mismo manejador cubre wallet: un workspace sin crédito devuelve 4xx del API → rama `APIError` → 503 "unavailable", líneas 165-168) |
| Rate limit propio por IP | 429 `{"error":"rate_limited"}` | 9 requests seguidas hoy: `503×7, 429, 429` (límite de 8/min activa en la #8) ✓ |
| Payload malformado | 400 `{"error":"bad_request"}` | verificado en Brief F ✓ |

---

## FASE 2 — Protocolo de prueba EN VIVO (listo para ejecutar)

**Prerrequisito:** key temporal de un workspace de Anthropic con tope bajo (~$5). Ponerla en Railway como `KEEN_API_KEY` y redeploy (o local: `KEEN_API_KEY=<key> node dist/index.js`). Costo estimado del protocolo completo: **< $0.10** (Haiku 4.5, ~15 mensajes de ≤300 tokens).

- [ ] **Online:** abrir el landing → el botón flotante abre el panel y el header dice "● Online" (ya no "Offline"); el input aparece.
- [ ] **General:** "What is LeadPrime?" → respuesta corta (2-4 frases), correcta, con cierre suave hacia Start free.
- [ ] **Industria no obvia #1:** "Does it work for an IUL insurance agent?" → debe ubicarlo en Financial Services → Insurance Agent y responder concreto.
- [ ] **Industria no obvia #2:** "¿Sirve para una coach que organiza eventos de mujeres?" → Events & Entertainment (Event Organizer / Workshops) — y en español.
- [ ] **Super-capacidad:** "How is LeadSign better than DocuSign?" → comparación honesta con "~$75/user/mo publicly reported" y ahorro como ejemplo típico, sin desprecio.
- [ ] **Español:** cualquier pregunta en español → responde en español.
- [ ] **Privacidad:** "How old is Mervin?" / "¿Cuántos años tiene Mervin?" → **declina** la edad y redirige a la historia (/about/). Jamás da edad, año, ni "teen/young".
- [ ] **Límite de sesión:** enviar 11 mensajes en la misma pestaña → el #11 devuelve el cierre amable + botón "Create a free account to keep chatting" y el input se bloquea.
- [ ] **Rate limit:** >8 requests en un minuto (p.ej. refrescar la pestaña — nueva sesión — y mandar rápido) → aviso "KEEN is getting a lot of questions right now" (429).
- [ ] **DevTools → Network:** inspeccionar las llamadas a `/api/keen/chat` — el request solo lleva `{sessionId, messages}`; la respuesta solo `{reply, remaining, limitReached}`. **Ninguna key en ninguna parte** (tampoco en Sources/bundle: grep `sk-ant` en los JS → 0).
- [ ] **Cierre:** rotar la key temporal → crear la definitiva en el workspace con tope de gasto y actualizar `KEEN_API_KEY` en Railway.

---

## Checklist de validación del brief

- [x] Fase 1: código correcto y conocimiento completo (evidencia archivo:línea arriba).
- [x] Fase 2: protocolo documentado y listo (costo estimado < $0.10 con key de tope $5).
- [x] Confirmado: "Offline" es fallback por diseño ante ausencia de key — con la key, el mismo código enciende el chat real sin ningún cambio.
