/**
 * LeadPrime Network — honest claims only (Brief B):
 * "license-verified" (never "vetted"), no city events, no credit
 * reconstruction, no LegalPrime formation claims. CSS visual replaces
 * the CloudFront image (Brief C).
 */
import { appLink } from "@/lib/appLinks";

const networkBenefits = [
  {
    icon: "🔗",
    title: "License-Verified Connections",
    desc: "Connect directly with license-verified Contractors, Property Managers, and Investors in your area.",
  },
  {
    icon: "🛡️",
    title: "Trust Score & Compliance Kit",
    desc: "Your license, insurance, and W-9 in one shareable profile. Build trust before the first call.",
  },
  {
    icon: "📄",
    title: "Documents Between Members",
    desc: "Send estimates, invoices, and contracts member-to-member — everything stays in the network.",
  },
  {
    icon: "🏛️",
    title: "Government Project Radar",
    desc: "Track federal and state opportunities that match your trade (Pro & Elite).",
  },
  {
    icon: "💰",
    title: "Business Financing Access",
    desc: "Request financing support directly from your Network Elite membership.",
  },
  {
    icon: "🤖",
    title: "Agent-to-Agent Messaging",
    desc: "Your AI agent coordinates quotes and scheduling with other members' agents — you just approve.",
  },
];

export default function NetworkSection() {
  return (
    <section id="network" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
              <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LeadPrime Network
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your next job is
              <br />
              <span className="lp-text-gradient-cyan">already in the network.</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              A B2B network where license-verified contractors, property
              managers, and investors find each other, share documents, and get
              work done — with your reputation traveling with you.
            </p>
            <a
              href={appLink("network", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-block"
            >
              Join the Network
            </a>
            <p className="text-sm text-white/50 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Full network access included with Network Elite — $249/mo.
            </p>
          </div>

          {/* CSS visual — member cards mock (replaces external image) */}
          <div className="relative" aria-hidden="true">
            <div className="lp-card rounded-2xl p-6 space-y-4">
              {[
                { initials: "MR", name: "Rivera Built Construction", meta: "General Contractor · San Jose", check: true },
                { initials: "VS", name: "Bay Homes Property Mgmt", meta: "Property Manager · Oakland", check: true },
                { initials: "AP", name: "Peralta Capital Partners", meta: "Investor · Fruitvale", check: false },
              ].map((m) => (
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
                    Verified
                  </span>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-[#00D4FF]/30 p-4 text-center">
                <p className="text-[#00D4FF] text-sm font-semibold">+ Your business here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {networkBenefits.map((b) => (
            <div key={b.title} className="lp-card rounded-xl p-5">
              <div className="text-2xl mb-3" aria-hidden="true">{b.icon}</div>
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
