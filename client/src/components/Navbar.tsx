import { useState, useEffect } from "react";

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
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center">
              {/* LeadPrime rocket/arrow logo matching the CRM */}
              <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                <defs>
                  <linearGradient id="lp-logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#0066FF" />
                  </linearGradient>
                </defs>
                {/* Rocket body */}
                <path d="M20 4 L28 20 L20 17 L12 20 Z" fill="url(#lp-logo-grad)" />
                {/* Fins */}
                <path d="M12 20 L8 30 L20 25 Z" fill="#00D4FF" opacity="0.7" />
                <path d="M28 20 L32 30 L20 25 Z" fill="#0066FF" opacity="0.7" />
                {/* Flame */}
                <path d="M20 25 L17 34 L20 31 L23 34 Z" fill="#00D4FF" opacity="0.5" />
                {/* Window */}
                <circle cx="20" cy="16" r="2.5" fill="#050B18" />
                <circle cx="20" cy="16" r="1.5" fill="#00D4FF" opacity="0.6" />
              </svg>
            </div>
            <span
              className="font-bold text-xl text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LeadPrime
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30">
              NETWORK
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Features", id: "features" },
              { label: "Network", id: "network" },
              { label: "For Industry", id: "industry" },
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
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://leadprime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a
              href="https://leadprime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm font-bold"
            >
              Start Free — 90 Days
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
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
                { label: "Features", id: "features" },
                { label: "Network", id: "network" },
                { label: "For Industry", id: "industry" },
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
                href="https://leadprime.chyrris.com"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary px-5 py-3 rounded-lg text-sm font-bold text-center mt-2"
              >
                Start Free — 90 Days
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
