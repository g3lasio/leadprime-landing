/**
 * Why contractors are switching — capability comparison (Brief D4/F6.1/G3).
 * Legal guardrails: competitor figures are public-report ranges, never
 * presented as official; footnote discloses sources and date. Jobber's
 * entry price could not be re-verified against getjobber.com at
 * implementation time (network-restricted build environment), so the
 * brief-mandated fallback "from ~$39/mo" + footnote is used.
 * Mobile (F6.1): the table becomes stacked per-capability cards under 768px
 * so nothing is cut off at 375–390px.
 */

const rows: { label: string; lp: string; jobber: string; st: string; lpStrong?: boolean }[] = [
  {
    label: "Starting price",
    lp: "$0 (Pay-As-You-Go)",
    jobber: "from ~$39/mo, scales with users",
    st: "Not public · reported $245–$500+/tech/mo",
    lpStrong: true,
  },
  {
    label: "Setup / implementation fee",
    lp: "None",
    jobber: "None",
    st: "Reported $5,000–$50,000",
    lpStrong: true,
  },
  {
    label: "Contract required",
    lp: "No — cancel anytime",
    jobber: "Trial then plan",
    st: "Annual contract, early-termination fees reported",
    lpStrong: true,
  },
  {
    label: "Built for Latino contractors / Spanish-native",
    lp: "Yes",
    jobber: "No",
    st: "No",
    lpStrong: true,
  },
  {
    label: "AI agent that follows up (KEEN)",
    lp: "Yes, built-in",
    jobber: "Add-on/limited",
    st: "Add-on",
    lpStrong: true,
  },
  {
    label: "Estimates + Invoices + Contracts + Payments, native",
    lp: "All included",
    jobber: "Core + paid add-ons",
    st: "Enterprise suite",
    lpStrong: true,
  },
  {
    label: "B2B verified network",
    lp: "Yes",
    jobber: "No",
    st: "No",
    lpStrong: true,
  },
  {
    label: "Best for",
    lp: "Solo to growing crews",
    jobber: "Small–mid teams",
    st: "20+ technician enterprises",
  },
];

// Brief G3 — LeadPrime bundles what usually takes 4–5 separate subscriptions.
const replaces = [
  { tool: "E-sign with AI field mapping", instead: "DocuSign IAM Professional (~$75/user/mo reported)", lp: "LeadSign — included" },
  { tool: "Contract generation", instead: "Rocket Lawyer ~$39.99/mo · LawDepot ~$35/mo (reported)", lp: "Contract Builder — included" },
  { tool: "Government bid finder", instead: "Bid-search services & manual SAM.gov digging", lp: "GovPrime — included" },
  { tool: "License & compliance tracking", instead: "Spreadsheets or compliance services", lp: "Business Health Passport — included" },
  { tool: "CRM + AI follow-up + payments", instead: "A CRM subscription + add-ons", lp: "LeadPrime core — from $0" },
];

export default function ComparisonSection() {
  return (
    <section id="compare" className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Compare
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Why contractors are
            <br />
            <span className="lp-text-gradient-cyan">switching to LeadPrime.</span>
          </h2>
        </div>

        {/* Desktop / tablet: full table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
            <thead>
              <tr className="bg-white/[0.04]">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50 w-[28%]">
                  Capability
                </th>
                <th className="p-4 text-sm font-black text-[#00D4FF] w-[24%]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  LeadPrime
                </th>
                <th className="p-4 text-sm font-bold text-white/70 w-[24%]">Jobber</th>
                <th className="p-4 text-sm font-bold text-white/70 w-[24%]">ServiceTitan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-white/[0.06]">
                  <td className="p-4 text-sm text-white/75 font-semibold">{r.label}</td>
                  <td className={`p-4 text-sm ${r.lpStrong ? "text-white font-bold" : "text-white/85"}`}>
                    <span className="inline-flex items-start gap-2">
                      {r.lpStrong && <span className="text-[#10B981] mt-0.5" aria-hidden="true">✓</span>}
                      {r.lp}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white/60">{r.jobber}</td>
                  <td className="p-4 text-sm text-white/60">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile (<768px): stacked per-capability cards — nothing cut off */}
        <div className="md:hidden space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="lp-card rounded-xl p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2.5">{r.label}</p>
              <div className="rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/25 px-3 py-2 mb-2">
                <p className="text-[11px] font-black text-[#00D4FF] mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LeadPrime</p>
                <p className="text-sm text-white font-semibold">
                  {r.lpStrong && <span className="text-[#10B981] mr-1.5" aria-hidden="true">✓</span>}
                  {r.lp}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
                  <p className="text-[11px] font-bold text-white/60 mb-0.5">Jobber</p>
                  <p className="text-xs text-white/70 leading-snug">{r.jobber}</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
                  <p className="text-[11px] font-bold text-white/60 mb-0.5">ServiceTitan</p>
                  <p className="text-xs text-white/70 leading-snug">{r.st}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brief G3 — replaces 4–5 separate subscriptions */}
        <div className="mt-12 rounded-2xl border border-[#10B981]/25 bg-[#10B981]/[0.04] p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            One subscription that <span className="text-[#10B981]">replaces 4–5.</span>
          </h3>
          <p className="text-sm text-white/60 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
            What usually takes a stack of separate tools comes included.
          </p>
          <div className="space-y-2.5">
            {replaces.map((r) => (
              <div
                key={r.tool}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-1.5 sm:gap-3 items-center rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div>
                  <p className="text-sm font-bold text-white">{r.tool}</p>
                  <p className="text-xs text-white/60">{r.instead}</p>
                </div>
                <span className="hidden sm:block text-white/40" aria-hidden="true">→</span>
                <p className="text-sm font-bold text-[#10B981] sm:text-right">{r.lp}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/65 mt-6 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
          Competitor pricing based on publicly reported figures, July 2026
          (Jobber, ServiceTitan, DocuSign, Rocket Lawyer, LawDepot);
          ServiceTitan and some others do not publish official pricing, and
          plans vary. Feature availability varies by competitor plan.
          LeadPrime pricing reflects current published plans. All product
          names are trademarks of their respective owners; LeadPrime is not
          affiliated with any of them.
        </p>
        <p className="mt-6">
          <a
            href="/compare/"
            className="text-sm font-bold text-[#00D4FF] hover:underline"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Read the full LeadPrime vs Jobber vs ServiceTitan comparison →
          </a>
        </p>
      </div>
    </section>
  );
}
