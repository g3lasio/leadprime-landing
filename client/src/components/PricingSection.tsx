/**
 * Pricing — Brief B approved copy (verbatim). Source of truth: production
 * plan_definitions (migration 099) + walletService.ts ($15 welcome credit).
 * No trials, no invented credits — exactly what production bills.
 */
import { appLink } from "@/lib/appLinks";

const plans = [
  {
    name: "Pay-As-You-Go",
    price: "$0",
    period: "/month",
    desc: "$15 in welcome credits. No credit card required. Pay only for what you use.",
    cta: "Start free",
    campaign: "pricing-payg",
    accent: "#10B981",
    featured: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    desc: "$20 in monthly credits. For growing businesses.",
    cta: "Choose Pro",
    campaign: "pricing-pro",
    accent: "#00D4FF",
    featured: true,
  },
  {
    name: "Network Elite",
    price: "$249",
    period: "/month",
    desc: "$250 in monthly credits, full B2B network access, OWL FENC Suite, Ledger financial tools, and business financing access.",
    cta: "Go Elite",
    campaign: "pricing-elite",
    accent: "#F59E0B",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Pricing
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Start at <span className="lp-text-gradient-cyan">$0.</span>
            <br />
            Scale when you're ready.
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            No contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`lp-card rounded-2xl p-8 flex flex-col relative ${
                plan.featured ? "lp-border-cyan lp-glow-cyan lg:-translate-y-2" : ""
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#00D4FF] text-[#050B18]">
                  Most Popular
                </span>
              )}
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: plan.accent, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {plan.price}
                </span>
                <span className="text-white/50 text-sm">{plan.period}</span>
              </div>
              <p
                className="text-sm text-white/65 leading-relaxed mb-8 flex-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {plan.desc}
              </p>
              <a
                href={appLink(plan.campaign, "signup")}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-center px-6 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                  plan.featured
                    ? "lp-btn-primary"
                    : "border border-white/20 text-white/85 hover:border-[#00D4FF]/50 hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p
          className="text-center text-sm text-white/50 mt-10 max-w-xl mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Usage (SMS, voice, email, AI actions) draws from your credit balance
          at published per-action rates.
        </p>
      </div>
    </section>
  );
}
