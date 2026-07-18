/**
 * Estimate/Invoice mockup (Brief D3). Fictional line items only.
 */

const lineItems = [
  { desc: "Demo & haul-away — existing cabinets", qty: "1", amount: "$1,450" },
  { desc: "Custom shaker cabinets — install", qty: "14", amount: "$6,800" },
  { desc: "Quartz countertops — supply & install", qty: "42 sqft", amount: "$3,960" },
  { desc: "Labor — licensed crew", qty: "36 hrs", amount: "$2,880" },
];

export default function EstimateMockup() {
  return (
    <div className="lp-card rounded-2xl p-5 max-w-md mx-auto" aria-hidden="true">
      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
        <div>
          <p className="text-[11px] text-white/45 font-semibold uppercase tracking-wider">Estimate #1024 (demo)</p>
          <p className="text-sm font-bold text-white mt-0.5">Maria's Kitchen Remodel</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] uppercase tracking-wide">
          Sent
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {lineItems.map((li, i) => (
          <div
            key={li.desc}
            className="flex items-center justify-between text-[11.5px] lp-mock-fade"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <span className="text-white/70 truncate pr-3">{li.desc}</span>
            <span className="text-white/40 px-2 whitespace-nowrap">{li.qty}</span>
            <span className="text-white/85 font-semibold whitespace-nowrap">{li.amount}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 mb-4">
        <span className="text-xs text-white/55 font-semibold">Total</span>
        <span className="text-lg font-black text-white">$15,090</span>
      </div>

      <div className="rounded-xl bg-[#00D4FF] text-[#050B18] text-center py-2.5 text-sm font-bold lp-mock-pulse">
        Approve &amp; Sign ✍️
      </div>
      <p className="text-center text-[10px] text-white/40 mt-2">
        One tap converts this into an invoice.
      </p>
    </div>
  );
}
