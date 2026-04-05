import { useState } from "react";

const DASHBOARD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-dashboard-mockup-48eK35UhJZoLRjFM5BRNg3.webp";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Lead Management",
    desc: "Capture, track, and nurture leads with a visual pipeline. Auto-import from Meta, Google, Bing, and web forms.",
    color: "#00D4FF",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Messages & Command Center",
    desc: "Unified inbox for SMS, email, and voice. AI-powered responses. Two-way communication with all your contacts.",
    color: "#00D4FF",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Campaigns",
    desc: "Multi-channel campaigns: SMS blasts, email sequences, voice drops. Schedule, automate, and track performance.",
    color: "#F59E0B",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Automations",
    desc: "Build powerful automation workflows triggered by lead actions, time delays, or custom events. Set it and forget it.",
    color: "#F59E0B",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "LeadSign — Digital Contracts",
    desc: "Generate, send, and e-sign contracts in minutes. Built-in templates for your industry. Track signature status in real-time.",
    color: "#10B981",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Lead Hunter",
    desc: "AI-powered lead discovery. Find prospects in your target market with verified contact data, ready to import.",
    color: "#10B981",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
      </svg>
    ),
    title: "Skip Trace Pro",
    desc: "Find property owner contact information instantly. Batch skip tracing for investors and wholesalers.",
    color: "#A78BFA",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Agent — Mervin",
    desc: "Your AI super-agent. Talks to owners, clients, and other AI agents. Handles follow-ups, qualifies leads, and books appointments 24/7.",
    color: "#00D4FF",
    highlight: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Knowledge Base",
    desc: "Train your AI with your documents, pricing, FAQs, and URLs. Your AI knows your business as well as you do.",
    color: "#A78BFA",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Agent Connector MCP",
    desc: "Connect external AI agents to your CRM. Let AI tools send leads, update contacts, and trigger workflows automatically.",
    color: "#F59E0B",
    highlight: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Integrations",
    desc: "Meta Ads, Google Ads, Bing/Microsoft Ads, Zoom, Google Meet, Outlook, Phone System, Web Form Webhooks, and Owl Fenc.",
    color: "#10B981",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Website Builder",
    desc: "AI-generated website for your business, built directly from your CRM profile. No coding required.",
    color: "#F59E0B",
  },
];

export default function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 bg-[#050B18] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything You Need
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            One Platform.
            <br />
            <span className="lp-text-gradient-cyan">Infinite Power.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            From lead capture to contract signing, from AI automation to network connections —
            LeadPrime has every tool your business needs to dominate your market.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mb-20 rounded-2xl overflow-hidden lp-border-cyan lp-glow-cyan">
          <img
            src={DASHBOARD_IMG}
            alt="LeadPrime CRM Dashboard"
            className="w-full object-cover"
            style={{ maxHeight: "500px", objectPosition: "top" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`lp-card rounded-xl p-5 transition-all duration-300 cursor-default ${
                hovered === i ? "border-[#00D4FF]/40 shadow-lg shadow-[#00D4FF]/10 -translate-y-1" : ""
              } ${feat.highlight ? "lp-border-amber" : ""}`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${feat.color}20`, color: feat.color }}
              >
                {feat.icon}
              </div>
              <h3
                className="font-bold text-white mb-2 text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {feat.title}
                {feat.highlight && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-semibold">
                    AI
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
