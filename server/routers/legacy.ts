/**
 * legacy.ts — EL PORTAL ÚNICO DE EVENTOS de Legacy Prime,
 * viviendo en la LANDING (leadprimecrm.chyrris.com), por orden
 * del dueño (30-oct-2026): «se supone que todo debería estar en
 * el url del landing page… yo lo necesito en el sistema de
 * landing».
 *
 * UNA SOLA DATA: el servidor de la landing y el backend de la
 * app LeadPrime comparten la MISMA base Neon (verificado:
 * NEON_DATABASE_URL de este servicio y DATABASE_URL de la app
 * apuntan al mismo host/base/usuario). Por eso este router lee
 * directamente legacy_prime_enlaces / legacy_prime_registros
 * con las mismas consultas que usa el servicio de la app
 * (legacyPrimeService.ts: la cuenta se acota por
 * enlaces.contractor_id; los registros cuelgan del enlace).
 *
 * EL REGISTRO no se escribe aquí: se despacha server-side a la
 * API pública viva de la app (POST /api/legacy-prime/publico/
 * :token/registrar) para que la fila nazca IDÉNTICA a la de
 * siempre — pase, cupo/excedente, correos y ticket de website
 * incluidos — con su ciudad de evento forzada vía
 * datos.ciudadEvento (el mismo flujo con el que Stockton y
 * Sacramento ya se llenaron desde el enlace de Turlock). El
 * token JAMÁS viaja al navegador: se resuelve aquí, del enlace
 * representante de la ciudad elegida; si la parada aún no
 * tiene enlace propio (Sacramento hoy), se usa el enlace
 * fundador de Turlock con la ciudad elegida, exactamente como
 * opera el tour.
 *
 * Procedimientos:
 * - eventos (público): la definición viva del programa (se lee
 *   de la API pública de la app, con caché de 5 min), los
 *   eventos FUTUROS desde los enlaces reales (sin hardcodear
 *   ciudades: una parada aparece cuando su enlace existe) y el
 *   HISTORIAL público: las paradas del tour ya ejecutadas más
 *   los eventos propios de esta landing (Networking Fairfield
 *   en event_registrations y el Taller por Zoom en
 *   taller_registrations), con sus conteos reales.
 * - registrar (público): el registro «sin puertas» de siempre
 *   con el campo de website EXPLÍCITO («tiene» con URL / «no
 *   tiene»). La sede solo se muestra donde está definida
 *   (sede_nombre del enlace); jamás se inventa una.
 * - adminRegistros / adminAsentarWebsite (protegidos): la
 *   tabla del dueño tras el PIN de admin de siempre de esta
 *   landing (EVENTO_ADMIN_PIN, el mismo gate de /admin/evento
 *   en server/routers/evento.ts), con la clasificación de
 *   website que usa el panel de la app: URL válida → tiene;
 *   website_url con un «no» literal → sin website (él lo
 *   escribió); sin_website=true → sin website (su fila nació
 *   por la vía sin-website); sin ninguna señal → por verificar
 *   (jamás se afirma que no tiene sin que conste).
 * - adminMarcarAsistencia (protegido, 6-nov-2026): el check-in
 *   del dueño en la puerta — un checkbox por registrado que
 *   asienta asistio/asistio_at en la MISMA fila (columnas
 *   aditivas, ver drizzle/neon/2026-11-06_asistencia_legacy_
 *   prime_registros.sql). Cada fila es el registro de UN
 *   evento (su enlace + ciudad_evento), así que la marca es
 *   por evento y sirve igual en cada parada futura del tour.
 *   NO confundir con evento.checkIn: ese opera la tabla vieja
 *   event_registrations (Networking Fairfield), no esta.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createHash, timingSafeEqual } from "node:crypto";
import pkg from "pg";
import { publicProcedure, router } from "../_core/trpc";

const { Pool } = pkg;

// ── Constantes ──────────────────────────────────────────────

/** La cuenta dueña de los enlaces Legacy Prime (Chyrris Technologies). */
const CONTRYRRIS_CONTRACTOR_ID = "con_mivahkqxdd8xiymgj";
/** La API viva de la app LeadPrime (registro público y pase). */
const LEADPRIME_API_URL = () =>
  (process.env.LEADPRIME_API_URL || "https://leadprime.chyrris.com").replace(/\/+$/, "");
