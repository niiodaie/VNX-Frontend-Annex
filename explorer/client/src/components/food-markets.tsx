import { Utensils } from "lucide-react";
import { foodMarkets } from "@/data/travel-data";

export default function FoodMarkets() {
  return (
    <section id="food" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <Utensils className="inline-block text-orange-600 mr-3" />
            Food & Markets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Savor authentic flavors and discover local culinary treasures
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodMarkets.map((market) => (
            <div key={market.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <img 
                src={market.imageUrl} 
                alt={market.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{market.name}</h3>
                <p className="text-gray-600 mb-3">{market.location}</p>
                <p className="text-sm text-gray-500 mb-4">{market.description}</p>
                <div className="flex items-center">
                  <span className={`${market.tagColor} px-2 py-1 rounded-full text-xs font-medium`}>
                    {market.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
