export default function Footer() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 via-transparent to-[#F59E0B]/5" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Start Free — No Credit Card Required
            </span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to Dominate
            <br />
            <span className="lp-text-gradient-cyan">Your Market?</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Start free with Pay-As-You-Go. Upgrade to Pro or Network Elite when you're ready to scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://leadprime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-10 py-5 rounded-xl text-lg font-black inline-flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started Free
            </a>
          </div>
          <p className="text-white/20 text-sm mt-6">
            No credit card required. Cancel anytime. Powered by Chyrris Technologies.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050B18] border-t border-white/5 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-logo_b6e94952.png" alt="LeadPrime" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-bold text-xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  LeadPrime
                </span>
              </div>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                The AI-powered CRM built for real estate professionals. Connect, automate, and grow your business with LeadPrime Network.
              </p>
              <p className="text-white/20 text-xs mt-4">Powered by Chyrris Technologies</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Product
              </h4>
              <ul className="space-y-2">
                {["Features", "LeadPrime Network", "AI Agent", "Pricing", "Integrations"].map((item) => (
                  <li key={item}>
                    <a
                      href="https://leadprime.chyrris.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-[#00D4FF] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Industries
              </h4>
              <ul className="space-y-2">
                {["Contractors", "Property Managers", "Investors", "Realtors", "Lenders", "Wholesalers"].map((item) => (
                  <li key={item}>
                    <a
                      href="https://leadprime.chyrris.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-[#00D4FF] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              © 2026 LeadPrime. All rights reserved. Powered by Chyrris Technologies.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Support"].map((item) => (
                <a
                  key={item}
                  href="https://leadprime.chyrris.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/20 hover:text-white/50 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
