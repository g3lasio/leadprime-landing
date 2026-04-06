const AI_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-ai-agent-YfBKo4A9LiWB4AkDpmP439.webp";

const capabilities = [
  {
    title: "Gestión Autónoma de Leads",
    desc: "Tu agente AI gestiona y maneja tus leads de forma completamente autónoma — califica, prioriza y responde sin que tengas que intervenir.",
    icon: "🎯",
  },
  {
    title: "Seguimiento por SMS en Autopilot",
    desc: "Cada nuevo lead recibe seguimiento inmediato vía SMS de forma automática. Tu pipeline nunca se enfría — el agente trabaja 24/7 sin descanso.",
    icon: "📲",
  },
  {
    title: "Comunicación con Clientes",
    desc: "Tu agente responde preguntas, califica leads y maneja objeciones por SMS, email y voz — 24/7, sin que levantes un dedo.",
    icon: "💬",
  },
  {
    title: "Conecta con Otros Agentes AI",
    desc: "Vía Agent Connector MCP, tu agente se integra con herramientas AI externas — permitiendo que otros agentes envíen leads directamente a tu CRM.",
    icon: "🤖",
  },
  {
    title: "Agenda Citas Automáticamente",
    desc: "Califica leads y agenda citas directamente en tu calendario. Solo hablas con personas listas para hacer negocios.",
    icon: "📅",
  },
  {
    title: "Entrenado en Tu Negocio",
    desc: "Alimenta tu agente con tus precios, FAQs, área de servicio y documentos vía la Base de Conocimiento. Conoce tu negocio tan bien como tú.",
    icon: "🧠",
  },
  {
    title: "Presencia Multi-Canal",
    desc: "Activo en SMS, email, llamadas de voz y chat web simultáneamente. Nunca pierdas un lead sin importar cómo te contacten.",
    icon: "📡",
  },
  {
    title: "Nombre y Personalidad Propios",
    desc: "Dale a tu agente el nombre que quieras y entrénalo con el conocimiento de tu negocio. Es tu asistente, con tu identidad.",
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
              Tu Agente AI.
              <br />
              <span className="lp-text-gradient-cyan">El Que Nunca Duerme.</span>
            </h2>

            <p className="text-white/60 mb-4 leading-relaxed text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tu agente AI no es solo un chatbot. Es un agente completo que gestiona tus leads de forma autónoma,
              da seguimiento automático por SMS en modo autopilot, habla con otros agentes AI y mantiene
              tu pipeline en movimiento — todo mientras tú te enfocas en lo que mejor sabes hacer.
            </p>
            <p className="text-[#00D4FF] font-semibold mb-10 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Dale el nombre que quieras. Entrénalo con tu negocio. Es tuyo.
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
              Activa Tu Agente AI — 90 Días Gratis
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
              <div className="text-xs text-[#00D4FF] font-semibold mb-1">Agente AI → Lead</div>
              <div className="text-xs text-white/80">"¡Hola! Vi que estás interesado. ¿Cuándo tienes disponibilidad para hablar?"</div>
            </div>

            <div className="absolute bottom-16 -right-6 lp-card rounded-xl px-4 py-3 max-w-[220px] lp-border-amber">
              <div className="text-xs text-[#F59E0B] font-semibold mb-1">Lead → Agente AI</div>
              <div className="text-xs text-white/80">"¡Mañana a las 2pm me viene bien!"</div>
            </div>

            <div className="absolute bottom-2 left-8 lp-card rounded-xl px-4 py-3 max-w-[200px]" style={{ border: "1px solid #10B98130" }}>
              <div className="text-xs text-[#10B981] font-semibold mb-1">✓ Cita Agendada</div>
              <div className="text-xs text-white/80">Mañana 2:00 PM — Agregado al calendario</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
