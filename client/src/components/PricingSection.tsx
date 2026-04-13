// Design: Dark Navy #050B18, Cyan #00D4FF, Gold #F59E0B
// Pricing: Pay-As-You-Go (free) | LeadPrime Pro ($15/mo) | Network Elite ($249/mo)

const payAsYouGoFeatures = [
  "All core features — Leads, Messages, Calendar",
  "AI Assistant — full access (Custom Name & Personality)",
  "LeadSign — digital contracts & e-sign",
  "Lead Hunter — AI prospect discovery",
  "Knowledge Base — train your AI",
  "Automations — unlimited workflows",
  "Mobile app (iOS & Android)",
  "$5 welcome credits to get started",
  "Pay only for what you use (SMS, AI, voice)",
  "Auto-recharge when balance runs low",
];

const proFeatures = [
  "Everything in Pay-As-You-Go",
  "Skip Trace Pro — property owner lookup",
  "Website Builder — AI-generated",
  "All integrations (Meta, Google, Bing, Zoom, Outlook, OWL FENC)",
  "Calendar & scheduling",
  "$20 in credits included every month",
  "Priority support",
];

const eliteFeatures = [
  "Everything in LeadPrime Pro",
  "$250 in credits included every month",
  "OWL FENC Suite — estimates, contracts & permits",
  "LeadPrime Network — verified B2B connections",
  "Access to Property Managers, Investors & Lenders",
  "Government, State, Federal & Residential Projects",
  "Networking Events — Las Vegas, San Francisco, Miami",
  "Business Financing & Preferred Credit Lines",
  "Commercial Credit Reconstruction Program",
  "Strategic Growth Partners",
  "Exclusive Legacy Investment Access",
  "LegalPrime — LLC, EIN, Articles of Organization",
  "Trust Score & Compliance Kit",
  "Priority placement in Network",
  "Dedicated account manager",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#050B18] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Transparent Pricing
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            3 Plans. One Universal Wallet.
            <br />
            <span className="lp-text-gradient-cyan">Pay Only for What You Use.</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            Start free with Pay-As-You-Go. Upgrade to <strong className="text-[#00D4FF]">LeadPrime Pro</strong> for included credits, or unlock the full ecosystem with{" "}
            <strong className="text-[#F59E0B]">Network Elite</strong>.
          </p>
        </div>

        {/* Three-plan grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">

          {/* Pay-As-You-Go */}
          <div
            className="rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(10, 22, 40, 0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/15 mb-4">
                <span className="text-xs font-bold text-white/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  FREE TO START
                </span>
              </div>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Pay-As-You-Go
              </h3>
              <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Full CRM access at no cost. Pay only for the channels and AI you actually use.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-6xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  $0
                </span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-white/40 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                + usage costs billed only on consumption
              </p>
            </div>

            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl text-sm font-bold text-center mb-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                fontFamily: "'Space Grotesk', sans-serif",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Get Started Free
            </a>

            <div className="space-y-3 flex-1">
              {payAsYouGoFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LeadPrime Pro */}
          <div
            className="rounded-2xl p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(10, 22, 40, 0.85)",
              border: "1px solid rgba(0, 212, 255, 0.35)",
              boxShadow: "0 0 40px rgba(0,212,255,0.08)",
            }}
          >
            {/* Popular badge */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-[#050B18] whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #00D4FF, #0099CC)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MOST POPULAR
            </div>

            <div className="mb-8 mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-4">
                <span className="text-xs font-bold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  PRO PLAN
                </span>
              </div>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                LeadPrime Pro
              </h3>
              <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Best value for active contractors and growing businesses. Credits included every month.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-6xl font-black text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  $15
                </span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-[#00D4FF]/70 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                $20 in credits included every month
              </p>
            </div>

            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl text-sm font-bold text-center mb-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #00D4FF, #0099CC)",
                color: "#050B18",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 0 20px rgba(0,212,255,0.25)",
              }}
            >
              Start with Pro
            </a>

            <div className="space-y-3 flex-1">
              {proFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Network Elite */}
          <div
            className="rounded-2xl p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(167,139,250,0.08))",
              border: "1px solid rgba(245,158,11,0.45)",
              boxShadow: "0 0 60px rgba(245,158,11,0.12)",
            }}
          >
            {/* Elite badge */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-[#050B18] whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ⭐ NETWORK ELITE
            </div>

            <div className="mb-8 mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 mb-4">
                <span className="text-xs font-bold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ELITE MEMBERSHIP
                </span>
              </div>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Network Elite
              </h3>
              <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                The full ecosystem. Projects, financing, events, OWL FENC Suite, and verified B2B connections nationwide.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-6xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  $249
                </span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-[#F59E0B]/80 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                $250 in credits included every month
              </p>
            </div>

            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl text-sm font-bold text-center mb-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #F97316)",
                color: "#050B18",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 0 30px rgba(245,158,11,0.35)",
              }}
            >
              Unlock Network Elite
            </a>

            <div className="space-y-3 flex-1">
              {eliteFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: "#F59E0B" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center">
          <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            All plans use the same universal wallet. Upgrade or downgrade anytime. No hidden fees. No contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
