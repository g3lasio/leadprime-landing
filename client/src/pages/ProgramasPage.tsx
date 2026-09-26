/**
 * /programas (Spanish, default) and /programs (English) — the Growth and
 * Legacy programs as a standalone page, the link the call agency can send
 * after a call. Same section and copy as the home page's #programas.
 */
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ProgramsSection from "@/components/ProgramsSection";
import Footer from "@/components/Footer";
import KeenWidget from "@/components/KeenWidget";
import { LangContext, usePageMeta, useScrollToHash } from "@/lib/i18n";
import { PROGRAMS_PATH, pageMetaFor } from "@shared/pageMeta";

export default function ProgramasPage() {
  const [location] = useLocation();
  const lang = pageMetaFor(location)?.lang ?? "es";
  usePageMeta(PROGRAMS_PATH[lang]);
  useScrollToHash();

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-[#050B18]">
        <Navbar />
        <main className="pt-16 lg:pt-20">
          <ProgramsSection standalone />
        </main>
        <Footer variant="programs" />
        <KeenWidget />
      </div>
    </LangContext.Provider>
  );
}
