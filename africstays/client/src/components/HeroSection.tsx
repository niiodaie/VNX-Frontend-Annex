import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const backgroundImages = [
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
  "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
  "https://images.unsplash.com/photo-1489493512598-d08130f49bea",
  "https://images.unsplash.com/photo-1496497243327-9dccd845c35f",
];

const HeroSection = () => {
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = backgroundImages.indexOf(backgroundImage);
      const nextIndex = (currentIndex + 1) % backgroundImages.length;
      setBackgroundImage(backgroundImages[nextIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [backgroundImage]);

  return (
    <section className="pt-20 md:pt-0 relative min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-4 leading-tight">
            Discover the Richness of Africa – Find Your Perfect Stay
          </h1>
          <p className="text-xl text-white mb-8">
            Explore unique accommodations and unforgettable experiences across the African continent
          </p>
        </div>
        
        <SearchBar className="max-w-5xl mx-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
