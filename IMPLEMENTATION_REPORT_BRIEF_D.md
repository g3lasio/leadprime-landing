# IMPLEMENTATION REPORT — BRIEF D (Pulido de contenido + diferenciación)

**Repo:** g3lasio/leadprime-landing · rama `main`
**Fecha:** 2026-07-18
**Estado:** ✅ Implementado, build validado, verificado visualmente contra el bundle de producción servido localmente.

---

## D1 — Logo oficial

| Ítem | Evidencia |
|---|---|
| Marca en navbar | `client/src/components/Navbar.tsx:32` — `<img src="/logo.png" alt="LeadPrime" …>` |
| Logo 512px transparente | `client/public/logo.png` (27 KB) |
| Favicon SVG + PNG | `client/public/favicon.svg`, `client/public/favicon.png` |
| Apple touch icon | `client/public/apple-touch-icon.png` |
| OG image 1200×630 | `client/public/og-image.png` (122 KB) — usa la marca oficial |

**Actualización final — paquete oficial de assets instalado:** el dueño entregó un zip con assets corregidos (transparencia RGBA real, verificada píxel a píxel). Instalado tal cual:

- `logo.png` ← `leadprime-icon.png` del paquete (414×414, flecha oficial transparente) — navbar y footer.
- `favicon-16/32/192/512.png` del paquete, enlazados en `client/index.html:13-15`; `apple-touch-icon.png` ← `favicon-180.png`. Los `favicon.svg`/`favicon.png` de la recreación fueron eliminados.
- `og-image.png` regenerado (1200×630) con el **ícono del paquete** + branding completo. El og que venía en el zip no se usó tal cual porque llegó **sin el nombre "LEADPRIME"**.
- ⚠️ `leadprime-logo-full.png` del paquete llegó **dañado**: la zona del wordmark tiene 0.00% de píxeles opacos (el proceso que quitó el fondo también borró el texto blanco "LEADPRIME"). Por eso navbar/footer conservan el patrón ícono + texto vivo "LeadPrime" (mismo resultado visual, siempre nítido). Si Manus reexporta el lockup completo con el wordmark intacto, se puede colocar como imagen única.

## D2 — Beneficios por vertical (copy aprobado, verbatim)

- `client/src/components/IndustrySection.tsx:16-60` — `verticalDetails` con los tres bloques aprobados:
  - **For Contractors** (7 bullets, líneas 22-30) — incluye GovPrime, KEEN follow-up, licencia/seguro/W-9.
  - **For Property Managers** (5 bullets, líneas 38-44).
  - **For Real Estate Investors** (4 bullets, líneas 52-57).
- Render con ✓ de color por vertical: `IndustrySection.tsx:145-178`.
- **Omisión conservadora documentada:** en Investors, el bullet de financiamiento se dejó como *"Access financing referrals through the network."* sin **"(Owl Funding)"** — el flujo de solicitud de financiamiento existe en producción, pero no pude verificar que la marca "Owl Funding" exista visible en el producto. Si confirmas la marca, es un cambio de una línea (`IndustrySection.tsx:56`).

## D3 — Mockups animados con datos 100% ficticios

Cero capturas reales, cero datos de clientes reales — todo CSS/JSX:

| Mockup | Archivo | Datos ficticios (evidencia) |
|---|---|---|
| Pipeline de contratista | `client/src/components/mockups/PipelineMockup.tsx` | Línea 3: comentario "100% fictional demo data"; línea 10 "Maria's Kitchen Remodel · $18,500 · San Jose"; línea 46 rótulo "(demo)"; línea 79 tarjeta viajera "Rosa's Patio Cover · KEEN following up…" |
| Estimado/factura | `client/src/components/mockups/EstimateMockup.tsx` | Línea 17 "Estimate #1024 (demo)"; total $15,090; insertado en FeaturesSection (`FeaturesSection.tsx:154-173`) con leyenda "Shown with demo data" (línea 169) |
| Chat KEEN | `client/src/components/AIAgentSection.tsx:41-95` | Conversación inventada (kitchen remodel → cita martes 10 AM) + indicador de "escribiendo" con puntos animados |

Animaciones: `client/src/index.css:254-297` (`lp-mock-fade`, `lp-mock-travel`, `lp-mock-pulse`, `lp-typing-dot`), todas anuladas bajo `prefers-reduced-motion` (`index.css:300-309`).

## D4 — Tabla comparativa vs Jobber / ServiceTitan

