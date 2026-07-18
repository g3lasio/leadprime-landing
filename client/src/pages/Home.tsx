import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import NetworkSection from "@/components/NetworkSection";
import IndustrySection from "@/components/IndustrySection";
import AdaptsSection from "@/components/AdaptsSection";
import SuperCapabilitiesSection from "@/components/SuperCapabilitiesSection";
import AIAgentSection from "@/components/AIAgentSection";
import ComparisonSection from "@/components/ComparisonSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import KeenWidget from "@/components/KeenWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <NetworkSection />
        <IndustrySection />
        <AdaptsSection />
        <SuperCapabilitiesSection />
        <AIAgentSection />
        <ComparisonSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
      {/* KEEN floating chat — present through the whole scroll (Brief F3) */}
      <KeenWidget />
    </div>
  );
}
