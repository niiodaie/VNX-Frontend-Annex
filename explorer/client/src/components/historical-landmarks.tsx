import { Landmark } from "lucide-react";
import { historicalLandmarks } from "@/data/travel-data";

export default function HistoricalLandmarks() {
  return (
    <section id="landmarks" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <Landmark className="inline-block text-orange-600 mr-3" />
            Historical Landmarks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Journey through time and explore monuments that shaped our world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {historicalLandmarks.map((landmark) => (
            <div key={landmark.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <img 
                src={landmark.imageUrl} 
                alt={landmark.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{landmark.name}</h3>
                <p className="text-gray-600 mb-3">{landmark.location}</p>
                <p className="text-sm text-gray-500">{landmark.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
