/**
 * Who It's For — Brief B approved copy (verbatim), honest hierarchy:
 *   PRIMARY   (real users in production): Contractors, Property Managers,
 *             Real Estate Investors — big cards.
 *   SECONDARY ("Also for" — network access, NOT full vertical products):
 *             Lenders, Wholesalers — small cards.
 *   REALTORS  network/services access only — one line, NO pipeline claims.
 */
import { appLink } from "@/lib/appLinks";

const primary = [
  {
    label: "Contractors",
    emoji: "🔨",
    color: "#00D4FF",
    desc: "Manage every job from estimate to final payment. Construction-stage pipelines, digital contracts, native estimates and invoices, and an AI agent that follows up so you don't have to.",
  },
  {
    label: "Property Managers",
    emoji: "🏢",
    color: "#F59E0B",
    desc: "Rent collection, tenant communication, and owner reporting — with payments built in. Your whole portfolio in one pipeline.",
  },
  {
    label: "Real Estate Investors",
    emoji: "📈",
    color: "#10B981",
    desc: "Track deals, organize your buyer and seller network, and run outreach and follow-up on autopilot. Built for how investors actually work a pipeline.",
  },
];

const secondary = [
  {
    label: "Lenders",
    emoji: "🏦",
    desc: "Connect with contractors and investors who need financing.",
  },
  {
    label: "Wholesalers",
    emoji: "🤝",
    desc: "Move deals through your network faster.",
  },
];

export default function IndustrySection() {
  return (
    <section id="industry" className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Who It's For
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built around <span className="lp-text-gradient-cyan">your business.</span>
          </h2>
        </div>

        {/* Primary verticals — real users in production */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {primary.map((v) => (
            <div
              key={v.label}
              className="lp-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ borderTop: `3px solid ${v.color}` }}
            >
              <div className="text-4xl mb-4" aria-hidden="true">{v.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {v.label}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {v.desc}
              </p>
              <a
                href={appLink(`industry-${v.label.toLowerCase().replace(/\s+/g, "-")}`, "signup")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold transition-colors"
                style={{ color: v.color }}
              >
                Start free →
              </a>
            </div>
          ))}
        </div>

        {/* Secondary — network access */}
        <p
          className="text-center text-sm font-bold uppercase tracking-widest text-white/50 mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Also for
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          {secondary.map((v) => (
            <div key={v.label} className="lp-card rounded-xl p-5 flex items-start gap-4">
              <div className="text-2xl" aria-hidden="true">{v.emoji}</div>
              <div>
                <h3 className="font-bold text-white text-base mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {v.label}
                </h3>
                <p className="text-sm text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Realtors — network/services access only (no pipeline claims) */}
        <p className="text-center text-sm text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="font-bold text-white/80">Realtors</span> — access the
          professional network and services.
        </p>
      </div>
    </section>
  );
}
