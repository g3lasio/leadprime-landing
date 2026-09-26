/**
 * Per-route <head> metadata for the bilingual marketing pages — one source of
 * truth for the server (server/_core/landingHtml.ts renders it into the static
 * HTML, so crawlers and Google Ads read the localized title/description
 * without executing JS) and the client (document.title on SPA navigation).
 *
 * Copy is aligned with the hero on purpose: title/description feed the
 * Google Ads landing-page Quality Score.
 */

export type Lang = "en" | "es";

export const SITE_URL = "https://leadprimecrm.chyrris.com";

export type PagePath = "/" | "/es" | "/programs" | "/programas";

export type PageMeta = {
  path: PagePath;
  lang: Lang;
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  /** Same page in the other language (hreflang + the EN/ES toggle). */
  alternate: PagePath;
  /** Home pages render the visible FAQ, so they carry the FAQPage JSON-LD. */
  hasFaq: boolean;
};

export const PAGE_META: Record<PagePath, PageMeta> = {
  "/": {
    path: "/",
    lang: "en",
    title:
      "LeadPrime — The business partner that runs your contracting business",
    description:
      "Your intelligent business partner — built by a contractor from Fairfield, California. Estimates, contracts, payments, and your license up to date, in English & Spanish.",
    ogImage: "/og-image.png?v=2",
    ogImageAlt:
      "LeadPrime — Your intelligent business partner. Built for contractors.",
    alternate: "/es",
    hasFaq: true,
  },
  "/es": {
    path: "/es",
    lang: "es",
    title: "LeadPrime — El socio que lleva tu negocio de contratista",
    description:
      "Tu socio de negocios inteligente — hecho por un contratista de Fairfield, California. Estimados, contratos, cobros y tu licencia al día, en español. Empieza gratis.",
    ogImage: "/og-image-es.png",
    ogImageAlt:
      "LeadPrime — Tu socio de negocios inteligente. Hecho para contratistas.",
    alternate: "/",
    hasFaq: true,
  },
  "/programs": {
    path: "/programs",
    lang: "en",
    title: "Growth & Legacy programs for contractors | LeadPrime",
    description:
      "Growth ($650/mo): we build the machine, you run it. Legacy ($1,200/mo): we build it and run it with you. Both include LeadPrime Elite software. Book a free diagnostic.",
    ogImage: "/og-image.png?v=2",
    ogImageAlt:
      "LeadPrime — Your intelligent business partner. Built for contractors.",
    alternate: "/programas",
    hasFaq: false,
  },
  "/programas": {
    path: "/programas",
    lang: "es",
    title: "Programas Growth y Legacy para contratistas | LeadPrime",
    description:
      "Growth ($650/mes): te construimos la máquina y tú la operas. Legacy ($1,200/mes): te la construimos y la operamos contigo. Ambos incluyen LeadPrime Elite. Agenda un diagnóstico gratis.",
    ogImage: "/og-image-es.png",
    ogImageAlt:
      "LeadPrime — Tu socio de negocios inteligente. Hecho para contratistas.",
    alternate: "/programs",
    hasFaq: false,
  },
};

/** Home page for each language (nav anchors like `#pricing` live there). */
export const HOME_PATH: Record<Lang, PagePath> = { en: "/", es: "/es" };

/** Standalone programs page for each language. */
export const PROGRAMS_PATH: Record<Lang, PagePath> = {
  en: "/programs",
  es: "/programas",
};

/** Resolves a request/location path ("/ES/", "/programas") to its page. */
export function pageMetaFor(pathname: string): PageMeta | undefined {
  const normalized = (pathname.replace(/\/+$/, "") || "/").toLowerCase();
  return PAGE_META[normalized as PagePath];
}
