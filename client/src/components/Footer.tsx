/**
 * Footer + final CTA — Brief B: positioning line aligned with the hero
 * (contractors first, no "real estate professionals" framing); legal
 * links point at the production app's real public pages; Chyrris appears
 * only in the legal line. Contrast raised to AA (Brief C7).
 */
import { appLink, APP_URL } from "@/lib/appLinks";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Network", href: "#network" },
  { label: "Who It's For", href: "#industry" },
  { label: "Pricing", href: "#pricing" },
];

const legalLinks = [
  { label: "Privacy Policy", href: `${APP_URL}/privacy-policy` },
  { label: "Terms of Service", href: `${APP_URL}/terms-of-service` },
  { label: "Support", href: "mailto:info@chyrris.com" },
];

export default function Footer() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 via-transparent to-[#F59E0B]/5" aria-hidden="true" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to run your business
            <br />
            <span className="lp-text-gradient-cyan">from one place?</span>
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Start free with $15 in welcome credits. No credit card required.
          </p>
          <a
            href={appLink("footer-cta", "signup")}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary px-10 py-4 rounded-xl text-base font-bold inline-block"
          >
            Start free — $0 Pay-As-You-Go
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050B18] border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="LeadPrime logo" className="w-8 h-8" width={32} height={32} loading="lazy" />
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  LeadPrime
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                The AI-powered CRM for contractors, property managers, and real
                estate investors.
              </p>
            </div>

            {/* Product */}
            <nav aria-label="Product">
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Product
              </p>
              <ul className="space-y-2">
                {productLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={appLink("footer", "signin")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-[#00D4FF] transition-colors"
                  >
                    Sign In
                  </a>
                </li>
              </ul>
            </nav>

            {/* Legal & contact */}
            <nav aria-label="Legal">
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Legal & Support
              </p>
              <ul className="space-y-2">
                {legalLinks.map((l) => (
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
              © 2026 LeadPrime · Chyrris Technologies / Owl Fenc LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
