import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import ExploreDestinations from "@/components/ExploreDestinations";
import UniqueStays from "@/components/UniqueStays";
import HowItWorks from "@/components/HowItWorks";
import BecomeHost from "@/components/BecomeHost";
import Testimonials from "@/components/Testimonials";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "ExploreAfrica – Your Gateway to Unique Stays";
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturedListings />
      <ExploreDestinations />
      <UniqueStays />
      <HowItWorks />
      <BecomeHost />
      <Testimonials />
    </div>
  );
};

export default Home;
