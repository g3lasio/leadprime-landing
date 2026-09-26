/**
 * Estimate/Invoice mockup (Brief D3). Fictional line items only.
 */
import { useLang } from "@/lib/i18n";

const COPY = {
  en: {
    number: "Estimate #1024 (demo)",
    job: "Maria's Kitchen Remodel",
    status: "Sent",
    lineItems: [
      { desc: "Demo & haul-away — existing cabinets", qty: "1", amount: "$1,450" },
      { desc: "Custom shaker cabinets — install", qty: "14", amount: "$6,800" },
      { desc: "Quartz countertops — supply & install", qty: "42 sqft", amount: "$3,960" },
      { desc: "Labor — licensed crew", qty: "36 hrs", amount: "$2,880" },
    ],
    total: "Total",
    approve: "Approve & Sign ✍️",
    note: "One tap converts this into an invoice.",
  },
  es: {
    number: "Estimado #1024 (demo)",
    job: "Remodelación de cocina de María",
    status: "Enviado",
    lineItems: [
      { desc: "Demolición y retiro — gabinetes existentes", qty: "1", amount: "$1,450" },
      { desc: "Gabinetes shaker a la medida — instalación", qty: "14", amount: "$6,800" },
      { desc: "Cubiertas de cuarzo — material e instalación", qty: "42 ft²", amount: "$3,960" },
      { desc: "Mano de obra — equipo con licencia", qty: "36 h", amount: "$2,880" },
    ],
    total: "Total",
    approve: "Aprobar y firmar ✍️",
    note: "Con un toque se convierte en factura.",
  },
} as const;

export default function EstimateMockup() {
  const t = COPY[useLang()];

  return (
    <div className="lp-card rounded-2xl p-5 max-w-md mx-auto" aria-hidden="true">
      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
        <div>
          <p className="text-[11px] text-white/45 font-semibold uppercase tracking-wider">{t.number}</p>
          <p className="text-sm font-bold text-white mt-0.5">{t.job}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] uppercase tracking-wide">
          {t.status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {t.lineItems.map((li, i) => (
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
        <span className="text-xs text-white/55 font-semibold">{t.total}</span>
        <span className="text-lg font-black text-white">$15,090</span>
      </div>

      <div className="rounded-xl bg-[#00D4FF] text-[#050B18] text-center py-2.5 text-sm font-bold lp-mock-pulse">
        {t.approve}
      </div>
      <p className="text-center text-[10px] text-white/40 mt-2">
        {t.note}
      </p>
    </div>
  );
}
