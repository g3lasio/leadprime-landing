# IMPLEMENTATION REPORT — BRIEF G (Super-Capabilities)

**Repo:** g3lasio/leadprime-landing · rama `main`
**Fecha:** 2026-07-18
**Estado:** ✅ Implementado; cada capacidad verificada contra el código de producción ANTES de publicarse; visuales 100% ficticios; verificado visualmente.

---

## G2 primero — Verificación contra producción (regla de oro)

Cada claim fue verificado en el repo g3lasio/leadprime antes de escribir una sola tarjeta:

| Capacidad | Evidencia en producción |
|---|---|
| **LeadSign — mapeo de firmantes por IA** | `backend/src/services/leadsign/aiDraftService.ts` — *"4-layer field detection (AcroForm → markers → Claude Vision)"*, `detectSignatureFields()`; `fieldDetectionService.ts` — *"Hybrid intelligent field detection with ROLE-BASED field assignment"*; `visionFieldDetectionService.ts`. Sube documento → IA detecta firmantes/campos → enviar. ✅ |
| **Contract Builder → firma en un flujo** | `backend/src/services/contracts/contractGenerator.ts` (generación por IA, incluso instrumentos legales complejos) + `contracts/leadsign/leadsignIntegration.ts` y `contractStatusBridge.ts` (puente directo contrato→LeadSign). ✅ |
| **GovPrime — SAM.gov** | `backend/src/services/govprime/` (govIntelService, govVaultService, govAgencyIntel) + `services/leadhunter/samGovService.ts` — URLs y flujos de sam.gov reales en el código. ✅ |
| **Business Health Passport** | `backend/src/profile/`: `documentTrackingService.ts`, **`expirationAlertService.ts`** (avisos antes de vencer), `documentConsequences.ts`, `documentClassification.ts` con tipos **reales** `workers_comp` (línea 88) y `w9_form` (línea 84). ✅ — el copy "licenses, insurance, W-9, and workers' comp" es literal a los tipos de producción. |

## G1 — Sección "Super-Capabilities"

- `client/src/components/SuperCapabilitiesSection.tsx`, colocada tras AdaptsSection y antes de Meet KEEN / la tabla comparativa (`Home.tsx`).
- Título: **"Tools that replace $1,000s in software & pro fees."** (variante defendible del sugerido) + subtítulo "Four capabilities that usually mean four separate subscriptions — included in LeadPrime."
- Formato spotlight: 4 tarjetas grandes alternadas, cada una con problema, comparación con competidor, bloque **Before → After** (componente `TimeCompare`: "~20 min → ~90 sec", "~$900 → included") y **mini-mockup CSS con datos 100% ficticios**:
  - LeadSign: "Remodel-Agreement-demo.pdf" → firmantes detectados (Maria G. / R. Bautista — inventados) → "Sent for signature · 92 seconds".
  - Contract Builder: elegir tipo → generado con scope → "Ready for signature via LeadSign".
  - GovPrime: radar con 3 oportunidades inventadas (biblioteca del condado, rampas ADA, HVAC escolar) con % de match — **sin "Juan Pérez" ni ningún dato real**.
  - Passport: 4 documentos con estados Al día / Por vencer / Acción necesaria (ficticios).

## G2 — Guardrails legales aplicados

- **Ahorros como estimados, no garantías:** "~20 minutes **typically**… **about** 90 seconds"; "**can run** ~$900 with an attorney (**typical example, not a quote**)"; footnote de sección: *"Time and cost figures are typical examples, not guarantees."*
- **Precios de competidores como rangos públicos con fuente:** DocuSign IAM Professional ~$75/user/mo, mínimo 3 usuarios, "publicly reported Jul 2026"; Rocket Lawyer ~$39.99/mo; LawDepot ~$35/mo o $7.50–$119/doc — todos con "(reported)".
- **GovPrime honesto:** *"Finding the opportunity is our job; winning the bid is yours."* — cero promesa de adjudicación.
- **Passport — cifra de multa defendible:** el "$10,000" exacto del brief no es citable universalmente, así que: *"fines in the thousands — in some states well into five figures"* (rango defendible; p.ej. CSLB California contempla sanciones de ese orden por contratar sin licencia).
- Footnote global de la sección + disclaimer de marcas: *"All product names are trademarks of their respective owners; LeadPrime is not affiliated with any of them."* (también en tabla y /compare/).

## G3 — Integración con la comparativa

- `ComparisonSection.tsx`: bloque nuevo **"One subscription that replaces 4–5."** — 5 filas (E-sign con IA vs DocuSign · Contract generation vs Rocket Lawyer/LawDepot · Gov bid finder vs servicios de búsqueda · Compliance tracking vs spreadsheets · CRM core desde $0), cada una "lo que reemplaza → incluido". Footnote ampliada con las 5 fuentes.
- `/compare/` estático: sección H2 **"One subscription that replaces 4–5"** con el mismo contenido en prosa (crawleable) + footnote actualizada.

## G4 — SEO y KEEN

- `client/index.html` keywords: + "AI contract signing", "DocuSign alternative for contractors", "contract generator for contractors", "Rocket Lawyer alternative", "government contract finder for contractors", "SAM.gov opportunities for contractors", "contractor license tracking software".
- JSON-LD `SoftwareApplication.featureList` actualizado: LeadSign con "AI signer and field mapping", "AI contract generator", "GovPrime — federal and state government contract finder (SAM.gov)", Passport con "W-9, and workers' comp tracking with expiration alerts".
- KEEN (`server/keen/systemPrompt.ts`): bloque SUPER-CAPABILITIES con las 4, las comparaciones honestas, y la instrucción explícita de presentar ahorros como ejemplos típicos y precios de competidores como rangos reportados (jul 2026).

## Validación

- ✅ 4 tarjetas con visuales ficticios (captura desktop de la sección).
- ✅ Cada capacidad verificada contra producción (tabla arriba, con archivo:línea).
- ✅ Comparaciones con nota de fuente; ahorros como estimados.
- ✅ GovPrime y Business Health Passport ahora visibles y explicados (sección propia + bullet de contractors + featureList).
- ✅ "Replaces 4–5 subscriptions" en la tabla del home y en /compare/.
- ✅ Keywords/JSON-LD + KEEN actualizados.
- ✅ Build exit 0; JSON-LD parsea; sin datos reales de clientes en ningún visual.
