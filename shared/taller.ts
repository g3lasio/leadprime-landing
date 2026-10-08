/**
 * Taller virtual LeadPrime — datos públicos del evento del sábado 17 de
 * octubre de 2026. Una sola fuente de verdad para la página de registro, el
 * formulario del equipo, los correos y el archivo de calendario.
 *
 * El enlace de Zoom es público a propósito (la invitación lo lleva); el
 * servidor puede sobreescribirlo con TALLER_ZOOM_URL.
 */

export const TALLER_SLUG = "taller-17-oct-2026";

export const TALLER = {
  slug: TALLER_SLUG,
  /** Nombre corto del evento (propuesta; se cambia aquí si Gelasio elige otro). */
  shortName: "Cúbrase y Cobre",
  series: "LeadPrime En Vivo",
  title:
    "Las 3 reglas de 2026 que pueden costarle la licencia, y cómo cobrar sin perseguir a nadie",
  dateLabel: "sábado 17 de octubre de 2026",
  timeLabel: "8:00 AM, hora de California",
  durationLabel: "40 minutos",
  format: "Taller gratis por Zoom, en español",
  /** Inicio y fin en UTC (8:00–8:40 AM PDT). */
  startIso: "2026-10-17T15:00:00Z",
  endIso: "2026-10-17T15:40:00Z",
  timezone: "America/Los_Angeles",
  zoomUrl:
    "https://us05web.zoom.us/j/82664482526?pwd=a44IObUR8Oyn6XJwRGlukNQplxnUcY.1",
  meetingId: "826 6448 2526",
  passcode: "NikqQ7",
  host: "el fundador de LeadPrime, contratista en Fairfield, California",
  hook: {
    number: "$10,000",
    text: "es la multa mínima desde julio de 2026 por tener ayudantes sin workers' comp. Y el CSLB ya está revisando a los contratistas que declararon «sin empleados».",
  },
  bullets: [
    {
      title: "Qué le va a pedir el CSLB este año",
      text: "La verificación a los que declararon «sin empleados», las multas de julio y lo que viene en 2028. Qué hacer antes de que le toque a usted.",
    },
    {
      title: "Un contrato que sí cumple las reglas de 2026",
      text: "Correo, teléfono, cancelación por correo y el depósito de $1,000 o 10 %. Si su contrato es una hoja de Word, se va con uno bueno.",
    },
    {
      title: "Cobrar el depósito con tarjeta antes de empezar",
      text: "En vivo: el contrato firmado en el celular del cliente y el depósito que entra antes de mover una herramienta.",
    },
  ],
  whoIsItFor:
    "Contratistas y oficios de California: jardinería, concreto, pintura, techos, drywall, plomería, electricidad, remodelación… con o sin licencia.",
  disclaimer:
    "No somos el CSLB ni vendemos seguros. El taller es gratis y no hay que comprar nada para entrar.",
  contactEmail: "leadprime@chyrris.com",
  contactPhone: "916-623-7755",
  organizer: "LeadPrime · Chyrris Technologies · Fairfield, California",
  /** Fechas (UTC) en que salen los recordatorios automáticos. */
  reminder1Iso: "2026-10-16T16:00:00Z", // viernes 16, 9:00 AM PT
  reminder2Iso: "2026-10-17T14:15:00Z", // sábado 17, 7:15 AM PT
} as const;

export const TALLER_TRADES = [
  "Jardinería y árboles",
  "Concreto y albañilería",
  "Pintura",
  "Techos",
  "Drywall",
  "Plomería",
  "Electricidad",
  "Construcción y remodelación",
  "Cercas y herrería",
  "Pisos y azulejo",
  "Aire acondicionado y calefacción",
  "Otro oficio",
] as const;

export const TALLER_TEAM_MEMBERS = [
  "Jorge",
  "John",
  "Jasmine",
  "Gelasio",
  "Otro",
] as const;

export type TallerChannelPref = "email" | "sms" | "both";

/** Enlace "Agregar a Google Calendar" con los datos del taller. */
export function googleCalendarUrl(zoomUrl: string = TALLER.zoomUrl): string {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${TALLER.shortName} — ${TALLER.series} (taller gratis por Zoom)`,
    dates: `${fmt(TALLER.startIso)}/${fmt(TALLER.endIso)}`,
    details: `${TALLER.title}\n\nEnlace de Zoom: ${zoomUrl}\nID: ${TALLER.meetingId} · Passcode: ${TALLER.passcode}\n\n${TALLER.disclaimer}`,
    location: zoomUrl,
    ctz: TALLER.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
