# IMPLEMENTATION REPORT — Landing solo contratistas + Programas Growth/Legacy

**Repo:** g3lasio/leadprime-landing · rama `landing-contratistas-programas`
**Fecha:** 2026-09-26 · encargo de Cowork (marketing), aprobado por Gelasio el 26-sep
**Estado:** ✅ Implementado y verificado en local. **Sin merge ni deploy** — Gelasio revisa y aprueba el merge.

> Objetivo: que lo que el contratista vea en el sitio después de la llamada de la agencia (desde el lunes 28-sep) diga lo mismo que la agente.

---

## ⚠️ Pendientes antes del merge

1. ~~URL de agendamiento del diagnóstico gratis~~ — **resuelto:** `DIAGNOSTIC_BOOKING_URL` = `https://leadprime.chyrris.com/book/chyrris-technologies` (página pública de reserva del recurso "Chyrris Technologies"; el contratista elige en persona o Google Meet). Ver sección 8.
2. **`/hazlo-real` y el Google tag no existen en este repo** (revisado todo el historial de todas las ramas: 0 coincidencias de `hazlo`, `gtag`, `googletagmanager`). Por eso este PR no los toca. Si hoy funcionan en producción, vienen de otra fuente (Cloudflare/GTM u otro deploy): conviene confirmar antes del deploy que publicar desde este repo no los reemplaza. Los `href` de todos los CTA existentes (UTMs incluidos) quedaron idénticos, así que los disparadores de conversión por URL no cambian.
3. ~~`/soporte` mostraba los marcadores `SOPORTE_TELEFONO` y `SOPORTE_TIEMPO_RESPUESTA`~~ — **resuelto** (ver sección 7).

---

## 1. Programas (Growth / Legacy)

- **Sección `#programas` justo debajo de Precios** en el home (`/` y `/es`) y **página propia `/programas`** (español, por defecto) + `/programs` (inglés). Mismo componente y mismo copy en los tres lugares: `client/src/components/ProgramsSection.tsx`.
- Posicionamiento visible: los planes Pago por uso / Pro / Network Elite son software de autoservicio; Growth y Legacy son programas hechos con nosotros que **incluyen** el software Elite.
- Dos tarjetas con el contenido aprobado ítem por ítem (incluye / no incluye), sello "Software LeadPrime Elite incluido ($249/mes de valor)" y el pie "La pauta se paga directo a Google y Meta, nunca dentro del fee. Sin garantías de resultados; toda proyección es estimado." en ambas.
- Único ajuste de redacción: la voz pasa a segunda persona donde el brief decía "del cliente" ("el dominio y el contenido son tuyos", "el filing fee del estado lo pagas tú", "tu calendario"). El resto es literal.
- CTA principal "Agenda un diagnóstico gratis" → página pública de reserva (`DIAGNOSTIC_BOOKING_URL`, con el `gclid`/`utm_*` de la página; ver sección 8). CTA secundario discreto "Ya hablé con el equipo" → `https://leadprime.chyrris.com/join/growth` y `/join/legacy`, exactos (sin UTMs). Los CTA llevan `data-cta` (`programas-growth-diagnostico`, `programas-legacy-join`, …) por si se quiere medir desde GTM sin tocar código.
- Accesos a la sección: enlace "¿Hablaste con nuestro equipo? Ver programas Growth y Legacy →" bajo los CTA del hero, enlace bajo los planes de Precios, "Programas" en el menú y en el footer.
- Reglas verificadas con grep sobre el build de producción: 0 apariciones de "te conseguimos la licencia", "te conseguimos tu DUNS", "Hazlo Real", "Construye Patrimonio".
- **KEEN también lo sabe:** el prompt del chat (`server/keen/systemPrompt.ts`) tiene Growth/Legacy con el mismo contenido y las mismas reglas (solo los nombres Growth y Legacy, "preparamos tu expediente" / "dejamos tu archivo comercial correcto", sin garantías, la pauta nunca va dentro del fee) y manda al diagnóstico gratis en `/programas`.

## 2. Audiencia única: contratistas

Quitado del sitio público: el banner "BUILT FOR CONTRACTORS · PROPERTY MANAGERS · INVESTORS", las tarjetas y bloques de Property Managers / Real Estate Investors, "ALSO FOR" (Lenders, Wholesalers), la línea de Realtors, toda la sección "Built for how YOU work" (13 industries, 140 specialties, ejemplos de seguros/eventos/limpieza — componente eliminado), y las menciones en footer, Features, Network (texto y tarjetas demo), Super-Capabilities, FAQ, meta tags, JSON-LD, `og-image.png`, `/about/`, `/compare/`, `/evento`, `/support` y el prompt de KEEN (se quitó el árbol de 13 industrias). "Who It's For" ahora es "For Contractors / Para contratistas" (mismo `id="industry"`, así que los enlaces viejos siguen llegando).

Única excepción: las páginas de administración del evento (`/admin/evento`, detrás de PIN y excluidas en `robots.txt`) conservan "Realtor" / "Property Manager" como opciones de rol de los registrados; no son parte del sitio público.

## 3. Español

- **`/es`** = landing completo en español (todas las secciones, mockups, widget de KEEN, FAQ). **`/`** sigue en inglés, pero si el navegador tiene el español como primer idioma, `/` lleva a `/es` conservando `?gclid`, `utm_*` y `#ancla`. El selector **EN | ES** (siempre visible, también en móvil) cambia a la misma página en el otro idioma y recuerda la elección.
- **`<head>` por idioma servido desde el servidor** (`server/_core/landingHtml.ts`, datos en `shared/pageMeta.ts`): `/es`, `/programas` y `/programs` llegan con `<html lang>`, title, description, canonical, Open Graph/Twitter, hreflang y el JSON-LD del FAQ en su idioma, sin depender de JavaScript (Google Ads y crawlers lo leen tal cual). El FAQ visible y su JSON-LD salen de la misma lista (`shared/faqs.ts`), así que ya no pueden desalinearse.
- `/nosotros/` (nueva, historia en español), `/soporte` abre en español, `sitemap.xml` con `/es`, `/programas`, `/programs`, `/nosotros/` y alternates hreflang.
- `/compare/` sigue solo en inglés (se conserva); los enlaces desde español dicen "(en inglés)".

## 4. Marca

