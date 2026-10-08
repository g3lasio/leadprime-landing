/**
 * /taller/equipo — formulario del equipo de llamadas para registrar a un
 * contratista mientras está en la línea. Requiere el PIN del equipo
 * (TALLER_TEAM_PIN o, si no existe, EVENTO_ADMIN_PIN). No se indexa.
 */
import { useEffect } from "react";
import TallerForm from "@/components/TallerForm";
import { TALLER } from "@shared/taller";

const GOLD = "#D4AF37";

export default function TallerEquipoPage() {
  useEffect(() => {
    document.title = "Registro del equipo · Taller 17 de octubre | LeadPrime";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
    document.documentElement.lang = "es";
  }, []);

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold tracking-tight">
            LeadPrime <span className="text-[10px] align-middle px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">EQUIPO</span>
          </span>
          <a href="/admin/taller" className="text-sm text-white/60 hover:text-white">Ver registrados →</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>◆ Registro en la llamada</p>
        <h1 className="text-2xl md:text-3xl font-extrabold">Taller del {TALLER.dateLabel}</h1>
        <p className="text-white/60 mt-2 text-sm md:text-base leading-relaxed">
          Llene esto mientras el contratista está en la línea. Al dar clic, la invitación con el enlace de Zoom le llega a su correo en segundos y usted sigue con la siguiente llamada. Deletree el correo de vuelta antes de enviar.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A1222] p-6 md:p-7">
          <TallerForm mode="team" />
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-5 text-sm text-white/55 space-y-2">
          <p className="font-bold text-white/80">Lo que debe decir el registro</p>
          <p>Nombre completo, teléfono de 10 dígitos y el correo deletreado de vuelta. Si no tiene correo, pregunte por el de un hijo o de su esposa que lo vea por él; sin correo no hay invitación.</p>
          <p>En la nota escriba lo que dijo en sus palabras: cuántos ayudantes tiene, si tiene workers' comp, cuánto le deben. Eso se usa el sábado.</p>
          <p>Después de registrarlo, en LeadPrime: Callback + nota «TALLER 17-oct · registrado».</p>
        </div>
      </main>
    </div>
  );
}
