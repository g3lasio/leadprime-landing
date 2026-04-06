import { useState } from "react";

const industries = [
  {
    id: "contractor",
    label: "Contractors",
    emoji: "🔨",
    color: "#00D4FF",
    tagline: "Stop chasing leads. Start closing jobs.",
    headline: "Built for the Contractor Who Wants to Dominate Their Market",
    desc: "You're good at your trade. LeadPrime handles the business side — lead follow-up, contracts, compliance, and network connections — so you can focus on the work. Join as a Founding Member and get 90 days free with full access to OWL FENC Suite.",
    benefits: [
      { icon: "📲", title: "Auto Lead Follow-Up", desc: "Never lose a lead again. AI follows up via SMS, email, and voice automatically." },
      { icon: "📄", title: "OWL FENC Suite — Free 90 Days", desc: "Generate professional estimates, contracts, and permits at no extra cost during your 90-day trial. Worth $100/month." },
      { icon: "🛡️", title: "Trust Score & Compliance Kit", desc: "W-9, license verification, COI — all organized and shareable with PMs and investors." },
      { icon: "🌐", title: "Public Verified Profile", desc: "Your @handle profile shows your credentials, Trust Score, and years of experience." },
      { icon: "🏗️", title: "Government & Residential Projects", desc: "Access federal, state, and residential projects posted by PMs and investors. Bid directly from the app." },
      { icon: "💰", title: "Business Financing & Credit Lines", desc: "Preferred financing options, commercial credit reconstruction, and strategic growth partners — exclusive to Network Elite members." },
      { icon: "🎟️", title: "Networking Events — Las Vegas, SF, Miami", desc: "Coworking and networking events in top cities. Meet PMs, investors, lenders, and partners face to face." },
      { icon: "🤖", title: "AI Agent 24/7", desc: "Your AI agent handles client communication 24/7 — answers questions, books appointments, and qualifies leads on autopilot." },
    ],
    cta: "Join as a Contractor",
  },
  {
    id: "pm",
    label: "Property Managers",
    emoji: "🏢",
    color: "#F59E0B",
    tagline: "Automate your portfolio. Manage everything from one place.",
    headline: "The PM's Command Center: Full Property Automation",
    desc: "Managing properties means juggling people, payments, maintenance, and contracts — all at once. LeadPrime automates the repetitive tasks so you can focus on growing your portfolio.",
    benefits: [
      { icon: "💰", title: "Automated Rent Collection", desc: "Automate monthly rent collection with SMS and email reminders. Reduce delinquency and eliminate manual follow-up." },
      { icon: "🔧", title: "Maintenance Management", desc: "Tenants report issues from the portal. The AI agent assigns contractors, tracks progress, and closes tickets automatically." },
      { icon: "📋", title: "Application Management", desc: "Receive, review, and process new tenant applications in a visual pipeline. Run background checks and approve directly from the app." },
      { icon: "📄", title: "Lease Renewal Automation", desc: "Automate the renewal process: notifications, term negotiation, digital signature, and archiving — zero paperwork." },
      { icon: "🔍", title: "Verified Contractor Network", desc: "Find licensed, insured contractors with verified Trust Scores. No more guessing, no more surprises." },
      { icon: "📊", title: "Prospect Pipeline", desc: "Manage prospective tenants, property owners, and vendor relationships in one unified visual pipeline." },
      { icon: "📣", title: "Multi-Channel Campaigns", desc: "Send SMS, email, and voice campaigns to owners and tenants at scale with a single click." },
      { icon: "🤖", title: "AI Agent 24/7", desc: "Your AI agent answers tenant questions, qualifies prospects, and schedules showings — without you lifting a finger." },
    ],
    cta: "Join as a Property Manager",
  },
  {
    id: "investor",
    label: "Investors",
    emoji: "📈",
    color: "#10B981",
    tagline: "Find deals faster. Close with confidence.",
    headline: "The Investor's Edge: AI-Powered Deal Flow & Network Access",
    desc: "From skip tracing to contract signing, LeadPrime gives investors the tools to find, analyze, and close deals — with a verified network of contractors and wholesalers ready to execute.",
    benefits: [
      { icon: "🔎", title: "Skip Trace Pro", desc: "Find property owner contact info instantly. Batch skip tracing for entire lists." },
      { icon: "🎯", title: "Lead Hunter", desc: "AI-powered prospect discovery. Find motivated sellers in your target market." },
      { icon: "🤝", title: "Contractor Network", desc: "Connect with verified contractors for rehabs, flips, and maintenance projects." },
      { icon: "📑", title: "LeadSign Contracts", desc: "Send purchase agreements, LOIs, and assignment contracts for e-signature instantly." },
      { icon: "⚡", title: "Automated Follow-Up", desc: "AI follows up with every lead on your list — no lead goes cold." },
      { icon: "📊", title: "Deal Pipeline", desc: "Track every deal from acquisition to close with a customized pipeline." },
    ],
    cta: "Join as an Investor",
  },
  {
    id: "realtor",
    label: "Realtors",
    emoji: "🏠",
    color: "#A78BFA",
    tagline: "More listings. More closings. Less chaos.",
    headline: "The Realtor's CRM That Actually Understands Real Estate",
    desc: "LeadPrime is built for the real estate professional who needs to manage buyers, sellers, and referral partners — all while keeping their pipeline full and their clients happy.",
    benefits: [
      { icon: "👥", title: "Buyer & Seller Pipeline", desc: "Separate pipelines for buyers and sellers. Track every stage from inquiry to closing." },
      { icon: "📱", title: "SMS & Email Drip Campaigns", desc: "Stay top of mind with automated nurture sequences for every lead type." },
      { icon: "🌐", title: "Network Referrals", desc: "Connect with investors, lenders, and contractors for referral partnerships." },
      { icon: "📋", title: "Digital Listing Agreements", desc: "Send and e-sign listing agreements and buyer rep agreements in minutes." },
      { icon: "🎯", title: "Lead Hunter", desc: "Find FSBO, expired listings, and pre-foreclosure leads in your market." },
      { icon: "📅", title: "Showing Scheduler", desc: "Automated appointment booking and confirmation via SMS and email." },
    ],
    cta: "Join as a Realtor",
  },
  {
    id: "lender",
    label: "Lenders",
    emoji: "🏦",
    color: "#F472B6",
    tagline: "More applications. Faster closings. Better relationships.",
    headline: "The Lender's Platform for Lead Generation & Partner Management",
    desc: "LeadPrime helps lenders capture more loan applications, automate follow-up, and build a referral network with realtors, investors, and contractors.",
    benefits: [
      { icon: "📲", title: "Multi-Channel Lead Capture", desc: "Capture leads from Meta Ads, Google Ads, web forms, and referral partners automatically." },
      { icon: "🤖", title: "AI Pre-Qualification", desc: "AI agent pre-qualifies borrowers via SMS and email before they reach your desk." },
      { icon: "🤝", title: "Realtor & Investor Network", desc: "Build referral partnerships with verified realtors and investors in your market." },
      { icon: "📊", title: "Application Pipeline", desc: "Track every loan application from inquiry to closing with custom pipeline stages." },
      { icon: "📣", title: "Rate Update Campaigns", desc: "Send rate updates and market news to your entire database with one click." },
      { icon: "📑", title: "Digital Disclosures", desc: "Send and collect signed disclosures and pre-approval letters digitally." },
    ],
    cta: "Join as a Lender",
  },
  {
    id: "wholesaler",
    label: "Wholesalers",
    emoji: "🔄",
    color: "#FB923C",
    tagline: "Find deals. Assign contracts. Build your buyers list.",
    headline: "The Wholesaler's Toolkit: From Lead to Assignment in Record Time",
    desc: "LeadPrime gives wholesalers the skip tracing, AI follow-up, and contract tools to find motivated sellers and close assignments fast — with a network of cash buyers ready to go.",
    benefits: [
      { icon: "🔎", title: "Skip Trace Pro", desc: "Find motivated seller contact info in seconds. Batch process entire lists." },
      { icon: "📲", title: "Cold Outreach Automation", desc: "SMS, email, and voice campaigns to motivated seller lists — fully automated." },
      { icon: "💼", title: "Cash Buyer Network", desc: "Connect with verified investors and cash buyers in your market for quick assignments." },
      { icon: "📑", title: "Assignment Contracts", desc: "Generate and e-sign assignment contracts and purchase agreements instantly." },
      { icon: "🎯", title: "Lead Hunter", desc: "Find pre-foreclosure, probate, and distressed property leads in your target zip codes." },
      { icon: "⚡", title: "AI Follow-Up Agent", desc: "AI follows up with every seller lead automatically — no deal left behind." },
    ],
    cta: "Join as a Wholesaler",
  },
];

