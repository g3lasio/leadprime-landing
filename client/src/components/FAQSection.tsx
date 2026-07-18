/**
 * FAQ — Brief E4 (AEO). Answers the real queries people type into Google
 * and ask AI assistants. The copy here MUST stay in sync with the FAQPage
 * JSON-LD in client/index.html (Google requires the structured answers to
 * be visible on the page). Native <details> keeps the text crawlable
 * without JS execution.
 */

const faqs = [
  {
    q: "What's the best CRM for contractors that works in Spanish?",
    a: "LeadPrime is built for Latino contractors in the U.S. — it works fully in English and Spanish, so your whole crew can use it. Estimates, invoices, digital contracts, payments, and an AI agent (KEEN) that follows up on leads are all native to the platform, not add-ons.",
  },
  {
    q: "Is there a free CRM for contractors?",
    a: "Yes. LeadPrime starts at $0 with the Pay-As-You-Go plan — you get $15 in welcome credits, no credit card required, and you only pay for what you use. Paid plans are optional: Pro is $15/month and Network Elite is $249/month.",
  },
  {
    q: "What CRM works for both contractors and property managers?",
    a: "LeadPrime ships industry-specific pipelines in one platform: contractors run jobs from estimate to final payment, while property managers track units, leases, tenant conversations, and rent collection by card or ACH. Both sides share the same CRM, documents, and payments.",
  },
  {
    q: "What's the best CRM for small contractors or solo operators?",
    a: "LeadPrime is designed for solo operators and small crews: start at $0, send professional estimates from your phone, and let the KEEN AI agent follow up on every lead so none goes cold. There are no setup fees and no annual contract — cancel anytime.",
  },
  {
    q: "Is there a CRM that includes estimates, invoices, and contracts?",
    a: "Yes — in LeadPrime they're native, not paid add-ons. Build an estimate, turn it into an invoice with one tap, send the contract for e-signature (LeadSign), and take card or ACH payment, all inside the same platform.",
  },
  {
    q: "How is LeadPrime different from Jobber or ServiceTitan?",
    a: "Three honest differences: LeadPrime starts at $0 Pay-As-You-Go while competitors start at a monthly subscription; LeadPrime is built bilingual (English and Spanish) rather than translated; and estimates, invoices, contracts, payments, and the AI agent are all included natively. ServiceTitan targets larger operations; Jobber starts from about $39/month (publicly reported figures, July 2026).",
    compareLink: true,
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              FAQ
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Questions contractors
            <br />
            <span className="lp-text-gradient-cyan">actually ask.</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="lp-card rounded-xl group"
            >
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {f.q}
                </h3>
                <span
                  className="text-[#00D4FF] text-xl leading-none mt-0.5 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-white/65 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {f.a}
                  {f.compareLink && (
                    <>
                      {" "}
                      <a href="/compare/" className="text-[#00D4FF] font-semibold hover:underline">
                        See the full comparison →
                      </a>
                    </>
                  )}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
