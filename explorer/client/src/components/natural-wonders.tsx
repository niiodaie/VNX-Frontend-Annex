import { Mountain } from "lucide-react";
import { naturalWonders } from "@/data/travel-data";

export default function NaturalWonders() {
  return (
    <section id="wonders" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <Mountain className="inline-block text-green-600 mr-3" />
            Natural Wonders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Breathtaking landscapes and natural phenomena that will leave you in awe
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {naturalWonders.map((wonder) => (
            <div key={wonder.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={wonder.imageUrl} 
                  alt={wonder.name}
                  className="w-full h-64 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{wonder.name}</h3>
                  <p className="text-sm text-gray-200">{wonder.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
