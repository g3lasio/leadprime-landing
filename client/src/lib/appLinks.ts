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
