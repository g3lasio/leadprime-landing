/**
 * /admin/taller — lista de registrados al taller del 17 de octubre (PIN).
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TALLER } from "@shared/taller";

const GOLD = "#D4AF37";
const PIN_KEY = "taller_team_pin";

type Reg = {
  id: number;
  full_name: string;
  business_name: string | null;
  phone: string;
  email: string;
  trade: string | null;
  city: string | null;
  note: string | null;
  registered_by: string;
  channel_pref: string;
  consent_contact: boolean;
  attendee_code: string;
  status: string;
  invite_sent_at: string | null;
  invite_error: string | null;
  reminder1_sent_at: string | null;
  reminder2_sent_at: string | null;
  created_at: string;
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-US", { timeZone: TALLER.timezone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function downloadCSV(rows: Reg[]) {
  const headers = ["Nombre", "Negocio", "Teléfono", "Correo", "Oficio", "Ciudad", "Nota", "Registró", "Prefiere", "Código", "Estado", "Invitación", "Recordatorio vie", "Recordatorio sáb", "Fecha registro"];
  const data = rows.map(r => [
    r.full_name, r.business_name ?? "", r.phone, r.email, r.trade ?? "", r.city ?? "", r.note ?? "", r.registered_by, r.channel_pref, r.attendee_code, r.status,
    r.invite_sent_at ? fmt(r.invite_sent_at) : r.invite_error ? `ERROR: ${r.invite_error}` : "", fmt(r.reminder1_sent_at), fmt(r.reminder2_sent_at), fmt(r.created_at),
  ]);
  const csv = [headers, ...data].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taller-17oct-registrados-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminTallerPage() {
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Registrados · Taller 17 de octubre | LeadPrime";
    try {
      const saved = localStorage.getItem(PIN_KEY) ?? "";
      if (saved) {
        setPin(saved);
        setEnteredPin(saved);
      }
    } catch {
      /* sin almacenamiento */
    }
  }, []);

  const { data, isLoading, error, refetch } = trpc.taller.adminList.useQuery(
    { pin: enteredPin },
    { enabled: enteredPin.length >= 4, retry: false }
  );
  const resend = trpc.taller.adminResend.useMutation({
    onSuccess: () => { toast.success("Invitación reenviada"); refetch(); },
    onError: e => toast.error(e.message),
  });
  const updateStatus = trpc.taller.adminUpdateStatus.useMutation({
    onSuccess: () => { toast.success("Estado actualizado"); refetch(); },
    onError: e => toast.error(e.message),
  });
  const del = trpc.taller.adminDelete.useMutation({
    onSuccess: () => { toast.success("Registro borrado"); refetch(); },
    onError: e => toast.error(e.message),
  });
  const runReminders = trpc.taller.adminRunReminders.useMutation({
    onSuccess: r => { toast.success(`Recordatorios: viernes ${r.r1}, sábado ${r.r2}`); refetch(); },
    onError: e => toast.error(e.message),
  });

  const rows = (data?.registrations ?? []) as Reg[];
  const q = search.trim().toLowerCase();
  const filtered = q
    ? rows.filter(r => [r.full_name, r.business_name, r.email, r.phone, r.city, r.trade, r.registered_by, r.note].some(v => (v ?? "").toLowerCase().includes(q)))
    : rows;

  if (enteredPin.length < 4 || error) {
    return (
      <div className="min-h-screen bg-[#050B18] text-white flex items-center justify-center px-6">
        <form
          onSubmit={e => { e.preventDefault(); setEnteredPin(pin); try { localStorage.setItem(PIN_KEY, pin); } catch { /* sin almacenamiento */ } }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0A1222] p-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>◆ Taller 17 de octubre</p>
          <h1 className="text-xl font-extrabold">Registrados</h1>
          {error && <p className="mt-3 text-sm text-red-300">{error.message}</p>}
          <input type="password" inputMode="numeric" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN del equipo" className="mt-4 w-full rounded-xl bg-white/[0.06] border border-white/15 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none" autoFocus />
          <button type="submit" className="mt-4 w-full rounded-xl py-3 font-extrabold text-[#0a1628]" style={{ backgroundColor: GOLD }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <span className="font-bold">Taller del {TALLER.dateLabel} · registrados</span>
          <div className="flex gap-2">
            <a href="/taller/equipo" className="text-sm px-3 py-2 rounded-lg border border-white/20 hover:border-white/40">+ Registrar</a>
            <button onClick={() => downloadCSV(filtered)} className="text-sm px-3 py-2 rounded-lg font-bold text-[#0a1628]" style={{ backgroundColor: GOLD }}>CSV</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <p className="text-white/50">Cargando…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Stat label="Registrados" value={data?.total ?? 0} />
              <Stat label="Hoy" value={data?.today ?? 0} />
              <Stat label="Por el equipo" value={Object.entries(data?.byRegisteredBy ?? {}).filter(([k]) => k !== "web").reduce((a, [, v]) => a + (v as number), 0)} />
              <Stat label="Invitaciones con error" value={data?.invitesFailed ?? 0} warn={(data?.invitesFailed ?? 0) > 0} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/50 mb-4">
              {Object.entries(data?.byRegisteredBy ?? {}).map(([k, v]) => (
                <span key={k} className="px-2 py-1 rounded-full border border-white/10">{k}: {v as number}</span>
              ))}
              {Object.entries(data?.byTrade ?? {}).map(([k, v]) => (
                <span key={k} className="px-2 py-1 rounded-full border border-white/10">{k}: {v as number}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, correo, teléfono, ciudad…" className="flex-1 min-w-[220px] rounded-xl bg-white/[0.06] border border-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none" />
              <button onClick={() => runReminders.mutate({ pin: enteredPin })} className="text-xs px-3 py-2 rounded-lg border border-white/20 hover:border-white/40" title="Manda los recordatorios que ya tocan (viernes 9 am / sábado 7:15 am PT)">Correr recordatorios</button>
              <button onClick={() => refetch()} className="text-xs px-3 py-2 rounded-lg border border-white/20 hover:border-white/40">Actualizar</button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.04] text-white/50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-3">Contratista</th>
                    <th className="text-left p-3">Contacto</th>
                    <th className="text-left p-3">Oficio · Ciudad</th>
                    <th className="text-left p-3">Nota</th>
                    <th className="text-left p-3">Registró</th>
                    <th className="text-left p-3">Invitación</th>
                    <th className="text-left p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-t border-white/[0.06] align-top ${r.status !== "registered" ? "opacity-50" : ""}`}>
                      <td className="p-3">
                        <p className="font-bold">{r.full_name}</p>
                        <p className="text-white/50 text-xs">{r.business_name ?? ""}</p>
                        <p className="text-white/35 text-xs">{fmt(r.created_at)} · {r.attendee_code}{r.status !== "registered" ? ` · ${r.status}` : ""}</p>
                      </td>
                      <td className="p-3">
                        <p>{r.phone}</p>
                        <p className="text-white/60 text-xs break-all">{r.email}</p>
                        <p className="text-white/35 text-xs">{r.channel_pref === "email" ? "correo" : r.channel_pref === "sms" ? "texto" : "correo y texto"}</p>
                      </td>
                      <td className="p-3 text-white/70">{r.trade ?? "—"}<br /><span className="text-white/45 text-xs">{r.city ?? ""}</span></td>
                      <td className="p-3 text-white/60 text-xs max-w-[260px] whitespace-pre-wrap">{r.note ?? "—"}</td>
                      <td className="p-3 text-white/70">{r.registered_by}</td>
                      <td className="p-3 text-xs">
                        {r.invite_sent_at ? <span className="text-emerald-300">✓ {fmt(r.invite_sent_at)}</span> : <span className="text-red-300">✗ {r.invite_error ?? "sin enviar"}</span>}
                        <br /><span className="text-white/35">vie {r.reminder1_sent_at ? "✓" : "—"} · sáb {r.reminder2_sent_at ? "✓" : "—"}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <button onClick={() => resend.mutate({ pin: enteredPin, id: r.id })} className="px-2 py-1 rounded border border-white/20 hover:border-white/40 text-left">Reenviar invitación</button>
                          {r.status === "registered" ? (
                            <button onClick={() => updateStatus.mutate({ pin: enteredPin, id: r.id, status: "cancelled" })} className="px-2 py-1 rounded border border-white/20 hover:border-white/40 text-left">Cancelar</button>
                          ) : (
                            <button onClick={() => updateStatus.mutate({ pin: enteredPin, id: r.id, status: "registered" })} className="px-2 py-1 rounded border border-white/20 hover:border-white/40 text-left">Reactivar</button>
                          )}
                          <button onClick={() => { if (window.confirm(`¿Borrar a ${r.full_name}? Solo para pruebas.`)) del.mutate({ pin: enteredPin, id: r.id }); }} className="px-2 py-1 rounded border border-red-400/30 text-red-300 hover:border-red-400/60 text-left">Borrar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-white/40">Todavía no hay registros.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className="text-3xl font-black mt-1" style={{ color: warn ? "#F87171" : GOLD }}>{value}</p>
    </div>
  );
}
