import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TrendingSection from "@/components/trending-section";
import PillarsSection from "@/components/pillars-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <TrendingSection />
      <PillarsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
