/**
 * Pricing — Brief B approved copy. Source of truth: production
 * plan_definitions (migration 099) + walletService.ts ($15 welcome credit).
 * No trials, no invented credits — exactly what production bills. These are
 * the self-serve software plans; the done-with-you programs (Growth/Legacy)
 * live in ProgramsSection right below.
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";

const PLAN_STYLE = [
  { campaign: "pricing-payg", accent: "#10B981", featured: false },
  { campaign: "pricing-pro", accent: "#00D4FF", featured: true },
  { campaign: "pricing-elite", accent: "#F59E0B", featured: false },
] as const;

const COPY = {
  en: {
    badge: "Pricing",
    title: { before: "Start at", highlight: "$0.", after: "Scale when you're ready." },
    subtitle: "No contracts. Cancel anytime.",
    mostPopular: "Most Popular",
    period: "/month",
    plans: [
      {
        name: "Pay-As-You-Go",
        price: "$0",
        desc: "$15 in welcome credits. No credit card required. Pay only for what you use.",
        cta: "Start free",
      },
      {
        name: "Pro",
        price: "$15",
        desc: "$20 in monthly credits. For growing businesses.",
        cta: "Choose Pro",
      },
      {
        name: "Network Elite",
        price: "$249",
        desc: "$250 in monthly credits, full B2B network access, a fence estimating suite, Ledger financial tools, and business financing access.",
        cta: "Go Elite",
      },
    ],
    usage: "Usage (SMS, voice, email, AI actions) draws from your credit balance at published per-action rates.",
    programsTeaser: "Want our team to build it with you? See the Growth & Legacy programs ↓",
  },
  es: {
    badge: "Precios",
    title: { before: "Empieza en", highlight: "$0.", after: "Crece cuando estés listo." },
    subtitle: "Sin contratos. Cancela cuando quieras.",
    mostPopular: "Más popular",
    period: "/mes",
    plans: [
      {
        name: "Pago por uso",
        price: "$0",
        desc: "$15 en créditos de bienvenida. Sin tarjeta de crédito. Pagas solo lo que usas.",
        cta: "Empieza gratis",
      },
      {
        name: "Pro",
        price: "$15",
        desc: "$20 en créditos cada mes. Para negocios en crecimiento.",
        cta: "Elige Pro",
      },
      {
        name: "Network Elite",
        price: "$249",
        desc: "$250 en créditos cada mes, acceso completo a la red B2B, suite de estimados para cercas, herramientas financieras Ledger y acceso a financiamiento para tu negocio.",
        cta: "Hazte Elite",
      },
    ],
    usage: "El uso (SMS, voz, email, acciones de IA) se descuenta de tu saldo de créditos según las tarifas publicadas por acción.",
    programsTeaser: "¿Prefieres que nuestro equipo lo construya contigo? Ver programas Growth y Legacy ↓",
  },
} as const;

export default function PricingSection() {
  const t = COPY[useLang()];

  return (
    <section id="pricing" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

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
            {t.title.before} <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
            <br />
            {t.title.after}
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.plans.map((plan, i) => {
            const { campaign, accent, featured } = PLAN_STYLE[i];
            return (
              <div
                key={campaign}
                className={`lp-card rounded-2xl p-8 flex flex-col relative ${
                  featured ? "lp-border-cyan lp-glow-cyan lg:-translate-y-2" : ""
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#00D4FF] text-[#050B18]">
                    {t.mostPopular}
                  </span>
                )}
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: accent, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {plan.price}
                  </span>
                  <span className="text-white/50 text-sm">{t.period}</span>
                </div>
                <p
                  className="text-sm text-white/65 leading-relaxed mb-8 flex-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {plan.desc}
                </p>
                <a
                  href={appLink(campaign, "signup")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-center px-6 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                    featured
                      ? "lp-btn-primary"
                      : "border border-white/20 text-white/85 hover:border-[#00D4FF]/50 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-sm text-white/50 mt-10 max-w-xl mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t.usage}
        </p>
        <p className="text-center mt-6">
          <a
            href="#programas"
            className="text-sm font-bold text-[#F59E0B] hover:underline underline-offset-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.programsTeaser}
          </a>
        </p>
      </div>
    </section>
  );
}