const ZONA_PT = "America/Los_Angeles";
/** Slug del taller por Zoom del 17-oct-2026 (shared/taller.ts). */
const TALLER_SLUG_HISTORIAL = "taller-17-oct-2026";

// ── PIN de admin — el mismo gate de siempre (evento.ts) ────

function digestPin(pin: string): Buffer {
  return createHash("sha256").update(pin).digest();
}

const pinAttempts = new Map<string, { count: number; windowStart: number }>();
const PIN_MAX_ATTEMPTS = 10;
const PIN_WINDOW_MS = 15 * 60 * 1000;

function checkPinRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = pinAttempts.get(key);
  if (!entry || now - entry.windowStart > PIN_WINDOW_MS) {
    pinAttempts.set(key, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= PIN_MAX_ATTEMPTS;
}

function requireAdminPin(pin: string | undefined, rateLimitKey: string): void {
  const expected = process.env.EVENTO_ADMIN_PIN;
  if (!expected) {
    // Fail closed: without the env var nobody gets in.
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Admin no configurado en el servidor",
    });
  }
  if (!checkPinRateLimit(rateLimitKey)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Demasiados intentos. Espera unos minutos.",
    });
  }
  const provided = typeof pin === "string" ? pin : "";
  if (!timingSafeEqual(digestPin(provided), digestPin(expected))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorrecto" });
  }
}

// ── Base de datos (la misma Neon de la app y de esta landing) ──

let _pool: InstanceType<typeof Pool> | null = null;
function getPool(): InstanceType<typeof Pool> {
  if (!_pool) {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not configured",
      });
    }
    _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  }
  return _pool;
}

// ── Clasificación de website (la misma regla del panel) ────

const TEXTOS_NO_WEBSITE = new Set([
  "no", "ninguno", "ninguna", "no tengo", "no tiene", "sin website",
  "sin pagina", "sin página", "no tengo website", "no tengo pagina",
  "no tengo página", "none", "n/a", "na", "-", "no aplica",
]);

export function esTextoNoWebsite(valor: string | null | undefined): boolean {
  if (!valor) return false;
  return TEXTOS_NO_WEBSITE.has(valor.trim().toLowerCase());
}

export function urlWebsiteValida(valor: string | null | undefined): string | null {
  const texto = String(valor ?? "").trim();
  if (!texto || esTextoNoWebsite(texto)) return null;
  const conEsquema = /^https?:\/\//i.test(texto) ? texto : `https://${texto}`;
  try {
    const u = new URL(conEsquema);
    return u.hostname.includes(".") ? conEsquema : null;
  } catch {
    return null;
  }
}

export type WebsiteEstado = "tiene" | "sin_website" | "por_verificar";
export type WebsiteBase = "url" | "texto" | "registro" | "sin_dato";

export function infoWebsiteDeRegistro(reg: {
  website_url?: string | null;
  sin_website?: boolean | null;
}): { estado: WebsiteEstado; base: WebsiteBase; urlValida: string | null } {
  const url = urlWebsiteValida(reg.website_url);
  if (url) return { estado: "tiene", base: "url", urlValida: url };
  if (esTextoNoWebsite(reg.website_url)) {
    return { estado: "sin_website", base: "texto", urlValida: null };
  }
  if (reg.sin_website === true) {
    return { estado: "sin_website", base: "registro", urlValida: null };
  }
  return { estado: "por_verificar", base: "sin_dato", urlValida: null };
}

// ── Enlaces (la fuente de verdad de los eventos) ───────────

type EnlaceRow = {
  id: string;
  token: string;
  ciudad: string;
  titulo_evento: string | null;
  cupo: number;
  fecha_evento: Date | string | null;
  sede_nombre: string | null;
  sede_direccion: string | null;
  sede_indicaciones: string | null;
  created_at: Date | string;
};

const COLUMNAS_ENLACE =
  "id, token, ciudad, titulo_evento, cupo, fecha_evento, sede_nombre, sede_direccion, sede_indicaciones, created_at";

