/**
 * Built for how YOU work — Brief F1 multi-industry positioning.
 *
 * Source of truth: production onboarding config (g3lasio/leadprime
 * constants/businessTypes.ts) — 13 industries, 140 specialties. The three
 * proven primaries (contractors, PMs, investors) stay front-and-center in
 * IndustrySection; this section honestly shows that LeadPrime ADAPTS to the
 * rest ("también se adapta a…"), with real example use cases. No industry is
 * oversold as a full vertical product.
 */

const industries = [
  { label: "Construction & Trades", emoji: "🔨", count: 41, examples: "Roofing · HVAC · Electrical · Concrete" },
  { label: "Real Estate", emoji: "🏘️", count: 9, examples: "PMs · Investors · Wholesaling · Airbnb" },
  { label: "Financial Services", emoji: "🏦", count: 8, examples: "Insurance · Lending · Tax prep" },
  { label: "Cleaning Services", emoji: "🧽", count: 8, examples: "Residential · Commercial · Pressure washing" },
  { label: "Marketing & Advertising", emoji: "📣", count: 10, examples: "Agencies · Ads · SEO · Content" },
  { label: "Professional Services", emoji: "💼", count: 7, examples: "Coaching · Consulting · Legal · Notary" },
  { label: "Retail & E-Commerce", emoji: "🛍️", count: 8, examples: "Stores · Dropshipping · Handmade" },
  { label: "Personal Services", emoji: "💈", count: 8, examples: "Barbers · Beauty · Fitness · Pet care" },
  { label: "Transportation & Logistics", emoji: "🚛", count: 8, examples: "Hauling · Moving · Towing · Freight" },
  { label: "Food & Beverage", emoji: "🍽️", count: 7, examples: "Catering · Food trucks · Meal prep" },
  { label: "Technology & Software", emoji: "💻", count: 7, examples: "Web dev · IT support · SaaS" },
  { label: "Health & Wellness", emoji: "🩺", count: 7, examples: "Dental · Therapy · Med spas" },
  { label: "Events & Entertainment", emoji: "🎪", count: 12, examples: "Event planning · Photo · Weddings" },
];

const realExamples = [
  {
    who: "An IUL insurance agent",
    what: "runs client outreach and policy follow-ups through the Financial Services pipeline.",
    emoji: "🛡️",
  },
  {
    who: "A coach who organizes women's events",
    what: "manages attendees, workshops, and follow-up in the Events & Entertainment setup.",
    emoji: "🎤",
  },
  {
    who: "A cleaning company",
    what: "books recurring jobs and collects payment — same CRM, different pipeline.",
    emoji: "✨",
  },
];

export default function AdaptsSection() {
  return (
    <section id="adapts" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Built for how YOU work
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-white mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The AI CRM that adapts to YOUR business —
            <br />
            <span className="lp-text-gradient-cyan">not the other way around.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Big field-service tools force your business into their mold.
            LeadPrime configures itself to yours: pick your industry and
            specialty at onboarding — 13 industries, 140 specialties — and your
            pipeline, stages, and AI adapt to match.
          </p>
        </div>

        {/* Real example use cases beyond construction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          {realExamples.map((e) => (
            <div key={e.who} className="lp-card rounded-xl p-5">
              <div className="text-2xl mb-2" aria-hidden="true">{e.emoji}</div>
              <p className="text-sm text-white/75 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="font-bold text-white">{e.who}</span> {e.what}
              </p>
            </div>
          ))}
        </div>

        {/* The 13 real industries from production onboarding */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {industries.map((ind) => (
            <div key={ind.label} className="lp-card rounded-xl px-4 py-3.5">
              <p className="text-sm font-bold text-white leading-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="mr-1.5" aria-hidden="true">{ind.emoji}</span>
                {ind.label}
              </p>
              <p className="text-[11px] text-white/55 leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
                {ind.count} specialties · {ind.examples}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/65 mt-8 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          Contractors, property managers, and real estate investors get the
          deepest builds today — every other industry gets a pipeline
          configured to how it actually works.
        </p>
      </div>
    </section>
  );
}
