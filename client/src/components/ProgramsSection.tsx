/**
 * Programas — Growth ($650/mo) and Legacy ($1,200/mo), approved by Gelasio on
 * 26-Sep-2026 for the call-agency campaign. This copy is what the agents say
 * on the phone, item by item: change it only with the same approval.
 *
 * Positioning: Pay-As-You-Go / Pro / Network Elite are self-serve software;
 * Growth and Legacy are done-with-you programs that INCLUDE Elite.
 * Guardrails: never promise to get the license or the DUNS for the client
 * (say "preparamos tu expediente" / "dejamos tu archivo comercial
 * correcto"); never call the programs "Hazlo Real" or "Construye
 * Patrimonio"; ad spend is never inside the fee; no guaranteed results.
 */
import { diagnosticBookingLink, PROGRAM_JOIN_URL } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";
import { HOME_PATH } from "@shared/pageMeta";
import ResponsiveImage from "@/components/ResponsiveImage";

type Program = {
  id: keyof typeof PROGRAM_JOIN_URL;
  name: string;
  price: string;
  tagline: string;
  forWhom: string;
  includesTitle: string;
  includes: string[];
  excludes: string[];
};

type Copy = {
  badge: string;
  title: { before: string; highlight: string };
  pageTitle: { before: string; highlight: string };
  positioning: string;
  kicker: string;
  period: string;
  eliteIncluded: string;
  excludesTitle: string;
  primaryCta: string;
  secondaryCta: string;
  footnote: string;
  softwareLink: string;
  programs: [Program, Program];
};

