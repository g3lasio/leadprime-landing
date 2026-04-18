import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import jsQR from "jsqr";

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
  const [manualCode, setManualCode] = useState("");
  const [lastScan, setLastScan] = useState<LastScan | null>(null);
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
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
          toast.warning(`⚠️ ${result.attendee.full_name} ya hizo check-in`);
        } else {
          toast.success(`✅ ¡Bienvenido, ${result.attendee.full_name}!`);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Código no válido";
        toast.error(`❌ ${msg}`);
      } finally {
        setTimeout(() => { isProcessingRef.current = false; }, 2500);
      }
    },
    [enteredPin, checkInMutation, statsQuery]
  );

  // jsQR scan loop — reads frames from video into canvas and decodes
  const scanLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { rafRef.current = requestAnimationFrame(scanLoop); return; }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (canvas.width > 0 && canvas.height > 0 && !isProcessingRef.current) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code && code.data) {
        processCode(code.data);
      }
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }, [processCode]);

  // Start/stop camera
  useEffect(() => {
    if (!enteredPin || mode !== "camera") return;

    let active = true;

    const startCamera = async () => {
      setCameraError(null);
      setCameraReady(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              if (active) {
                setCameraReady(true);
                rafRef.current = requestAnimationFrame(scanLoop);
              }
            }).catch((err) => {
              console.error("Video play error:", err);
              if (active) setCameraError("No se pudo iniciar el video.");
            });
          };
        }
      } catch (err: unknown) {
        console.error("Camera access error:", err);
        if (!active) return;
        const e = err as { name?: string };
        if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
          setCameraError("Permiso de cámara denegado. Ve a Configuración del navegador y permite el acceso a la cámara para este sitio.");
        } else if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError") {
          setCameraError("No se encontró una cámara. Usa el modo manual.");
        } else if (e.name === "NotReadableError" || e.name === "TrackStartError") {
          setCameraError("La cámara está siendo usada por otra app. Ciérrala e intenta de nuevo.");
        } else {
          setCameraError("No se pudo acceder a la cámara. Usa el modo manual.");
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraReady(false);
    };
  }, [enteredPin, mode, scanLoop]);

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
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setCameraError(null);
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
  const percentage =
    stats && stats.totalApproved > 0
      ? Math.round((stats.totalAttended / stats.totalApproved) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#080C14] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(8,12,20,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <a href="/admin/evento" className="text-white/40 hover:text-white/70 transition-colors text-sm">
            ← Dashboard
          </a>
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
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Asistencia</p>
              <p className="text-white font-black text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats ? (
                  <>
                    <span style={{ color: "#D4AF37" }}>{stats.totalAttended}</span>
                    <span className="text-white/30 text-lg"> / {stats.totalApproved}</span>
                  </>
                ) : (
                  <span className="text-white/20">— / —</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black" style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}>
                {percentage}%
              </p>
              {stats && (
                <p className="text-white/30 text-xs mt-1">{stats.totalApproved - stats.totalAttended} pendientes</p>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                background: "linear-gradient(90deg, #D4AF37 0%, #F5E6A3 100%)",
              }}
            />
          </div>
          {stats && (
            <div className="flex justify-between mt-2">
              <span className="text-white/20 text-xs">0</span>
              <span className="text-white/20 text-xs">{stats.totalApproved} aprobados</span>
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          <button
            onClick={() => switchMode("camera")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === "camera" ? "text-[#080C14]" : "text-white/50 hover:text-white/80"
            }`}
            style={
              mode === "camera"
                ? { background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" }
                : { background: "transparent" }
            }
          >
            📷 Cámara
          </button>
          <button
            onClick={() => switchMode("manual")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === "manual" ? "text-[#080C14]" : "text-white/50 hover:text-white/80"
            }`}
            style={
              mode === "manual"
                ? { background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" }
                : { background: "transparent" }
            }
          >
            ⌨️ Manual
          </button>
        </div>

        {/* Camera Scanner — uses native getUserMedia + jsQR */}
        {mode === "camera" && (
          <div className="space-y-3">
            {cameraError ? (
              <div
                className="rounded-2xl p-6 text-center space-y-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <div className="text-4xl">📵</div>
                <p className="text-red-400 text-sm font-bold">Cámara no disponible</p>
                <p className="text-white/50 text-xs leading-relaxed">{cameraError}</p>
                <button
                  onClick={() => { setCameraError(null); setMode("camera"); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-white/20 text-white/60 hover:text-white transition-colors"
                >
                  Reintentar
                </button>
                <div className="pt-1">
                  <button
                    onClick={() => switchMode("manual")}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-[#080C14]"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" }}
                  >
                    Usar modo manual →
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(212,175,55,0.2)", background: "#0D1220", aspectRatio: "4/3" }}
              >
                {/* Hidden canvas for jsQR processing */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Video element */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                  style={{ display: cameraReady ? "block" : "none" }}
                />

                {/* Loading overlay */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="text-4xl animate-pulse">📷</div>
                      <p className="text-white/50 text-sm">Iniciando cámara...</p>
                      <p className="text-white/25 text-xs">Puede aparecer un diálogo de permisos</p>
                    </div>
                  </div>
                )}

                {/* Gold corner overlay when active */}
                {cameraReady && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-52 h-52">
                      <div
                        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg"
                        style={{ borderColor: "#D4AF37" }}
                      />
                      <div
                        className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg"
                        style={{ borderColor: "#D4AF37" }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg"
                        style={{ borderColor: "#D4AF37" }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg"
                        style={{ borderColor: "#D4AF37" }}
                      />
                    </div>
                  </div>
                )}

                {/* Processing flash */}
                {isProcessingRef.current && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "rgba(212,175,55,0.15)" }}
                  />
                )}
              </div>
            )}
            <p className="text-center text-white/30 text-xs">
              Apunta la cámara al código QR del asistente · El escaneo es automático
            </p>
          </div>
        )}

        {/* Manual Entry */}
        {mode === "manual" && (
          <div className="space-y-3">
            <form onSubmit={handleManualSubmit}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">
                    Código del asistente
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="LNC-XXXXXX o XXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors placeholder-white/20"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={!manualCode.trim() || checkInMutation.isPending}
                    className="px-5 py-3 rounded-xl font-black text-[#080C14] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)" }}
                  >
                    {checkInMutation.isPending ? "..." : "✓"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Last Scan Result */}
        {lastScan && (
          <div
            className="rounded-2xl p-5 transition-all"
            style={{
              border: `1px solid ${lastScan.result.alreadyCheckedIn ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.4)"}`,
              background: lastScan.result.alreadyCheckedIn
                ? "rgba(245,158,11,0.05)"
                : "rgba(34,197,94,0.05)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: lastScan.result.alreadyCheckedIn
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(34,197,94,0.15)",
                }}
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
                  {lastScan.timestamp.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Check-ins List */}
        {stats && stats.recentCheckins.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Últimos check-ins</p>
              <span className="text-white/30 text-xs">{stats.totalAttended} total</span>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {stats.recentCheckins.map((r, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-white/2 transition-colors"
                >
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
                    <p className="text-white/40 text-xs truncate">
                      {r.role} · {r.city}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white/30 text-xs font-mono">LNC-{r.code}</p>
                    {r.checked_in_at && (
                      <p className="text-white/20 text-xs">
                        {new Date(r.checked_in_at).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
            <p className="text-white/20 text-xs mt-1">
              Los asistentes aparecerán aquí conforme lleguen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
