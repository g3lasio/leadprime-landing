/**
 * FAQ — Brief E4 (AEO). Answers the real queries people type into Google
 * and ask AI assistants. The copy lives in shared/faqs.ts, which also feeds
 * the FAQPage JSON-LD the server renders into the static HTML — the visible
 * answers and the structured data can't drift apart. Native <details> keeps
 * the text crawlable without JS execution.
 */
import { useLang } from "@/lib/i18n";
import { FAQS } from "@shared/faqs";

const COPY = {
  en: {
    title: { before: "Questions contractors", highlight: "actually ask." },
    compareLink: "See the full comparison →",
  },
  es: {
    title: { before: "Las preguntas que", highlight: "sí hacen los contratistas." },
    compareLink: "Ver la comparación completa (en inglés) →",
  },
} as const;

export default function FAQSection() {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <section id="faq" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
            <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              FAQ
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.title.before}
            <br />
            <span className="lp-text-gradient-cyan">{t.title.highlight}</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS[lang].map((f) => (
            <details
              key={f.q}
              className="lp-card rounded-xl group"
            >
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {f.q}
                </h3>
                <span
                  className="text-[#00D4FF] text-xl leading-none mt-0.5 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-white/65 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {f.a}
                  {f.compareLink && (
                    <>
                      {" "}
                      <a href="/compare/" className="text-[#00D4FF] font-semibold hover:underline">
                        {t.compareLink}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
