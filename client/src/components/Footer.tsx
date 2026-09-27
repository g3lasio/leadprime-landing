/**
 * Footer + final CTA — contractors-only positioning; the company is
 * "LeadPrime · Chyrris Technologies" everywhere (legal line: Chyrris
 * Technologies LLC). Legal links point at the production app's real public
 * pages. Contrast raised to AA (Brief C7).
 */
import { useLocation } from "wouter";
import { appLink, APP_URL, diagnosticBookingLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";
import { HOME_PATH } from "@shared/pageMeta";
import ResponsiveImage from "@/components/ResponsiveImage";

const COPY = {
  en: {
    cta: {
      default: {
        title: ["Ready to run your business", "from one place?"],
        text: "Start free with $15 in welcome credits. No credit card required.",
        button: "Start free — $0 Pay-As-You-Go",
      },
      programs: {
        title: ["Ready for us to", "build your machine?"],
        text: "",
        button: "Book a free diagnostic",
      },
    },
    slogan: "Your intelligent business partner.",
    blurb: "The AI-powered CRM for contractors — in English & Español.",
    productTitle: "Product",
    sections: [
      { label: "Features", id: "features" },
      { label: "How It Works", id: "how-it-works" },
      { label: "Network", id: "network" },
      { label: "For Contractors", id: "industry" },
      { label: "Pricing", id: "pricing" },
      { label: "Programs", id: "programas" },
    ],
    about: { label: "About Us — Our Story", href: "/about/" },
    signIn: "Sign In",
    legalTitle: "Legal & Support",
    legal: [
      { label: "Privacy Policy", href: `${APP_URL}/privacy-policy` },
      { label: "Terms of Service", href: `${APP_URL}/terms-of-service` },
      { label: "Support", href: "/support" },
    ],
    rights: "All rights reserved.",
  },
  es: {
    cta: {
      default: {
        title: ["¿Listo para manejar tu negocio", "desde un solo lugar?"],
        text: "Empieza gratis con $15 en créditos de bienvenida. Sin tarjeta de crédito.",
        button: "Empieza gratis — $0 pago por uso",
      },
      programs: {
        title: ["¿Listo para que te", "construyamos la máquina?"],
        text: "",
        button: "Agenda un diagnóstico gratis",
      },
    },
    slogan: "Tu socio de negocios inteligente.",
    blurb: "El CRM con IA para contratistas — en español y en inglés.",
    productTitle: "Producto",
    sections: [
      { label: "Funciones", id: "features" },
      { label: "Cómo funciona", id: "how-it-works" },
      { label: "Red", id: "network" },
      { label: "Para contratistas", id: "industry" },
      { label: "Precios", id: "pricing" },
      { label: "Programas", id: "programas" },
    ],
    about: { label: "Nosotros — nuestra historia", href: "/nosotros/" },
    signIn: "Iniciar sesión",
    legalTitle: "Legal y soporte",
    legal: [
      { label: "Política de privacidad", href: `${APP_URL}/privacy-policy` },
      { label: "Términos de servicio", href: `${APP_URL}/terms-of-service` },
      { label: "Soporte", href: "/soporte" },
    ],
    rights: "Todos los derechos reservados.",
  },
} as const;

export default function Footer({ variant = "default" }: { variant?: "default" | "programs" }) {
  const lang = useLang();
  const t = COPY[lang];
  const cta = t.cta[variant];
  const [location] = useLocation();
  // Section anchors live on the home page of the current language.
  const home = HOME_PATH[lang];
  const onHome = location.replace(/\/+$/, "") === home.replace(/\/+$/, "");
  const sectionHref = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);
  const finalCtaAlt = lang === "es"
    ? "Contratista junto a una camioneta blanca sin marcas al atardecer."
    : "Contractor beside an unbranded white pickup truck at sunset.";

  return (
    <>
      {/* Final CTA */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden isolate">
        <ResponsiveImage
          asset="final-cta"
          alt={finalCtaAlt}
          width={1600}
          height={900}
          sizes="100vw"
          className="absolute inset-0 block"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050B18]/70" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/15 via-transparent to-[#F59E0B]/15" aria-hidden="true" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {cta.title[0]}
            <br />
            <span className="lp-text-gradient-cyan">{cta.title[1]}</span>
          </h2>
          {cta.text && (
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
              {cta.text}
            </p>
          )}
          {variant === "programs" ? (
            <a
              href={diagnosticBookingLink()}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="programas-footer-diagnostico"
              className="lp-btn-primary px-10 py-4 rounded-xl text-base font-bold inline-block mt-4"
            >
              {cta.button}
            </a>
          ) : (
            <a
              href={appLink("footer-cta", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-10 py-4 rounded-xl text-base font-bold inline-block"
            >
              {cta.button}
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050B18] border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-2">
                <img
                  src="/logo-full.png"
                  alt="LeadPrime"
                  className="h-10 w-auto"
                  height={40}
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-semibold text-[#00D4FF] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.slogan}
              </p>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.blurb}
              </p>
              <p className="text-sm text-white/50 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Fairfield, California
              </p>
            </div>

            {/* Product */}
            <nav aria-label={t.productTitle}>
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.productTitle}
              </p>
              <ul className="space-y-2">
                {t.sections.map(l => (
                  <li key={l.id}>
                    <a href={sectionHref(l.id)} className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={t.about.href} className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors">
                    {t.about.label}
                  </a>
                </li>
                <li>
                  <a
                    href={appLink("footer", "signin")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors"
                  >
                    {t.signIn}
                  </a>
                </li>
              </ul>
            </nav>

            {/* Legal & contact */}
            <nav aria-label={t.legalTitle}>
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.legalTitle}
              </p>
              <ul className="space-y-2">
                {t.legal.map(l => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 text-center">
            <p className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
              © 2026 LeadPrime · Chyrris Technologies LLC. {t.rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
