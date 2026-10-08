/**
 * /taller — registro público al taller virtual del sábado 17 de octubre de 2026.
 * Español. El contratista se registra solo; la invitación con el enlace de
 * Zoom le llega al instante por correo.
 */
import { useEffect } from "react";
import TallerForm from "@/components/TallerForm";
import { TALLER } from "@shared/taller";

const GOLD = "#D4AF37";

export default function TallerPage() {
  useEffect(() => {
    document.title = `Taller gratis por Zoom · ${TALLER.dateLabel} | LeadPrime`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      `${TALLER.title}. ${TALLER.dateLabel}, ${TALLER.timeLabel}, ${TALLER.durationLabel}, por Zoom, en español. Gratis.`
    );
    document.documentElement.lang = "es";
  }, []);

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/es" className="font-bold tracking-tight text-white">
            LeadPrime{" "}
            <span className="text-[10px] align-middle px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">EN VIVO</span>
          </a>
          <a href="#registro" className="text-sm font-bold px-4 py-2 rounded-lg text-[#0a1628]" style={{ backgroundColor: GOLD }}>
            Apartar mi lugar
          </a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-12 pb-6 md:pt-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          ◆ {TALLER.series} · {TALLER.format}
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
          {TALLER.title}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm md:text-base text-white/70">
          <span>📅 {TALLER.dateLabel}</span>
          <span>🕗 {TALLER.timeLabel}</span>
          <span>⏱ {TALLER.durationLabel}</span>
          <span>💻 Por Zoom · en español · gratis</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <section className="space-y-6">
          <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: `${GOLD}55`, background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)` }}>
            <p className="text-5xl md:text-6xl font-black tracking-tight">{TALLER.hook.number}</p>
            <p className="text-white/80 mt-3 leading-relaxed">{TALLER.hook.text}</p>
            <p className="text-white font-bold mt-4 leading-relaxed">
              El sábado le decimos qué le van a pedir, cómo dejar su contrato en regla con las reglas de 2026 y cómo cobrar el depósito con tarjeta antes de empezar. En 40 minutos, sin rodeos.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/45 mb-4">Con qué se va a ir</h2>
            <ol className="space-y-4">
              {TALLER.bullets.map((b, i) => (
                <li key={b.title} className="flex gap-4">
                  <span className="shrink-0 h-9 w-9 rounded-full border flex items-center justify-center font-black" style={{ color: GOLD, borderColor: `${GOLD}66` }}>{i + 1}</span>
                  <div>
                    <p className="font-bold text-white">{b.title}</p>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mt-1">{b.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/45 mb-2">Quién lo da</p>
            <p className="text-white/80 leading-relaxed">
              Lo da {TALLER.host}. No es una clase de leyes: es lo que a él le pidieron y cómo lo resolvió. Al final hay preguntas, y a quien quiera dejar su contrato y su enlace de cobro listos lo ayudamos ese mismo día.
            </p>
            <p className="text-white/60 text-sm mt-3">{TALLER.whoIsItFor}</p>
          </div>
        </section>

        <section id="registro" className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border border-white/10 bg-[#0A1222] p-6 md:p-7 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-extrabold">Aparte su lugar</h2>
            <p className="text-white/55 text-sm mt-1 mb-5">Es gratis. La invitación con el enlace de Zoom le llega al correo en segundos.</p>
            <TallerForm mode="public" />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-white/40 space-y-2">
          <p>{TALLER.disclaimer}</p>
          <p>
            © 2026 {TALLER.organizer} ·{" "}
            <a href={`mailto:${TALLER.contactEmail}`} className="underline hover:text-white/70">{TALLER.contactEmail}</a> · {TALLER.contactPhone}
          </p>
        </div>
      </footer>
    </div>
  );
}
