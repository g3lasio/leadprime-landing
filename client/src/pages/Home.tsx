import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import NetworkSection from "@/components/NetworkSection";
import IndustrySection from "@/components/IndustrySection";
import AIAgentSection from "@/components/AIAgentSection";
import ComparisonSection from "@/components/ComparisonSection";
import KenChat from "@/components/KenChat";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

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
        <AIAgentSection />
        <ComparisonSection />
        <KenChat />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