- `client/src/components/ComparisonSection.tsx` — 8 filas de capacidades, montada en `Home.tsx:24`.
- **Precio de Jobber:** `getjobber.com` devolvió 403 desde este entorno (proxy de red del sandbox), así que se usó el fallback que el brief manda: **"from ~$39/mo, scales with users"** (`ComparisonSection.tsx:14`).
- **Nota legal** (`ComparisonSection.tsx:123-128`): *"Competitor pricing based on publicly reported figures, July 2026; ServiceTitan and some others do not publish official pricing. Feature availability varies by competitor plan. LeadPrime pricing reflects current published plans."*
- Ningún claim absoluto ("#1", "the only") — solo capacidades verificables y rangos públicamente reportados marcados como "reported".
- Verificado visualmente: captura del bundle servido en local muestra tabla completa + footnote.

## D5 — Widget de chat KEN en vivo (seguro, flag OFF por defecto)

`client/src/components/KenChat.tsx`:

- **Token solo por env:** línea 19 — `import.meta.env.VITE_KEN_WIDGET_TOKEN`. Grep en todo `client/` + `server/`: **cero tokens hardcodeados** (las únicas ocurrencias son el nombre de la variable en el comentario y esa línea).
- **Flag OFF fail-closed:** líneas 57 y 69 — sin la variable, la sección **no renderiza nada** y no se inyecta ningún script. **No hay fallback al widget personal** (documentado en el comentario de cabecera, líneas 2-15).
- **Mecanismo de embed = producción:** líneas 59-65 — inyecta `${APP_URL}/api/widget/embed.js` con `data-token`, igual que `routes/websiteBuilder.ts` del repo principal.
- **Expectativas del visitante:** líneas 105-107 — "Demo assistant with public product info only · usage limits apply per visitor."
- **Imagen de KEN ("usa esta imagen como la de ken"):** ✅ instalada — `client/public/ken.png` ← `ken-avatar-256.png` del paquete oficial (256×256, 88 KB; tamaño idóneo: se muestra a 88px máx). Por política de transparencia del README del paquete, el avatar lleva **siempre** la etiqueta "KEN · AI Assistant" (`KenChat.tsx`, pill bajo el avatar) y el mock del chat dice "KEEN · AI Agent" (`AIAgentSection.tsx`) — KEN nunca debe leerse como un miembro humano del equipo. `KenAvatar` (líneas 26-51) lo carga con fallback al monograma "K" (`onError`, línea 48) y aparece en la sección Try KEN (avatar 88px, línea 82) y en el chat mock de AIAgentSection (`AIAgentSection.tsx:58`). Verificado con captura del bundle en local: el retrato renderiza en el avatar circular.

### Pasos para activar KEN (para Gelasio — el código ya está listo)

1. En la app de producción, crea un **widget dedicado** para la landing (no uses tu cuenta/widget personal).
2. Cárgalo **solo con conocimiento público** del producto (features, precios publicados, FAQs) — nada interno.
3. Asócialo a una **wallet separada con tope** (los límites por visitante se aplican server-side en producción).
4. En Railway (proyecto de la landing): `VITE_KEN_WIDGET_TOKEN = <token del widget dedicado>` y redeploy (es variable de build de Vite).
5. ~~Sube `client/public/ken.png`~~ — ✅ ya instalado (retrato oficial).
6. Sin el paso 4, la sección permanece invisible — ese es el comportamiento diseñado, no un bug.

---

## Validación

- ✅ `pnpm build` exit 0 — chunk principal 344 KB + vendors, HTML 8.79 KB.
- ✅ Bundle servido en local (`node dist/index.js`) y verificado con 3 capturas: hero/navbar (logo oficial + copy B intacto), sección Industry (cards + beneficios D2 + PipelineMockup animado), tabla comparativa D4 con footnote.
- ✅ Grep de seguridad: sin `VITE_KEN_WIDGET_TOKEN` hardcodeado, sin PIN `6289`, sin secretos en el diff.
- ✅ Copy aprobado del Brief B **no se tocó** (el header del chat mock sigue diciendo "KEEN"; "KEN" es solo la persona del widget en vivo D5).
- ✅ Todas las animaciones respetan `prefers-reduced-motion`.

## Pendiente del dueño (fuera de mi alcance)

1. Railway: `VITE_KEN_WIDGET_TOKEN` cuando el widget dedicado esté listo (sin la variable, la sección Try KEN no aparece — por diseño).
2. Confirmar la marca "(Owl Funding)" para restaurarla en `IndustrySection.tsx:56`.

*(El retrato de KEN y el logo oficial ya quedaron instalados en el repo — recuperados del transcript de la sesión, sin acción requerida.)*
