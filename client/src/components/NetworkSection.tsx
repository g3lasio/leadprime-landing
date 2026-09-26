/**
 * LeadPrime Network — honest claims only (Brief B):
 * "license-verified" (never "vetted"), no city events, no credit
 * reconstruction, no LegalPrime formation claims. CSS visual replaces
 * the CloudFront image (Brief C). Contractors-only audience (Sep 2026).
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";

const ICONS = ["🔗", "🛡️", "📄", "🏛️", "💰", "🤖"];

const COPY = {
  en: {
    badge: "LeadPrime Network",
    title: { before: "Your next job is", highlight: "already in the network." },
    text: "A B2B network where license-verified contractors find each other, share documents, and get work done — with your reputation traveling with you.",
    cta: "Join the Network",
    note: "Full network access included with Network Elite — $249/mo.",
    demo: "Demo data",
    verified: "Verified",
    yourBusiness: "+ Your business here",
    members: [
      { initials: "RB", name: "Rivera Built Construction", meta: "General Contractor · San Jose", check: true },
      { initials: "OE", name: "Ortega Electric", meta: "Electrical · Vallejo", check: true },
      { initials: "LR", name: "Luna Roofing & Gutters", meta: "Roofing · Fairfield", check: false },
    ],
    benefits: [
      { title: "License-Verified Connections", desc: "Connect directly with license-verified contractors in your area." },
      { title: "Trust Score & Compliance Kit", desc: "Your license, insurance, and W-9 in one shareable profile. Build trust before the first call." },
      { title: "Documents Between Members", desc: "Send estimates, invoices, and contracts member-to-member — everything stays in the network." },
      { title: "Government Project Radar", desc: "Track federal and state opportunities that match your trade (Pro & Elite)." },
      { title: "Business Financing Access", desc: "Request financing support directly from your Network Elite membership." },
      { title: "Agent-to-Agent Messaging", desc: "Your AI agent coordinates quotes and scheduling with other members' agents — you just approve." },
    ],
  },
  es: {
    badge: "Red LeadPrime",
    title: { before: "Tu próximo trabajo", highlight: "ya está en la red." },
    text: "Una red B2B donde contratistas con licencia verificada se encuentran, comparten documentos y sacan el trabajo — y tu reputación viaja contigo.",
    cta: "Únete a la red",
    note: "Acceso completo a la red incluido con Network Elite — $249/mes.",
    demo: "Datos de ejemplo",
    verified: "Verificado",
    yourBusiness: "+ Tu negocio aquí",
    members: [
      { initials: "RB", name: "Rivera Built Construction", meta: "Contratista general · San José", check: true },
      { initials: "OE", name: "Ortega Electric", meta: "Electricista · Vallejo", check: true },
      { initials: "LR", name: "Luna Roofing & Gutters", meta: "Techos · Fairfield", check: false },
    ],
    benefits: [
      { title: "Conexiones con licencia verificada", desc: "Conéctate directo con contratistas con licencia verificada en tu zona." },
      { title: "Trust Score y kit de cumplimiento", desc: "Tu licencia, tu seguro y tu W-9 en un perfil que puedes compartir. Genera confianza antes de la primera llamada." },
      { title: "Documentos entre miembros", desc: "Manda estimados, facturas y contratos de miembro a miembro — todo se queda en la red." },
      { title: "Radar de proyectos de gobierno", desc: "Sigue oportunidades federales y estatales que encajan con tu oficio (Pro y Elite)." },
      { title: "Acceso a financiamiento", desc: "Solicita apoyo de financiamiento directo desde tu membresía Network Elite." },
      { title: "Mensajes agente a agente", desc: "Tu agente de IA coordina cotizaciones y citas con los agentes de otros miembros — tú solo apruebas." },
    ],
  },
} as const;

export default function NetworkSection() {
  const t = COPY[useLang()];

  return (
    <section id="network" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
              <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.badge}
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.title.before}
              <br />
              <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.text}
            </p>
            <a
              href={appLink("network", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-block"
            >
              {t.cta}
            </a>
            <p className="text-sm text-white/50 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.note}
            </p>
          </div>

          {/* CSS visual — member cards mock (replaces external image) */}
          <div className="relative" aria-hidden="true">
            <div className="lp-card rounded-2xl p-6 space-y-4">
              <p className="text-[10px] uppercase tracking-wider text-white/45">{t.demo}</p>
              {t.members.map(m => (
                <div key={m.initials} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="w-11 h-11 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/40 flex items-center justify-center text-[#00D4FF] font-bold text-sm">
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {m.name} {m.check && <span className="text-[#10B981]">✓</span>}
                    </p>
                    <p className="text-white/50 text-xs truncate">{m.meta}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#10B981]/15 text-[#10B981] whitespace-nowrap">
                    {t.verified}
                  </span>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-[#00D4FF]/30 p-4 text-center">
                <p className="text-[#00D4FF] text-sm font-semibold">{t.yourBusiness}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {t.benefits.map((b, i) => (
            <div key={b.title} className="lp-card rounded-xl p-5">
              <div className="text-2xl mb-3" aria-hidden="true">{ICONS[i]}</div>
              <h3 className="font-bold text-white text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {b.title}
              </h3>
              <p className="text-xs text-white/55 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
