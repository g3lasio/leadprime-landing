/**
 * Localized static HTML for the bilingual marketing pages.
 *
 * The SPA ships a single client/index.html (English defaults). For every page
 * in PAGE_META this swaps the <head> — <html lang>, title, description,
 * canonical, Open Graph/Twitter tags, hreflang alternates — and injects the
 * FAQPage JSON-LD in the page's language, so /es and /programas reach
 * crawlers and the Google Ads landing-page check already in Spanish, with
 * zero JS required.
 */
import { faqPageJsonLd } from "@shared/faqs";
import { PAGE_META, SITE_URL, type PageMeta } from "@shared/pageMeta";

const OG_LOCALE = { en: "en_US", es: "es_US" } as const;
const LANGUAGE_NAME = { en: "English", es: "Spanish" } as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const absoluteUrl = (pagePath: string) =>
  SITE_URL + (pagePath === "/" ? "/" : pagePath);

// Replacer functions (not strings) everywhere below: copy like "$1,200/mes"
// would otherwise be read as a "$1" capture-group reference.
function setMeta(
  html: string,
  attr: "name" | "property",
  key: string,
  value: string
): string {
  const tag = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  return html.replace(tag, (_m, open, close) => open + escapeHtml(value) + close);
}

function jsonLdScript(data: unknown): string {
  // "<" escaped so no string inside the JSON can close the <script> early.
  const json = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${json}\n    </script>`;
}

function alternateLinks(meta: PageMeta): string {
  const other = PAGE_META[meta.alternate];
  const en = meta.lang === "en" ? meta : other;
  const es = meta.lang === "es" ? meta : other;
  return [
    `<link rel="alternate" hreflang="en" href="${absoluteUrl(en.path)}" />`,
    `<link rel="alternate" hreflang="es" href="${absoluteUrl(es.path)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(en.path)}" />`,
  ].join("\n    ");
}

export function renderLandingHtml(template: string, meta: PageMeta): string {
  const url = absoluteUrl(meta.path);
  const ogImage = SITE_URL + meta.ogImage;
  let html = template
    .replace(/<html lang="[^"]*"/, () => `<html lang="${meta.lang}"`)
    .replace(
      /<title>[\s\S]*?<\/title>/,
      () => `<title>${escapeHtml(meta.title)}</title>`
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      (_m, open, close) => open + url + close
    );
  html = setMeta(html, "name", "description", meta.description);
  html = setMeta(html, "name", "language", LANGUAGE_NAME[meta.lang]);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:image", ogImage);
  html = setMeta(html, "property", "og:image:alt", meta.ogImageAlt);
  html = setMeta(html, "property", "og:locale", OG_LOCALE[meta.lang]);
  html = setMeta(
    html,
    "property",
    "og:locale:alternate",
    OG_LOCALE[PAGE_META[meta.alternate].lang]
  );
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.description);
  html = setMeta(html, "name", "twitter:image", ogImage);
  return html
    .replace("<!--lp:alternates-->", () => alternateLinks(meta))
    .replace("<!--lp:faq-jsonld-->", () =>
      meta.hasFaq ? jsonLdScript(faqPageJsonLd(meta.lang)) : ""
    );
}
