/**
 * AdminRegistradosPage — LA TABLA DEL DUEÑO en la landing
 * (/admin/registrados), protegida con el PIN de admin de
 * siempre (el mismo gate de /admin/evento: EVENTO_ADMIN_PIN).
 * Orden del dueño, 30-oct-2026.
 *
 * UNA sola tabla con TODOS los registrados de Legacy Prime —
 * la misma legacy_prime_registros que alimenta la app — con
 * filtros por EVENTO y por CIUDAD, buscador, y la columna de
 * WEBSITE al frente: quién tiene (con su enlace), quién NO
 * tiene (él lo declaró o su fila nació por la vía sin-website)
 * y quién está «por verificar» porque no consta nada — jamás
 * se afirma que alguien no tiene website sin que conste.
 * El conteo «X registrados · Y sin website» acompaña al filtro:
 * la lista de trabajo para construirles su sitio en 24 h.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Registro = {
  id: string;
  nombre: string;
  compania: string;
  ciudad: string | null;
  ciudadEvento: string | null;
  eventoOrigen: string | null;
  eventoCambiadoAt: string | null;
  telefono: string | null;
  correo: string | null;
  websiteUrl: string | null;
  websiteEstado: "tiene" | "sin_website" | "por_verificar";
  websiteBase: "url" | "texto" | "registro" | "sin_dato";
  websiteUrlValida: string | null;
  salida: string;
  estado: string;
  /** 'agente' | 'agente_recuperado' | 'agente_barrido'; null = formulario/equipo. */
  registradoPor: string | null;
  enlaceTitulo: string | null;
  createdAt: string;
};

const TEXTO_BASE: Record<Registro["websiteBase"], string> = {
  url: "URL registrada",
  texto: "él declaró «no»",
  registro: "registrado sin website",
  sin_dato: "sin dato",
};

function digitos(tel: string | null): string {
  const d = (tel ?? "").replace(/\D/g, "");
  return d.length === 10 ? `1${d}` : d;
}

