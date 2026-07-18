/**
 * AI Agent (KEEN) — capabilities supported by production. Brief F3 replaced
 * the static 3-bubble chat mockup with the REAL floating KEEN widget; this
 * section now presents the agent and hands off to the live chat.
 */
import { appLink } from "@/lib/appLinks";
import KeenAvatar from "@/components/KeenAvatar";

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

export default function AIAgentSection() {
  const openKeen = () => window.dispatchEvent(new Event("keen:open"));

  return (
    <section className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 max-w-full h-96 bg-[#F59E0B]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Live-agent card — the real KEEN is one click away */}
          <div className="order-2 lg:order-1">
            <div className="lp-card lp-border-cyan rounded-2xl p-8 max-w-md mx-auto text-center">
              <div className="flex justify-center mb-4">
                <KeenAvatar size={96} online />
              </div>
              <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                KEEN
                <span className="ml-2 align-middle text-xs px-1.5 py-0.5 rounded bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF] font-semibold uppercase tracking-wide">
                  AI Agent
                </span>
              </p>
              <p className="text-[#10B981] text-xs mb-5">● Live on this page</p>
              <p className="text-sm text-white/70 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                This isn't a mockup — KEEN is live right here. Ask it about
                pricing, features, or whether LeadPrime fits your business.
                English o español.
              </p>
              <button
                onClick={openKeen}
                className="lp-btn-primary px-6 py-3 rounded-xl text-sm font-bold w-full"
                aria-label="Open the KEEN chat"
              >
                Chat with KEEN now
              </button>
              <p className="text-xs text-white/65 mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Public product info only · usage limits apply per visitor.
              </p>
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
