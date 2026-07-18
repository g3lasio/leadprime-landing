# IMPLEMENTATION REPORT — BRIEF C (Saneamiento Técnico)

**Fecha:** 2026-07-18 (UTC) · **Repo:** g3lasio/leadprime-landing @ main
**Validación:** build real + smoke test del server compilado (evidencia abajo). Deploy final lo confirma Manus.

---

## C1 — Tooling de Manus fuera de producción ✅
- `vite.config.ts`: los 3 plugins (`vitePluginManusRuntime` — el que inyectaba 366KB con segunda copia de React —, `jsxLocPlugin` y el debug collector) ahora solo cargan cuando `command === "serve"` (dev). En `vite build` quedan excluidos (línea ~160).
- `client/public/__manus__/debug-collector.js` **eliminado del repo** (ya no se copia al build).
- `client/src/main.tsx`: el redirect de plantilla Manus a `${VITE_OAUTH_PORTAL_URL}/app-auth` ahora se omite si el env no está configurado (antes redirigía al literal `undefined/app-auth`).
- Verificación en build: `grep -c "manus|data-loc" dist/public/index.html` → **0**. Una sola copia de React (chunk `vendor-react` 11.79 KB).

### Bundle ANTES → DESPUÉS
| Artefacto | Antes | Después |
|---|---|---|
| index.html | **374.80 KB** | **8.79 KB** (−97.7%) |
| JS (un solo chunk) | **720.54 KB** | main **332.36 KB** + vendor-react 11.79 + vendor-data 99.85 (lazy: EventoPage 4.32, Admin 19.72, **CheckIn/jsqr 145.38 — ya no carga en Home**, NotFound 4.53) |
| CSS | 144.86 KB | 138.59 KB |
| **Ruta crítica de Home (raw)** | **~1,240 KB** | **~591 KB** (−52%) · gzip ~156 KB |