async function enlacesDeCuenta(): Promise<EnlaceRow[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_ENLACE} FROM legacy_prime_enlaces
      WHERE contractor_id = $1
      ORDER BY created_at ASC`,
    [CONTRYRRIS_CONTRACTOR_ID],
  );
  return rows as EnlaceRow[];
}

/** Los enlaces «NO USAR» son QA del equipo: nunca representan un evento. */
const esQa = (e: EnlaceRow) => /no usar/i.test(e.titulo_evento ?? "");

function fechaPT(fecha: Date | string | null): string | null {
  if (!fecha) return null;
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-CA", { timeZone: ZONA_PT });
}

function hoyPT(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: ZONA_PT });
}

export type VistaEvento = {
  ciudad: string;
  etiqueta: string | null;
  fechaISO: string | null;
  tituloEvento: string | null;
  cupo: number;
  sedeDefinida: boolean;
  sedeNombre: string | null;
  registrados: number;
};

/** La etiqueta corta del título («Turlock · 31-oct» → «31-oct»). */
function etiquetaDe(titulo: string | null): string | null {
  if (!titulo) return null;
  const partes = titulo.split("·");
  return (partes.length > 1 ? partes[partes.length - 1] : titulo).trim() || null;
}

/**
 * Un evento por ciudad entre los enlaces reales (no QA): el
 * representante prefiere sede definida y luego el más antiguo.
 * Con `soloFuturos`, solo paradas con fecha de hoy en adelante
 * (o sin fecha asentada, que aún no se ejecutan).
 */
function eventosPorCiudad(
  enlaces: EnlaceRow[],
  conteos: Map<string, number>,
  soloFuturos: boolean,
): VistaEvento[] {
  const hoy = hoyPT();
  const porCiudad = new Map<string, EnlaceRow>();
  for (const e of enlaces) {
    if (esQa(e)) continue;
    const f = fechaPT(e.fecha_evento);
    if (soloFuturos && f && f < hoy) continue;
    if (!soloFuturos && (!f || f >= hoy)) continue;
    const actual = porCiudad.get(e.ciudad);
    if (!actual) {
      porCiudad.set(e.ciudad, e);
      continue;
    }
    const sedeNueva = (e.sede_nombre ?? "").trim() !== "";
    const sedeActual = (actual.sede_nombre ?? "").trim() !== "";
    if (sedeNueva && !sedeActual) porCiudad.set(e.ciudad, e);
  }
  const lista = Array.from(porCiudad.values()).map((e) => ({
    ciudad: e.ciudad,
    etiqueta: etiquetaDe(e.titulo_evento),
    fechaISO: e.fecha_evento ? new Date(e.fecha_evento).toISOString() : null,
    tituloEvento: e.titulo_evento,
    cupo: e.cupo,
    sedeDefinida: (e.sede_nombre ?? "").trim() !== "",
    sedeNombre: e.sede_nombre,
    registrados: conteos.get(e.ciudad) ?? 0,
  }));
  lista.sort((a, b) =>
    soloFuturos
      ? String(a.fechaISO ?? "9999").localeCompare(String(b.fechaISO ?? "9999"))
      : String(b.fechaISO ?? "").localeCompare(String(a.fechaISO ?? "")),
  );
  return lista;
}

/** Conteos reales por ciudad de evento (las filas QA no cuentan). */
async function conteosPorCiudad(): Promise<Map<string, number>> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT r.ciudad_evento AS ciudad, count(*)::int AS n
       FROM legacy_prime_registros r
       JOIN legacy_prime_enlaces e ON e.id = r.enlace_id
      WHERE e.contractor_id = $1
        AND (r.correo IS NULL OR r.correo NOT ILIKE '%@invalid.example')
      GROUP BY r.ciudad_evento`,
    [CONTRYRRIS_CONTRACTOR_ID],
  );
  const mapa = new Map<string, number>();
  for (const r of rows) if (r.ciudad) mapa.set(r.ciudad as string, r.n as number);
  return mapa;
}

// ── La definición viva (de la API pública de la app) ───────

let definicionCache: { datos: any; expira: number } | null = null;

