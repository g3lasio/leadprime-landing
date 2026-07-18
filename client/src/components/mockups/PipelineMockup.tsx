/**
 * Animated contractor-pipeline mockup (Brief D3).
 * 100% fictional demo data — CSS-only animation, Linear/Stripe style.
 */

const stages = [
  {
    name: "New",
    color: "#00D4FF",
    cards: [{ title: "Maria's Kitchen Remodel", meta: "$18,500 · San Jose" }],
  },
  {
    name: "Contacted",
    color: "#22D3EE",
    cards: [{ title: "Downtown Fence Job", meta: "$7,200 · Oakland" }],
  },
  {
    name: "Estimate Sent",
    color: "#F59E0B",
    cards: [
      { title: "Garcia Bathroom Reno", meta: "$12,400 · Fremont" },
      { title: "Sunset Deck Build", meta: "$9,800 · Hayward" },
    ],
  },
  {
    name: "Signed",
    color: "#10B981",
    cards: [{ title: "Lakeside ADU Project", meta: "$86,000 · Fairfield" }],
  },
  {
    name: "Completed",
    color: "#A78BFA",
    cards: [{ title: "Vista Roof Replacement", meta: "$24,300 · Paid ✓" }],
  },
];

export default function PipelineMockup() {
  return (
    <div className="lp-card rounded-2xl p-4 overflow-hidden" aria-hidden="true">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 pb-3 border-b border-white/10 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[11px] text-white/45 font-semibold tracking-wide">
          LeadPrime · Contractor Pipeline (demo)
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-5 gap-2 min-w-[560px]">
          {stages.map((stage, si) => (
            <div key={stage.name} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide truncate">
                  {stage.name}
                </span>
              </div>
              <div className="space-y-2">
                {stage.cards.map((c, ci) => (
                  <div
                    key={c.title}
                    className="rounded-md border border-white/10 bg-[#0D1B30] p-2 lp-mock-fade"
                    style={{ animationDelay: `${(si * 2 + ci) * 0.15}s`, borderLeft: `2px solid ${stage.color}` }}
                  >
                    <p className="text-[10.5px] font-semibold text-white/85 leading-tight">{c.title}</p>
                    <p className="text-[9.5px] text-white/45 mt-0.5">{c.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* The traveling card: New → Contacted → Estimate Sent, on loop */}
        <div className="absolute top-8 left-0 w-[19%] lp-mock-travel pointer-events-none">
          <div className="rounded-md border border-[#00D4FF]/50 bg-[#0D2237] p-2 shadow-lg shadow-[#00D4FF]/10">
            <p className="text-[10.5px] font-semibold text-white leading-tight">Rosa's Patio Cover</p>
            <p className="text-[9.5px] text-[#00D4FF] mt-0.5">KEEN following up…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
