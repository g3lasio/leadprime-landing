import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import NetworkSection from "@/components/NetworkSection";
import IndustrySection from "@/components/IndustrySection";
import AIAgentSection from "@/components/AIAgentSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <NetworkSection />
      <IndustrySection />
      <AIAgentSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
