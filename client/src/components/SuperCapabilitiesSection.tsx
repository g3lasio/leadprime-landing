/**
 * Super-Capabilities — Brief G. The four tools that alone justify switching,
 * each verified against production before publishing:
 *   1. LeadSign AI signer/field mapping  → services/leadsign/aiDraftService.ts
 *      (4-layer detection: AcroForm → markers → Claude Vision, role-based)
 *   2. Contract Builder → sign, one flow → services/contracts/contractGenerator.ts
 *      + leadsign/leadsignIntegration.ts
 *   3. GovPrime (SAM.gov matching)       → services/govprime/* + samGovService.ts
 *   4. Business Health Passport          → profile/documentTrackingService.ts +
 *      expirationAlertService.ts (workers_comp & w9_form are real doc types)
 *
 * Legal guardrails: competitor prices are publicly reported ranges (footnote,
 * Jul 2026); savings figures are framed as typical examples, not guarantees.
 * All visuals use 100% fictional data.
 */
import { appLink } from "@/lib/appLinks";

function TimeCompare({ them, themLabel, us, usLabel }: { them: string; themLabel: string; us: string; usLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
        <p className="text-lg font-black text-white/45 line-through" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{them}</p>
        <p className="text-[11px] text-white/55 mt-0.5">{themLabel}</p>
      </div>
      <div className="rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 p-3.5 text-center">
        <p className="text-lg font-black text-[#10B981]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{us}</p>
        <p className="text-[11px] text-white/65 mt-0.5">{usLabel}</p>
      </div>
    </div>
  );
}

