import { MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Places</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Explore the world's most scenic destinations and cultural treasures with our interactive travel platform
          </p>
        </div>
        
        {/* Interactive Map Placeholder */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center h-96 bg-white/5 rounded-xl border-2 border-dashed border-white/30">
            <div className="text-center">
              <MapPin className="mx-auto text-6xl text-white/60 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Interactive World Map</h3>
              <p className="text-white/80">Click on regions to discover amazing destinations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