- Eslogan oficial bajo el logo en el hero: "Your intelligent business partner." / "Tu socio de negocios inteligente." (también bajo el logo del footer y como `slogan` en el JSON-LD). No había otras variantes de "business partner inteligence/intelligence" en el repo. En el home, el logo del navbar se oculta mientras el hero muestra el logo con eslogan y reaparece al hacer scroll (evita el logo doble en móvil).
- Footer: "© 2026 LeadPrime · Chyrris Technologies LLC." (antes "Chyrris Technologies / Owl Fenc LLC"), igual en `/about/`, `/nosotros/`, `/compare/`, `/evento` y `legalName` del JSON-LD.
- Network Elite: "OWL FENC Suite" → "suite de estimados para cercas" / "a fence estimating suite".
- Sin nombre personal del fundador ni dirección completa en ninguna página pública: `/about/` (texto, meta y JSON-LD sin personas), `/evento` ("1000 Webster Street, Fairfield, CA 94533" → "Fairfield, California"; sin el nombre en la descripción), y KEEN (regla de privacidad ampliada: nunca nombres, edades ni direcciones; solo "Fairfield, California"). La historia se conserva sin nombres y sin referencias de edad.
- Imágenes con texto regeneradas sobre el arte oficial (mismo lockup, fondo, fuente DejaVu Sans y colores medidos del original; solo se repintó la franja de texto): `og-image.png` (EN), nueva `og-image-es.png` (ES) y `evento-networking.png` ("Presentado por LeadPrime · Chyrris Technologies"). El `og:image` lleva `?v=2` para que WhatsApp/Facebook no sigan mostrando la versión vieja.

## 5. Verificación

| Chequeo | Resultado |
|---|---|
| `pnpm check` | Sin errores nuevos. Queda 1 error preexistente en `server/routers/evento.ts:540` (igual que en `main`); se corrigió de paso el de `FeaturesSection.tsx` (`JSX` namespace). |
| `pnpm test` | 7/9 pasan, incluidos 5 tests nuevos del `<head>` por idioma (`server/landingHtml.test.ts`). Los 2 que fallan son los de secretos del evento (`NEON_DATABASE_URL`, `EVENTO_ADMIN_PIN`), que fallan igual en `main` sin esas variables. |
| `pnpm build` | OK. JS principal 124.3 KB gzip (main: 112.9 KB; +11.4 KB por el copy bilingüe y Programas). |
| Rutas (servidor de producción local) | `/`, `/es`, `/es/`, `/ES`, `/programas`, `/programs`, `/about/`, `/nosotros/`, `/compare/`, `/support`, `/soporte`, `/evento`, `/sitemap.xml` → 200 con el idioma y título correctos. |
| Prueba funcional (Playwright) | 23/23: selector EN/ES, redirección por idioma del navegador, CTAs y enlaces `/join/…`, navegación desde `/programas` a `/es#pricing`, textos obligatorios, Programas justo debajo de Precios, `/soporte` en español, `/evento` sin nombre ni dirección, sin errores de consola. |
| Carga móvil (iPhone 13, Slow 4G 150 ms / 1.6 Mbps, CPU 4×, mediana de 3) | LCP `/` 1.79 s (main 1.76 s) · `/es` 1.81 s · `/programas` 1.51 s · `/` con navegador en español → `/es` 1.87 s. Todo < 2.5 s. (Las peticiones a Google Fonts se excluyen en ambas mediciones por el entorno sin salida a internet; afectan igual a main y a la rama.) |

## 6. Otros cambios técnicos

- El HTML de las páginas del SPA se sirve con `Cache-Control: no-cache` (+ ETag/304). Antes `/` se cacheaba 1 h: tras un deploy, un navegador podía quedarse con un HTML que apunta a JS ya borrado (página en blanco). Assets con hash siguen con caché de 1 año.
- `AdaptsSection.tsx` eliminado (sin uso). No se borró ninguna página: `/compare/`, `/about/`, `/evento`, `/support` siguen igual de accesibles.

## 7. Soporte (`/soporte` y `/support`)

- Los marcadores que venían de `main` se reemplazaron con los datos que dio Cowork: **Teléfono / WhatsApp 707 770 4888** (el número abre la llamada con `tel:+17077704888` y hay un enlace "Escríbenos por WhatsApp →" a `https://wa.me/17077704888`), **correo info@chyrris.com** y **"Respondemos el mismo día hábil, lunes a viernes."** (EN: "We reply the same business day, Monday through Friday.").
- Las etiquetas fijas "CONTACT" y "PRIVACY" ahora se traducen ("CONTACTO", "PRIVACIDAD").
- La URL pública de reserva ya está conectada (ver sección 8).


## 8. Reserva del diagnóstico gratis

- `DIAGNOSTIC_BOOKING_URL` (`client/src/lib/appLinks.ts`) = `https://leadprime.chyrris.com/book/chyrris-technologies`: la página pública del recurso "Chyrris Technologies", donde el contratista elige en persona o Google Meet. Los 3 CTA "Agenda un diagnóstico gratis" (tarjetas Growth y Legacy + CTA final de `/programas`) abren esa página en pestaña nueva.
- Los CTA le pasan como query el `gclid` y los `utm_*` de la página actual (ningún otro parámetro), para que la reserva conserve el clic del anuncio. Si el visitante ya navegó a una página sin ellos (la navegación interna puede perder el query), se usan los de la página por la que entró en esta sesión (`sessionStorage`); los de la página actual siempre ganan.
- Verificado en navegador (7/7): parámetros de la página actual → CTA `…/book/chyrris-technologies?gclid=…&utm_source=…`; tras navegar de `/programas` a `/es#pricing` se conservan; sin parámetros → URL limpia; `/?gclid=…` con navegador en español → `/es?gclid=…` → el CTA lo lleva. La prueba funcional completa sigue en 23/23.
---

## Lista de textos cambiados

Formato: **antes → después**. "ES" = versión en español (nueva en todo el sitio). Todo el texto en español, sección por sección, está al final.

### Meta tags y datos estructurados (afectan Quality Score)