export default function SuperCapabilitiesSection() {
  return (
    <section id="super-capabilities" className="py-24 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 max-w-full h-96 bg-[#10B981]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 max-w-full h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 mb-6">
            <span className="text-sm font-semibold text-[#10B981]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Super-Capabilities
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tools that replace
            <br />
            <span className="lp-text-gradient-cyan">$1,000s in software & pro fees.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Four capabilities that usually mean four separate subscriptions —
            included in LeadPrime.
          </p>
        </div>

        <div className="space-y-10 max-w-5xl mx-auto">
          {/* 1 — LeadSign vs DocuSign */}
          <div className="lp-card lp-border-cyan rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-2">E-Sign with AI · vs DocuSign</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LeadSign — sign contracts in <span className="lp-text-gradient-cyan">90 seconds</span>, not 20 minutes.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Upload any document and LeadPrime's AI automatically maps the
                signer names and fields. Send for signature in one click. What
                typically takes ~20 minutes of manual setup in other tools is
                done in about 90 seconds here.
              </p>
              <p className="text-xs text-white/65 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                For realtors, title companies, lenders — anyone who moves a lot
                of paperwork.
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                DocuSign gates its AI field-mapping behind IAM Professional
                (~$75/user/mo, 3-user minimum, publicly reported Jul 2026) and
                meters envelopes. LeadPrime includes AI mapping with no
                enterprise tier and no per-document toll.
              </p>
              <TimeCompare them="~20 min" themLabel="manual field setup elsewhere" us="~90 sec" usLabel="AI-mapped in LeadPrime" />
            </div>
            {/* Mini-mockup: upload → mapped → sent (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">LeadSign · demo data</p>
              <div className="space-y-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">Remodel-Agreement-demo.pdf</p>
                    <p className="text-[10px] text-white/55">Uploaded · 3 pages</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF] font-bold">AI scan</span>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1.5">Signers detected automatically</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                    <p className="text-xs text-white/85">Maria G. (Client) — signature ×2, date</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <p className="text-xs text-white/85">R. Bautista (Contractor) — signature, initials</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 px-3 py-2.5 flex items-center gap-2 lp-mock-pulse">
                  <span className="text-[#10B981] font-bold text-xs">✓ Sent for signature</span>
                  <span className="text-[10px] text-white/55">· 92 seconds total</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Contract Builder vs Rocket Lawyer / LawDepot */}
          <div className="lp-card lp-border-amber rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">Contract Builder · vs Rocket Lawyer / LawDepot</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Generate a <span className="lp-text-gradient-amber">ready-to-sign contract</span> in 90 seconds.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Build your contract and send it for signature in one flow — no
                blank template to fill in by hand. A contractor's agreement
                that can run ~$900 with an attorney (typical example, not a
                quote) is done in about 90 seconds.
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rocket Lawyer (~$39.99/mo) and LawDepot (~$35/mo, or
                $7.50–$119 per document; publicly reported Jul 2026) sell
                templates you fill in yourself — no AI mapping, no e-sign in
                the same flow. LeadPrime generates the contract AND leaves it
                ready for signature in one step.
              </p>
              <TimeCompare them="~$900" themLabel="typical attorney-drafted agreement" us="included" usLabel="generated + ready to sign" />
            </div>
            {/* Mini-mockup: pick type → generated → ready (fictional) */}
            <div className="lp-card rounded-xl p-5 border border-white/10 lg:order-1" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">Contract Builder · demo data</p>
              <div className="space-y-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1">1 · Choose contract type</p>
                  <p className="text-xs font-semibold text-white">Kitchen remodel agreement — CA</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                  <p className="text-[10px] text-white/55 mb-1">2 · Generated with your scope</p>
                  <p className="text-xs text-white/85">Payment milestones · change orders · lien-law notices</p>
                </div>
                <div className="rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 px-3 py-2.5 flex items-center gap-2 lp-mock-pulse">
                  <span className="text-[#10B981] font-bold text-xs">✓ Ready for signature</span>
                  <span className="text-[10px] text-white/55">· via LeadSign</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 — GovPrime */}
          <div className="lp-card lp-border-cyan rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-2">GovPrime · public-work radar</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Find <span className="lp-text-gradient-cyan">government contracts</span> that match your trade.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                LeadPrime scans federal and state opportunities from SAM.gov
                and public sources, and matches them to your trade and
                location — so you find public work you'd never see otherwise.
                Finding the opportunity is our job; winning the bid is yours.
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                For contractors who want a way into public work without hiring
                a bid-search service.
              </p>
            </div>
            {/* Mini-mockup: opportunity radar (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">GovPrime · demo data</p>
              <div className="space-y-2.5">
                {[
                  { t: "Roof replacement — county library", m: "Federal · matches: Roofing · closes in 12 days", pct: "94%" },
                  { t: "Sidewalk & ADA ramps package", m: "State · matches: Concrete & Masonry", pct: "88%" },
                  { t: "HVAC retrofit — school district", m: "State · matches: HVAC · pre-bid meeting soon", pct: "81%" },
                ].map((o) => (
                  <div key={o.t} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{o.t}</p>
                      <p className="text-[10px] text-white/55">{o.m}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF] font-bold shrink-0">{o.pct} match</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 — Business Health Passport */}
          <div className="lp-card lp-border-amber rounded-2xl p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">Business Health Passport · compliance shield</p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Never miss a <span className="lp-text-gradient-amber">license, renewal, or fine.</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Track your licenses, insurance, W-9, and workers' comp in one
                place. LeadPrime warns you before anything expires — so an
                expired license or missing document never turns into a fine.
              </p>
              <p className="text-xs text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                Contracting without an active license can mean fines in the
                thousands — in some states well into five figures. LeadPrime
                keeps you covered before it gets there.
              </p>
            </div>
            {/* Mini-mockup: passport statuses (fictional data) */}
            <div className="lp-card rounded-xl p-5 border border-white/10 lg:order-1" aria-hidden="true">
              <p className="text-[10px] uppercase tracking-wider text-white/45 mb-3">Business Health Passport · demo data</p>
              <div className="space-y-2.5">
                {[
                  { d: "Contractor license — C-33", s: "Current", c: "#10B981", note: "renews Mar 2027" },
                  { d: "General liability insurance", s: "Expiring soon", c: "#F59E0B", note: "34 days left · reminder sent" },
                  { d: "Workers' comp certificate", s: "Current", c: "#10B981", note: "on file" },
                  { d: "W-9 on file", s: "Action needed", c: "#EF4444", note: "new EIN — re-upload" },
                ].map((r) => (
                  <div key={r.d} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.c }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{r.d}</p>
                      <p className="text-[10px] text-white/55">{r.note}</p>
                    </div>
                    <span className="text-[10px] font-bold shrink-0" style={{ color: r.c }}>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={appLink("super-capabilities", "signup")}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-block"
          >
            Get all four — start free at $0
          </a>
          <p className="text-xs text-white/65 mt-5 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Competitor pricing based on publicly reported figures, July 2026
            (DocuSign IAM Professional, Rocket Lawyer, LawDepot); plans and
            prices vary and may change. Time and cost figures are typical
            examples, not guarantees. All screens shown with fictional demo
            data.
          </p>
        </div>
      </div>
    </section>
  );
}