export default function IndustrySection() {
  const [active, setActive] = useState(0);
  const ind = industries[active];

  return (
    <section id="industry" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F59E0B]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
            <span className="text-sm font-semibold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Built For Your Industry
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Industry.
            <br />
            <span className="lp-text-gradient-amber">Your CRM.</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            LeadPrime is customized for each professional type. Select your industry to see exactly how it works for you.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {industries.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => setActive(i)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                active === i
                  ? "text-[#050B18]"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
              style={
                active === i
                  ? { background: ind.color, fontFamily: "'Space Grotesk', sans-serif" }
                  : { fontFamily: "'Space Grotesk', sans-serif" }
              }
            >
              <span>{ind.emoji}</span>
              {ind.label}
            </button>
          ))}
        </div>

        {/* Industry Content */}
        <div
          key={ind.id}
          className="lp-card rounded-2xl p-8 lg:p-12 transition-all duration-300"
          style={{ borderColor: `${ind.color}30` }}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div>
              <div
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
                style={{ background: `${ind.color}20`, color: ind.color }}
              >
                {ind.tagline}
              </div>
              <h3
                className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {ind.headline}
              </h3>
              <p className="text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {ind.desc}
              </p>
              <a
                href="https://lead-prime.chyrris.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${ind.color}, ${ind.color}CC)`,
                  color: "#050B18",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: `0 0 20px ${ind.color}40`,
                }}
              >
                {ind.cta} — Free 90 Days
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Right: Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ind.benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: `${ind.color}08`, border: `1px solid ${ind.color}20` }}
                >
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div
                    className="text-sm font-bold text-white mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {b.title}
                  </div>
                  <div className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