| Dónde | Antes | Después |
|---|---|---|
| `<title>` `/` (+ og/twitter) | LeadPrime — The AI CRM for Contractors & Real Estate Pros (English & Español) | LeadPrime — The business partner that runs your contracting business |
| description `/` (+ og/twitter) | The AI-powered CRM built for contractors, property managers & real estate investors — in English & Spanish. Estimates, invoices, contracts & payments in one place. Start free, $0 — no credit card. | Your intelligent business partner — built by a contractor from Fairfield, California. Estimates, contracts, payments, and your license up to date, in English & Spanish. |
| `<title>` `/es` (nuevo) | — | LeadPrime — El socio que lleva tu negocio de contratista |
| description `/es` (nuevo) | — | Tu socio de negocios inteligente — hecho por un contratista de Fairfield, California. Estimados, contratos, cobros y tu licencia al día, en español. Empieza gratis. |
| `<title>` / description `/programas` (nuevo) | — | Programas Growth y Legacy para contratistas \| LeadPrime · "Growth ($650/mes): te construimos la máquina y tú la operas. Legacy ($1,200/mes): te la construimos y la operamos contigo. Ambos incluyen LeadPrime Elite. Agenda un diagnóstico gratis." |
| `<title>` / description `/programs` (nuevo) | — | Growth & Legacy programs for contractors \| LeadPrime · "Growth ($650/mo): we build the machine, you run it. Legacy ($1,200/mo): we build it and run it with you. Both include LeadPrime Elite software. Book a free diagnostic." |
| og:image:alt | LeadPrime — the AI-powered CRM that runs your business, not just your leads. | LeadPrime — Your intelligent business partner. Built for contractors. (ES: LeadPrime — Tu socio de negocios inteligente. Hecho para contratistas.) |
| keywords | …CRM para property managers, property management CRM, real estate CRM, B2B real estate network, property manager software, investor CRM… | sin audiencias no-contratistas; + programa para contratistas, estimados para contratistas |
| meta author | Chyrris Technologies | LeadPrime · Chyrris Technologies |
| JSON-LD SoftwareApplication | "AI-powered CRM built for contractors, property managers, and real estate investors in the U.S. …" · featureList "Industry pipelines for contractors, property managers, and investors" · publisher "Chyrris Technologies" | "AI-powered business partner and CRM built for contractors in the U.S. — fully bilingual … plus license tracking and a license-verified B2B network. Starts free at $0 Pay-As-You-Go." · "Construction-stage pipelines for contractors" · "LeadPrime · Chyrris Technologies" |
| JSON-LD Organization | legalName "Chyrris Technologies / Owl Fenc LLC" · "…for Latino contractors, property managers, and real estate investors…" | legalName "Chyrris Technologies LLC" · "LeadPrime is the AI-powered business partner built for Latino contractors in the U.S. — fully bilingual in English and Spanish." · + slogan · + dirección solo ciudad (Fairfield, CA, US) |
| JSON-LD FAQPage | fijo en inglés, con la pregunta de property managers | generado por idioma desde `shared/faqs.ts` (igual al FAQ visible) |

### Navbar
| Antes | Después |
|---|---|
| alt del logo: "LeadPrime — AI-powered CRM for contractors and real estate pros" | "LeadPrime" |
| Menú: How It Works · Features · Network · **Who It's For** · Pricing · About | How It Works · Features · Network · Pricing · **Programs** · About (ES: Cómo funciona · Funciones · Red · Precios · Programas · Nosotros) |
| — | Selector **EN \| ES** (nuevo); ES: "Iniciar sesión", "Empieza gratis" |

### Hero
| Antes | Después |
|---|---|
| BUILT FOR CONTRACTORS · PROPERTY MANAGERS · INVESTORS | (eliminado) → logo + eslogan: **Your intelligent business partner.** / **Tu socio de negocios inteligente.** |
| The AI-powered CRM that runs your business, not just your leads. In English & Español. | **The business partner that runs your contracting business — not just your leads.** / **El socio que lleva tu negocio de contratista — no solo tus leads.** |
| From first lead to signed contract to paid invoice — LeadPrime unifies your pipeline, your documents, your estimates, and your payments in one place. Built for Latino contractors in the U.S. — works fully in English and Spanish, so your whole crew can use it. | **Built by a contractor from Fairfield, California. Estimates, contracts, payments, and your license up to date — in English and Spanish.** / **Hecho por un contratista de Fairfield, California. Estimados, contratos, cobros y tu licencia al día, en español.** |
| — | (nuevo) Talked to our team? See the Growth & Legacy programs → / ¿Hablaste con nuestro equipo? Ver programas Growth y Legacy → |

### Features / Funciones
| Antes | Después |
|---|---|
| **Pipelines by Industry** — Pre-built stages for how YOUR business works — contractor, property manager, or investor. | **Construction Pipelines** — Pre-built stages for how your jobs actually move — from first call to estimate, signed contract, and final payment. |
| **B2B Network** — Connect with license-verified contractors, PMs, and investors. | Connect with other license-verified contractors. |

### Network / Red
| Antes | Después |
|---|---|
| A B2B network where license-verified contractors, property managers, and investors find each other, share documents, and get work done — with your reputation traveling with you. | A B2B network where license-verified contractors find each other, share documents, and get work done — with your reputation traveling with you. |
| License-Verified Connections — Connect directly with license-verified Contractors, Property Managers, and Investors in your area. | …Connect directly with license-verified contractors in your area. |
| Tarjetas demo: "Bay Homes Property Mgmt — Property Manager · Oakland", "Peralta Capital Partners — Investor · Fruitvale" | "Ortega Electric — Electrical · Vallejo", "Luna Roofing & Gutters — Roofing · Fairfield" + etiqueta "Demo data / Datos de ejemplo" |

### Who It's For → For Contractors / Para contratistas
- Badge "Who It's For" → "For Contractors" / "Para contratistas". Se conserva el copy de contratistas (intro, "From the first estimate to the final payment — without the paperwork.", 7 beneficios, "Start free →").
- **Eliminado:** tarjetas "Property Managers" y "Real Estate Investors" (con sus textos y CTAs), bloques "For Property Managers" y "For Real Estate Investors", "ALSO FOR" (Lenders, Wholesalers) y "Realtors — access the professional network and services."

### Built for how YOU work — eliminada completa
"The AI CRM that adapts to YOUR business — not the other way around.", "13 industries, 140 specialties", las 13 tarjetas de industrias, los 3 ejemplos (agente de seguros IUL, coach de eventos, empresa de limpieza) y "Contractors, property managers, and real estate investors get the deepest builds today…".

### Super-Capabilities / Súper capacidades
| Antes | Después |
|---|---|
| For realtors, title companies, lenders — anyone who moves a lot of paperwork. | For contractors who get contracts, change orders, and agreements signed every week. / Para contratistas que mandan a firmar contratos, órdenes de cambio y acuerdos cada semana. |

### Pricing / Precios
| Antes | Después |
|---|---|
| Network Elite: "$250 in monthly credits, full B2B network access, **OWL FENC Suite**, Ledger financial tools, and business financing access." | "…full B2B network access, **a fence estimating suite**, Ledger financial tools…" / ES "…acceso completo a la red B2B, **suite de estimados para cercas**, herramientas financieras Ledger y acceso a financiamiento para tu negocio." |
| — | (nuevo) Want our team to build it with you? See the Growth & Legacy programs ↓ / ¿Prefieres que nuestro equipo lo construya contigo? Ver programas Growth y Legacy ↓ |

### Programas (nuevo) — texto completo

**ES** — Badge "Programas" · H2 "Programas hechos con nosotros." (en `/programas`, H1 "Programas Growth y Legacy, hechos con nosotros.") · "Los planes Pago por uso, Pro y Network Elite son software de autoservicio: tú lo configuras y lo usas. Growth y Legacy son programas hechos con nosotros que incluyen el software LeadPrime Elite."

