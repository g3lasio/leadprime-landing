/**
 * How It Works — three simple steps (Brief B, approved copy — verbatim).
 * The hero's secondary CTA scrolls here (#how-it-works).
 */
import { useLang } from "@/lib/i18n";

const COPY = {
  en: {
    badge: "How It Works",
    title: { before: "Three steps.", highlight: "One system." },
    step: "Step",
    steps: [
      { title: "Capture", desc: "Leads come in from your ads, referrals, and network." },
      { title: "Work the pipeline", desc: "KEEN follows up. You send estimates, contracts, and invoices without leaving the app." },
      { title: "Get paid", desc: "Accept payment, track your documents, grow your business." },
    ],
  },
  es: {
    badge: "Cómo funciona",
    title: { before: "Tres pasos.", highlight: "Un solo sistema." },
    step: "Paso",
    steps: [
      { title: "Captura", desc: "Los leads llegan de tus anuncios, referidos y tu red." },
      { title: "Trabaja tu pipeline", desc: "KEEN da seguimiento. Tú mandas estimados, contratos y facturas sin salir de la app." },
      { title: "Cobra", desc: "Recibe pagos, controla tus documentos y haz crecer tu negocio." },
    ],
  },
} as const;

const steps = [
  {
    number: "1",
    color: "#00D4FF",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "2",
    color: "#F59E0B",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "3",
    color: "#10B981",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  const t = COPY[useLang()];

  return (
    <section id="how-it-works" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[400px] bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.badge}
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.title.before} <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.number} className="lp-card rounded-2xl p-8 text-center relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${step.color}20`, color: step.color }}
              >
                {step.icon}
              </div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: step.color, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t.step} {step.number}
              </p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.steps[i].title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.steps[i].desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
