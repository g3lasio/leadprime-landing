/**
 * What You Get — Brief B approved feature list (verbatim copy).
 * Only features live in production today; gated features carry a
 * "Coming Soon" badge. The CloudFront dashboard mockup was removed
 * (Brief C: zero external asset dependencies).
 */

import type { ReactNode } from "react";
import EstimateMockup from "@/components/mockups/EstimateMockup";
import { useLang, type Lang } from "@/lib/i18n";

type Feature = {
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  color: string;
  icon: ReactNode;
  highlight?: boolean;
  comingSoon?: boolean;
};

const COPY = {
  en: {
    badge: "What You Get",
    title: { before: "One Platform.", highlight: "Everything Your Business Needs." },
    subtitle:
      "From first lead to final payment — core tools are live today, and what's on the way is clearly marked.",
    showcase: {
      title: { before: "Estimates that", highlight: "close jobs." },
      text: "Build professional estimates and send invoices from your phone. Get paid faster — one tap turns an approved estimate into an invoice, and your client signs on any device.",
      demo: "Shown with demo data.",
    },
    ai: "AI",
    comingSoon: "Coming Soon",
  },
  es: {
    badge: "Lo que obtienes",
    title: { before: "Una sola plataforma.", highlight: "Todo lo que tu negocio necesita." },
    subtitle:
      "Del primer lead al pago final — las herramientas principales ya funcionan hoy, y lo que viene en camino está bien marcado.",
    showcase: {
      title: { before: "Estimados que", highlight: "cierran trabajos." },
      text: "Haz estimados profesionales y manda facturas desde tu teléfono. Cobra más rápido — con un toque conviertes un estimado aprobado en factura, y tu cliente firma desde cualquier dispositivo.",
      demo: "Mostrado con datos de ejemplo.",
    },
    ai: "IA",
    comingSoon: "Próximamente",
  },
} as const;

const features: Feature[] = [
  {
    title: { en: "AI Agent (KEEN)", es: "Agente de IA (KEEN)" },
    desc: {
      en: "Your AI assistant that follows up on leads, drafts messages, and keeps your pipeline moving. Give it any name you want.",
      es: "Tu asistente de IA que da seguimiento a tus leads, escribe mensajes y mantiene tu pipeline en movimiento. Ponle el nombre que quieras.",
    },
    color: "#00D4FF",
    highlight: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: { en: "Native Estimates & Invoices", es: "Estimados y facturas integrados" },
    desc: {
      en: "Build professional estimates and send invoices from your phone. Get paid faster.",
      es: "Haz estimados profesionales y manda facturas desde tu teléfono. Cobra más rápido.",
    },
    color: "#10B981",
    highlight: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: { en: "Digital Contracts & E-Sign (LeadSign)", es: "Contratos digitales y firma electrónica (LeadSign)" },
    desc: {
      en: "Send contracts, get them signed on any device.",
      es: "Manda contratos y que te los firmen desde cualquier dispositivo.",
    },
    color: "#00D4FF",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: { en: "Construction Pipelines", es: "Pipelines de construcción" },
    desc: {
      en: "Pre-built stages for how your jobs actually move — from first call to estimate, signed contract, and final payment.",
      es: "Etapas listas para cómo se mueven tus trabajos — del primer contacto al estimado, el contrato firmado y el pago final.",
    },
    color: "#F59E0B",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: { en: "Payments (LeadPrime Pay)", es: "Pagos (LeadPrime Pay)" },
    desc: {
      en: "Accept card and ACH. Surcharge supported.",
      es: "Acepta tarjeta y ACH. Puedes aplicar recargo.",
    },
    color: "#10B981",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: { en: "B2B Network", es: "Red B2B" },
    desc: {
      en: "Connect with other license-verified contractors.",
      es: "Conéctate con otros contratistas con licencia verificada.",
    },
    color: "#00D4FF",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: { en: "Business Health Passport", es: "Business Health Passport" },
    desc: {
      en: "Track your licenses, insurance, and docs so you never miss a renewal or a fine.",
      es: "Controla tus licencias, seguros y documentos para que no se te pase una renovación ni te caiga una multa.",
    },
    color: "#A78BFA",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: { en: "Lead Hunter", es: "Lead Hunter" },
    desc: {
      en: "AI-powered lead discovery for your target market.",
      es: "Descubre leads con IA en tu mercado.",
    },
    color: "#F59E0B",
    comingSoon: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: { en: "Tap to Pay", es: "Tap to Pay" },
    desc: {
      en: "Take card payments with just your phone.",
      es: "Cobra con tarjeta usando solo tu teléfono.",
    },
    color: "#F59E0B",
    comingSoon: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: { en: "Website Builder", es: "Creador de sitios web" },
    desc: {
      en: "AI-generated website built from your CRM profile.",
      es: "Sitio web generado con IA a partir de tu perfil en el CRM.",
    },
    color: "#F59E0B",
    comingSoon: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <section id="features" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 max-w-full h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.badge}
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.title.before}
            <br />
            <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Estimates & Invoices showcase (Brief D3 mockup #2, next to its feature) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h3
              className="text-2xl lg:text-3xl font-black text-white mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.showcase.title.before} <span className="lp-text-gradient-cyan">{t.showcase.title.highlight}</span>
            </h3>
            <p className="text-white/60 leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.showcase.text}
            </p>
            <p className="text-xs text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.showcase.demo}
            </p>
          </div>
          <EstimateMockup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feat) => (
            <div
              key={feat.title.en}
              className={`lp-card rounded-xl p-5 transition-all duration-300 hover:border-[#00D4FF]/40 hover:-translate-y-1 ${
                feat.highlight ? "lp-border-amber" : ""
              } ${feat.comingSoon ? "opacity-80" : ""}`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${feat.color}20`, color: feat.color }}
              >
                {feat.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feat.title[lang]}
                {feat.highlight && !feat.comingSoon && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-semibold">
                    {t.ai}
                  </span>
                )}
                {feat.comingSoon && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-semibold uppercase tracking-wide">
                    {t.comingSoon}
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/55 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {feat.desc[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