- **GROWTH — $650/mes** — "Te construimos la máquina. Tú la operas." — Para el contratista que tiene quién conteste el teléfono en la primera hora. — ✓ Software LeadPrime Elite incluido ($249/mes de valor)
  - Incluye: Sitio web propio (el dominio y el contenido son tuyos) · Google Business Profile creado o recuperado, verificado, con sistema de reseñas · 1 campaña principal configurada (Google LSA o Meta) · LeadPrime Elite completo (CRM, pipeline, automatizaciones, estimados con IA, contratos y LeadSign, facturas, cobros, Business Health Passport) · Agente de IA cargado con el conocimiento de tu negocio · Créditos LeadPrime cada mes · Diagnóstico inicial de crédito empresarial y perfil DUNS · Operating Agreement si formas una LLC (el filing fee del estado lo pagas tú) · Onboarding y 1 reunión estratégica al mes
  - No incluye: Llamar, dar seguimiento ni agendar los leads · Monitoreo continuo de campañas · Seguimiento mensual de crédito · Contratos de gobierno · El presupuesto de publicidad
- **LEGACY — $1,200/mes** — "Te la construimos y la operamos contigo." — Para el que no se da abasto: no necesita más leads, necesita quién los trabaje. — ✓ Software LeadPrime Elite incluido ($249/mes de valor)
  - Todo Growth, más: Nuestro equipo persigue los leads (primer intento en menos de 2 horas hábiles, hasta 6 intentos en 10 días, hasta 100 leads nuevos al mes) · Precalificación y cita agendada en tu calendario · Monitoreo de campañas y remarketing · Sitio bilingüe con galería y calendario de estimados · Google Business Profile con 2 publicaciones al mes y reseñas gestionadas · CRM para hasta 3 usuarios de oficina · Crédito: seguimiento mensual y estrategia de líneas y cuentas de negocio · GovPrime (SAM.gov, UEI, NAICS, capability statement, hasta 5 oportunidades y 2 análisis bid/no-bid al mes) · Onboarding de 90 min y 2 reuniones estratégicas al mes · Fix & Flip con Owl Funding a partir del mes 6
  - No incluye: El presupuesto de publicidad · Visitar, medir, estimar y ejecutar el trabajo · Garantía de leads, trabajos, ingresos o aprobación de crédito
- Ambas: CTA "Agenda un diagnóstico gratis" · "Ya hablé con el equipo" · pie "La pauta se paga directo a Google y Meta, nunca dentro del fee. Sin garantías de resultados; toda proyección es estimado."
- Solo en `/programas`: "¿Solo quieres el software? Ver planes desde $0 →" y CTA final "¿Listo para que te construyamos la máquina?" + "Agenda un diagnóstico gratis".

**EN** — "Programs" · "Done-with-you programs." (`/programs`: "Growth & Legacy: done-with-you programs.") · "The Pay-As-You-Go, Pro, and Network Elite plans are self-serve software: you set it up and use it. Growth and Legacy are done-with-you programs that include LeadPrime Elite software."

- **GROWTH — $650/month** — "We build the machine. You run it." — For the contractor who has someone to answer the phone within the first hour. — ✓ LeadPrime Elite software included ($249/month value)
  - Includes: Your own website (the domain and the content are yours) · Google Business Profile created or recovered, verified, with a review system · 1 main campaign set up (Google LSA or Meta) · Full LeadPrime Elite (CRM, pipeline, automations, AI estimates, contracts and LeadSign, invoices, payments, Business Health Passport) · AI agent loaded with your business knowledge · LeadPrime credits every month · Initial business credit diagnostic and DUNS profile · Operating Agreement if you form an LLC (you pay the state filing fee) · Onboarding and 1 strategy meeting per month
  - Not included: Calling, following up with, or booking your leads · Ongoing campaign monitoring · Monthly credit follow-up · Government contracts · Your ad budget
- **LEGACY — $1,200/month** — "We build it and run it with you." — For the contractor who can't keep up: they don't need more leads, they need someone to work them. — ✓ LeadPrime Elite software included ($249/month value)
  - Everything in Growth, plus: Our team chases your leads (first attempt in under 2 business hours, up to 6 attempts over 10 days, up to 100 new leads per month) · Pre-qualification and appointments booked on your calendar · Campaign monitoring and remarketing · Bilingual website with gallery and estimate calendar · Google Business Profile with 2 posts per month and managed reviews · CRM for up to 3 office users · Credit: monthly follow-up and a strategy for business credit lines and accounts · GovPrime (SAM.gov, UEI, NAICS, capability statement, up to 5 opportunities and 2 bid/no-bid analyses per month) · 90-minute onboarding and 2 strategy meetings per month · Fix & Flip with Owl Funding starting in month 6
  - Not included: Your ad budget · Visiting, measuring, estimating, and doing the work · Any guarantee of leads, jobs, income, or credit approval
- Both: "Book a free diagnostic" · "I already talked to the team" · "Ad spend is paid directly to Google and Meta, never inside the fee. No guaranteed results; every projection is an estimate." · `/programs` only: "Just want the software? See plans from $0 →", "Ready for us to build your machine?"

### FAQ
| Antes | Después |
|---|---|
| **What CRM works for both contractors and property managers?** — LeadPrime ships industry-specific pipelines in one platform: contractors run jobs…, while property managers track units, leases, tenant conversations, and rent collection… | **What's the difference between the plans and the Growth and Legacy programs?** — Pay-As-You-Go, Pro, and Network Elite are self-serve software: you set up and run LeadPrime yourself. Growth ($650/month) and Legacy ($1,200/month) are done-with-you programs that include LeadPrime Elite software ($249/month value). In Growth we build the machine and you run it; in Legacy we build it and run it with you. Ad spend is paid directly to Google and Meta, never inside the fee, and results are not guaranteed. (ES en la lista final) |

### Footer
| Antes | Después |
|---|---|
| The AI-powered CRM for contractors, property managers, and real estate investors — in English & Español. | **Your intelligent business partner.** + "The AI-powered CRM for contractors — in English & Español." + "Fairfield, California" (ES: "Tu socio de negocios inteligente." + "El CRM con IA para contratistas — en español y en inglés.") |
| Enlaces: …Network · **Who It's For** · Pricing · About Us — Our Story | …Network · **For Contractors** · Pricing · **Programs** · About Us — Our Story (ES: …Para contratistas · Precios · Programas · Nosotros — nuestra historia) |
| © 2026 LeadPrime · Chyrris Technologies / Owl Fenc LLC. All rights reserved. | **© 2026 LeadPrime · Chyrris Technologies LLC.** All rights reserved. / Todos los derechos reservados. |

