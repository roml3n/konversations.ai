import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustSection";
import MissionStatement from "@/components/sections/MissionStatement";
import WhyKonversationsSection from "@/components/sections/WhyKonversationsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
// import InteractiveDemoSection from "@/components/sections/InteractiveDemoSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <MissionStatement />
      <FeaturesSection />
      <WhyKonversationsSection />
      <Footer />
    </>
  );
}
