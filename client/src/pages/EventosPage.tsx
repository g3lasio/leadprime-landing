/**
 * EventosPage — EL PORTAL ÚNICO DE EVENTOS de Legacy Prime en
 * la landing (/eventos). Orden del dueño, 30-oct-2026.
 *
 * Una sola página pública: los eventos futuros SIEMPRE
 * disponibles con su registro (el selector sale de los datos
 * del backend de LeadPrime — enlaces reales del tour, sin
 * hardcodear ciudades), y conforme cada evento se ejecuta
 * queda asentado en el HISTORIAL público de abajo (ahí ya
 * viven el Networking de Fairfield del 2-jul y el Taller por
 * Zoom del 17-oct, con sus conteos reales).
 *
 * El registro es «sin puertas» como el de siempre (contacto
 * obligatorio, preguntas de perfil opcionales) y el website va
 * EXPLÍCITO: «¿Tu negocio tiene página web?» Sí (con URL) o
 * No. La sede se muestra según esté definida — nombre del
 * lugar, o «Sede por confirmar» — jamás inventada; la
 * dirección exacta llega solo en la confirmación y el pase,
 * como en todo el sistema. El registro cae en la MISMA tabla
 * única (legacy_prime_registros) vía la API de LeadPrime.
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

const GOLD = "#D4AF37";
const CYAN = "#00D4FF";

type EventoVista = {
  ciudad: string;
  etiqueta: string | null;
  fechaISO: string | null;
  tituloEvento: string | null;
  cupo: number;
  sedeDefinida: boolean;
  sedeNombre: string | null;
  registrados: number;
};

function fechaLarga(iso: string | null): string {
  if (!iso) return "Fecha por confirmar";
  return new Date(iso).toLocaleDateString("es-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-[#0d1830] px-3 py-2.5 text-[15px] text-white placeholder:text-white/35 outline-none focus:border-[#00D4FF]/70";
const labelCls = "block text-sm font-semibold text-white/85 mb-1.5";

export default function EventosPage() {
  const { data, isLoading, error } = trpc.legacy.eventos.useQuery();
  const [ciudadEvento, setCiudadEvento] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [compania, setCompania] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [webEstado, setWebEstado] = useState<"sin_declarar" | "tiene" | "no_tiene">("sin_declarar");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [conAcompanante, setConAcompanante] = useState(false);
  const [acompananteNombre, setAcompananteNombre] = useState("");
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [resultado, setResultado] = useState<any>(null);

  const proximos: EventoVista[] = (data?.proximos ?? []) as EventoVista[];
  const historial: any[] = data?.historial ?? [];
  const definicion: any = data?.definicion ?? {};
  const eventoSel = useMemo(
    () => proximos.find((e) => e.ciudad === ciudadEvento) ?? proximos[0] ?? null,
    [proximos, ciudadEvento],
  );

  const registrar = trpc.legacy.registrar.useMutation({
    onSuccess: (r) => {
      if (!r.ok) {
        setFaltantes(r.faltantes ?? []);
        return;
      }
      setFaltantes([]);
      setResultado(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (e) => setFaltantes([e.message || "No se pudo completar tu registro. Inténtalo de nuevo."]),
  });

  function enviar() {
    if (!eventoSel) return;
    // «Sí, tengo website» sin URL crearía un dato ambiguo en el
    // registro (el sistema lo leería como sin-website): se pide
    // la dirección aquí mismo, en la puerta.
    if (webEstado === "tiene" && !websiteUrl.trim()) {
      setFaltantes(["Pega la dirección de tu website, o elige «No tengo website»."]);
      return;
    }
    setFaltantes([]);
    registrar.mutate({
      ciudadEvento: eventoSel.ciudad,
      datos: {
        nombre,
        compania,
        ciudad: ciudad || eventoSel.ciudad,
        telefono,
        correo,
        websiteUrl: webEstado === "tiene" ? websiteUrl : "",
        sinWebsite: webEstado === "no_tiene",
        ...(webEstado !== "sin_declarar" ? { websiteDeclaracion: webEstado } : {}),
        acompananteNombre: conAcompanante ? acompananteNombre : "",
      },
      respuestas,
    });
  }

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
          <a href="/" className="text-sm text-white/60 hover:text-white transition-colors">
            Volver al inicio
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Encabezado */}
        <header className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Legacy Prime · Comunidad de contratistas inversionistas
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Eventos</h1>
          <p className="text-white/65 max-w-2xl mx-auto">
            Desayunos privados de la mesa Legacy Prime: 25 lugares por ciudad, solo con invitación.
            Elige tu evento y aparta tu asiento — y abajo queda el historial de lo que ya se vivió.
          </p>
        </header>

        {isLoading && <p className="text-center text-white/60">Cargando los eventos…</p>}
        {error && (
          <p className="text-center text-red-300">
            Los eventos no cargaron. Recarga la página en un momento.
          </p>
        )}

        {resultado ? (
          /* ── Confirmación (la sede completa vive aquí y en el pase) ── */
          <section className="rounded-2xl border border-white/10 bg-[#0A1222] p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-extrabold">{resultado.mensaje?.titulo}</h2>
            <p className="text-white/80 leading-relaxed">{resultado.mensaje?.cuerpo}</p>
            <p className="text-white/80">
              Tu evento: <strong>{resultado.evento?.ciudad}</strong> · {fechaLarga(resultado.evento?.fechaEvento)} · 9:00 AM
            </p>
            {resultado.sede ? (
              <div className="rounded-xl border p-4" style={{ borderColor: `${CYAN}66`, background: "#0d1830" }}>
                <p className="font-bold" style={{ color: CYAN }}>
                  📍 Tu sede — {resultado.evento?.ciudad}
                </p>
                {resultado.sede.nombre && <p className="text-white/85">{resultado.sede.nombre}</p>}
                {resultado.sede.direccion && <p className="text-white/85">{resultado.sede.direccion}</p>}
                {resultado.sede.indicaciones && <p className="text-white/60 text-sm">{resultado.sede.indicaciones}</p>}
              </div>
            ) : (
              <p className="text-white/60">
                La sede de tu evento se anunciará pronto: te llegará por correo en cuanto esté definida.
              </p>
            )}
            {resultado.salida === "califica_condicionado" && (
              <div className="rounded-xl border p-4" style={{ borderColor: `${GOLD}66`, background: "#0d1830" }}>
                <p className="text-white/85">
                  Tu website estará montado en tiempo récord, en menos de 24 horas, y tu asiento se
                  confirma en cuanto esté publicado.
                </p>
              </div>
            )}
            {resultado.paseUrl && (
              <a
                href={resultado.paseUrl}
                className="inline-block font-bold px-6 py-3 rounded-lg text-[#0a1628]"
                style={{ backgroundColor: GOLD }}
              >
                Ver mi pase →
              </a>
            )}
            <p className="text-white/55 text-sm">Revisa tu correo: ahí va el siguiente paso.</p>
          </section>
        ) : (
          <>
            {/* ── Próximos eventos (el selector) ─────────── */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold">1 · Elige tu evento</h2>
              {proximos.length === 0 && !isLoading && (
                <p className="text-white/60">Pronto anunciaremos las siguientes fechas.</p>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {proximos.map((e) => {
                  const activa = eventoSel?.ciudad === e.ciudad;
                  return (
                    <button
                      key={e.ciudad}
                      type="button"
                      onClick={() => {
                        setCiudadEvento(e.ciudad);
                        setCiudad(e.ciudad);
                        document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-left rounded-2xl border p-5 transition-all"
                      style={{
                        borderColor: activa ? GOLD : "rgba(255,255,255,0.12)",
                        background: activa ? `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)` : "#0A1222",
                      }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xl font-extrabold">{e.ciudad}</span>
                        <span className="text-xs font-bold text-white/55">{e.cupo} lugares</span>
                      </div>
                      <p className="text-white/70 mt-1">{e.etiqueta ?? fechaLarga(e.fechaISO)} · 9:00 AM</p>
                      <p className="text-sm mt-1" style={{ color: activa ? GOLD : "#9fb4cc" }}>
                        {e.sedeDefinida ? `📍 Sede: ${e.sedeNombre ?? "definida"}` : "📍 Sede por confirmar"}
                      </p>
                      <p className="text-xs text-white/45 mt-2">
                        {e.registrados > 0 ? `${e.registrados} registrados` : "Sé de los primeros en registrarte"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── El formulario único ────────────────────── */}
            <section id="registro" className="rounded-2xl border border-white/10 bg-[#0A1222] p-6 md:p-8 space-y-5">
              <h2 className="text-2xl font-extrabold">
                2 · Tu registro{eventoSel ? ` — ${eventoSel.ciudad}` : ""}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tu nombre *</label>
                  <input className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
                </div>
                <div>
                  <label className={labelCls}>Tu compañía *</label>
                  <input className={inputCls} value={compania} onChange={(e) => setCompania(e.target.value)} placeholder="Nombre de la compañía" />
                </div>
                <div>
                  <label className={labelCls}>Ciudad *</label>
                  <input className={inputCls} value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Tu ciudad" />
                </div>
                <div>
                  <label className={labelCls}>Teléfono *</label>
                  <input className={inputCls} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="(209) 555-0100" inputMode="tel" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Correo *</label>
                  <input className={inputCls} value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ahí llegan tu aprobación y tu pase" inputMode="email" autoCapitalize="none" />
                </div>
              </div>

              <div>
                <label className={labelCls}>¿Tu negocio tiene página web?</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWebEstado(webEstado === "tiene" ? "sin_declarar" : "tiene")}
                    className="px-4 py-2 rounded-full border text-sm font-semibold"
                    style={{
                      borderColor: webEstado === "tiene" ? CYAN : "rgba(255,255,255,0.25)",
                      background: webEstado === "tiene" ? CYAN : "transparent",
                      color: webEstado === "tiene" ? "#0a1628" : "#fff",
                    }}
                  >
                    Sí, tengo website
                  </button>
                  <button
                    type="button"
                    onClick={() => setWebEstado(webEstado === "no_tiene" ? "sin_declarar" : "no_tiene")}
                    className="px-4 py-2 rounded-full border text-sm font-semibold"
                    style={{
                      borderColor: webEstado === "no_tiene" ? CYAN : "rgba(255,255,255,0.25)",
                      background: webEstado === "no_tiene" ? CYAN : "transparent",
                      color: webEstado === "no_tiene" ? "#0a1628" : "#fff",
                    }}
                  >
                    No tengo website
                  </button>
                </div>
                {webEstado === "tiene" && (
                  <input
                    className={`${inputCls} mt-3`}
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://tucompania.com"
                    autoCapitalize="none"
                  />
                )}
                {webEstado === "no_tiene" && (
                  <p className="text-sm text-white/55 mt-2">
                    Estándar de la mesa: todos se ven profesionales. Te lo construimos antes del evento,
                    en menos de 24 horas.
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>¿Vienes acompañado? (un socio o pareja de confianza)</label>
                <div className="flex gap-2">
                  {["Sí", "No"].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setConAcompanante(op === "Sí")}
                      className="px-4 py-2 rounded-full border text-sm font-semibold"
                      style={{
                        borderColor: conAcompanante === (op === "Sí") ? CYAN : "rgba(255,255,255,0.25)",
                        background: conAcompanante === (op === "Sí") ? CYAN : "transparent",
                        color: conAcompanante === (op === "Sí") ? "#0a1628" : "#fff",
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
                {conAcompanante && (
                  <input
                    className={`${inputCls} mt-3`}
                    value={acompananteNombre}
                    onChange={(e) => setAcompananteNombre(e.target.value)}
                    placeholder="Nombre de tu acompañante"
                  />
                )}
              </div>

              {(definicion?.preguntas ?? []).length > 0 && (
                <div className="space-y-4 border-t border-white/10 pt-5">
                  <p className="text-white/60 text-sm">
                    Cinco preguntas de perfil — opcionales. Con tus datos de contacto tu asiento queda
                    apartado y recibes tu pase; el equipo revisa cada perfil personalmente.
                  </p>
                  {(definicion.preguntas as any[]).map((p) => (
                    <div key={p.clave}>
                      <label className={labelCls}>{p.etiqueta}</label>
                      <div className="flex flex-wrap gap-2">
                        {p.opciones.map((op: string) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setRespuestas((prev) => ({ ...prev, [p.clave]: op }))}
                            className="px-3.5 py-2 rounded-full border text-sm"
                            style={{
                              borderColor: respuestas[p.clave] === op ? CYAN : "rgba(255,255,255,0.25)",
                              background: respuestas[p.clave] === op ? CYAN : "transparent",
                              color: respuestas[p.clave] === op ? "#0a1628" : "#fff",
                              fontWeight: respuestas[p.clave] === op ? 700 : 400,
                            }}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {faltantes.length > 0 && (
                <div className="rounded-xl border border-red-900 bg-[#3B0A0A] p-4">
                  {faltantes.map((f) => (
                    <p key={f} className="text-red-200 text-sm">• {f}</p>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={enviar}
                disabled={registrar.isPending || !eventoSel}
                className="w-full font-extrabold px-6 py-3.5 rounded-lg text-[#0a1628] disabled:opacity-60"
                style={{ backgroundColor: GOLD }}
              >
                {registrar.isPending ? "Enviando…" : "Quiero mi asiento →"}
              </button>
              <p className="text-xs text-white/40 leading-relaxed">
                Legacy Prime es la comunidad de contratistas inversionistas de LeadPrime Network. Las
                cifras de los proyectos son proyecciones con comparables reales, no garantías de ganancia.
              </p>
            </section>
          </>
        )}

        {/* ── Historial público ────────────────────────── */}
        {historial.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold">Historial de eventos</h2>
            <p className="text-white/55">
              Cada evento que se ejecuta queda asentado aquí. Esto ya se vivió en la comunidad:
            </p>
            <div className="space-y-3">
              {historial.map((h: any, i: number) => (
                <article
                  key={`${h.nombre}-${i}`}
                  className="rounded-2xl border border-white/10 bg-[#0A1222] p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                >
                  <div className="flex-1">
                    <h3 className="font-extrabold text-lg">{h.nombre}</h3>
                    <p className="text-white/65 text-sm mt-0.5">
                      {h.fechaTexto} · {h.modalidad === "zoom" ? "💻 Zoom" : `📍 ${h.lugar}`}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black" style={{ color: GOLD }}>
                      {h.registrados}
                    </p>
                    <p className="text-xs text-white/50">
                      registrados{h.detalle ? ` · ${h.detalle}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center text-white/35 text-xs pb-4">
          Legacy Prime · LeadPrime Network — Más conexión. Más visión. Más crecimiento.
        </footer>
      </main>
    </div>
  );
}