### KEEN (chat del sitio)
- Saludo: "…Ask me anything about the product, pricing, or whether it fits your business…" → "…Ask me anything about the product, pricing, **the Growth and Legacy programs**, or whether it fits your business…" + saludo y toda la interfaz en español en `/es` y `/programas`.
- Prompt: fuera el árbol de 13 industrias / 140 especialidades y "real estate pros"; audiencia solo contratistas; Growth y Legacy con el contenido aprobado y sus reglas; historia sin nombres; regla de privacidad ampliada a nombres y direcciones.

### Páginas estáticas e imágenes
- **`/about/`:** description "LeadPrime was born from Owl Fenc, a Northern California fencing and construction company founded by [nombre del fundador] and his son [nombre del hijo] — …" → "LeadPrime was born at a fencing and construction company in Fairfield, California, run by a contractor and his son — Mexican immigrants and native Tsotsil speakers who built the business partner they wished they'd had." · primer párrafo → "LeadPrime was born in the field — at a fencing and construction company in **Fairfield, California**, run by a contractor and his son." · "[nombres] are…" → "They are…" · "Today, LeadPrime helps Latino contractors, property managers, and real estate pros…" → "Today, LeadPrime helps Latino contractors across the U.S.…" · "…the technology company the [apellido] family built on top of Owl Fenc's field experience." → "…the technology company that family built on top of its years in the field." · JSON-LD sin `founder` (nombres) · footer "Chyrris Technologies LLC" · enlace a "Español".
- **`/nosotros/` (nueva):** la misma historia en español.
- **`/compare/`:** "connect with verified contractors, property managers, and investors" → "connect with other license-verified contractors" · "especially Latino contractors, property managers, and real estate investors" → "especially Latino contractors" · footer "Chyrris Technologies LLC".
- **`/evento`:** "1000 Webster Street, Fairfield, CA 94533" → "Fairfield, California" · público "General contractors, contratistas locales y property managers…" → "Contratistas generales y contratistas locales del área de Fairfield y el Bay Area" · descripción sin el nombre del fundador ni property managers · "Presentado por LeadPrime · Owl Fenc" → "LeadPrime · Chyrris Technologies" (texto e imagen) · "Encuentros privados que conectan a contratistas y property managers del Bay Area." → "Encuentros privados para contratistas del Bay Area." · pie "Powered by Chyrris Technologies" → "Chyrris Technologies LLC".
- **`/support` / `/soporte`:** "Built for contractors and service businesses…" / "…contratistas y negocios de servicios…" → solo contratistas; `/soporte` abre en español · "Support phone: SOPORTE_TELEFONO" → "Phone / WhatsApp: 707 770 4888" + "Message us on WhatsApp →" (ES "Teléfono / WhatsApp: 707 770 4888" + "Escríbenos por WhatsApp →") · "Response target: SOPORTE_TIEMPO_RESPUESTA during business days" → "We reply the same business day, Monday through Friday." (ES "Tiempo de respuesta: SOPORTE_TIEMPO_RESPUESTA en días hábiles" → "Respondemos el mismo día hábil, lunes a viernes.") · "CONTACT" / "PRIVACY" → ES "CONTACTO" / "PRIVACIDAD".
- **`og-image.png`:** "The AI-powered CRM for contractors & real estate pros · Start free · $0 Pay-As-You-Go · leadprimecrm.chyrris.com" → "Your intelligent business partner — built for contractors · Start free · English & Español · leadprimecrm.chyrris.com". **Nueva `og-image-es.png`:** "Tu socio de negocios inteligente — hecho para contratistas · Empieza gratis · En español · leadprimecrm.chyrris.com".

### Texto completo en español (/es), sección por sección

Extraído del sitio renderizado (build de producción local), en el orden en que aparece.

#### Navbar

- Cómo funciona
- Funciones
- Red
- Precios
- Programas
- Nosotros
- EN
- ES
- Iniciar sesión
- Empieza gratis

#### Hero

- Tu socio de negocios inteligente.
- El socio que lleva tu negocio de contratista — no solo tus leads.
- Hecho por un contratista de Fairfield, California. Estimados, contratos, cobros y tu licencia al día, en español.
- Empieza gratis — $0 pago por uso
- Mira cómo funciona
- ¿Hablaste con nuestro equipo? Ver programas Growth y Legacy →
- IA
- Automatización inteligente
- $0
- Para empezar
- 5+
- Integraciones

#### Cómo funciona

- Cómo funciona
- Tres pasos. Un solo sistema.
- PASO 1
- Captura
- Los leads llegan de tus anuncios, referidos y tu red.
- PASO 2
- Trabaja tu pipeline
- KEEN da seguimiento. Tú mandas estimados, contratos y facturas sin salir de la app.
- PASO 3
- Cobra
- Recibe pagos, controla tus documentos y haz crecer tu negocio.

#### Funciones

- Lo que obtienes
- Una sola plataforma.
- Todo lo que tu negocio necesita.
- Del primer lead al pago final — las herramientas principales ya funcionan hoy, y lo que viene en camino está bien marcado.
- Estimados que cierran trabajos.
- Haz estimados profesionales y manda facturas desde tu teléfono. Cobra más rápido — con un toque conviertes un estimado aprobado en factura, y tu cliente firma desde cualquier dispositivo.
- Mostrado con datos de ejemplo.
- ESTIMADO #1024 (DEMO)
- Remodelación de cocina de María
- ENVIADO
- Demolición y retiro — gabinetes existentes
- 1
- $1,450
- Gabinetes shaker a la medida — instalación
- 14
- $6,800
- Cubiertas de cuarzo — material e instalación
- 42 ft²
- $3,960
- Mano de obra — equipo con licencia
- 36 h
- $2,880
- Total
- $15,090
- Aprobar y firmar ✍️
- Con un toque se convierte en factura.
- Agente de IA (KEEN)IA
- Tu asistente de IA que da seguimiento a tus leads, escribe mensajes y mantiene tu pipeline en movimiento. Ponle el nombre que quieras.
- Estimados y facturas integradosIA
- Haz estimados profesionales y manda facturas desde tu teléfono. Cobra más rápido.
- Contratos digitales y firma electrónica (LeadSign)
- Manda contratos y que te los firmen desde cualquier dispositivo.
- Pipelines de construcción
- Etapas listas para cómo se mueven tus trabajos — del primer contacto al estimado, el contrato firmado y el pago final.
- Pagos (LeadPrime Pay)
- Acepta tarjeta y ACH. Puedes aplicar recargo.
- Red B2B
- Conéctate con otros contratistas con licencia verificada.
- Business Health Passport
- Controla tus licencias, seguros y documentos para que no se te pase una renovación ni te caiga una multa.
- Lead HunterPRÓXIMAMENTE
- Descubre leads con IA en tu mercado.
- Tap to PayPRÓXIMAMENTE
- Cobra con tarjeta usando solo tu teléfono.
- Creador de sitios webPRÓXIMAMENTE
- Sitio web generado con IA a partir de tu perfil en el CRM.