const COPY: Record<"en" | "es", Copy> = {
  es: {
    badge: "Programas",
    title: { before: "Programas hechos", highlight: "con nosotros." },
    pageTitle: {
      before: "Programas Growth y Legacy,",
      highlight: "hechos con nosotros.",
    },
    positioning:
      "Los planes Pago por uso, Pro y Network Elite son software de autoservicio: tú lo configuras y lo usas. Growth y Legacy son programas hechos con nosotros que incluyen el software LeadPrime Elite.",
    kicker: "Programa",
    period: "/mes",
    eliteIncluded: "Software LeadPrime Elite incluido ($249/mes de valor)",
    excludesTitle: "No incluye",
    primaryCta: "Agenda un diagnóstico gratis",
    secondaryCta: "Ya hablé con el equipo",
    footnote:
      "La pauta se paga directo a Google y Meta, nunca dentro del fee. Sin garantías de resultados; toda proyección es estimado.",
    softwareLink: "¿Solo quieres el software? Ver planes desde $0 →",
    programs: [
      {
        id: "growth",
        name: "Growth",
        price: "$650",
        tagline: "Te construimos la máquina. Tú la operas.",
        forWhom:
          "Para el contratista que tiene quién conteste el teléfono en la primera hora.",
        includesTitle: "Incluye",
        includes: [
          "Sitio web propio (el dominio y el contenido son tuyos)",
          "Google Business Profile creado o recuperado, verificado, con sistema de reseñas",
          "1 campaña principal configurada (Google LSA o Meta)",
          "LeadPrime Elite completo (CRM, pipeline, automatizaciones, estimados con IA, contratos y LeadSign, facturas, cobros, Business Health Passport)",
          "Agente de IA cargado con el conocimiento de tu negocio",
          "Créditos LeadPrime cada mes",
          "Diagnóstico inicial de crédito empresarial y perfil DUNS",
          "Operating Agreement si formas una LLC (el filing fee del estado lo pagas tú)",
          "Onboarding y 1 reunión estratégica al mes",
        ],
        excludes: [
          "Llamar, dar seguimiento ni agendar los leads",
          "Monitoreo continuo de campañas",
          "Seguimiento mensual de crédito",
          "Contratos de gobierno",
          "El presupuesto de publicidad",
        ],
      },
      {
        id: "legacy",
        name: "Legacy",
        price: "$1,200",
        tagline: "Te la construimos y la operamos contigo.",
        forWhom:
          "Para el que no se da abasto: no necesita más leads, necesita quién los trabaje.",
        includesTitle: "Todo Growth, más:",
        includes: [
          "Nuestro equipo persigue los leads (primer intento en menos de 2 horas hábiles, hasta 6 intentos en 10 días, hasta 100 leads nuevos al mes)",
          "Precalificación y cita agendada en tu calendario",
          "Monitoreo de campañas y remarketing",
          "Sitio bilingüe con galería y calendario de estimados",
          "Google Business Profile con 2 publicaciones al mes y reseñas gestionadas",
          "CRM para hasta 3 usuarios de oficina",
          "Crédito: seguimiento mensual y estrategia de líneas y cuentas de negocio",
          "GovPrime (SAM.gov, UEI, NAICS, capability statement, hasta 5 oportunidades y 2 análisis bid/no-bid al mes)",
          "Onboarding de 90 min y 2 reuniones estratégicas al mes",
          "Fix & Flip con Owl Funding a partir del mes 6",
        ],
        excludes: [
          "El presupuesto de publicidad",
          "Visitar, medir, estimar y ejecutar el trabajo",
          "Garantía de leads, trabajos, ingresos o aprobación de crédito",
        ],
      },
    ],
  },
  en: {
    badge: "Programs",
    title: { before: "Done-with-you", highlight: "programs." },
    pageTitle: {
      before: "Growth & Legacy:",
      highlight: "done-with-you programs.",
    },
    positioning:
      "The Pay-As-You-Go, Pro, and Network Elite plans are self-serve software: you set it up and use it. Growth and Legacy are done-with-you programs that include LeadPrime Elite software.",
    kicker: "Program",
    period: "/month",
    eliteIncluded: "LeadPrime Elite software included ($249/month value)",
    excludesTitle: "Not included",
    primaryCta: "Book a free diagnostic",
    secondaryCta: "I already talked to the team",
    footnote:
      "Ad spend is paid directly to Google and Meta, never inside the fee. No guaranteed results; every projection is an estimate.",
    softwareLink: "Just want the software? See plans from $0 →",
    programs: [
      {
        id: "growth",
        name: "Growth",
        price: "$650",
        tagline: "We build the machine. You run it.",
        forWhom:
          "For the contractor who has someone to answer the phone within the first hour.",
        includesTitle: "Includes",
        includes: [
          "Your own website (the domain and the content are yours)",
          "Google Business Profile created or recovered, verified, with a review system",
          "1 main campaign set up (Google LSA or Meta)",
          "Full LeadPrime Elite (CRM, pipeline, automations, AI estimates, contracts and LeadSign, invoices, payments, Business Health Passport)",
          "AI agent loaded with your business knowledge",
          "LeadPrime credits every month",
          "Initial business credit diagnostic and DUNS profile",
          "Operating Agreement if you form an LLC (you pay the state filing fee)",
          "Onboarding and 1 strategy meeting per month",
        ],
        excludes: [
          "Calling, following up with, or booking your leads",
          "Ongoing campaign monitoring",
          "Monthly credit follow-up",
          "Government contracts",
          "Your ad budget",
        ],
      },
      {
        id: "legacy",
        name: "Legacy",
        price: "$1,200",
        tagline: "We build it and run it with you.",
        forWhom:
          "For the contractor who can't keep up: they don't need more leads, they need someone to work them.",
        includesTitle: "Everything in Growth, plus:",
        includes: [
          "Our team chases your leads (first attempt in under 2 business hours, up to 6 attempts over 10 days, up to 100 new leads per month)",
          "Pre-qualification and appointments booked on your calendar",
          "Campaign monitoring and remarketing",
          "Bilingual website with gallery and estimate calendar",
          "Google Business Profile with 2 posts per month and managed reviews",
          "CRM for up to 3 office users",
          "Credit: monthly follow-up and a strategy for business credit lines and accounts",
          "GovPrime (SAM.gov, UEI, NAICS, capability statement, up to 5 opportunities and 2 bid/no-bid analyses per month)",
          "90-minute onboarding and 2 strategy meetings per month",
          "Fix & Flip with Owl Funding starting in month 6",
        ],
        excludes: [
          "Your ad budget",
          "Visiting, measuring, estimating, and doing the work",
          "Any guarantee of leads, jobs, income, or credit approval",
        ],
      },
    ],
  },
};

const ACCENT: Record<Program["id"], string> = {
  growth: "#00D4FF",
  legacy: "#F59E0B",
};

const PROGRAM_VISUALS = {
  es: {
    cafeAlt: "Contratista y asesor revisando una tableta en una cafetería con luz de ventana.",
    steps: [
      { asset: "activation-welcome", caption: "1. Te damos la bienvenida", alt: "Pantalla de bienvenida al programa LeadPrime Network en un teléfono." },
      { asset: "activation-agreement", caption: "2. Firmas tu acuerdo en el teléfono", alt: "Pantalla de firma del acuerdo de LeadPrime en un teléfono." },
      { asset: "activation-ach", caption: "3. Activas tu cuenta; el cobro es el último paso", alt: "Pantalla de activación ACH de LeadPrime en un teléfono." },
    ],
  },
  en: {
    cafeAlt: "Contractor and advisor reviewing a tablet in a café with window light.",
    steps: [
      { asset: "activation-welcome", caption: "1. We welcome you", alt: "Welcome screen for the LeadPrime Network program on a phone." },
      { asset: "activation-agreement", caption: "2. Sign your agreement on your phone", alt: "LeadPrime agreement signature screen on a phone." },
      { asset: "activation-ach", caption: "3. Activate your account; billing is the last step", alt: "LeadPrime ACH activation screen on a phone." },
    ],
  },
} as const;

