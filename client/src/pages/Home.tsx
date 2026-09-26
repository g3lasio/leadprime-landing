import { Redirect, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import NetworkSection from "@/components/NetworkSection";
import IndustrySection from "@/components/IndustrySection";
import SuperCapabilitiesSection from "@/components/SuperCapabilitiesSection";
import AIAgentSection from "@/components/AIAgentSection";
import ComparisonSection from "@/components/ComparisonSection";
import PricingSection from "@/components/PricingSection";
import ProgramsSection from "@/components/ProgramsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import KeenWidget from "@/components/KeenWidget";
import {
  LangContext,
  preferredLang,
  usePageMeta,
  useScrollToHash,
} from "@/lib/i18n";
import { HOME_PATH, pageMetaFor } from "@shared/pageMeta";

/** "/" is English and "/es" Spanish; a Spanish browser landing on "/" goes to "/es". */
export default function Home() {
  const [location] = useLocation();
  const lang = pageMetaFor(location)?.lang ?? "en";
  const toSpanish = lang === "en" && preferredLang() === "es";
  usePageMeta(HOME_PATH[lang]);
  useScrollToHash(!toSpanish);

  if (toSpanish) {
    // Keep ?gclid/utm_* and #anchors through the redirect.
    return (
      <Redirect
        to={`${HOME_PATH.es}${window.location.search}${window.location.hash}`}
        replace
      />
    );
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-[#050B18]">
        <Navbar logoInHero />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <FeaturesSection />
          <NetworkSection />
          <IndustrySection />
          <SuperCapabilitiesSection />
          <AIAgentSection />
          <ComparisonSection />
          <PricingSection />
          <ProgramsSection />
          <FAQSection />
        </main>
        <Footer />
        {/* KEEN floating chat — present through the whole scroll (Brief F3) */}
        <KeenWidget />
      </div>
    </LangContext.Provider>
  );
}