#### Red

- Red LeadPrime
- Tu próximo trabajo
- ya está en la red.
- Una red B2B donde contratistas con licencia verificada se encuentran, comparten documentos y sacan el trabajo — y tu reputación viaja contigo.
- Únete a la red
- Acceso completo a la red incluido con Network Elite — $249/mes.
- DATOS DE EJEMPLO
- RB
- Rivera Built Construction ✓
- Contratista general · San José
- VERIFICADO
- OE
- Ortega Electric ✓
- Electricista · Vallejo
- VERIFICADO
- LR
- Luna Roofing & Gutters
- Techos · Fairfield
- VERIFICADO
- + Tu negocio aquí
- 🔗
- Conexiones con licencia verificada
- Conéctate directo con contratistas con licencia verificada en tu zona.
- 🛡️
- Trust Score y kit de cumplimiento
- Tu licencia, tu seguro y tu W-9 en un perfil que puedes compartir. Genera confianza antes de la primera llamada.
- 📄
- Documentos entre miembros
- Manda estimados, facturas y contratos de miembro a miembro — todo se queda en la red.
- 🏛️
- Radar de proyectos de gobierno
- Sigue oportunidades federales y estatales que encajan con tu oficio (Pro y Elite).
- 💰
- Acceso a financiamiento
- Solicita apoyo de financiamiento directo desde tu membresía Network Elite.
- 🤖
- Mensajes agente a agente
- Tu agente de IA coordina cotizaciones y citas con los agentes de otros miembros — tú solo apruebas.

#### Para contratistas

- Para contratistas
- Hecho a la medida de tu negocio.
- Maneja cada trabajo del estimado al pago final. Pipelines por etapa de construcción, contratos digitales, estimados y facturas integrados, y un agente de IA que da seguimiento para que tú no tengas que hacerlo.
- Del primer estimado al pago final — sin tanto papeleo.
- ✓
- Manda estimados profesionales desde tu teléfono en minutos.
- ✓
- Convierte un estimado aprobado en factura con un toque.
- ✓
- Firma contratos en la obra — sin impresora ni oficina.
- ✓
- KEEN da seguimiento a cada lead para que ninguno se enfríe.
- ✓
- Controla tu licencia, tu seguro y tu W-9 para que nunca se te pase una renovación.
- ✓
- Encuentra proyectos de gobierno con GovPrime — trae oportunidades federales y estatales de SAM.gov, según tu oficio.
- ✓
- Acepta pagos con tarjeta y ACH — cobra en el momento.
- Empieza gratis →
- LeadPrime · Pipeline de contratista (demo)
- NUEVO
- Remodelación de cocina de María
- $18,500 · San José
- CONTACTADO
- Cerca en el centro
- $7,200 · Oakland
- ESTIMADO ENVIADO
- Baño de la familia García
- $12,400 · Fremont
- Deck Sunset
- $9,800 · Hayward
- FIRMADO
- ADU Lakeside
- $86,000 · Fairfield
- TERMINADO
- Techo nuevo Vista
- $24,300 · Pagado ✓
- Techo de patio de Rosa
- KEEN dando seguimiento…

#### Súper capacidades

- Súper capacidades
- Herramientas que reemplazan
- miles de dólares en software y honorarios.
- Cuatro capacidades que normalmente son cuatro suscripciones separadas — incluidas en LeadPrime.
- FIRMA ELECTRÓNICA CON IA · VS DOCUSIGN
- LeadSign — firma contratos en 90 segundos, no en 20 minutos.
- Sube cualquier documento y la IA de LeadPrime identifica automáticamente a los firmantes y los campos. Mándalo a firmar con un clic. Lo que normalmente toma ~20 minutos de configuración manual en otras herramientas aquí queda listo en unos 90 segundos.
- Para contratistas que mandan a firmar contratos, órdenes de cambio y acuerdos cada semana.
- DocuSign limita su mapeo de campos con IA al plan IAM Professional (~$75/usuario/mes, mínimo 3 usuarios, según reportes públicos de julio 2026) y cobra por sobre. LeadPrime incluye el mapeo con IA sin plan empresarial y sin cobro por documento.
- ~20 min
- configuración manual en otras
- ~90 seg
- mapeado con IA en LeadPrime
- LEADSIGN · DATOS DE EJEMPLO
- 📄
- Contrato-Remodelacion-demo.pdf
- Subido · 3 páginas
- Escaneo IA
- Firmantes detectados automáticamente
- María G. (Cliente) — firma ×2, fecha
- R. Bautista (Contratista) — firma, iniciales
- ✓ Enviado a firma
- · 92 segundos en total
- GENERADOR DE CONTRATOS · VS ROCKET LAWYER / LAWDEPOT
- Genera un contrato listo para firmar en 90 segundos.
- Arma tu contrato y mándalo a firmar en un solo paso — sin plantillas en blanco que llenar a mano. Un contrato de contratista que con un abogado puede costar ~$900 (ejemplo típico, no una cotización) queda listo en unos 90 segundos.
- Rocket Lawyer (~$39.99/mes) y LawDepot (~$35/mes, o $7.50–$119 por documento; según reportes públicos de julio 2026) venden plantillas que llenas tú mismo — sin mapeo con IA ni firma electrónica en el mismo flujo. LeadPrime genera el contrato Y lo deja listo para firmar en un solo paso.
- ~$900
- contrato típico hecho por abogado
- incluido
- generado y listo para firmar
- GENERADOR DE CONTRATOS · DATOS DE EJEMPLO
- 1 · Elige el tipo de contrato
- Contrato de remodelación de cocina — CA
- 2 · Generado con tu alcance de trabajo
- Pagos por etapa · órdenes de cambio · avisos de gravamen (lien)
- ✓ Listo para firmar
- · vía LeadSign
- GOVPRIME · RADAR DE OBRA PÚBLICA
- Encuentra contratos de gobierno que encajan con tu oficio.
- LeadPrime revisa oportunidades federales y estatales de SAM.gov y de fuentes públicas, y las relaciona con tu oficio y tu zona — para que encuentres obra pública que de otro modo nunca verías. Encontrar la oportunidad es nuestro trabajo; ganar la licitación es el tuyo.
- Para contratistas que quieren entrar a la obra pública sin contratar un servicio de búsqueda de licitaciones.
- GOVPRIME · DATOS DE EJEMPLO
- Cambio de techo — biblioteca del condado
- Federal · coincide: Techos · cierra en 12 días
- 94% coincide
- Paquete de banquetas y rampas ADA
- Estatal · coincide: Concreto y mampostería
- 88% coincide
- Modernización de HVAC — distrito escolar
- Estatal · coincide: HVAC · junta previa pronto
- 81% coincide
- BUSINESS HEALTH PASSPORT · ESCUDO DE CUMPLIMIENTO
- Tu licencia y tus seguros, siempre al día.
- Controla tus licencias, seguros, W-9 y workers' comp en un solo lugar. LeadPrime te avisa antes de que algo venza — para que una licencia vencida o un documento faltante nunca se convierta en multa.
- Trabajar como contratista sin licencia activa puede significar multas de miles de dólares — en algunos estados, de cinco cifras. LeadPrime te mantiene cubierto antes de que llegues a eso.
- BUSINESS HEALTH PASSPORT · DATOS DE EJEMPLO
- Licencia de contratista — C-33
- renueva mar 2027
- Vigente
- Seguro de responsabilidad general
- quedan 34 días · recordatorio enviado
- Vence pronto
- Certificado de workers' comp
- en archivo
- Vigente
- W-9 en archivo
- EIN nuevo — vuelve a subirlo
- Requiere acción
- Obtén las cuatro — empieza gratis en $0
- Precios de la competencia basados en cifras reportadas públicamente, julio 2026 (DocuSign IAM Professional, Rocket Lawyer, LawDepot); los planes y precios varían y pueden cambiar. Los tiempos y costos son ejemplos típicos, no garantías. Todas las pantallas se muestran con datos de ejemplo ficticios.

