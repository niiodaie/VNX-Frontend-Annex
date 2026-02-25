import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import NaturalWonders from "@/components/natural-wonders";
import HistoricalLandmarks from "@/components/historical-landmarks";
import CulturalEvents from "@/components/cultural-events";
import FoodMarkets from "@/components/food-markets";
import AffiliateBooking from "@/components/affiliate-booking";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <NaturalWonders />
        <HistoricalLandmarks />
        <CulturalEvents />
        <FoodMarkets />
        <AffiliateBooking />
      </main>
      <Footer />
    </div>
  );
}
