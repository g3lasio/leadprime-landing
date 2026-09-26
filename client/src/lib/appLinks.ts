/**
 * Canonical links from the marketing landing into the production app.
 *
 * Marketing (this site)  → https://leadprimecrm.chyrris.com
 * Production app         → https://leadprime.chyrris.com
 *
 * Every CTA carries UTMs (utm_source=landing, utm_medium=cta,
 * utm_campaign=<section>) plus an `auth` intent hint so signup and login
 * can be measured and routed separately. Query params are safe for the
 * app: unknown params are ignored by the SPA router.
 */
export const APP_URL = "https://leadprime.chyrris.com";
export const LANDING_URL = "https://leadprimecrm.chyrris.com";

/**
 * Growth / Legacy primary CTA — "Agenda un diagnóstico gratis": the public
 * booking page of the "Chyrris Technologies" calendar resource in LeadPrime
 * (the contractor picks in person or Google Meet; it keeps gclid/utm_*).
 */
export const DIAGNOSTIC_BOOKING_URL = `${APP_URL}/book/chyrris-technologies`;

const ATTRIBUTION_KEY = "lp-attribution";

/** The gclid and utm_* params of a query string, in their original order. */
function attributionQuery(search: string): string {
  const picked = new URLSearchParams();
  new URLSearchParams(search).forEach((value, key) => {
    if (key === "gclid" || key.startsWith("utm_")) picked.append(key, value);
  });
  return picked.toString();
}

// Remember the ad attribution of the page the visitor landed on (per browser
// session): in-site navigation can drop the query string before they book.
try {
  const landing = attributionQuery(window.location.search);
  if (landing) window.sessionStorage.setItem(ATTRIBUTION_KEY, landing);
} catch {
  /* no window / blocked storage: only the current page's params are used */
}

/**
 * DIAGNOSTIC_BOOKING_URL carrying the current page's gclid and utm_* so the
 * booking keeps the ad click; falls back to the landing page's params when
 * the current URL has none.
 */
export function diagnosticBookingLink(): string {
  let query = attributionQuery(window.location.search);
  if (!query) {
    try {
      query = window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "";
    } catch {
      /* blocked storage */
    }
  }
  return query ? `${DIAGNOSTIC_BOOKING_URL}?${query}` : DIAGNOSTIC_BOOKING_URL;
}

/** Programs secondary CTA — "Ya hablé con el equipo" (enrollment in the app). */
export const PROGRAM_JOIN_URL = {
  growth: `${APP_URL}/join/growth`,
  legacy: `${APP_URL}/join/legacy`,
} as const;

export function appLink(
  campaign: string,
  intent: "signup" | "signin" = "signup",
): string {
  const params = new URLSearchParams({
    auth: intent,
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: campaign,
  });
  return `${APP_URL}/?${params.toString()}`;
}