async function definicionPublica(token: string): Promise<any> {
  if (definicionCache && definicionCache.expira > Date.now()) {
    return definicionCache.datos;
  }
  const resp = await fetch(
    `${LEADPRIME_API_URL()}/api/legacy-prime/publico/${encodeURIComponent(token)}`,
  );
  if (!resp.ok) throw new Error(`definición pública: HTTP ${resp.status}`);
  const cuerpo = await resp.json();
  // La API responde { definicion: { preguntas, paradas }, evento }.
  const datos = cuerpo?.definicion ?? {};
  definicionCache = { datos, expira: Date.now() + 5 * 60 * 1000 };
  return datos;
}

/** El enlace fundador real: Turlock, el más antiguo que no es QA. */
function enlaceFundador(enlaces: EnlaceRow[]): EnlaceRow | null {
  const reales = enlaces.filter((e) => !esQa(e));
  return (
    reales.find((e) => e.ciudad.toLowerCase() === "turlock") ??
    reales[0] ??
    null
  );
}

/**
 * El token con el que una ciudad se registra: el de su enlace
 * representante si la parada ya tiene enlace; si no, el
 * fundador (la fila nace con su ciudad forzada, como hoy).
 */
function tokenParaCiudad(enlaces: EnlaceRow[], ciudadEvento: string): string | null {
  const fundador = enlaceFundador(enlaces);
  if (!fundador) return null;
  const propios = enlaces.filter(
    (e) => !esQa(e) && e.ciudad.toLowerCase() === ciudadEvento.toLowerCase(),
  );
  if (!propios.length) return fundador.token;
  const conSede = propios.find((e) => (e.sede_nombre ?? "").trim() !== "");
  return (conSede ?? propios[0]).token;
}

// ── Historial fijo de esta landing (Fairfield + Zoom) ──────

function fechaLargaES(iso: string): string {
  return new Date(iso).toLocaleDateString("es-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA_PT,
  });
}

// ── El router ───────────────────────────────────────────────

