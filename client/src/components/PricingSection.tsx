// Design: Dark Navy #050B18, Cyan #00D4FF, Gold #F59E0B
// Pricing: Plan Base $15/mo pay-as-you-go + Network Elite $249/mo with full benefits

const basePlanFeatures = [
  "Unlimited contacts & lead pipeline",
  "SMS, Email & Voice campaigns",
  "AI Agent — Full Access (Custom Name & Personality)",
  "LeadSign — digital contracts & e-sign",
  "Lead Hunter — AI prospect discovery",
  "Skip Trace Pro — property owner lookup",
  "Automations — unlimited workflows",
  "Knowledge Base — train your AI",
  "Agent Connector MCP",
  "Website Builder — AI-generated",
  "All integrations (Meta, Google, Bing, Zoom, Outlook, OWL FENC)",
  "Calendar & scheduling",
  "Mobile app (iOS & Android)",
  "Pay only for what you use (SMS, email, AI, voice)",
];

const eliteFeatures = [
  "Everything in Plan Base",
  "OWL FENC Suite — $500 credits/month (value $100)",
  "AI Estimate Generator — professional quotes",
  "Digital Contracts & Invoices (OWL FENC)",
  "Permit Advisor & Compliance Tools",
  "LeadPrime Network — verified B2B connections",
  "Access to Property Managers & Investors",
  "Government, State, Federal & Residential Projects",
  "Networking Events — Las Vegas, San Francisco, Miami",
  "Business Financing & Preferred Credit Lines",
  "Commercial Credit Reconstruction Program",
  "Strategic Growth Partners",
  "Exclusive Legacy Investment Access",
  "LegalPrime — LLC, EIN, Articles of Organization",
  "Trust Score & Compliance Kit",
  "Founding Member Badge — for life",
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
            Start at <span className="lp-text-gradient-cyan">$15/month.</span>
            <br />
            Scale Without Limits.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            No hidden fees. No locked features. Pay only for what you use.
            Upgrade to <strong className="text-[#F59E0B]">Network Elite</strong> to unlock the full ecosystem — projects, financing, events, and more.
          </p>
        </div>

        {/* Two-plan grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">

          {/* Plan Base */}
          <div
            className="rounded-2xl p-8 lg:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(10, 22, 40, 0.85)",
              border: "1px solid rgba(0, 212, 255, 0.25)",
            }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-4">
                <span className="text-xs font-bold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  PAY AS YOU GO
                </span>
              </div>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Plan Base
              </h3>
              <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Full CRM access. Pay only for the channels and AI you actually use. No surprises.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-6xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  $15
                </span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-[#00D4FF]/70 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                + usage costs (SMS, email, AI, voice) — billed only on consumption
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
              Start Free — 90 Days
            </a>

            <div className="space-y-3 flex-1">
              {basePlanFeatures.map((feat, i) => (
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
            className="rounded-2xl p-8 lg:p-10 flex flex-col relative transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(167,139,250,0.08))",
              border: "1px solid rgba(245,158,11,0.45)",
              boxShadow: "0 0 60px rgba(245,158,11,0.12)",
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-[#050B18] whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ⭐ FOUNDING MEMBER — 90 DAYS FREE
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
                Includes $500 OWL FENC credits/month (value $100) — no extra charge
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
              Join as Founding Member — Free 90 Days
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

        {/* Founding Member CTA banner */}
        <div
          className="rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden max-w-4xl mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(0,212,255,0.08))",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 via-transparent to-[#00D4FF]/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h3
              className="text-3xl lg:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Founding Member Program
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              The first <span className="text-[#F59E0B] font-bold">100 members per city</span> earn the{" "}
              <span className="text-[#00D4FF] font-bold">Founding Member badge for life</span> — plus priority placement in the
              network, exclusive events, and locked-in pricing forever. No credit card. No commitment.
            </p>
            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-amber px-10 py-4 rounded-xl text-base font-bold inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Claim Your Founding Member Spot
            </a>
            <p className="text-white/30 text-xs mt-4">No credit card. No commitment. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