export default function AdminRegistradosPage() {
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [search, setSearch] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("todos");
  const [filtroCiudad, setFiltroCiudad] = useState("todas");
  const [soloSinWebsite, setSoloSinWebsite] = useState(false);
  const [asentandoId, setAsentandoId] = useState<string | null>(null);
  const [urlNueva, setUrlNueva] = useState("");

  const { data, isLoading, error, refetch } = trpc.legacy.adminRegistros.useQuery(
    { pin: enteredPin },
    { enabled: enteredPin.length === 4, retry: false },
  );

  const asentar = trpc.legacy.adminAsentarWebsite.useMutation({
    onSuccess: () => {
      toast.success("Website asentado");
      setAsentandoId(null);
      setUrlNueva("");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const registros: Registro[] = (data?.registros ?? []) as Registro[];
  const eventos = useMemo(
    () => Array.from(new Set(registros.map((r) => r.ciudadEvento).filter((x): x is string => !!x))),
    [registros],
  );
  const ciudades = useMemo(
    () => Array.from(new Set(registros.map((r) => r.ciudad).filter((x): x is string => !!x))),
    [registros],
  );

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registros.filter((r) => {
      if (filtroEvento !== "todos" && r.ciudadEvento !== filtroEvento) return false;
      if (filtroCiudad !== "todas" && r.ciudad !== filtroCiudad) return false;
      if (soloSinWebsite && r.websiteEstado !== "sin_website") return false;
      if (q) {
        const todo = `${r.nombre} ${r.compania} ${r.telefono ?? ""} ${r.correo ?? ""}`.toLowerCase();
        if (!todo.includes(q)) return false;
      }
      return true;
    });
  }, [registros, search, filtroEvento, filtroCiudad, soloSinWebsite]);

  const sinWebsiteFiltrados = filtrados.filter((r) => r.websiteEstado === "sin_website").length;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnteredPin(pin);
  };

  // PIN gate — el mismo de siempre.
  if (!enteredPin || (error && error.message === "PIN incorrecto")) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Registrados
            </h1>
            <p className="text-white/40 text-sm mt-2">Legacy Prime · Todos los eventos</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">PIN de acceso (4 dígitos)</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            {error && error.message === "PIN incorrecto" && (
              <p className="text-red-400 text-sm text-center">PIN incorrecto. Intenta de nuevo.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-[#080C14]"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F5E6A3)" }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="text-white/50 text-sm">Cargando registros...</div>
      </div>
    );
  }

  const selectCls =
    "px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 [&>option]:text-black";

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Registrados — Legacy Prime
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Todos los eventos, una sola tabla · {data?.totales.total ?? 0} en total ·{" "}
              {data?.totales.tiene ?? 0} con website · {data?.totales.sinWebsite ?? 0} sin website ·{" "}
              {data?.totales.porVerificar ?? 0} por verificar
            </p>
          </div>
          <p className="text-lg font-bold" style={{ color: "#D4AF37" }}>
            {filtrados.length} registrados · {sinWebsiteFiltrados} sin website
          </p>
        </header>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, negocio, teléfono o correo…"
            className="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <select value={filtroEvento} onChange={(e) => setFiltroEvento(e.target.value)} className={selectCls}>
            <option value="todos">Evento: todos</option>
            {eventos.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
          <select value={filtroCiudad} onChange={(e) => setFiltroCiudad(e.target.value)} className={selectCls}>
            <option value="todas">Ciudad: todas</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSoloSinWebsite((v) => !v)}
            className="px-3 py-2 rounded-lg border text-sm font-semibold"
            style={{
              borderColor: soloSinWebsite ? "#D4AF37" : "rgba(255,255,255,0.12)",
              background: soloSinWebsite ? "#D4AF37" : "transparent",
              color: soloSinWebsite ? "#080C14" : "#fff",
            }}
          >
            Solo sin website
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10"
          >
            ↻ Actualizar
          </button>
        </div>

        {/* La tabla única */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm min-w-[980px]">
            <thead>
              <tr className="bg-white/5 text-left text-white/60">
                <th className="px-3 py-2.5 font-semibold">Nombre</th>
                <th className="px-3 py-2.5 font-semibold">Teléfono</th>
                <th className="px-3 py-2.5 font-semibold">Correo</th>
                <th className="px-3 py-2.5 font-semibold">Ciudad</th>
                <th className="px-3 py-2.5 font-semibold">Evento</th>
                <th className="px-3 py-2.5 font-semibold">Website</th>
                <th className="px-3 py-2.5 font-semibold">Estado</th>
                <th className="px-3 py-2.5 font-semibold">Contacto</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => (
                <tr key={r.id} className="border-t border-white/8 hover:bg-white/[0.03] align-top">
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-white">{r.nombre}</p>
                    <p className="text-white/50 text-xs">{r.compania}</p>
                    {r.registradoPor && (
                      <p className="text-[#00D4FF]/80 text-xs">
                        {r.registradoPor === "agente_recuperado"
                          ? "🤖 agente — recuperado de transcripción"
                          : r.registradoPor === "agente_barrido"
                            ? "🤖 agente — barrido post-llamada"
                            : "🤖 registrado por el agente"}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{r.telefono ?? "—"}</td>
                  <td className="px-3 py-2.5">{r.correo ?? "—"}</td>
                  <td className="px-3 py-2.5">{r.ciudad ?? "—"}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold">{r.ciudadEvento ?? "—"}</p>
                    {r.eventoOrigen && r.eventoOrigen !== r.ciudadEvento && (
                      <p className="text-white/50 text-xs">vino de {r.eventoOrigen}</p>
                    )}
                    {r.eventoCambiadoAt && (
                      <p className="text-amber-300/80 text-xs">cambió de evento</p>
                    )}
                    {r.enlaceTitulo && <p className="text-white/35 text-xs">{r.enlaceTitulo}</p>}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.websiteEstado === "tiene" && r.websiteUrlValida ? (
                      <>
                        <a
                          href={r.websiteUrlValida}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00D4FF] underline break-all"
                        >
                          {r.websiteUrlValida.replace(/^https?:\/\//, "")}
                        </a>
                        <p className="text-white/40 text-xs">{TEXTO_BASE[r.websiteBase]}</p>
                      </>
                    ) : r.websiteEstado === "tiene" ? (
                      <>
                        <span className="text-emerald-300 font-semibold">Tiene website</span>
                        <p className="text-white/40 text-xs">sin URL asentada</p>
                      </>
                    ) : r.websiteEstado === "sin_website" ? (
                      <>
                        <span className="inline-block px-2 py-0.5 rounded bg-red-500/15 text-red-300 font-bold text-xs">
                          SIN WEBSITE
                        </span>
                        <p className="text-white/40 text-xs mt-1">{TEXTO_BASE[r.websiteBase]}</p>
                        {asentandoId === r.id ? (
                          <span className="flex gap-1.5 mt-1.5">
                            <input
                              value={urlNueva}
                              onChange={(e) => setUrlNueva(e.target.value)}
                              placeholder="https://su-sitio.com"
                              className="px-2 py-1 rounded bg-white/5 border border-white/15 text-xs w-44 focus:outline-none"
                            />
                            <button
                              type="button"
                              disabled={asentar.isPending || !urlNueva.trim()}
                              onClick={() =>
                                asentar.mutate({ pin: enteredPin, id: r.id, websiteUrl: urlNueva.trim() })
                              }
                              className="px-2 py-1 rounded bg-[#D4AF37] text-[#080C14] text-xs font-bold disabled:opacity-50"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setAsentandoId(null)}
                              className="px-2 py-1 rounded bg-white/10 text-xs"
                            >
                              ✕
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAsentandoId(r.id);
                              setUrlNueva("");
                            }}
                            className="block mt-1.5 text-xs text-[#D4AF37] underline"
                          >
                            Asentar website construido
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-white/60 font-semibold text-xs">
                          Por verificar
                        </span>
                        <p className="text-white/40 text-xs mt-1">{TEXTO_BASE[r.websiteBase]}</p>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className={r.estado === "confirmado" ? "text-emerald-300 font-semibold" : "text-amber-200 font-semibold"}>
                      {r.estado === "confirmado" ? "✅ Confirmado" : "⏳ Pendiente"}
                    </p>
                    <p className="text-white/45 text-xs">
                      {r.salida === "califica_condicionado"
                        ? "condicionado (website)"
                        : r.salida === "califica"
                          ? "califica"
                          : r.salida}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {r.telefono ? (
                      <span className="flex gap-2 text-base">
                        <a href={`tel:${digitos(r.telefono)}`} title="Llamar">📞</a>
                        <a href={`sms:${digitos(r.telefono)}`} title="SMS">💬</a>
                        <a
                          href={`https://wa.me/${digitos(r.telefono)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp"
                        >
                          🟢
                        </a>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-white/45">
                    Sin registros con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-white/35 text-xs">
          La misma tabla única de registrados de Legacy Prime (la de la app): lo que se asienta aquí se
          ve allá, y viceversa. Las filas de los enlaces marcados «QA — NO USAR» son pruebas del equipo.
        </p>
      </div>
    </div>
  );
}
