/**
 * AI Agent (KEEN) — capabilities supported by production. Brief F3 replaced
 * the static 3-bubble chat mockup with the REAL floating KEEN widget; this
 * section now presents the agent and hands off to the live chat.
 */
import { appLink } from "@/lib/appLinks";
import { useLang } from "@/lib/i18n";
import KeenAvatar from "@/components/KeenAvatar";

const ICONS = ["🎯", "💬", "📅", "📚", "🔌", "✨"];

const COPY = {
  en: {
    chip: "AI Agent",
    live: "● Live on this page",
    liveText:
      "This isn't a mockup — KEEN is live right here. Ask it about pricing, features, or whether LeadPrime fits your business. English o español.",
    chatCta: "Chat with KEEN now",
    chatAria: "Open the KEEN chat",
    limits: "Public product info only · usage limits apply per visitor.",
    badge: "Meet KEEN",
    title: { before: "Your AI agent works", highlight: "while you build." },
    text: "KEEN follows up on every lead, drafts your messages, and keeps your pipeline moving — 24/7. Give it any name you want. It's yours.",
    cta: "Activate Your AI Agent — Free",
    capabilities: [
      { title: "Autonomous Lead Follow-Up", desc: "KEEN qualifies, prioritizes, and responds to leads without you having to intervene." },
      { title: "24/7 SMS Autopilot", desc: "Follow-ups go out on schedule — nights, weekends, and while you're on the job." },
      { title: "Books Appointments", desc: "Connected to your calendar. KEEN proposes times, confirms, and reminds." },
      { title: "Trained On Your Business", desc: "Feed it your pricing, docs, and FAQs through the Knowledge Base — it answers like you would." },
      { title: "Agent-to-Agent (MCP)", desc: "Connect external AI agents to your CRM to send leads, update contacts, and trigger workflows." },
      { title: "Yours to Name", desc: "KEEN is the default — give your agent any name and personality you want." },
    ],
  },
  es: {
    chip: "Agente de IA",
    live: "● En vivo en esta página",
    liveText:
      "Esto no es una maqueta — KEEN está en vivo aquí mismo. Pregúntale por precios, funciones o si LeadPrime le queda a tu negocio. En español o en inglés.",
    chatCta: "Habla con KEEN ahora",
    chatAria: "Abrir el chat de KEEN",
    limits: "Solo información pública del producto · hay límites de uso por visitante.",
    badge: "Conoce a KEEN",
    title: { before: "Tu agente de IA trabaja", highlight: "mientras tú construyes." },
    text: "KEEN da seguimiento a cada lead, escribe tus mensajes y mantiene tu pipeline en movimiento — 24/7. Ponle el nombre que quieras. Es tuyo.",
    cta: "Activa tu agente de IA — gratis",
    capabilities: [
      { title: "Seguimiento automático de leads", desc: "KEEN califica, prioriza y responde a tus leads sin que tengas que intervenir." },
      { title: "Piloto automático de SMS 24/7", desc: "Los seguimientos salen a tiempo — noches, fines de semana y mientras estás en la obra." },
      { title: "Agenda citas", desc: "Conectado a tu calendario. KEEN propone horarios, confirma y manda recordatorios." },
      { title: "Entrenado con tu negocio", desc: "Dale tus precios, documentos y preguntas frecuentes en la Base de Conocimiento — responde como tú lo harías." },
      { title: "Agente a agente (MCP)", desc: "Conecta agentes de IA externos a tu CRM para mandar leads, actualizar contactos y activar flujos de trabajo." },
      { title: "Ponle tu nombre", desc: "KEEN es el nombre de fábrica — ponle a tu agente el nombre y la personalidad que quieras." },
    ],
  },
} as const;

export default function AIAgentSection() {
  const t = COPY[useLang()];
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
                  {t.chip}
                </span>
              </p>
              <p className="text-[#10B981] text-xs mb-5">{t.live}</p>
              <p className="text-sm text-white/70 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.liveText}
              </p>
              <button
                onClick={openKeen}
                className="lp-btn-primary px-6 py-3 rounded-xl text-sm font-bold w-full"
                aria-label={t.chatAria}
              >
                {t.chatCta}
              </button>
              <p className="text-xs text-white/65 mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.limits}
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
              <span className="text-sm font-semibold text-[#F59E0B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.badge}
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.title.before}
              <br />
              <span className="lp-text-gradient-amber">{t.title.highlight}</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {t.capabilities.map((c, i) => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">{ICONS[i]}</span>
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
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
