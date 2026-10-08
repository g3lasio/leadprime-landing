/**
 * Formulario de registro al taller virtual del 17 de octubre.
 * mode="public": lo llena el contratista. mode="team": lo llena el equipo de
 * llamadas durante la llamada (PIN del equipo + quién registra + preferencia).
 */
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { TALLER, TALLER_TEAM_MEMBERS, TALLER_TRADES } from "@shared/taller";

const GOLD = "#D4AF37";
const PIN_KEY = "taller_team_pin";
const AGENT_KEY = "taller_team_agent";

type Props = {
  mode: "public" | "team";
  onSuccess?: (result: RegisterResult) => void;
};

export type RegisterResult = {
  success: boolean;
  alreadyRegistered: boolean;
  code: string;
  email: string;
  inviteSent: boolean;
  zoomUrl: string;
};

const inputCls =
  "w-full rounded-xl bg-white/[0.06] border border-white/15 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#D4AF37]/70 focus:ring-2 focus:ring-[#D4AF37]/20 text-base";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-white/55 mb-1.5";

function readAttribution() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const pick = (k: string) => p.get(k) || undefined;
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    gclid: pick("gclid"),
    referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
  };
}

export default function TallerForm({ mode, onSuccess }: Props) {
  const isTeam = mode === "team";
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(true);
  const [channelPref, setChannelPref] = useState<"email" | "sms" | "both">("email");
  const [agent, setAgent] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const attribution = useMemo(readAttribution, []);

  useEffect(() => {
    if (!isTeam) return;
    try {
      setPin(localStorage.getItem(PIN_KEY) ?? "");
      setAgent(localStorage.getItem(AGENT_KEY) ?? "");
    } catch {
      /* sin almacenamiento */
    }
  }, [isTeam]);

  const register = trpc.taller.register.useMutation({
    onSuccess: data => {
      setError(null);
      setResult(data as RegisterResult);
      if (isTeam) {
        try {
          localStorage.setItem(PIN_KEY, pin);
          localStorage.setItem(AGENT_KEY, agent);
        } catch {
          /* sin almacenamiento */
        }
      }
      onSuccess?.(data as RegisterResult);
    },
    onError: e => setError(e.message || "No se pudo registrar. Intente de nuevo."),
  });

  const reset = () => {
    setFullName("");
    setBusiness("");
    setPhone("");
    setEmail("");
    setTrade("");
    setCity("");
    setNote("");
    setChannelPref("email");
    setConsent(true);
    setResult(null);
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) return setError("Escriba el nombre del contratista.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Escriba un teléfono de 10 dígitos.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Escriba un correo válido (ahí llega la invitación).");
    if (!consent) return setError("Marque la casilla de permiso para mandar la invitación.");
    if (isTeam && !agent) return setError("Elija quién registra.");
    if (isTeam && pin.trim().length < 4) return setError("Escriba el PIN del equipo.");
    register.mutate({
      full_name: fullName.trim(),
      business_name: business.trim() || null,
      phone: phone.trim(),
      email: email.trim(),
      trade: trade || null,
      city: city.trim() || null,
      note: note.trim() || null,
      consent_contact: consent,
      channel_pref: isTeam ? channelPref : "email",
      registered_by: isTeam ? agent : "web",
      teamPin: isTeam ? pin.trim() : undefined,
      ...attribution,
    });
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/[0.07] p-6 md:p-8 text-center">
        <p className="text-4xl mb-2">✅</p>
        <h3 className="text-2xl font-extrabold text-white">
          {result.alreadyRegistered ? "Ya estaba registrado" : "Lugar apartado"}
        </h3>
        <p className="text-white/70 mt-2 leading-relaxed">
          {result.inviteSent
            ? <>La invitación con el enlace de Zoom {result.alreadyRegistered ? "se volvió a mandar" : "ya salió"} a <strong className="text-white">{result.email}</strong>. Si no la ve en 2 minutos, revise la carpeta de spam o promociones.</>
            : <>El registro quedó guardado, pero el correo no salió todavía (lo reintentamos). Guarde este enlace de Zoom: </>}
        </p>
        {!result.inviteSent && (
          <a href={result.zoomUrl} className="block mt-3 break-all underline" style={{ color: GOLD }}>{result.zoomUrl}</a>
        )}
        <div className="mt-5 rounded-xl bg-black/30 border border-white/10 p-4 text-left text-sm text-white/70 space-y-1">
          <p><span className="text-white/45">Cuándo:</span> <strong className="text-white">{TALLER.dateLabel}, {TALLER.timeLabel}</strong> · {TALLER.durationLabel}</p>
          <p><span className="text-white/45">Dónde:</span> por Zoom · ID {TALLER.meetingId} · passcode {TALLER.passcode}</p>
          <p><span className="text-white/45">Código de asistente:</span> <strong style={{ color: GOLD }}>{result.code}</strong></p>
        </div>
        {isTeam ? (
          <button type="button" onClick={reset} className="mt-6 w-full rounded-xl py-3.5 font-extrabold text-[#0a1628]" style={{ backgroundColor: GOLD }}>
            Registrar al siguiente →
          </button>
        ) : (
          <a href={result.zoomUrl} className="inline-block mt-6 rounded-xl px-6 py-3.5 font-extrabold text-[#0a1628]" style={{ backgroundColor: GOLD }}>
            Guardar mi enlace de Zoom →
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {isTeam && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-dashed border-white/20 p-4 bg-white/[0.03]">
          <div>
            <label className={labelCls} htmlFor="t-agent">Quién registra</label>
            <select id="t-agent" className={inputCls} value={agent} onChange={e => setAgent(e.target.value)}>
              <option value="">Elegir…</option>
              {TALLER_TEAM_MEMBERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="t-pin">PIN del equipo</label>
            <input id="t-pin" className={inputCls} type="password" inputMode="numeric" autoComplete="off" value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="t-name">Nombre del contratista *</label>
          <input id="t-name" className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="t-biz">Nombre del negocio</label>
          <input id="t-biz" className={inputCls} value={business} onChange={e => setBusiness(e.target.value)} placeholder="Ej. García Concrete" autoComplete="organization" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="t-phone">Teléfono (celular) *</label>
          <input id="t-phone" className={inputCls} type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(707) 000-0000" autoComplete="tel" />
        </div>
        <div>
          <label className={labelCls} htmlFor="t-email">Correo (ahí llega la invitación) *</label>
          <input id="t-email" className={inputCls} type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@gmail.com" autoComplete="email" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="t-trade">Oficio</label>
          <select id="t-trade" className={inputCls} value={trade} onChange={e => setTrade(e.target.value)}>
            <option value="">Elegir…</option>
            {TALLER_TRADES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="t-city">Ciudad</label>
          <input id="t-city" className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="Ej. Fairfield" autoComplete="address-level2" />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="t-note">{isTeam ? "Nota de la llamada (lo que dijo, en sus palabras)" : "¿Qué le gustaría resolver en el taller? (opcional)"}</label>
        <textarea id="t-note" className={inputCls + " min-h-[88px]"} value={note} onChange={e => setNote(e.target.value)} maxLength={600} placeholder={isTeam ? "Ej. Tiene 3 ayudantes, nunca ha tenido workers' comp, le deben $8,000 de un trabajo" : "Ej. Quiero saber si mi contrato cumple y cómo cobrar el depósito con tarjeta"} />
      </div>

      {isTeam && (
        <div>
          <p className={labelCls}>¿Cómo quiere recibir la invitación?</p>
          <div className="flex flex-wrap gap-2">
            {([
              ["email", "Correo"],
              ["sms", "Mensaje de texto"],
              ["both", "Correo y texto"],
            ] as const).map(([v, l]) => (
              <button type="button" key={v} onClick={() => setChannelPref(v)} className={`px-4 py-2 rounded-full border text-sm font-bold transition-colors ${channelPref === v ? "border-[#D4AF37] text-[#0a1628]" : "border-white/20 text-white/70 hover:border-white/40"}`} style={channelPref === v ? { backgroundColor: GOLD } : undefined}>
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-2">El correo sale al instante. El mensaje de texto lo manda LeadPrime en la tarde, solo a quien lo pidió.</p>
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-white/65 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#D4AF37]" />
        <span>
          {isTeam
            ? "El contratista aceptó recibir la invitación y los recordatorios del taller por correo (y por texto si lo pidió)."
            : "Acepto recibir por correo la invitación y los recordatorios del taller. Puedo darme de baja cuando quiera."}
        </span>
      </label>

      {error && (
        <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      <button type="submit" disabled={register.isPending} className="w-full rounded-xl py-4 text-base font-extrabold text-[#0a1628] disabled:opacity-60" style={{ backgroundColor: GOLD }}>
        {register.isPending ? "Enviando la invitación…" : isTeam ? "Registrar y mandar la invitación →" : "Apartar mi lugar gratis →"}
      </button>
      <p className="text-center text-xs text-white/40">{TALLER.disclaimer}</p>
    </form>
  );
}
