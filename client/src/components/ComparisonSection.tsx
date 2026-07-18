/**
 * Why contractors are switching — capability comparison (Brief D4).
 * Legal guardrails: competitor figures are public-report ranges, never
 * presented as official; footnote discloses sources and date. Jobber's
 * entry price could not be re-verified against getjobber.com at
 * implementation time (network-restricted build environment), so the
 * brief-mandated fallback "from ~$39/mo" + footnote is used.
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

        {/* Table scrolls horizontally on small screens */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
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

        <p className="text-xs text-white/50 mt-4 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
          Competitor pricing based on publicly reported figures, July 2026;
          ServiceTitan and some others do not publish official pricing. Feature
          availability varies by competitor plan. LeadPrime pricing reflects
          current published plans.
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