#### Conoce a KEEN

- KEENAGENTE DE IA
- ● En vivo en esta página
- Esto no es una maqueta — KEEN está en vivo aquí mismo. Pregúntale por precios, funciones o si LeadPrime le queda a tu negocio. En español o en inglés.
- Habla con KEEN ahora
- Solo información pública del producto · hay límites de uso por visitante.
- Conoce a KEEN
- Tu agente de IA trabaja
- mientras tú construyes.
- KEEN da seguimiento a cada lead, escribe tus mensajes y mantiene tu pipeline en movimiento — 24/7. Ponle el nombre que quieras. Es tuyo.
- 🎯
- Seguimiento automático de leads
- KEEN califica, prioriza y responde a tus leads sin que tengas que intervenir.
- 💬
- Piloto automático de SMS 24/7
- Los seguimientos salen a tiempo — noches, fines de semana y mientras estás en la obra.
- 📅
- Agenda citas
- Conectado a tu calendario. KEEN propone horarios, confirma y manda recordatorios.
- 📚
- Entrenado con tu negocio
- Dale tus precios, documentos y preguntas frecuentes en la Base de Conocimiento — responde como tú lo harías.
- 🔌
- Agente a agente (MCP)
- Conecta agentes de IA externos a tu CRM para mandar leads, actualizar contactos y activar flujos de trabajo.
- ✨
- Ponle tu nombre
- KEEN es el nombre de fábrica — ponle a tu agente el nombre y la personalidad que quieras.
- Activa tu agente de IA — gratis

#### Compara

- Compara
- Por qué los contratistas
- se están cambiando a LeadPrime.
- CAPACIDAD	LeadPrime	Jobber	ServiceTitan
- Precio inicial
- ✓
- $0 (pago por uso)	desde ~$39/mes, sube con los usuarios	No es público · reportado $245–$500+/técnico/mes
- Costo de instalación / implementación
- ✓
- Ninguno	Ninguno	Reportado $5,000–$50,000
- Contrato obligatorio
- ✓
- No — cancela cuando quieras	Prueba y luego plan	Contrato anual; se reportan cargos por cancelación anticipada
- Hecho para contratistas latinos / en español
- ✓
- Sí	No	No
- Agente de IA que da seguimiento (KEEN)
- ✓
- Sí, integrado	Complemento/limitado	Complemento
- Estimados + facturas + contratos + pagos, integrados
- ✓
- Todo incluido	Básico + complementos pagados	Suite empresarial
- Red B2B verificada
- ✓
- Sí	No	No
- Ideal para	Desde quien trabaja solo hasta equipos en crecimiento	Equipos pequeños y medianos	Empresas de 20+ técnicos
- Una suscripción que reemplaza 4–5.
- Lo que normalmente requiere un montón de herramientas separadas viene incluido.
- Firma electrónica con mapeo de campos por IA
- DocuSign IAM Professional (~$75/usuario/mes, reportado)
- →
- LeadSign — incluido
- Generación de contratos
- Rocket Lawyer ~$39.99/mes · LawDepot ~$35/mes (reportado)
- →
- Generador de contratos — incluido
- Buscador de licitaciones de gobierno
- Servicios de búsqueda de licitaciones y búsqueda manual en SAM.gov
- →
- GovPrime — incluido
- Control de licencias y cumplimiento
- Hojas de cálculo o servicios de cumplimiento
- →
- Business Health Passport — incluido
- CRM + seguimiento con IA + pagos
- Una suscripción de CRM + complementos
- →
- LeadPrime core — desde $0
- Precios de la competencia basados en cifras reportadas públicamente, julio 2026 (Jobber, ServiceTitan, DocuSign, Rocket Lawyer, LawDepot); ServiceTitan y otros no publican precios oficiales, y los planes varían. Las funciones disponibles varían según el plan de cada competidor. Los precios de LeadPrime reflejan los planes publicados actualmente. Todos los nombres de productos son marcas de sus respectivos dueños; LeadPrime no está afiliado a ninguno de ellos.
- Lee la comparación completa LeadPrime vs Jobber vs ServiceTitan (en inglés) →

#### Precios

- Precios
- Empieza en $0.
- Crece cuando estés listo.
- Sin contratos. Cancela cuando quieras.
- Pago por uso
- $0
- /mes
- $15 en créditos de bienvenida. Sin tarjeta de crédito. Pagas solo lo que usas.
- Empieza gratis
- MÁS POPULAR
- Pro
- $15
- /mes
- $20 en créditos cada mes. Para negocios en crecimiento.
- Elige Pro
- Network Elite
- $249
- /mes
- $250 en créditos cada mes, acceso completo a la red B2B, suite de estimados para cercas, herramientas financieras Ledger y acceso a financiamiento para tu negocio.
- Hazte Elite
- El uso (SMS, voz, email, acciones de IA) se descuenta de tu saldo de créditos según las tarifas publicadas por acción.
- ¿Prefieres que nuestro equipo lo construya contigo? Ver programas Growth y Legacy ↓

#### Programas

