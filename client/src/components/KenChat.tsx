/**
 * Try KEN — live AI chat (Brief D5). SECURITY SETUP:
 *
 *  · The widget token comes ONLY from the VITE_KEN_WIDGET_TOKEN Railway
 *    variable — never hardcoded. When the variable is absent the entire
 *    section renders nothing (flag OFF by design, no personal-account
 *    fallback ever).
 *  · The token must belong to a DEDICATED LeadPrime widget loaded with
 *    public product knowledge only, backed by a capped wallet separate
 *    from any personal/production wallet. The production widget grants
 *    minimal permissions (chat + lead create) and enforces server-side
 *    limits; the visible note below sets visitor expectations.
 *  · Embed mechanism matches production: /api/widget/embed.js with a
 *    data-token attribute (see prod routes/websiteBuilder.ts).
 */
import { useEffect, useState } from "react";
import { APP_URL } from "@/lib/appLinks";

const KEN_WIDGET_TOKEN: string | undefined = import.meta.env.VITE_KEN_WIDGET_TOKEN;

/**
 * KEN's portrait. The owner-provided image lives at client/public/ken.png —
 * if it isn't there yet, we gracefully fall back to the brand monogram so
 * the section never shows a broken image.
 */
export function KenAvatar({ size = 40 }: { size?: number }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div
        className="rounded-full bg-[#00D4FF]/20 border-2 border-[#00D4FF]/50 flex items-center justify-center text-[#00D4FF] font-black"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        K
      </div>
    );
  }
  return (
    <img
      src="/ken.png"
      alt="KEN — LeadPrime AI assistant"
      width={size}
      height={size}
      loading="lazy"
      className="rounded-full object-cover border-2 border-[#00D4FF]/50"
      style={{ width: size, height: size }}
      onError={() => setBroken(true)}
    />
  );
}

export default function KenChat() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!KEN_WIDGET_TOKEN) return;
    if (document.getElementById("lp-ken-widget")) return;
    const s = document.createElement("script");
    s.id = "lp-ken-widget";
    s.src = `${APP_URL}/api/widget/embed.js`;
    s.async = true;
    s.setAttribute("data-token", KEN_WIDGET_TOKEN);
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, []);

  // Flag OFF: without the Railway env var, nothing renders at all.
  if (!KEN_WIDGET_TOKEN) return null;

  return (
    <section id="try-ken" className="py-24 bg-[#050B18] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
          <span className="text-sm font-semibold text-[#00D4FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Live Demo
          </span>
        </div>
        {/* KEN identity — /ken.png (owner-provided portrait); falls back to monogram */}
        <div className="flex justify-center mb-6">
          <KenAvatar size={88} />
        </div>
        <h2
          className="text-4xl lg:text-5xl font-black text-white mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Try KEN — <span className="lp-text-gradient-cyan">ask anything about LeadPrime.</span>
        </h2>
        <p className="text-lg text-white/60 max-w-xl mx-auto mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          This is the same AI that will work your pipeline. Ask it about
          features, pricing, or your trade — live, right now.
        </p>
        <button
          onClick={() => {
            // The embed script renders its own launcher; nudge it open if exposed.
            const w = window as any;
            if (typeof w.LeadPrimeWidget?.open === "function") w.LeadPrimeWidget.open();
            else document.querySelector<HTMLElement>("[data-lp-widget-launcher]")?.click();
          }}
          className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold"
        >
          {loaded ? "Chat with KEN" : "Loading KEN…"}
        </button>
        <p className="text-xs text-white/45 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          Demo assistant with public product info only · usage limits apply per visitor.
        </p>
      </div>
    </section>
  );
}
