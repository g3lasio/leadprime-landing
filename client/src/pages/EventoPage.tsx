/**
 * EventoPage — Galería de eventos LeadPrime Networking (histórico).
 *
 * Brief A (contención): esta página dejó de ser un funnel de registro.
 * El evento del 2 de julio de 2026 ya se realizó; la página ahora es una
 * galería de eventos pasados — sin formulario, sin CTAs de solicitud de
 * acceso y sin llamadas al backend. Los futuros eventos se anunciarán
 * cuando exista una fecha confirmada.
 *
 * Sep 2026: sitio solo para contratistas, sin nombre personal del fundador
 * ni dirección completa (solo "Fairfield, California"); la empresa es
 * "LeadPrime · Chyrris Technologies".
 */

import { TALLER } from "@shared/taller";

const GOLD = "#D4AF37";

type PastEvent = {
  title: string;
  date: string;
  time: string;
  address: string;
  audience: string;
  description: string;
  image: string;
  presenter: string;
};

const PAST_EVENTS: PastEvent[] = [
  {
    title: "LeadPrime Networking · Bay Area",
    date: "jueves 2 de julio, 2026",
    time: "7:00 PM – 8:30 PM",
    address: "Fairfield, California",
    audience:
      "Contratistas generales y contratistas locales del área de Fairfield y el Bay Area",
    description:
      "Una noche privada de networking curado: recepción con credenciales, un briefing de la industria a cargo del equipo de LeadPrime y cierre con introducciones dirigidas entre asistentes.",
    image: "/evento-networking.png",
    presenter: "LeadPrime · Chyrris Technologies",
  },
];

export default function EventoPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Nav mínima */}
      <nav className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold tracking-tight text-white">
            LeadPrime{" "}
            <span className="text-[10px] align-middle px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
              NETWORK
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </nav>

      {/* Encabezado */}
      <header className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: GOLD }}
        >
          ◆ LeadPrime Networking
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Eventos
        </h1>
        <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm md:text-base">
          Encuentros para contratistas de California, en español.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Próximo evento: taller virtual del 17 de octubre */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">
          Próximo evento
        </h2>
        <article
          className="rounded-2xl overflow-hidden border mb-14"
          style={{ borderColor: `${GOLD}66`, background: `linear-gradient(135deg, ${GOLD}1f, ${GOLD}06)` }}
        >
          <div className="p-6 md:p-10">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5"
              style={{ color: GOLD, borderColor: `${GOLD}66`, backgroundColor: "rgba(5,11,24,0.85)" }}
            >
              Gratis · por Zoom · en español
            </span>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
              ◆ {TALLER.series} · {TALLER.shortName}
            </p>
            <h3 className="text-2xl md:text-4xl font-extrabold leading-tight max-w-3xl">
              {TALLER.title}
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm md:text-base text-white/70">
              <span>📅 {TALLER.dateLabel}</span>
              <span>🕗 {TALLER.timeLabel}</span>
              <span>⏱ {TALLER.durationLabel}</span>
            </div>
            <p className="text-white/75 text-sm md:text-base leading-relaxed mt-5 max-w-3xl">
              <strong className="text-white">{TALLER.hook.number}</strong> {TALLER.hook.text} El sábado le decimos qué le van a pedir, cómo dejar su contrato en regla y cómo cobrar el depósito con tarjeta antes de empezar.
            </p>
            <p className="text-white/50 text-sm mt-3">{TALLER.whoIsItFor}</p>
            <a
              href="/taller"
              className="inline-block mt-6 px-7 py-3.5 rounded-xl font-extrabold text-[#0a1628] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: GOLD }}
            >
              Apartar mi lugar gratis →
            </a>
            <p className="text-xs text-white/35 mt-4">{TALLER.disclaimer}</p>
          </div>
        </article>

        {/* Galería de eventos pasados */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">
          Eventos realizados
        </h2>
        <div className="grid gap-8">
          {PAST_EVENTS.map((ev) => (
            <article
              key={ev.title + ev.date}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
            >
              <div className="relative">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "360px" }}
                  loading="lazy"
                />
                <span
                  className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
                  style={{
                    color: GOLD,
                    borderColor: `${GOLD}66`,
                    backgroundColor: "rgba(5,11,24,0.85)",
                  }}
                >
                  Evento realizado
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold">{ev.title}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-white/60">
                  <span>📅 {ev.date}</span>
                  <span>🕖 {ev.time}</span>
                  <span>📍 {ev.address}</span>
                </div>
                <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4">
                  {ev.description}
                </p>
                <p className="text-white/45 text-sm mt-3">{ev.audience}</p>
                <p className="text-xs text-white/35 mt-5">
                  Presentado por{" "}
                  <span style={{ color: GOLD }}>{ev.presenter}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-8 text-center">
          <p className="text-white/60 font-semibold">¿Se registró y no le llegó la invitación?</p>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto">
            Revise la carpeta de spam o escríbanos a {TALLER.contactEmail} y se la reenviamos.
          </p>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-white/40 space-y-2">
          <p>
            © 2026 LeadPrime · Chyrris Technologies LLC ·{" "}
            <a
              href="mailto:info@chyrris.com"
              className="underline hover:text-white/70"
            >
              info@chyrris.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
