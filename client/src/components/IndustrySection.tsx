/**
 * For Contractors — single audience (Gelasio, 22-Sep-2026): contractors only.
 * Property managers, investors, lenders, wholesalers, and realtors are no
 * longer marketed on the public site. Every benefit below is backed by
 * production today (Brief D2 copy). Keeps id="industry" so existing
 * #industry links still land here.
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";
import PipelineMockup from "@/components/mockups/PipelineMockup";
import ResponsiveImage from "@/components/ResponsiveImage";

const COPY = {
  en: {
    badge: "For Contractors",
    title: { before: "Built around", highlight: "your business." },
    intro:
      "Manage every job from estimate to final payment. Construction-stage pipelines, digital contracts, native estimates and invoices, and an AI agent that follows up so you don't have to.",
    subtitle: "From the first estimate to the final payment — without the paperwork.",
    benefits: [
      "Send professional estimates from your phone in minutes.",
      "Turn an approved estimate into an invoice with one tap.",
      "Get contracts signed on-site — no printer, no office.",
      "KEEN follows up on every lead so none goes cold.",
      "Track your license, insurance, and W-9 so you never miss a renewal.",
      "Find government projects with GovPrime — pulls federal & state opportunities from SAM.gov, matched to your trade.",
      "Accept card and ACH payments — get paid on the spot.",
    ],
    cta: "Start free →",
  },
  es: {
    badge: "Para contratistas",
    title: { before: "Hecho a la medida de", highlight: "tu negocio." },
    intro:
      "Maneja cada trabajo del estimado al pago final. Pipelines por etapa de construcción, contratos digitales, estimados y facturas integrados, y un agente de IA que da seguimiento para que tú no tengas que hacerlo.",
    subtitle: "Del primer estimado al pago final — sin tanto papeleo.",
    benefits: [
      "Manda estimados profesionales desde tu teléfono en minutos.",
      "Convierte un estimado aprobado en factura con un toque.",
      "Firma contratos en la obra — sin impresora ni oficina.",
      "KEEN da seguimiento a cada lead para que ninguno se enfríe.",
      "Controla tu licencia, tu seguro y tu W-9 para que nunca se te pase una renovación.",
      "Encuentra proyectos de gobierno con GovPrime — trae oportunidades federales y estatales de SAM.gov, según tu oficio.",
      "Acepta pagos con tarjeta y ACH — cobra en el momento.",
    ],
    cta: "Empieza gratis →",
  },
} as const;

const TRADES = {
  en: [
    { asset: "fences", label: "Fences", alt: "Fence installer securing a wood fence panel with a level." },
    { asset: "roofing", label: "Roofing", alt: "Roofer working on an asphalt shingle roof at sunset with a visible safety harness." },
    { asset: "landscaping", label: "Landscaping", alt: "Landscaper arranging plants in a garden with decorative stone." },
    { asset: "remodeling", label: "Remodeling", alt: "Contractor measuring cabinets in a kitchen under renovation." },
    { asset: "electrical", label: "Electrical", alt: "Electrician checking an electrical panel in a garage." },
    { asset: "stucco", label: "Stucco", alt: "Stucco installer applying finish to an exterior wall." },
  ],
  es: [
    { asset: "fences", label: "Cercas", alt: "Instalador de cercas fijando un panel de madera con un nivel." },
    { asset: "roofing", label: "Techos", alt: "Techero trabajando sobre un techo de teja asfáltica al atardecer, con arnés de seguridad visible." },
    { asset: "landscaping", label: "Jardinería", alt: "Paisajista acomodando plantas en un jardín con piedra decorativa." },
    { asset: "remodeling", label: "Remodelación", alt: "Contratista midiendo gabinetes en una cocina en obra." },
    { asset: "electrical", label: "Electricidad", alt: "Electricista revisando un panel eléctrico en un garaje." },
    { asset: "stucco", label: "Yeso y estuco", alt: "Yesero aplicando estuco en una pared exterior." },
  ],
} as const;

export default function IndustrySection() {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <section id="industry" className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.badge}
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.title.before} <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.intro}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {TRADES[lang].map((trade) => (
            <figure key={trade.asset} className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#050B18] shadow-lg">
              <ResponsiveImage
                asset={trade.asset}
                alt={trade.alt}
                width={1600}
                height={2000}
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 48vw"
                className="block"
                imgClassName="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050B18]/90 to-transparent px-3 pb-3 pt-10 text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {trade.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Contractor benefits (Brief D2) next to the pipeline mockup */}
        <div id="for-contractors" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3
              className="text-2xl lg:text-3xl font-black text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.subtitle}
            </h3>
            <ul className="space-y-3 mb-8">
              {t.benefits.map(b => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="mt-0.5 font-bold text-[#00D4FF]" aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={appLink("industry-contractors", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#00D4FF] transition-colors"
            >
              {t.cta}
            </a>
          </div>
          <div className="overflow-x-auto">
            <PipelineMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