export const legacyRouter = router({
  /**
   * Público: definición + próximos eventos (desde los datos) +
   * historial público (lo ya ejecutado, con sus conteos).
   */
  eventos: publicProcedure.query(async () => {
    const enlaces = await enlacesDeCuenta();
    const fundador = enlaceFundador(enlaces);
    if (!fundador) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Eventos no disponibles por el momento",
      });
    }
    const [definicion, conteos] = await Promise.all([
      definicionPublica(fundador.token),
      conteosPorCiudad(),
    ]);

    // Los próximos eventos: las paradas del tour que la app ya
    // tiene creadas (su definición viva — Sacramento, Concord,
    // Napa, San José y el Cierre existen ahí aunque aún no
    // tengan enlace propio; se registran por el flujo fundador,
    // como ya se llenaron Stockton y Sacramento), enriquecidas
    // con la sede/cupo de su enlace si ya existe, MÁS cualquier
    // enlace futuro fuera del tour. Nada hardcodeado aquí: si
    // el tour crece en la app, crece solo en esta página.
    const hoy = hoyPT();
    const porEnlace = new Map(
      eventosPorCiudad(enlaces, conteos, true).map((e) => [e.ciudad.toLowerCase(), e]),
    );
    const proximos: VistaEvento[] = [];
    const ciudadesTour = new Set<string>();
    for (const p of (definicion?.paradas ?? []) as Array<{
      ciudad: string; etiqueta: string; fechaISO: string;
    }>) {
      const fecha = fechaPT(p.fechaISO);
      if (fecha && fecha < hoy) continue;
      ciudadesTour.add(p.ciudad.toLowerCase());
      const delEnlace = porEnlace.get(p.ciudad.toLowerCase());
      proximos.push({
        ciudad: p.ciudad,
        etiqueta: p.etiqueta,
        fechaISO: p.fechaISO,
        tituloEvento: delEnlace?.tituloEvento ?? null,
        cupo: delEnlace?.cupo ?? 25,
        sedeDefinida: delEnlace?.sedeDefinida ?? false,
        sedeNombre: delEnlace?.sedeNombre ?? null,
        registrados: conteos.get(p.ciudad) ?? 0,
      });
    }
    for (const e of Array.from(porEnlace.values())) {
      if (!ciudadesTour.has(e.ciudad.toLowerCase())) proximos.push(e);
    }
    proximos.sort((a, b) =>
      String(a.fechaISO ?? "9999").localeCompare(String(b.fechaISO ?? "9999")),
    );

    // Historial: las paradas del tour ya ejecutadas…
    const pasadosTour = eventosPorCiudad(enlaces, conteos, false).map((p) => ({
      nombre: p.tituloEvento ?? `Desayuno Legacy Prime — ${p.ciudad}`,
      ciudad: p.ciudad,
      fechaISO: p.fechaISO,
      fechaTexto: p.fechaISO ? fechaLargaES(p.fechaISO) : "Fecha por confirmar",
      lugar: p.sedeNombre ?? p.ciudad,
      modalidad: "presencial" as const,
      registrados: p.registrados,
      detalle: null as string | null,
    }));

    // …más los eventos propios de esta landing, con los conteos
    // de SUS tablas en esta misma base.
    const pool = getPool();
    const historial: Array<{
      nombre: string; ciudad: string; fechaISO: string | null; fechaTexto: string;
      lugar: string; modalidad: "presencial" | "zoom"; registrados: number; detalle: string | null;
    }> = [...pasadosTour];
    try {
      const { rows } = await pool.query(
        `SELECT count(*)::int AS total,
                count(*) FILTER (WHERE status = 'approved')::int AS aprobados
           FROM event_registrations`,
      );
      historial.push({
        nombre: "LeadPrime Networking — Fairfield",
        ciudad: "Fairfield",
        fechaISO: "2026-07-02T19:00:00-07:00",
        fechaTexto: "jueves, 2 de julio de 2026",
        lugar: "1000 Webster Street, Fairfield, CA",
        modalidad: "presencial",
        registrados: rows[0]?.total ?? 0,
        detalle: `${rows[0]?.aprobados ?? 0} aprobados`,
      });
    } catch {
      // La tabla hermana no responde: el historial sigue sin ella.
    }
    try {
      const { rows } = await pool.query(
        `SELECT count(*)::int AS total FROM taller_registrations WHERE event_slug = $1`,
        [TALLER_SLUG_HISTORIAL],
      );
      historial.push({
        nombre: "Taller por Zoom «Cúbrase y Cobre» — LeadPrime En Vivo",
        ciudad: "Zoom",
        fechaISO: "2026-10-17T08:00:00-07:00",
        fechaTexto: "sábado, 17 de octubre de 2026 · 8:00 AM PT",
        lugar: "Zoom",
        modalidad: "zoom",
        registrados: rows[0]?.total ?? 0,
        detalle: null,
      });
    } catch {
      // Ídem.
    }
    historial.sort((a, b) => String(b.fechaISO ?? "").localeCompare(String(a.fechaISO ?? "")));

    return {
      definicion: {
        preguntas: definicion?.preguntas ?? [],
        paradas: definicion?.paradas ?? [],
      },
      proximos,
      historial,
    };
  }),

  /**
   * Público: el registro único. Despacha a la API de la app con
   * el token resuelto en el servidor y la ciudad forzada; la
   * fila nace en la MISMA tabla, con su pase y sus correos.
   */
  registrar: publicProcedure
    .input(
      z.object({
        ciudadEvento: z.string().min(1).max(80),
        datos: z.object({
          nombre: z.string().max(200),
          compania: z.string().max(200),
          ciudad: z.string().max(120),
          telefono: z.string().max(40),
          correo: z.string().max(200),
          websiteUrl: z.string().max(300).optional(),
          sinWebsite: z.boolean().optional(),
          websiteDeclaracion: z.enum(["tiene", "no_tiene"]).optional(),
          acompananteNombre: z.string().max(200).optional(),
        }),
        respuestas: z.record(z.string(), z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const enlaces = await enlacesDeCuenta();
      const token = tokenParaCiudad(enlaces, input.ciudadEvento);
      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "El registro no está disponible por el momento",
        });
      }
      const datos: Record<string, unknown> = {
        ...input.datos,
        ciudadEvento: input.ciudadEvento,
      };
      const resp = await fetch(
        `${LEADPRIME_API_URL()}/api/legacy-prime/publico/${encodeURIComponent(token)}/registrar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ datos, respuestas: input.respuestas ?? {} }),
        },
      );
      const cuerpo: any = await resp.json().catch(() => ({}));
      if (resp.status === 422) {
        return {
          ok: false as const,
          faltantes: (cuerpo?.faltantes ?? ["Revisa tus datos"]) as string[],
        };
      }
      if (!resp.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo completar tu registro. Inténtalo de nuevo en un momento.",
        });
      }
      // La API responde 201 { salida, estado, mensaje, paseToken }.
      // La sede de la confirmación sale del enlace representante
      // de la ciudad elegida (solo se muestra tras registrarse,
      // como en todo el sistema; si no está definida, no se
      // muestra ninguna — jamás se inventa).
      const propios = enlaces.filter(
        (e) => !esQa(e) && e.ciudad.toLowerCase() === input.ciudadEvento.toLowerCase(),
      );
      const rep =
        propios.find((e) => (e.sede_nombre ?? "").trim() !== "") ?? propios[0] ?? null;
      const sede =
        rep && (rep.sede_nombre ?? "").trim() !== ""
          ? {
              nombre: rep.sede_nombre,
              direccion: rep.sede_direccion,
              indicaciones: rep.sede_indicaciones,
            }
          : null;
      let fechaEvento: string | null = rep?.fecha_evento
        ? new Date(rep.fecha_evento).toISOString()
        : null;
      try {
        const def = await definicionPublica(token);
        const parada = (def?.paradas ?? []).find(
          (p: any) => String(p.ciudad).toLowerCase() === input.ciudadEvento.toLowerCase(),
        );
        if (parada?.fechaISO) fechaEvento = parada.fechaISO;
      } catch {
        // Sin definición a la mano, manda la fecha del enlace.
      }
      const paseToken = (cuerpo?.paseToken ?? null) as string | null;
      return {
        ok: true as const,
        salida: (cuerpo?.salida ?? "califica") as string,
        mensaje: cuerpo?.mensaje ?? null,
        paseToken,
        paseUrl: paseToken
          ? `${LEADPRIME_API_URL()}/legacy-prime/pase/${paseToken}`
          : null,
        evento: { ciudad: input.ciudadEvento, fechaEvento },
        sede,
      };
    }),

  /**
   * Protegido (PIN): TODOS los registrados de la cuenta, con la
   * website clasificada — la tabla única del dueño.
   */
  adminRegistros: publicProcedure
    .input(z.object({ pin: z.string().min(1).max(64) }))
    .query(async ({ input, ctx }) => {
      requireAdminPin(input.pin, ctx?.req?.ip ?? "legacy-admin");
      const pool = getPool();
      const { rows } = await pool.query(
        `SELECT r.id, r.nombre, r.compania, r.ciudad, r.ciudad_evento, r.evento_origen,
                r.evento_cambiado_at, r.telefono, r.correo, r.website_url, r.sin_website,
                r.salida, r.estado, r.registrado_por, r.asistio, r.asistio_at,
                e.titulo_evento AS enlace_titulo, r.created_at
           FROM legacy_prime_registros r
           JOIN legacy_prime_enlaces e ON e.id = r.enlace_id
          WHERE e.contractor_id = $1
          ORDER BY r.created_at DESC
          LIMIT 500`,
        [CONTRYRRIS_CONTRACTOR_ID],
      );
      const registros = rows.map((r: any) => {
        const info = infoWebsiteDeRegistro(r);
        return {
          id: r.id as string,
          nombre: r.nombre as string,
          compania: r.compania as string,
          ciudad: (r.ciudad ?? null) as string | null,
          ciudadEvento: (r.ciudad_evento ?? null) as string | null,
          eventoOrigen: (r.evento_origen ?? null) as string | null,
          eventoCambiadoAt: r.evento_cambiado_at
            ? new Date(r.evento_cambiado_at).toISOString()
            : null,
          telefono: (r.telefono ?? null) as string | null,
          correo: (r.correo ?? null) as string | null,
          websiteUrl: (r.website_url ?? null) as string | null,
          websiteEstado: info.estado,
          websiteBase: info.base,
          websiteUrlValida: info.urlValida,
          salida: r.salida as string,
          // Quién asentó el registro (migración 520 de la app): 'agente',
          // 'agente_recuperado' o 'agente_barrido'; null = formulario/equipo.
          registradoPor: (r.registrado_por ?? null) as string | null,
          // Check-in en la puerta (6-nov-2026): la marca vive en
          // la fila misma; asistio_at es la hora en que se marcó.
          asistio: r.asistio === true,
          asistioAt: r.asistio_at ? new Date(r.asistio_at).toISOString() : null,
          estado: (r.estado === "confirmado" ? "confirmado" : "registrado") as string,
          enlaceTitulo: (r.enlace_titulo ?? null) as string | null,
          createdAt: new Date(r.created_at).toISOString(),
        };
      });
      return {
        registros,
        totales: {
          total: registros.length,
          asistieron: registros.filter((r) => r.asistio).length,
          tiene: registros.filter((r) => r.websiteEstado === "tiene").length,
          sinWebsite: registros.filter((r) => r.websiteEstado === "sin_website").length,
          porVerificar: registros.filter((r) => r.websiteEstado === "por_verificar").length,
        },
      };
    }),

  /**
   * Protegido (PIN): asentar el website ya construido de un
   * registrado — replica exacta de lo que hace el panel de la
   * app (registro + su ticket de website).
   */
  adminAsentarWebsite: publicProcedure
    .input(
      z.object({
        pin: z.string().min(1).max(64),
        id: z.string().uuid(),
        websiteUrl: z.string().min(4).max(300),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      requireAdminPin(input.pin, ctx?.req?.ip ?? "legacy-admin");
      const url = urlWebsiteValida(input.websiteUrl) ?? input.websiteUrl.trim();
      const pool = getPool();
      const { rows } = await pool.query(
        `UPDATE legacy_prime_registros r
            SET website_url = $2, sin_website = false, updated_at = now()
          WHERE r.id = $1
            AND EXISTS (
              SELECT 1 FROM legacy_prime_enlaces e
               WHERE e.id = r.enlace_id AND e.contractor_id = $3
            )
          RETURNING r.id`,
        [input.id, url.slice(0, 300), CONTRYRRIS_CONTRACTOR_ID],
      );
      if (!rows.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      }
      await pool
        .query(
          `UPDATE legacy_prime_tickets SET website_url = $2, updated_at = now() WHERE registro_id = $1`,
          [input.id, url.slice(0, 300)],
        )
        .catch(() => undefined);
      return { ok: true as const };
    }),

  /**
   * Protegido (PIN): el check-in del dueño en la puerta del
   * evento — marca o desmarca la ASISTENCIA de un registrado.
   * La marca queda en la fila misma de legacy_prime_registros
   * (asistio + asistio_at con la hora del servidor al marcar;
   * al desmarcar, asistio_at vuelve a NULL). Como cada fila es
   * el registro de un evento concreto, la asistencia queda por
   * evento y el mismo checkbox sirve en todas las paradas
   * futuras sin tocar nada más.
   */
  adminMarcarAsistencia: publicProcedure
    .input(
      z.object({
        pin: z.string().min(1).max(64),
        id: z.string().uuid(),
        asistio: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      requireAdminPin(input.pin, ctx?.req?.ip ?? "legacy-admin");
      const pool = getPool();
      const { rows } = await pool.query(
        `UPDATE legacy_prime_registros r
            SET asistio = $2,
                asistio_at = CASE WHEN $2 THEN now() ELSE NULL END,
                updated_at = now()
          WHERE r.id = $1
            AND EXISTS (
              SELECT 1 FROM legacy_prime_enlaces e
               WHERE e.id = r.enlace_id AND e.contractor_id = $3
            )
          RETURNING r.asistio, r.asistio_at`,
        [input.id, input.asistio, CONTRYRRIS_CONTRACTOR_ID],
      );
      if (!rows.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registro no encontrado" });
      }
      return {
        ok: true as const,
        asistio: rows[0].asistio === true,
        asistioAt: rows[0].asistio_at
          ? new Date(rows[0].asistio_at).toISOString()
          : null,
      };
    }),
});