## C2 — Assets sociales y de marca ✅ (creados en `client/public/`)
- **favicon.svg** (341 B, vectorial — flecha angular azul sobre #050B18) + **favicon.png** 32×32 + **apple-touch-icon.png** 180×180.
- **logo.png** 512×512 (marca oficial, referenciado por Navbar/Footer y el JSON-LD Organization).
- **og-image.png** 1200×630 (121.8 KB) con el mensaje del nuevo hero ("The AI-powered CRM that runs your business, not just your leads." + eyebrow + dominio).
- **Cero imágenes del CDN sandbox de Manus**: el fondo del hero pasó a CSS puro; los mockups de dashboard/AI/network pasaron a visuales CSS; la imagen del evento se reemplazó por `evento-networking.png` local (122.9 KB) — `grep cloudfront client/` → **0** (el componente muerto Map.tsx, que proxyaba por `forge.butterfly-effect.dev`, fue eliminado — sin importadores).
- `og:image`/`twitter:image` → `https://leadprimecrm.chyrris.com/og-image.png` + `og:image:alt` añadido.
- Nota: el CDN bloqueado desde el sandbox impidió descargar las fotos originales (mockup, foto de Gelasio) — se sustituyeron por visuales generados; si quieres las fotos reales de vuelta, súbelas a `client/public/` y cambia una línea.

## C3 — Dominio ✅
- `<link rel="canonical">`, `og:url` y ambos JSON-LD → **https://leadprimecrm.chyrris.com/** (`client/index.html:17,26,51,120,121`).
- **Redirect 301** `lead-prime.chyrris.com` → `leadprimecrm.chyrris.com` con path preservado, primero en la cadena de middleware (`server/_core/index.ts:36-43`). Probado: `curl -H "Host: lead-prime.chyrris.com" /pricing-page` → `301 → https://leadprimecrm.chyrris.com/pricing-page`.
- CTAs de app siguen a `leadprime.chyrris.com` ✅. Emails del server (`evento.ts:266,305`, `eventoApprove.ts` renderPage) siguen con el dominio viejo pero esas rutas están deshabilitadas desde Brief A (registro cerrado, action 410) — sin impacto en runtime.
- ⚠️ Pendiente Railway (Gelasio): apuntar `leadprimecrm.chyrris.com` al servicio y conservar `lead-prime.chyrris.com` como alias para que el 301 opere.

## C4 — Performance ✅
- **Code-splitting activo**: rutas lazy (`React.lazy` + Suspense en `App.tsx`) + `manualChunks` vendor-react/vendor-data (`vite.config.ts`). Antes: 0 chunks.
- **Caching**: assets hasheados `Cache-Control: public, max-age=31536000, immutable`; HTML/estáticos 1h (`server/_core/vite.ts`). Verificado por curl.
- **Imágenes**: todas locales, con `loading="lazy"` + `width/height` donde aplica; el LCP del hero ya no es imagen remota sino texto sobre CSS.
- **Deps muertas eliminadas**: `framer-motion`, `html5-qrcode` (pnpm remove); `ComponentShowcase.tsx` (58 KB, sin ruta) y `Map.tsx` eliminados.
- **CWV estimado (Home, móvil):** LCP antes ≈ descarga de 375 KB HTML + 720 KB JS + webp remoto de CloudFront (≳6 s en 4G); después ≈ 8.8 KB HTML + texto como LCP renderizable tras ~156 KB gzip (estimado <2.5 s en 4G). Medición de campo pendiente post-deploy (sin red externa en el sandbox).

## C5 — SEO técnico ✅
- `client/public/sitemap.xml` (dominio canónico; `/` y `/evento`) y `robots.txt` (Allow /, **Disallow /admin/**, referencia al sitemap). Smoke: ambos 200 con content-type correcto.
- JSON-LD válido y sin claims viejos: SoftwareApplication con los 3 offers reales ($0/$15/$249) y featureList sin Lead Hunter/Website Builder (coming soon) ni Mervin; Organization con logo propio; FAQPage con precios reales y red "license-verified". (Los 4 Q&As del FAQPage siguen sin sección visible en la página — limitación heredada anotada para una futura sección FAQ visible.)
- Meta completos con og-image propio + `og:image:alt` + `theme-color`.

## C6 — CTAs y tracking ✅
- Helper `client/src/lib/appLinks.ts`: cada CTA lleva `auth=signin|signup` + `utm_source=landing&utm_medium=cta&utm_campaign=<sección>`.
- **Sign In ≠ Get Started**: navbar Sign In → `auth=signin`, todo lo demás → `auth=signup`. Campañas por sección: hero, navbar, network, ai-agent, industry-<vertical>, pricing-payg/pro/elite, footer, footer-cta.
- Nota de diseño: producción no expone rutas `/login`//`/signup` (SPA con entry único), así que la diferenciación viaja por query param — la app puede leer `auth=` cuando quiera rutear el intent; los UTMs ya son medibles hoy en analytics.

## C7 — Accesibilidad ✅
- `maximum-scale=1` eliminado del viewport (`index.html:5`) — pinch-zoom restaurado.
- Contrastes AA en las secciones reescritas: legal del footer a `text-white/50` (≈5.2:1) y links a `/60`; body copy `/55`–`/65`; se eliminaron los `/20-/40` del footer viejo.
- Hamburger con `aria-label` + `aria-expanded` (`Navbar.tsx:89-90`); decorativos con `aria-hidden`; `<main>` landmark en Home; headings en orden (los h4 del footer viejo → nav+p).
- `prefers-reduced-motion` global (`index.css` final).
- Alt text: todas las imágenes (`logo.png` en navbar/footer, evento) tienen alt.

## VALIDACIÓN C (smoke test sobre `node dist/index.js`)
| Check | Resultado |
|---|---|
| Manus fuera del bundle; 1 React | ✅ grep=0; vendor-react único |
| Bundle antes/después | ✅ tabla arriba (−52% ruta crítica, −98% HTML) |
| favicon + logo + og-image existen y cargan | ✅ 200 (image/png, image/svg+xml) |
| Cero hot-links al CDN de Manus | ✅ grep=0 |
| Canonical/og/sitemap = leadprimecrm | ✅ |
| 301 con-guion → canónico | ✅ curl verificado |
| Code-splitting + LCP | ✅ chunks listados; estimación documentada |
| CTAs signin/signup + UTMs | ✅ |
| Viewport/contrastes/alt | ✅ |