- Programas
- Programas hechos con nosotros.
- Los planes Pago por uso, Pro y Network Elite son software de autoservicio: tú lo configuras y lo usas. Growth y Legacy son programas hechos con nosotros que incluyen el software LeadPrime Elite.
- PROGRAMA
- Growth
- $650
- /mes
- Te construimos la máquina. Tú la operas.
- Para el contratista que tiene quién conteste el teléfono en la primera hora.
- ✓ Software LeadPrime Elite incluido ($249/mes de valor)
- INCLUYE
- ✓
- Sitio web propio (el dominio y el contenido son tuyos)
- ✓
- Google Business Profile creado o recuperado, verificado, con sistema de reseñas
- ✓
- 1 campaña principal configurada (Google LSA o Meta)
- ✓
- LeadPrime Elite completo (CRM, pipeline, automatizaciones, estimados con IA, contratos y LeadSign, facturas, cobros, Business Health Passport)
- ✓
- Agente de IA cargado con el conocimiento de tu negocio
- ✓
- Créditos LeadPrime cada mes
- ✓
- Diagnóstico inicial de crédito empresarial y perfil DUNS
- ✓
- Operating Agreement si formas una LLC (el filing fee del estado lo pagas tú)
- ✓
- Onboarding y 1 reunión estratégica al mes
- NO INCLUYE
- ✕
- Llamar, dar seguimiento ni agendar los leads
- ✕
- Monitoreo continuo de campañas
- ✕
- Seguimiento mensual de crédito
- ✕
- Contratos de gobierno
- ✕
- El presupuesto de publicidad
- Agenda un diagnóstico gratis
- Ya hablé con el equipo
- La pauta se paga directo a Google y Meta, nunca dentro del fee. Sin garantías de resultados; toda proyección es estimado.
- PROGRAMA
- Legacy
- $1,200
- /mes
- Te la construimos y la operamos contigo.
- Para el que no se da abasto: no necesita más leads, necesita quién los trabaje.
- ✓ Software LeadPrime Elite incluido ($249/mes de valor)
- TODO GROWTH, MÁS:
- ✓
- Nuestro equipo persigue los leads (primer intento en menos de 2 horas hábiles, hasta 6 intentos en 10 días, hasta 100 leads nuevos al mes)
- ✓
- Precalificación y cita agendada en tu calendario
- ✓
- Monitoreo de campañas y remarketing
- ✓
- Sitio bilingüe con galería y calendario de estimados
- ✓
- Google Business Profile con 2 publicaciones al mes y reseñas gestionadas
- ✓
- CRM para hasta 3 usuarios de oficina
- ✓
- Crédito: seguimiento mensual y estrategia de líneas y cuentas de negocio
- ✓
- GovPrime (SAM.gov, UEI, NAICS, capability statement, hasta 5 oportunidades y 2 análisis bid/no-bid al mes)
- ✓
- Onboarding de 90 min y 2 reuniones estratégicas al mes
- ✓
- Fix & Flip con Owl Funding a partir del mes 6
- NO INCLUYE
- ✕
- El presupuesto de publicidad
- ✕
- Visitar, medir, estimar y ejecutar el trabajo
- ✕
- Garantía de leads, trabajos, ingresos o aprobación de crédito
- Agenda un diagnóstico gratis
- Ya hablé con el equipo
- La pauta se paga directo a Google y Meta, nunca dentro del fee. Sin garantías de resultados; toda proyección es estimado.

#### FAQ

- FAQ
- Las preguntas que
- sí hacen los contratistas.
- ¿Cuál es el mejor CRM para contratistas que funcione en español?
- +
- LeadPrime está hecho para contratistas latinos en Estados Unidos — funciona completamente en inglés y en español, para que todo tu equipo lo pueda usar. Estimados, facturas, contratos digitales, pagos y un agente de IA (KEEN) que da seguimiento a tus leads vienen integrados en la plataforma, no como complementos.
- ¿Hay un CRM gratis para contratistas?
- +
- Sí. LeadPrime empieza en $0 con el plan de pago por uso (Pay-As-You-Go): recibes $15 en créditos de bienvenida, sin tarjeta de crédito, y solo pagas lo que usas. Los planes pagados son opcionales: Pro cuesta $15 al mes y Network Elite $249 al mes.
- ¿Cuál es la diferencia entre los planes y los programas Growth y Legacy?
- +
- Pago por uso, Pro y Network Elite son software de autoservicio: tú configuras y manejas LeadPrime. Growth ($650 al mes) y Legacy ($1,200 al mes) son programas hechos con nosotros que incluyen el software LeadPrime Elite ($249 al mes de valor). En Growth te construimos la máquina y tú la operas; en Legacy te la construimos y la operamos contigo. La pauta se paga directo a Google y Meta, nunca dentro del fee, y no hay garantía de resultados.
- ¿Cuál es el mejor CRM para contratistas pequeños o que trabajan solos?
- +
- LeadPrime está pensado para quienes trabajan solos y para equipos pequeños: empieza en $0, manda estimados profesionales desde tu teléfono y deja que el agente de IA KEEN dé seguimiento a cada lead para que ninguno se enfríe. No hay costos de instalación ni contrato anual — cancela cuando quieras.
- ¿Hay un CRM que incluya estimados, facturas y contratos?
- +
- Sí — en LeadPrime vienen integrados, no son complementos pagados. Haz un estimado, conviértelo en factura con un toque, manda el contrato a firma electrónica (LeadSign) y cobra con tarjeta o ACH, todo dentro de la misma plataforma.
- ¿En qué se diferencia LeadPrime de Jobber o ServiceTitan?
- +
- Tres diferencias honestas: LeadPrime empieza en $0 con pago por uso, mientras que la competencia empieza con una suscripción mensual; LeadPrime está hecho bilingüe (inglés y español) desde el principio, no traducido después; y estimados, facturas, contratos, pagos y el agente de IA vienen incluidos de forma nativa. ServiceTitan está pensado para operaciones más grandes; Jobber empieza desde unos $39 al mes (cifras reportadas públicamente, julio 2026). Ver la comparación completa (en inglés) →

#### CTA final

- ¿Listo para manejar tu negocio
- desde un solo lugar?
- Empieza gratis con $15 en créditos de bienvenida. Sin tarjeta de crédito.
- Empieza gratis — $0 pago por uso

#### Footer

- Tu socio de negocios inteligente.
- El CRM con IA para contratistas — en español y en inglés.
- Fairfield, California
- PRODUCTO
- Funciones
- Cómo funciona
- Red
- Para contratistas
- Precios
- Programas
- Nosotros — nuestra historia
- Iniciar sesión
- LEGAL Y SOPORTE
- Política de privacidad
- Términos de servicio
- Soporte
- © 2026 LeadPrime · Chyrris Technologies LLC. Todos los derechos reservados.
