/**
 * Hero — contractors-only positioning (Sep 2026): official slogan under the
 * logo, approved EN/ES headline + subhead. Background is pure CSS
 * (Brief C: the CloudFront hero image was removed — better LCP, zero
 * external asset dependencies); the lockup reuses the navbar's logo file,
 * so it adds no request.
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";

const COPY = {
  en: {
    slogan: "Your intelligent business partner.",
    headline: {
      before: "The business partner that",
      highlight: "runs your contracting business",
      after: "— not just your leads.",
    },
    subhead:
      "Built by a contractor from Fairfield, California. Estimates, contracts, payments, and your license up to date — in English and Spanish.",
    primaryCta: "Start free — $0 Pay-As-You-Go",
    secondaryCta: "See how it works",
    programsLink: "Talked to our team? See the Growth & Legacy programs →",
    stats: [
      { value: "AI", label: "Powered Automation" },
      { value: "$0", label: "To Get Started" },
      { value: "5+", label: "Integrations" },
    ],
  },
  es: {
    slogan: "Tu socio de negocios inteligente.",
    headline: {
      before: "El socio que",
      highlight: "lleva tu negocio de contratista",
      after: "— no solo tus leads.",
    },
    subhead:
      "Hecho por un contratista de Fairfield, California. Estimados, contratos, cobros y tu licencia al día, en español.",
    primaryCta: "Empieza gratis — $0 pago por uso",
    secondaryCta: "Mira cómo funciona",
    programsLink: "¿Hablaste con nuestro equipo? Ver programas Growth y Legacy →",
    stats: [
      { value: "IA", label: "Automatización inteligente" },
      { value: "$0", label: "Para empezar" },
      { value: "5+", label: "Integraciones" },
    ],
  },
} as const;

export default function HeroSection() {
  const t = COPY[useLang()];
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
        {/* Brand lockup — official slogan under the logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo-full.png"
            alt="LeadPrime"
            className="h-14 md:h-20 w-auto"
            width={240}
            height={80}
          />
          <p
            className="-mt-1 text-base md:text-lg font-semibold tracking-wide text-[#00D4FF]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.slogan}
          </p>
        </div>

        <h1
          className="text-4xl md:text-6xl font-black text-white leading-[1.08] mb-6 max-w-5xl mx-auto text-balance"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t.headline.before}{" "}
          <span className="lp-text-gradient-cyan">{t.headline.highlight}</span>{" "}
          {t.headline.after}
        </h1>

        <p
          className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t.subhead}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href={appLink("hero", "signup")}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold w-full sm:w-auto"
          >
            {t.primaryCta}
          </a>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="px-8 py-4 rounded-xl text-base font-bold w-full sm:w-auto border border-white/20 text-white/80 hover:border-[#00D4FF]/50 hover:text-white transition-colors"
          >
            {t.secondaryCta}
          </button>
        </div>

        {/* Visitors coming from a call with the team go straight to Growth/Legacy */}
        <button
          onClick={() => scrollTo("programas")}
          className="text-sm font-semibold text-[#F59E0B] hover:text-[#FBBF24] underline-offset-4 hover:underline mb-14"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t.programsLink}
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {t.stats.map(s => (
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
