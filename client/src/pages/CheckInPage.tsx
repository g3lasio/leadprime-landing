import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

const ROLE_COLORS: Record<string, string> = {
  Contratista: "#D4AF37",
  "Property Manager": "#00D4FF",
  Realtor: "#A78BFA",
  "Otro profesional de la industria": "#6EE7B7",
};

type CheckInResult = {
  success: boolean;
  alreadyCheckedIn: boolean;
  attendee: {
    id: number;
    full_name: string;
    role: string;
    city: string;
    code: string;
    status: string;
  };
};

type LastScan = {
  result: CheckInResult;
  timestamp: Date;
};

export default function CheckInPage() {
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [lastScan, setLastScan] = useState<LastScan | null>(null);
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const isProcessingRef = useRef(false);

  const checkInMutation = trpc.evento.checkIn.useMutation();
  const statsQuery = trpc.evento.attendanceStats.useQuery(
    { pin: enteredPin },
    { enabled: !!enteredPin, refetchInterval: 10000 }
  );

  const processCode = useCallback(
    async (rawCode: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      try {
        const result = await checkInMutation.mutateAsync({ pin: enteredPin, code: rawCode });
        setLastScan({ result, timestamp: new Date() });
        statsQuery.refetch();
        if (result.alreadyCheckedIn) {
          toast.warning(`⚠️ ${result.attendee.full_name} ya hizo check-in anteriormente`);
        } else {
          toast.success(`✅ ¡Bienvenido, ${result.attendee.full_name}!`);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error al procesar el código";
        toast.error(`❌ ${msg}`);
        setLastScan(null);
      } finally {
        // Allow next scan after 2 seconds
        setTimeout(() => { isProcessingRef.current = false; }, 2000);
      }
    },
    [enteredPin, checkInMutation, statsQuery]
  );

  // Start/stop camera scanner
  useEffect(() => {
    if (!enteredPin || mode !== "camera") return;

    let cancelled = false;
    let localScanner: Html5Qrcode | null = null;

    const startScanner = async () => {
      if (scannerRef.current) return;
      try {
        const scanner = new Html5Qrcode("qr-reader");
        localScanner = scanner;
        if (!cancelled) scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!cancelled) processCode(decodedText);
          },
          () => {} // ignore frame errors during scanning
        );
        if (!cancelled) setScannerActive(true);
      } catch (err) {
        console.error("Camera error:", err);
        // Clean up the scanner instance that failed to start
        if (localScanner) {
          try { await localScanner.stop(); } catch (_) { /* ignore */ }
          localScanner = null;
        }
        scannerRef.current = null;
        if (!cancelled) {
          toast.error("No se pudo acceder a la cámara. Usa el modo manual.");
          setMode("manual");
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      const s = scannerRef.current ?? localScanner;
      if (s) {
        s.stop().catch(() => {}).finally(() => {
          scannerRef.current = null;
          setScannerActive(false);
        });
      }
    };
  }, [enteredPin, mode, processCode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processCode(manualCode.trim());
    setManualCode("");
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnteredPin(pin);
  };

  const switchMode = (newMode: "camera" | "manual") => {
    if (newMode === mode) return;
    // Stop camera if switching away
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        scannerRef.current = null;
        setScannerActive(false);
      });
    }
    setMode(newMode);
    setLastScan(null);
  };

  // PIN gate
  if (!enteredPin) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌙</div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Check-in
            </h1>
            <p className="text-white/40 text-sm mt-1">La Noche Chyrris · 22 de Mayo, 2026</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">PIN de administrador</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-[#080C14] text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)" }}
            >
              Entrar
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/admin/evento" className="text-white/30 text-sm hover:text-white/50 transition-colors">
              ← Volver al dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const percentage = stats && stats.totalApproved > 0
    ? Math.round((stats.totalAttended / stats.totalApproved) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080C14] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(8,12,20,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <div className="flex items-center gap-3">
          <a href="/admin/evento" className="text-white/40 hover:text-white/70 transition-colors text-sm">← Dashboard</a>
          <span className="text-white/20">|</span>
          <h1 className="text-white font-black text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            🌙 Check-in · La Noche Chyrris
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-bold">EN VIVO</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Attendance Progress */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Asistencia</p>
              <p className="text-white font-black text-2xl">
                <span style={{ color: "#D4AF37" }}>{stats?.totalAttended ?? "—"}</span>
                <span className="text-white/30 text-lg"> / {stats?.totalApproved ?? "—"}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black" style={{ color: "#D4AF37" }}>{percentage}%</p>
              <p className="text-white/40 text-xs">{stats?.totalPending ?? 0} pendientes</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                background: "linear-gradient(90deg, #D4AF37 0%, #F5E6A3 100%)",
                boxShadow: "0 0 12px rgba(212,175,55,0.5)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/30 text-xs">0</span>
            <span className="text-white/30 text-xs">{stats?.totalApproved ?? 0} aprobados</span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          <button
            onClick={() => switchMode("camera")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === "camera" ? "text-[#080C14]" : "text-white/50 hover:text-white/80"}`}
            style={mode === "camera" ? { background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" } : { background: "transparent" }}
          >
            📷 Cámara
          </button>
          <button
            onClick={() => switchMode("manual")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === "manual" ? "text-[#080C14]" : "text-white/50 hover:text-white/80"}`}
            style={mode === "manual" ? { background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" } : { background: "transparent" }}
          >
            ⌨️ Manual
          </button>
        </div>

        {/* Camera Scanner */}
        {mode === "camera" && (
          <div className="space-y-4">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(212,175,55,0.2)", background: "#0D1220" }}
            >
              <div id="qr-reader" ref={scannerContainerRef} className="w-full" />
              {!scannerActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-white/50 text-sm">Iniciando cámara...</p>
                  </div>
                </div>
              )}
              {/* Gold corner overlay */}
              {scannerActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-52 h-52">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: "#D4AF37" }} />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: "#D4AF37" }} />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: "#D4AF37" }} />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: "#D4AF37" }} />
                  </div>
                </div>
              )}
            </div>
            <p className="text-center text-white/30 text-xs">
              Apunta la cámara al QR del asistente · El escaneo es automático
            </p>
          </div>
        )}

        {/* Manual Entry */}
        {mode === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-white/60 mb-2">Código del asistente</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="LNC-XXXXXX o XXXXXX"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors font-mono text-lg tracking-widest uppercase"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim() || checkInMutation.isPending}
                  className="px-6 py-3 rounded-xl font-black text-[#080C14] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" }}
                >
                  {checkInMutation.isPending ? "..." : "✓"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Last Scan Result */}
        {lastScan && (
          <div
            className="rounded-2xl p-5 transition-all"
            style={{
              border: `1px solid ${lastScan.result.alreadyCheckedIn ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.4)"}`,
              background: lastScan.result.alreadyCheckedIn ? "rgba(245,158,11,0.05)" : "rgba(34,197,94,0.05)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: lastScan.result.alreadyCheckedIn ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)" }}
              >
                {lastScan.result.alreadyCheckedIn ? "⚠️" : "✅"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-black text-lg leading-tight"
                  style={{ color: lastScan.result.alreadyCheckedIn ? "#F59E0B" : "#22C55E" }}
                >
                  {lastScan.result.alreadyCheckedIn ? "Ya registrado" : "¡Bienvenido!"}
                </p>
                <p className="text-white font-bold text-xl mt-1">{lastScan.result.attendee.full_name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: `${ROLE_COLORS[lastScan.result.attendee.role] ?? "#6EE7B7"}20`,
                      color: ROLE_COLORS[lastScan.result.attendee.role] ?? "#6EE7B7",
                    }}
                  >
                    {lastScan.result.attendee.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 text-white/60">
                    📍 {lastScan.result.attendee.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/5 text-white/40">
                    LNC-{lastScan.result.attendee.code}
                  </span>
                </div>
                <p className="text-white/30 text-xs mt-2">
                  {lastScan.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Check-ins List */}
        {stats && stats.recentCheckins.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Últimos check-ins</p>
              <span className="text-white/30 text-xs">{stats.totalAttended} total</span>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {stats.recentCheckins.map((r, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-white/2 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: `${ROLE_COLORS[r.role] ?? "#6EE7B7"}20`,
                      color: ROLE_COLORS[r.role] ?? "#6EE7B7",
                    }}
                  >
                    {r.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{r.full_name}</p>
                    <p className="text-white/40 text-xs truncate">{r.role} · {r.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white/30 text-xs font-mono">LNC-{r.code}</p>
                    {r.checked_in_at && (
                      <p className="text-white/20 text-xs">
                        {new Date(r.checked_in_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats && stats.recentCheckins.length === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🎟</p>
            <p className="text-white/30 text-sm">Aún no hay check-ins registrados</p>
            <p className="text-white/20 text-xs mt-1">Los asistentes aparecerán aquí conforme lleguen</p>
          </div>
        )}
      </div>
    </div>
  );
}
