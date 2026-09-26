import { useState, useEffect, type MouseEvent } from "react";
import { useLocation } from "wouter";
import { appLink } from "@/lib/appLinks";
import { rememberLang, useLang, type Lang } from "@/lib/i18n";
import { HOME_PATH, pageMetaFor } from "@shared/pageMeta";

const COPY = {
  en: {
    items: [
      { label: "How It Works", id: "how-it-works" },
      { label: "Features", id: "features" },
      { label: "Network", id: "network" },
      { label: "Pricing", id: "pricing" },
      { label: "Programs", id: "programas" },
    ],
    about: { label: "About", href: "/about/" },
    signIn: "Sign In",
    getStarted: "Get Started Free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "LeadPrime home",
    language: "Language",
  },
  es: {
    items: [
      { label: "Cómo funciona", id: "how-it-works" },
      { label: "Funciones", id: "features" },
      { label: "Red", id: "network" },
      { label: "Precios", id: "pricing" },
      { label: "Programas", id: "programas" },
    ],
    about: { label: "Nosotros", href: "/nosotros/" },
    signIn: "Iniciar sesión",
    getStarted: "Empieza gratis",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    home: "Inicio de LeadPrime",
    language: "Idioma",
  },
} as const;

const LANG_NAMES: Record<Lang, string> = { en: "English", es: "Español" };

/** EN | ES switch — jumps to the same page in the other language. */
function LangToggle() {
  const lang = useLang();
  const [location, navigate] = useLocation();

  const switchTo = (next: Lang) => {
    if (next === lang) return;
    rememberLang(next);
    const target = pageMetaFor(location)?.alternate ?? HOME_PATH[next];
    navigate(`${target}${window.location.search}${window.location.hash}`);
  };

  return (
    <div
      role="group"
      aria-label={COPY[lang].language}
      className="flex items-center rounded-lg border border-white/15 p-0.5"
    >
      {(["en", "es"] as const).map(option => (
        <button
          key={option}
          type="button"
          lang={option}
          onClick={() => switchTo(option)}
          aria-pressed={lang === option}
          aria-label={LANG_NAMES[option]}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
            lang === option
              ? "bg-[#00D4FF] text-[#050B18]"
              : "text-white/70 hover:text-white"
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/**
 * `logoInHero`: the page's hero already shows the logo + slogan lockup, so the
 * navbar logo stays hidden until the visitor scrolls past the top.
 */
export default function Navbar({ logoInHero = false }: { logoInHero?: boolean }) {
  const lang = useLang();
  const t = COPY[lang];
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Sections live on the home page; from any other page (e.g. /programas)
  // the link goes to the home page in the same language, at that section.
  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    else navigate(`${HOME_PATH[lang]}#${id}`);
  };

  const hideLogo = logoInHero && !scrolled && !mobileOpen;

  const goHome = (e: MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (document.getElementById("how-it-works")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(HOME_PATH[lang]);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050B18]/95 backdrop-blur-md border-b border-[#00D4FF]/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo — official lockup image; the confusing NETWORK pill was
              removed (Brief F6.4: brand vs section vs Elite plan ambiguity) */}
          <a
            href={HOME_PATH[lang]}
            onClick={goHome}
            aria-label={t.home}
            className={`flex items-center transition-opacity duration-300 ${
              hideLogo ? "opacity-0 invisible" : "opacity-100"
            }`}
          >
            <img
              src="/logo-full.png"
              alt="LeadPrime"
              className="h-10 lg:h-12 w-auto"
              height={48}
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {t.items.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </button>
            ))}
            <a
              href={t.about.href}
              className="text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {t.about.label}
            </a>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LangToggle />
            <a
              href={appLink("navbar", "signin")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {t.signIn}
            </a>
            <a
              href={appLink("navbar", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm font-bold"
            >
              {t.getStarted}
            </a>
          </div>

          {/* Mobile: language switch stays visible next to the menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LangToggle />
            <button
              className="text-white/70 hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t.closeMenu : t.openMenu}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-[#00D4FF]/10 bg-[#050B18]/95">
            <div className="flex flex-col gap-4">
              {t.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors py-1"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={t.about.href}
                className="text-left text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors py-1"
              >
                {t.about.label}
              </a>
              <a
                href={appLink("navbar", "signup")}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary px-5 py-3 rounded-lg text-sm font-bold text-center mt-2"
              >
                {t.getStarted}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
