import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Registration = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  city: string;
  preferred_language: string;
  business_name: string | null;
  trade_types: string | null;
  years_in_business: string | null;
  team_size: string | null;
  units_managed: string | null;
  brokerage_name: string | null;
  referral_source: string;
  referral_name: string | null;
  dietary_restriction: string;
  consent_contact: boolean;
  consent_photo: boolean;
  attendee_code: string;
  is_early_bird: boolean;
  status: string;
  created_at: string;
};

const ROLE_COLORS: Record<string, string> = {
  Contratista: "#D4AF37",
  "Property Manager": "#00D4FF",
  Realtor: "#A78BFA",
  "Otro profesional de la industria": "#6EE7B7",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#22C55E",
  cancelled: "#EF4444",
  attended: "#D4AF37",
};

function downloadCSV(registrations: Registration[]) {
  const headers = [
    "Código", "Nombre", "Email", "Teléfono", "Rol", "Ciudad", "Idioma",
    "Negocio", "Tipo de trabajo", "Años en negocio", "Equipo",
    "Unidades", "Brokerage", "Referido por", "Nombre referido",
    "Dieta", "Foto OK", "Early Bird", "Estado", "Fecha registro"
  ];

  const rows = registrations.map((r) => [
    r.attendee_code, r.full_name, r.email, r.phone, r.role, r.city, r.preferred_language,
    r.business_name ?? "", r.trade_types ?? "", r.years_in_business ?? "", r.team_size ?? "",
    r.units_managed ?? "", r.brokerage_name ?? "", r.referral_source, r.referral_name ?? "",
    r.dietary_restriction, r.consent_photo ? "Sí" : "No",
    r.is_early_bird ? "Sí" : "No", r.status,
    new Date(r.created_at).toLocaleString("es-US"),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noche-chyrris-registros-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminEventoPage() {
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const { data, isLoading, error, refetch } = trpc.evento.adminList.useQuery(
    { pin: enteredPin },
    { enabled: enteredPin.length === 4, retry: false }
  );

  const updateStatus = trpc.evento.adminUpdateStatus.useMutation({
    onSuccess: () => {
      toast.success("Estado actualizado");
      refetch();
      setSelectedReg(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnteredPin(pin);
  };

  // PIN gate
  if (!enteredPin || (error && error.message === "PIN incorrecto")) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-black text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-2">La Noche Chyrris</p>
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

  if (!data) return null;

  const filtered = data.registrations.filter((r: Registration) => {
    const matchSearch =
      !search ||
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.attendee_code.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || r.role === filterRole;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Admin — La Noche Chyrris
            </h1>
            <p className="text-white/40 text-sm">{data.total} registros totales</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => downloadCSV(data.registrations)}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            >
              ⬇ Exportar CSV
            </button>
            <button
              onClick={() => { setEnteredPin(""); setPin(""); }}
              className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs">Total</p>
            <p className="text-3xl font-black text-white mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.total}
            </p>
            <p className="text-white/30 text-xs">de 50 cupos</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs">Early Birds</p>
            <p className="text-3xl font-black text-[#D4AF37] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.earlyBird}
            </p>
            <p className="text-white/30 text-xs">de 20 cupos</p>
          </div>
          {Object.entries(data.byRole as Record<string, number>).slice(0, 2).map(([role, count]) => (
            <div key={role} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-xs truncate">{role}</p>
              <p
                className="text-3xl font-black mt-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: ROLE_COLORS[role] || "#fff" }}
              >
                {count as number}
              </p>
            </div>
          ))}
        </div>

        {/* Role breakdown */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(data.byRole as Record<string, number>).map(([role, count]) => (
            <span
              key={role}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                borderColor: `${ROLE_COLORS[role] || "#fff"}40`,
                color: ROLE_COLORS[role] || "#fff",
                background: `${ROLE_COLORS[role] || "#fff"}15`,
              }}
            >
              {role}: {count as number}
            </span>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o código..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#0D1220] border border-white/10 text-white text-sm focus:outline-none"
          >
            <option value="all">Todos los roles</option>
            <option>Contratista</option>
            <option>Property Manager</option>
            <option>Realtor</option>
            <option>Otro profesional de la industria</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#0D1220] border border-white/10 text-white text-sm focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmados</option>
            <option value="cancelled">Cancelados</option>
            <option value="attended">Asistieron</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Código</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Rol</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Ciudad</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Referido</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-white/30">
                      No hay registros que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  filtered.map((r: Registration) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setSelectedReg(r)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-[#D4AF37] text-xs">{r.attendee_code}</span>
                        {r.is_early_bird && (
                          <span className="ml-1 text-xs">🏆</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{r.full_name}</td>
                      <td className="px-4 py-3 text-white/60 hidden sm:table-cell">{r.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            color: ROLE_COLORS[r.role] || "#fff",
                            background: `${ROLE_COLORS[r.role] || "#fff"}15`,
                          }}
                        >
                          {r.role.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{r.city}</td>
                      <td className="px-4 py-3 text-white/60 hidden lg:table-cell text-xs">{r.referral_source}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            color: STATUS_COLORS[r.status] || "#fff",
                            background: `${STATUS_COLORS[r.status] || "#fff"}15`,
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {r.status !== "attended" && (
                            <button
                              onClick={() => updateStatus.mutate({ pin: enteredPin, id: r.id, status: "attended" })}
                              className="px-2 py-1 rounded text-xs bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors"
                              title="Marcar como asistió"
                            >
                              ✓
                            </button>
                          )}
                          {r.status !== "cancelled" && (
                            <button
                              onClick={() => updateStatus.mutate({ pin: enteredPin, id: r.id, status: "cancelled" })}
                              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-white/20 text-xs mt-4 text-center">
          {filtered.length} de {data.total} registros · Haz click en una fila para ver detalles completos
        </p>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-[#0D1220] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {selectedReg.full_name}
                </h3>
                <p className="text-[#D4AF37] font-mono text-sm">{selectedReg.attendee_code}</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                ["Email", selectedReg.email],
                ["Teléfono", selectedReg.phone],
                ["Rol", selectedReg.role],
                ["Ciudad", selectedReg.city],
                ["Idioma", selectedReg.preferred_language],
                selectedReg.business_name && ["Negocio", selectedReg.business_name],
                selectedReg.trade_types && ["Tipo de trabajo", selectedReg.trade_types],
                selectedReg.years_in_business && ["Años en negocio", selectedReg.years_in_business],
                selectedReg.team_size && ["Equipo", selectedReg.team_size],
                selectedReg.units_managed && ["Unidades", selectedReg.units_managed],
                selectedReg.brokerage_name && ["Brokerage", selectedReg.brokerage_name],
                ["Referido por", selectedReg.referral_source],
                selectedReg.referral_name && ["Nombre referido", selectedReg.referral_name],
                ["Dieta", selectedReg.dietary_restriction],
                ["Foto OK", selectedReg.consent_photo ? "Sí" : "No"],
                ["Early Bird", selectedReg.is_early_bird ? "🏆 Sí" : "No"],
                ["Estado", selectedReg.status],
                ["Registrado", new Date(selectedReg.created_at).toLocaleString("es-US")],
              ].filter(Boolean).map((item) => item && (
                <div key={item[0]} className="flex justify-between gap-4">
                  <span className="text-white/40 flex-shrink-0">{item[0]}</span>
                  <span className="text-white text-right">{item[1]}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              {selectedReg.status !== "attended" && (
                <button
                  onClick={() => updateStatus.mutate({ pin: enteredPin, id: selectedReg.id, status: "attended" })}
                  className="flex-1 py-2 rounded-lg text-sm font-bold bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors"
                >
                  Marcar como asistió
                </button>
              )}
              {selectedReg.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus.mutate({ pin: enteredPin, id: selectedReg.id, status: "cancelled" })}
                  className="flex-1 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Cancelar registro
                </button>
              )}
              {selectedReg.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus.mutate({ pin: enteredPin, id: selectedReg.id, status: "confirmed" })}
                  className="flex-1 py-2 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
