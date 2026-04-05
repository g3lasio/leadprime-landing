import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    desc: "For solo operators just getting started with CRM and automation.",
    color: "#00D4FF",
    features: [
      "Up to 500 contacts",
      "Lead pipeline management",
      "SMS & Email campaigns",
      "AI Agent (Mervin) — basic",
      "LeadSign — 5 contracts/month",
      "1 integration",
      "Calendar & scheduling",
      "Mobile app (iOS & Android)",
    ],
    cta: "Start Free — 90 Days",
    popular: false,
  },
  {
    name: "Pro",
    price: "$197",
    period: "/month",
    desc: "For growing businesses that need full automation and network access.",
    color: "#F59E0B",
    features: [
      "Unlimited contacts",
      "Full pipeline management",
      "SMS, Email & Voice campaigns",
      "AI Agent (Mervin) — advanced",
      "LeadSign — unlimited contracts",
      "All integrations (Meta, Google, Bing, Zoom, Outlook)",
      "Lead Hunter — 100 leads/month",
      "Skip Trace Pro — 50 searches/month",
      "LeadPrime Network access",
      "Trust Score & Compliance Kit",
      "Knowledge Base",
      "Automations — unlimited",
      "Agent Connector MCP",
      "Website Builder",
      "Priority support",
    ],
    cta: "Start Free — 90 Days",
    popular: true,
  },
  {
    name: "Network Elite",
    price: "$249",
    period: "/month",
    desc: "For serious professionals who want everything — including OWL FENC Suite.",
    color: "#A78BFA",
    features: [
      "Everything in Pro",
      "OWL FENC Suite included ($120 credits/month)",
      "AI Estimate Generator",
      "Professional Invoices",
      "Digital Contracts (OWL FENC)",
      "Founding Member badge — for life",
      "Priority placement in Network",
      "Skip Trace Pro — unlimited",
      "Lead Hunter — unlimited",
      "LegalPrime — LLC & EIN services",
      "Dedicated account manager",
      "White-glove onboarding",
    ],
    cta: "Join as Founding Member",
    popular: false,
    highlight: true,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#A78BFA]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 mb-6">
            <span className="text-sm font-semibold text-[#A78BFA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Simple Pricing
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Start Free.
            <br />
            <span className="lp-text-gradient-cyan">Scale When Ready.</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            All plans include a 90-day free trial. No credit card required.
            Cancel anytime. Join as a Founding Member and lock in your rate forever.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
            <span className={`text-sm font-medium ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? "bg-[#00D4FF]" : "bg-white/20"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${annual ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-white" : "text-white/40"}`}>
              Annual
              <span className="ml-1.5 text-xs text-[#10B981] font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => {
            const price = annual
              ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
              : plan.price;

            return (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular ? "scale-105" : ""
                }`}
                style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, ${plan.color}15, ${plan.color}05)`
                    : "rgba(10, 22, 40, 0.8)",
                  border: `1px solid ${plan.color}${plan.popular ? "50" : "25"}`,
                  boxShadow: plan.popular ? `0 0 40px ${plan.color}20` : "none",
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-[#050B18]"
                    style={{ background: plan.color, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    MOST POPULAR
                  </div>
                )}
                {plan.highlight && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-[#050B18]"
                    style={{ background: plan.color, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    FOUNDING MEMBER
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="text-xl font-black text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: plan.color }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-5xl font-black text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {price}
                    </span>
                    <span className="text-white/40 text-sm">{plan.period}</span>
                  </div>
                  {annual && (
                    <div className="text-xs text-[#10B981] font-semibold mt-1">20% off with annual billing</div>
                  )}
                </div>

                <a
                  href="https://leadprime.chyrris.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-xl text-sm font-bold text-center mb-8 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`,
                    color: "#050B18",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: `0 0 20px ${plan.color}30`,
                  }}
                >
                  {plan.cta}
                </a>

                <div className="space-y-3">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: plan.color }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Founding Member banner */}
        <div
          className="rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(0,212,255,0.1))",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 via-transparent to-[#00D4FF]/5" />
          <div className="relative z-10">
            <div className="text-4xl mb-4">🚀</div>
            <h3
              className="text-3xl lg:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Founding Member Program
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Join now and get <span className="text-[#F59E0B] font-bold">90 days completely free</span> — no credit card required.
              The first 100 members in each city earn the <span className="text-[#00D4FF] font-bold">Founding Member badge</span> for life,
              plus priority placement in the network when we activate the project marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://leadprime.chyrris.com"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-amber px-10 py-4 rounded-xl text-base font-bold inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Claim Your Founding Member Spot
              </a>
            </div>
            <p className="text-white/30 text-xs mt-4">No credit card. No commitment. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
