import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FAQS } from "@shared/faqs";
import { PAGE_META, pageMetaFor } from "@shared/pageMeta";
import { renderLandingHtml } from "./_core/landingHtml";

const template = fs.readFileSync(
  path.resolve(import.meta.dirname, "..", "client", "index.html"),
  "utf-8"
);

const jsonLdBlocks = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    m => JSON.parse(m[1])
  );

describe("renderLandingHtml", () => {
  it("serves /es with a Spanish head, hreflang pair, and Spanish FAQ JSON-LD", () => {
    const html = renderLandingHtml(template, PAGE_META["/es"]);
    expect(html).toContain('<html lang="es"');
    expect(html).toContain(`<title>${PAGE_META["/es"].title}</title>`);
    expect(html).toContain('<link rel="canonical" href="https://leadprimecrm.chyrris.com/es" />');
    expect(html).toContain('hreflang="en" href="https://leadprimecrm.chyrris.com/"');
    expect(html).toContain('hreflang="es" href="https://leadprimecrm.chyrris.com/es"');
    expect(html).toContain('<meta property="og:locale" content="es_US" />');
    expect(html).toContain("https://leadprimecrm.chyrris.com/og-image-es.png");
    expect(html).not.toContain(PAGE_META["/"].title);

    const faq = jsonLdBlocks(html).find(b => b["@type"] === "FAQPage");
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      FAQS.es.map(f => f.q)
    );
  });

  it("keeps prices intact (no $1 capture-group substitution)", () => {
    const html = renderLandingHtml(template, PAGE_META["/programas"]);
    expect(html).toContain("Legacy ($1,200/mes)");
    expect(html).toContain("Growth ($650/mes)");
  });

  it("omits the FAQPage on the programs pages, which have no visible FAQ", () => {
    const html = renderLandingHtml(template, PAGE_META["/programs"]);
    expect(html).toContain('<html lang="en"');
    expect(jsonLdBlocks(html).some(b => b["@type"] === "FAQPage")).toBe(false);
    expect(html).not.toContain("<!--lp:");
  });

  it("renders every page with valid JSON-LD and no leftover placeholders", () => {
    for (const meta of Object.values(PAGE_META)) {
      const html = renderLandingHtml(template, meta);
      expect(html).not.toContain("<!--lp:");
      expect(() => jsonLdBlocks(html)).not.toThrow();
      expect(html).toContain(
        `<meta name="description" content="${meta.description.replace(/&/g, "&amp;")}" />`
      );
    }
  });
});

describe("pageMetaFor", () => {
  it("normalizes case and trailing slashes", () => {
    expect(pageMetaFor("/ES/")?.path).toBe("/es");
    expect(pageMetaFor("/Programas")?.path).toBe("/programas");
    expect(pageMetaFor("/")?.path).toBe("/");
    expect(pageMetaFor("/support")).toBeUndefined();
  });
});
