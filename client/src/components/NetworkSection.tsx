const NETWORK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-network-visual-2Zw352fuUmfvWEH5jyr7AB.webp";

const networkBenefits = [
  {
    icon: "🔗",
    title: "Verified B2B Connections",
    desc: "Connect directly with verified Contractors, PMs, Investors, Realtors, Lenders, and Wholesalers in your area.",
  },
  {
    icon: "🏗️",
    title: "Government & Residential Projects",
    desc: "Access federal, state, and residential projects. Bid on real opportunities that match your specialty and location.",
  },
  {
    icon: "🛡️",
    title: "Trust Score & Compliance Kit",
    desc: "Your verified Trust Score, license check, insurance status, and W-9 — all in one shareable profile.",
  },
  {
    icon: "🎟️",
    title: "Networking Events — Las Vegas, SF, Miami",
    desc: "Exclusive coworking and networking events in top U.S. cities. Meet PMs, investors, lenders, and partners in person.",
  },
  {
    icon: "💰",
    title: "Business Financing & Credit Lines",
    desc: "Preferred business financing, commercial credit reconstruction program, and strategic growth partners — exclusive to Elite members.",
  },
  {
    icon: "📈",
    title: "Legacy Investment Access",
    desc: "Exclusive access to legacy investment opportunities available only to verified LeadPrime Network Elite members.",
  },
  {
    icon: "⚖️",
    title: "LegalPrime — Business Formation",
    desc: "Get your LLC, EIN, Articles of Organization, and more — directly from your CRM.",
  },
  {
    icon: "🔒",
    title: "Founding Member Badge — For Life",
    desc: "Join now and earn the Founding Member badge — priority placement in the network and locked-in pricing forever.",
  },
];

export default function NetworkSection() {
  return (
    <section id="network" className="py-24 bg-[#0A1628] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4FF]/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden lp-border-cyan lp-glow-cyan">
              <img
                src={NETWORK_IMG}
                alt="LeadPrime Network"
                className="w-full object-cover"
                style={{ height: "480px", objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lp-card rounded-xl p-4 lp-border-amber lp-glow-amber max-w-[200px]">
              <div className="text-2xl font-black text-[#F59E0B] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                90 Days
              </div>
              <div className="text-xs text-white/60">Free Founding Member Trial</div>
              <div className="text-xs text-[#F59E0B] font-semibold mt-1">No credit card required</div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
              <span className="text-sm font-semibold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LeadPrime Network
              </span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The Elite B2B Hub
              <br />
              <span className="lp-text-gradient-amber">for Real Estate Pros.</span>
            </h2>

            <p className="text-white/60 mb-10 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Stop searching for reliable partners. LeadPrime Network connects you with verified professionals
              across the entire real estate ecosystem. Every member is vetted, every profile is verified.
              This is where serious business gets done.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {networkBenefits.map((b, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {b.title}
                    </div>
                    <div className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-amber px-8 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Join the Network
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
