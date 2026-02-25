import { Calendar } from "lucide-react";
import { culturalEvents } from "@/data/travel-data";

export default function CulturalEvents() {
  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <Calendar className="inline-block text-red-600 mr-3" />
            Cultural Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in vibrant festivals and cultural celebrations around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {culturalEvents.map((event) => (
            <div key={event.id} className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img 
                src={event.imageUrl} 
                alt={event.name}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className={`${event.color} text-white px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block`}>
                  {event.month}
                </span>
                <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                <p className="text-gray-200 mb-2">{event.location}</p>
                <p className="text-sm text-gray-300">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
