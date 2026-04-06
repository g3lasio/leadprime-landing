const AI_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-ai-agent-YfBKo4A9LiWB4AkDpmP439.webp";

const capabilities = [
  {
    title: "Autonomous Lead Management",
    desc: "Your AI agent manages and handles your leads completely autonomously — qualifies, prioritizes, and responds without you having to intervene.",
    icon: "🎯",
  },
  {
    title: "SMS Follow-Up on Autopilot",
    desc: "Every new lead gets immediate follow-up via SMS automatically. Your pipeline never goes cold — the agent works 24/7 without rest.",
    icon: "📲",
  },
  {
    title: "Talks to Your Clients",
    desc: "Your agent answers questions, qualifies leads, and handles objections via SMS, email, and voice — 24/7, without you lifting a finger.",
    icon: "💬",
  },
  {
    title: "Connects with Other AI Agents",
    desc: "Via Agent Connector MCP, your agent integrates with external AI tools — letting other agents send leads directly into your CRM.",
    icon: "🤖",
  },
  {
    title: "Books Appointments Automatically",
    desc: "Qualifies leads and books appointments directly on your calendar. You only talk to people who are ready to do business.",
    icon: "📅",
  },
  {
    title: "Trained on Your Business",
    desc: "Feed your agent your pricing, FAQs, service area, and documents via the Knowledge Base. It knows your business as well as you do.",
    icon: "🧠",
  },
  {
    title: "Multi-Channel Presence",
    desc: "Active on SMS, email, voice calls, and web chat simultaneously. Never miss a lead regardless of how they contact you.",
    icon: "📡",
  },
  {
    title: "Your Name. Your Identity.",
    desc: "Give your agent any name you want and train it with your business knowledge. It's your assistant — fully branded to you.",
    icon: "✨",
  },
];

export default function AIAgentSection() {
  return (
    <section className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/3 via-transparent to-[#F59E0B]/3" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AI Super-Agent
              </span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your AI Agent.
              <br />
              <span className="lp-text-gradient-cyan">The One That Never Sleeps.</span>
            </h2>

            <p className="text-white/60 mb-4 leading-relaxed text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your AI agent is not just a chatbot. It's a full agent that autonomously manages your leads,
              follows up via SMS on autopilot, talks to other AI agents, and keeps your pipeline moving —
              all while you focus on what you do best.
            </p>
            <p className="text-[#00D4FF] font-semibold mb-10 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Give it any name you want. Train it on your business. It's yours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {capabilities.map((cap, i) => (
                <div key={i} className="lp-card rounded-xl p-4 hover:border-[#00D4FF]/30 transition-all duration-200">
                  <div className="text-2xl mb-2">{cap.icon}</div>
                  <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {cap.title}
                  </div>
                  <div className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {cap.desc}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2"
            >
              <span>🤖</span>
              Activate Your AI Agent — Free 90 Days
            </a>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden lp-border-cyan animate-float">
              <img
                src={AI_IMG}
                alt="LeadPrime AI Agent"
                className="w-full object-cover"
                style={{ height: "500px", objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/40 to-transparent" />
            </div>

            {/* Floating chat bubbles */}
            <div className="absolute top-8 -left-6 lp-card rounded-xl px-4 py-3 max-w-[220px] lp-border-cyan">
              <div className="text-xs text-[#00D4FF] font-semibold mb-1">AI Agent → Lead</div>
              <div className="text-xs text-white/80">"Hi! I saw you're interested. When's a good time to connect?"</div>
            </div>

            <div className="absolute bottom-16 -right-6 lp-card rounded-xl px-4 py-3 max-w-[220px] lp-border-amber">
              <div className="text-xs text-[#F59E0B] font-semibold mb-1">Lead → AI Agent</div>
              <div className="text-xs text-white/80">"Tomorrow at 2pm works for me!"</div>
            </div>

            <div className="absolute bottom-2 left-8 lp-card rounded-xl px-4 py-3 max-w-[200px]" style={{ border: "1px solid #10B98130" }}>
              <div className="text-xs text-[#10B981] font-semibold mb-1">✓ Appointment Booked</div>
              <div className="text-xs text-white/80">Tomorrow 2:00 PM — Added to calendar</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