/** Home section by default; `standalone` renders it as the /programas page body. */
export default function ProgramsSection({ standalone = false }: { standalone?: boolean }) {
  const lang = useLang();
  const t = COPY[lang];
  const Heading = standalone ? "h1" : "h2";
  const title = standalone ? t.pageTitle : t.title;
  const visuals = PROGRAM_VISUALS[lang];
  // Carries the page's gclid/utm_* into the booking page.
  const bookingHref = diagnosticBookingLink();

  return (
    <section
      id="programas"
      className={`${standalone ? "pt-12 lg:pt-16" : "pt-24"} pb-24 bg-[#0A1628] relative overflow-hidden`}
    >
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
            <span className="text-sm font-semibold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.badge}
            </span>
          </div>
          <Heading
            className="text-4xl lg:text-6xl font-black text-white mb-6 text-balance"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title.before} <span className="lp-text-gradient-amber">{title.highlight}</span>
          </Heading>
          <p className="text-lg text-white/65 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.positioning}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 items-center max-w-6xl mx-auto mb-16">
          <figure className="overflow-hidden rounded-2xl border border-[#F59E0B]/20 shadow-[0_24px_80px_rgba(245,158,11,0.12)]">
            <ResponsiveImage
              asset="programs-cafe"
              alt={visuals.cafeAlt}
              width={1600}
              height={1067}
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="block"
              imgClassName="aspect-[3/2] h-full w-full object-cover"
            />
          </figure>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
            {visuals.steps.map((step) => (
              <figure key={step.asset} className="min-w-0">
                <ResponsiveImage
                  asset={step.asset}
                  alt={step.alt}
                  width={1330}
                  height={2704}
                  widths={[480, 768, 1200]}
                  sizes="(min-width: 1024px) 15vw, 30vw"
                  className="block"
                  imgClassName="h-auto w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.32)]"
                />
                <figcaption className="mt-3 text-center text-xs leading-snug text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {step.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch">
          {t.programs.map(program => {
            const accent = ACCENT[program.id];
            return (
              <article
                key={program.id}
                className="lp-card rounded-2xl p-7 lg:p-9 flex flex-col"
                style={{ borderTop: `3px solid ${accent}` }}
                aria-labelledby={`programa-${program.id}`}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t.kicker}
                </p>
                <h3
                  id={`programa-${program.id}`}
                  className="text-3xl lg:text-4xl font-black text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {program.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-3 mb-5">
                  <span className="text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {program.price}
                  </span>
                  <span className="text-white/55 text-sm">{t.period}</span>
                </div>
                <p className="text-lg lg:text-xl font-bold text-white leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {program.tagline}
                </p>
                {/* min-height keeps both cards' Elite badges aligned side by side */}
                <p className="text-sm text-white/65 mt-2 leading-relaxed lg:min-h-[2.9rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {program.forWhom}
                </p>

                <p
                  className="mt-5 rounded-xl border px-4 py-3 text-sm font-semibold leading-snug"
                  style={{ borderColor: `${accent}55`, background: `${accent}14`, color: accent, fontFamily: "'Inter', sans-serif" }}
                >
                  <span aria-hidden="true">✓ </span>
                  {t.eliteIncluded}
                </p>

                <h4 className="mt-7 mb-3 text-xs font-bold uppercase tracking-widest text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {program.includesTitle}
                </h4>
                <ul className="space-y-2.5">
                  {program.includes.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="mt-0.5 font-bold shrink-0" style={{ color: accent }} aria-hidden="true">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="mt-7 mb-3 text-xs font-bold uppercase tracking-widest text-white/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t.excludesTitle}
                </h4>
                <ul className="space-y-2">
                  {program.excludes.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="mt-0.5 shrink-0 text-white/40" aria-hidden="true">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={`programas-${program.id}-diagnostico`}
                    className={`${program.id === "legacy" ? "lp-btn-amber" : "lp-btn-primary"} block text-center px-6 py-4 rounded-xl text-base font-bold`}
                  >
                    {t.primaryCta}
                  </a>
                  <a
                    href={PROGRAM_JOIN_URL[program.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={`programas-${program.id}-join`}
                    className="block text-center mt-3 text-sm text-white/60 hover:text-white underline-offset-4 hover:underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {t.secondaryCta}
                  </a>
                  <p className="mt-5 pt-4 border-t border-white/10 text-xs text-white/55 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.footnote}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {standalone && (
          <p className="text-center mt-10">
            <a
              href={`${HOME_PATH[lang]}#pricing`}
              className="text-sm font-bold text-[#00D4FF] hover:underline"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.softwareLink}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
