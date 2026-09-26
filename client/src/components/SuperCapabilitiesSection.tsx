/**
 * Super-Capabilities — Brief G. The four tools that alone justify switching,
 * each verified against production before publishing:
 *   1. LeadSign AI signer/field mapping  → services/leadsign/aiDraftService.ts
 *      (4-layer detection: AcroForm → markers → Claude Vision, role-based)
 *   2. Contract Builder → sign, one flow → services/contracts/contractGenerator.ts
 *      + leadsign/leadsignIntegration.ts
 *   3. GovPrime (SAM.gov matching)       → services/govprime/* + samGovService.ts
 *   4. Business Health Passport          → profile/documentTrackingService.ts +
 *      expirationAlertService.ts (workers_comp & w9_form are real doc types)
 *
 * Legal guardrails: competitor prices are publicly reported ranges (footnote,
 * Jul 2026); savings figures are framed as typical examples, not guarantees.
 * All visuals use 100% fictional data.
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";

const COPY = {
  en: {
    badge: "Super-Capabilities",
    title: { before: "Tools that replace", highlight: "$1,000s in software & pro fees." },
    subtitle: "Four capabilities that usually mean four separate subscriptions — included in LeadPrime.",
    leadsign: {
      kicker: "E-Sign with AI · vs DocuSign",
      title: { before: "LeadSign — sign contracts in", highlight: "90 seconds", after: ", not 20 minutes." },
      text: "Upload any document and LeadPrime's AI automatically maps the signer names and fields. Send for signature in one click. What typically takes ~20 minutes of manual setup in other tools is done in about 90 seconds here.",
      audience: "For contractors who get contracts, change orders, and agreements signed every week.",
      vs: "DocuSign gates its AI field-mapping behind IAM Professional (~$75/user/mo, 3-user minimum, publicly reported Jul 2026) and meters envelopes. LeadPrime includes AI mapping with no enterprise tier and no per-document toll.",
      compare: { them: "~20 min", themLabel: "manual field setup elsewhere", us: "~90 sec", usLabel: "AI-mapped in LeadPrime" },
      mock: {
        label: "LeadSign · demo data",
        file: "Remodel-Agreement-demo.pdf",
        fileMeta: "Uploaded · 3 pages",
        scan: "AI scan",
        signers: "Signers detected automatically",
        client: "Maria G. (Client) — signature ×2, date",
        contractor: "R. Bautista (Contractor) — signature, initials",
        sent: "✓ Sent for signature",
        time: "· 92 seconds total",
      },
    },
    builder: {
      kicker: "Contract Builder · vs Rocket Lawyer / LawDepot",
      title: { before: "Generate a", highlight: "ready-to-sign contract", after: " in 90 seconds." },
      text: "Build your contract and send it for signature in one flow — no blank template to fill in by hand. A contractor's agreement that can run ~$900 with an attorney (typical example, not a quote) is done in about 90 seconds.",
      vs: "Rocket Lawyer (~$39.99/mo) and LawDepot (~$35/mo, or $7.50–$119 per document; publicly reported Jul 2026) sell templates you fill in yourself — no AI mapping, no e-sign in the same flow. LeadPrime generates the contract AND leaves it ready for signature in one step.",
      compare: { them: "~$900", themLabel: "typical attorney-drafted agreement", us: "included", usLabel: "generated + ready to sign" },
      mock: {
        label: "Contract Builder · demo data",
        step1: "1 · Choose contract type",
        type: "Kitchen remodel agreement — CA",
        step2: "2 · Generated with your scope",
        clauses: "Payment milestones · change orders · lien-law notices",
        ready: "✓ Ready for signature",
        via: "· via LeadSign",
      },
    },
    govprime: {
      kicker: "GovPrime · public-work radar",
      title: { before: "Find", highlight: "government contracts", after: " that match your trade." },
      text: "LeadPrime scans federal and state opportunities from SAM.gov and public sources, and matches them to your trade and location — so you find public work you'd never see otherwise. Finding the opportunity is our job; winning the bid is yours.",
      audience: "For contractors who want a way into public work without hiring a bid-search service.",
      mock: {
        label: "GovPrime · demo data",
        match: "match",
        items: [
          { t: "Roof replacement — county library", m: "Federal · matches: Roofing · closes in 12 days", pct: "94%" },
          { t: "Sidewalk & ADA ramps package", m: "State · matches: Concrete & Masonry", pct: "88%" },
          { t: "HVAC retrofit — school district", m: "State · matches: HVAC · pre-bid meeting soon", pct: "81%" },
        ],
      },
    },
    passport: {
      kicker: "Business Health Passport · compliance shield",
      title: { before: "Never miss a", highlight: "license, renewal, or fine." },
      text: "Track your licenses, insurance, W-9, and workers' comp in one place. LeadPrime warns you before anything expires — so an expired license or missing document never turns into a fine.",
      risk: "Contracting without an active license can mean fines in the thousands — in some states well into five figures. LeadPrime keeps you covered before it gets there.",
      mock: {
        label: "Business Health Passport · demo data",
        rows: [
          { d: "Contractor license — C-33", s: "Current", c: "#10B981", note: "renews Mar 2027" },
          { d: "General liability insurance", s: "Expiring soon", c: "#F59E0B", note: "34 days left · reminder sent" },
          { d: "Workers' comp certificate", s: "Current", c: "#10B981", note: "on file" },
          { d: "W-9 on file", s: "Action needed", c: "#EF4444", note: "new EIN — re-upload" },
        ],
      },
    },
    cta: "Get all four — start free at $0",
    footnote:
      "Competitor pricing based on publicly reported figures, July 2026 (DocuSign IAM Professional, Rocket Lawyer, LawDepot); plans and prices vary and may change. Time and cost figures are typical examples, not guarantees. All screens shown with fictional demo data.",
  },
  es: {
    badge: "Súper capacidades",
    title: { before: "Herramientas que reemplazan", highlight: "miles de dólares en software y honorarios." },
    subtitle: "Cuatro capacidades que normalmente son cuatro suscripciones separadas — incluidas en LeadPrime.",
    leadsign: {
      kicker: "Firma electrónica con IA · vs DocuSign",
      title: { before: "LeadSign — firma contratos en", highlight: "90 segundos", after: ", no en 20 minutos." },
      text: "Sube cualquier documento y la IA de LeadPrime identifica automáticamente a los firmantes y los campos. Mándalo a firmar con un clic. Lo que normalmente toma ~20 minutos de configuración manual en otras herramientas aquí queda listo en unos 90 segundos.",
      audience: "Para contratistas que mandan a firmar contratos, órdenes de cambio y acuerdos cada semana.",
      vs: "DocuSign limita su mapeo de campos con IA al plan IAM Professional (~$75/usuario/mes, mínimo 3 usuarios, según reportes públicos de julio 2026) y cobra por sobre. LeadPrime incluye el mapeo con IA sin plan empresarial y sin cobro por documento.",
      compare: { them: "~20 min", themLabel: "configuración manual en otras", us: "~90 seg", usLabel: "mapeado con IA en LeadPrime" },
      mock: {
        label: "LeadSign · datos de ejemplo",
        file: "Contrato-Remodelacion-demo.pdf",
        fileMeta: "Subido · 3 páginas",
        scan: "Escaneo IA",
        signers: "Firmantes detectados automáticamente",
        client: "María G. (Cliente) — firma ×2, fecha",
        contractor: "R. Bautista (Contratista) — firma, iniciales",
        sent: "✓ Enviado a firma",
        time: "· 92 segundos en total",
      },
    },
    builder: {
      kicker: "Generador de contratos · vs Rocket Lawyer / LawDepot",
      title: { before: "Genera un", highlight: "contrato listo para firmar", after: " en 90 segundos." },
      text: "Arma tu contrato y mándalo a firmar en un solo paso — sin plantillas en blanco que llenar a mano. Un contrato de contratista que con un abogado puede costar ~$900 (ejemplo típico, no una cotización) queda listo en unos 90 segundos.",
      vs: "Rocket Lawyer (~$39.99/mes) y LawDepot (~$35/mes, o $7.50–$119 por documento; según reportes públicos de julio 2026) venden plantillas que llenas tú mismo — sin mapeo con IA ni firma electrónica en el mismo flujo. LeadPrime genera el contrato Y lo deja listo para firmar en un solo paso.",
      compare: { them: "~$900", themLabel: "contrato típico hecho por abogado", us: "incluido", usLabel: "generado y listo para firmar" },
      mock: {
        label: "Generador de contratos · datos de ejemplo",
        step1: "1 · Elige el tipo de contrato",
        type: "Contrato de remodelación de cocina — CA",
        step2: "2 · Generado con tu alcance de trabajo",
        clauses: "Pagos por etapa · órdenes de cambio · avisos de gravamen (lien)",
        ready: "✓ Listo para firmar",
        via: "· vía LeadSign",
      },
    },
    govprime: {
      kicker: "GovPrime · radar de obra pública",
      title: { before: "Encuentra", highlight: "contratos de gobierno", after: " que encajan con tu oficio." },
      text: "LeadPrime revisa oportunidades federales y estatales de SAM.gov y de fuentes públicas, y las relaciona con tu oficio y tu zona — para que encuentres obra pública que de otro modo nunca verías. Encontrar la oportunidad es nuestro trabajo; ganar la licitación es el tuyo.",
      audience: "Para contratistas que quieren entrar a la obra pública sin contratar un servicio de búsqueda de licitaciones.",
      mock: {
        label: "GovPrime · datos de ejemplo",
        match: "coincide",
        items: [
          { t: "Cambio de techo — biblioteca del condado", m: "Federal · coincide: Techos · cierra en 12 días", pct: "94%" },
          { t: "Paquete de banquetas y rampas ADA", m: "Estatal · coincide: Concreto y mampostería", pct: "88%" },
          { t: "Modernización de HVAC — distrito escolar", m: "Estatal · coincide: HVAC · junta previa pronto", pct: "81%" },
        ],
      },
    },
    passport: {
      kicker: "Business Health Passport · escudo de cumplimiento",
      title: { before: "Tu licencia y tus seguros,", highlight: "siempre al día." },
      text: "Controla tus licencias, seguros, W-9 y workers' comp en un solo lugar. LeadPrime te avisa antes de que algo venza — para que una licencia vencida o un documento faltante nunca se convierta en multa.",
      risk: "Trabajar como contratista sin licencia activa puede significar multas de miles de dólares — en algunos estados, de cinco cifras. LeadPrime te mantiene cubierto antes de que llegues a eso.",
      mock: {
        label: "Business Health Passport · datos de ejemplo",
        rows: [
          { d: "Licencia de contratista — C-33", s: "Vigente", c: "#10B981", note: "renueva mar 2027" },
          { d: "Seguro de responsabilidad general", s: "Vence pronto", c: "#F59E0B", note: "quedan 34 días · recordatorio enviado" },
          { d: "Certificado de workers' comp", s: "Vigente", c: "#10B981", note: "en archivo" },
          { d: "W-9 en archivo", s: "Requiere acción", c: "#EF4444", note: "EIN nuevo — vuelve a subirlo" },
        ],
      },
    },
    cta: "Obtén las cuatro — empieza gratis en $0",
    footnote:
      "Precios de la competencia basados en cifras reportadas públicamente, julio 2026 (DocuSign IAM Professional, Rocket Lawyer, LawDepot); los planes y precios varían y pueden cambiar. Los tiempos y costos son ejemplos típicos, no garantías. Todas las pantallas se muestran con datos de ejemplo ficticios.",
  },
} as const;

function TimeCompare({ them, themLabel, us, usLabel }: { them: string; themLabel: string; us: string; usLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
        <p className="text-lg font-black text-white/45 line-through" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{them}</p>
        <p className="text-[11px] text-white/55 mt-0.5">{themLabel}</p>
      </div>
      <div className="rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 p-3.5 text-center">
        <p className="text-lg font-black text-[#10B981]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{us}</p>
        <p className="text-[11px] text-white/65 mt-0.5">{usLabel}</p>
      </div>
    </div>
  );
}

export default function SuperCapabilitiesSection() {
  const t = COPY[useLang()];
  const { leadsign, builder, govprime, passport } = t;

  return (
    <section id="super-capabilities" className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#10B981]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 mb-6">
            <span className="text-sm font-semibold text-[#10B981]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.badge}
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t.title.before}
            <br />
            <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-10 max-w-5xl mx-auto">
          {/* 1 — LeadSign vs DocuSign */}
          <div className="lp-card lp-border-cyan rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-2">{leadsign.kicker}</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {leadsign.title.before} <span className="lp-text-gradient-cyan">{leadsign.title.highlight}</span>{leadsign.title.after}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                {leadsign.text}
              </p>
              <p className="text-xs text-white/65 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {leadsign.audience}
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                {leadsign.vs}
              </p>
              <TimeCompare {...leadsign.compare} />
            </div>
            {/* Mini-mockup: upload → mapped → sent (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">{leadsign.mock.label}</p>
              <div className="space-y-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{leadsign.mock.file}</p>
                    <p className="text-[10px] text-white/55">{leadsign.mock.fileMeta}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF] font-bold">{leadsign.mock.scan}</span>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1.5">{leadsign.mock.signers}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                    <p className="text-xs text-white/85">{leadsign.mock.client}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <p className="text-xs text-white/85">{leadsign.mock.contractor}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 px-3 py-2.5 flex items-center gap-2 lp-mock-pulse">
                  <span className="text-[#10B981] font-bold text-xs">{leadsign.mock.sent}</span>
                  <span className="text-[10px] text-white/55">{leadsign.mock.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Contract Builder vs Rocket Lawyer / LawDepot */}
          <div className="lp-card lp-border-amber rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">{builder.kicker}</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {builder.title.before} <span className="lp-text-gradient-amber">{builder.title.highlight}</span>{builder.title.after}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                {builder.text}
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                {builder.vs}
              </p>
              <TimeCompare {...builder.compare} />
            </div>
            {/* Mini-mockup: pick type → generated → ready (fictional) */}
            <div className="lp-card rounded-xl p-5 border border-white/10 lg:order-1" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">{builder.mock.label}</p>
              <div className="space-y-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1">{builder.mock.step1}</p>
                  <p className="text-xs font-semibold text-white">{builder.mock.type}</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1">{builder.mock.step2}</p>
                  <p className="text-xs text-white/85">{builder.mock.clauses}</p>
                </div>
                <div className="rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 px-3 py-2.5 flex items-center gap-2 lp-mock-pulse">
                  <span className="text-[#10B981] font-bold text-xs">{builder.mock.ready}</span>
                  <span className="text-[10px] text-white/55">{builder.mock.via}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 — GovPrime */}
          <div className="lp-card lp-border-cyan rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-2">{govprime.kicker}</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {govprime.title.before} <span className="lp-text-gradient-cyan">{govprime.title.highlight}</span>{govprime.title.after}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                {govprime.text}
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                {govprime.audience}
              </p>
            </div>
            {/* Mini-mockup: opportunity radar (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">{govprime.mock.label}</p>
              <div className="space-y-2.5">
                {govprime.mock.items.map(o => (
                  <div key={o.t} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{o.t}</p>
                      <p className="text-[10px] text-white/55">{o.m}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF] font-bold shrink-0">
                      {o.pct} {govprime.mock.match}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 — Business Health Passport */}
          <div className="lp-card lp-border-amber rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">{passport.kicker}</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {passport.title.before} <span className="lp-text-gradient-amber">{passport.title.highlight}</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                {passport.text}
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                {passport.risk}
              </p>
            </div>
            {/* Mini-mockup: passport statuses (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10 lg:order-1" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">{passport.mock.label}</p>
              <div className="space-y-2.5">
                {passport.mock.rows.map(r => (
                  <div key={r.d} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.c }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{r.d}</p>
                      <p className="text-[10px] text-white/55">{r.note}</p>
                    </div>
                    <span className="text-[10px] font-bold shrink-0" style={{ color: r.c }}>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={appLink("super-capabilities", "signup")}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-block"
          >
            {t.cta}
          </a>
          <p className="text-xs text-white/65 mt-5 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
