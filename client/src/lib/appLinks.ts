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
 * Growth / Legacy primary CTA — "Agenda un diagnóstico gratis".
 *
 * PENDING: replace with the public booking URL of the "Chyrris Technologies"
 * calendar resource in LeadPrime. No public URL could be confirmed when the
 * Programs section shipped, so until then the CTA opens an email to the
 * published support inbox (same address as /support).
 */
export const DIAGNOSTIC_BOOKING_URL =
  "mailto:info@chyrris.com?subject=Quiero%20agendar%20mi%20diagn%C3%B3stico%20gratis";

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
