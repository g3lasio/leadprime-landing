/**
 * Hero — Brief B approved copy (verbatim). Background is pure CSS
 * (Brief C: the CloudFront hero image was removed — better LCP, zero
 * external asset dependencies).
 */
import { appLink } from "@/lib/appLinks";

const stats = [
  { value: "AI", label: "Powered Automation" },
  { value: "$0", label: "To Get Started" },
  { value: "5+", label: "Integrations" },
];

export default function HeroSection() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050B18]">
      {/* CSS-only background: brand glows over the dark base */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] max-w-[150vw] h-[600px] rounded-full bg-[#00D4FF]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] max-w-[100vw] h-[400px] rounded-full bg-[#F59E0B]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-[#050B18]/60" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-28 pb-20 text-center">
        {/* Eyebrow */}
        <p
          className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#00D4FF] mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Built for Contractors · Property Managers · Investors
        </p>

        {/* H1 — Brief B approved headline + Brief E2 bilingual signal */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          The AI-powered CRM that
          <br />
          <span className="lp-text-gradient-cyan">runs your business,</span>
          <br />
          not just your leads.
          <span className="block text-xl md:text-2xl lg:text-3xl font-bold text-white/85 mt-5">
            In English <span className="lp-text-gradient-amber">&amp; Español.</span>
          </span>
        </h1>

        {/* Subhead — Brief E2 prominent bilingual/Latino line */}
        <p
          className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          From first lead to signed contract to paid invoice — LeadPrime unifies
          your pipeline, your documents, your estimates, and your payments in
          one place. Built for Latino contractors in the U.S. — works fully in
          English and Spanish, so your whole crew can use it.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href={appLink("hero", "signup")}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold w-full sm:w-auto"
          >
            Start free — $0 Pay-As-You-Go
          </a>
          <button
            onClick={scrollToHowItWorks}
            className="px-8 py-4 rounded-xl text-base font-bold w-full sm:w-auto border border-white/20 text-white/80 hover:border-[#00D4FF]/50 hover:text-white transition-colors"
          >
            See how it works
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-2xl md:text-3xl font-black lp-text-gradient-cyan"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
