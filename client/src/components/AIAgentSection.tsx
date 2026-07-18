/**
 * AI Agent (KEEN) — capabilities supported by production. The CloudFront
 * image was replaced with a CSS chat mock (Brief C: zero external assets).
 */
import { appLink } from "@/lib/appLinks";
import { KenAvatar } from "@/components/KenChat";

const capabilities = [
  {
    title: "Autonomous Lead Follow-Up",
    desc: "KEEN qualifies, prioritizes, and responds to leads without you having to intervene.",
    icon: "🎯",
  },
  {
    title: "24/7 SMS Autopilot",
    desc: "Follow-ups go out on schedule — nights, weekends, and while you're on the job.",
    icon: "💬",
  },
  {
    title: "Books Appointments",
    desc: "Connected to your calendar. KEEN proposes times, confirms, and reminds.",
    icon: "📅",
  },
  {
    title: "Trained On Your Business",
    desc: "Feed it your pricing, docs, and FAQs through the Knowledge Base — it answers like you would.",
    icon: "📚",
  },
  {
    title: "Agent-to-Agent (MCP)",
    desc: "Connect external AI agents to your CRM to send leads, update contacts, and trigger workflows.",
    icon: "🔌",
  },
  {
    title: "Yours to Name",
    desc: "KEEN is the default — give your agent any name and personality you want.",
    icon: "✨",
  },
];

const chatDemo = [
  { from: "lead", text: "Hi, I need a quote for a kitchen remodel." },
  { from: "agent", text: "Great! I can help with that. Would Tuesday at 10 AM work for a free estimate visit?" },
  { from: "lead", text: "Tuesday works. See you then!" },
];

export default function AIAgentSection() {
  return (
    <section className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 max-w-full h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CSS chat mock */}
          <div className="order-2 lg:order-1" aria-hidden="true">
            <div className="lp-card rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <KenAvatar size={40} />
                <div>
                  <p className="text-white font-bold text-sm">KEEN</p>
                  <p className="text-[#10B981] text-xs">● Working your pipeline</p>
                </div>
              </div>
              <div className="space-y-3">
                {chatDemo.map((m, i) => (
                  <div
                    key={i}
                    className={`flex lp-mock-fade ${m.from === "agent" ? "justify-end" : "justify-start"}`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "agent"
                          ? "bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-white"
                          : "bg-white/5 border border-white/10 text-white/80"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {/* typing indicator — subtle loop */}
                <div className="flex justify-end lp-mock-fade" style={{ animationDelay: "1.8s" }}>
                  <div className="rounded-2xl px-4 py-3 bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center gap-1.5">
                    <span className="lp-typing-dot" />
                    <span className="lp-typing-dot" style={{ animationDelay: "0.18s" }} />
                    <span className="lp-typing-dot" style={{ animationDelay: "0.36s" }} />
                  </div>
                </div>
                <p className="text-center text-xs text-white/45 pt-2">
                  Appointment booked automatically · You just show up
                </p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
              <span className="text-sm font-semibold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Meet KEEN
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your AI agent works
              <br />
              <span className="lp-text-gradient-amber">while you build.</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              KEEN follows up on every lead, drafts your messages, and keeps
              your pipeline moving — 24/7. Give it any name you want. It's
              yours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {capabilities.map((c) => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">{c.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {c.title}
                    </p>
                    <p className="text-white/55 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={appLink("ai-agent", "signup")}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-block"
            >
              Activate Your AI Agent — Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
