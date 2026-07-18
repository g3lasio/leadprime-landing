import { useState, useEffect } from "react";
import { appLink } from "@/lib/appLinks";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
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
          <div className="flex items-center">
            <img
              src="/logo-full.png"
              alt="LeadPrime — AI-powered CRM for contractors and real estate pros"
              className="h-10 lg:h-12 w-auto"
              height={48}
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "How It Works", id: "how-it-works" },
              { label: "Features", id: "features" },
              { label: "Network", id: "network" },
              { label: "Who It's For", id: "industry" },
              { label: "Pricing", id: "pricing" },
            ].map((item) => (
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
              href="/about/"
              className="text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              About
            </a>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={appLink("navbar", "signin")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a
              href={appLink("navbar", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm font-bold"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-[#00D4FF]/10">
            <div className="flex flex-col gap-4">
              {[
                { label: "How It Works", id: "how-it-works" },
                { label: "Features", id: "features" },
                { label: "Network", id: "network" },
                { label: "Who It's For", id: "industry" },
                { label: "Pricing", id: "pricing" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors py-1"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/about/"
                className="text-left text-sm font-medium text-white/70 hover:text-[#00D4FF] transition-colors py-1"
              >
                About
              </a>
              <a
                href={appLink("navbar", "signup")}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary px-5 py-3 rounded-lg text-sm font-bold text-center mt-2"
              >
                Get Started Free
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
