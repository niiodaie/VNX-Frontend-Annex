import { Ticket, MapPin, Mountain, Utensils, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AffiliateBooking() {
  const handleCityTours = () => {
    console.log("City tours clicked");
  };

  const handleAdventures = () => {
    console.log("Adventures clicked");
  };

  const handleFoodExperiences = () => {
    console.log("Food experiences clicked");
  };

  return (
    <section id="booking" className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <Ticket className="inline-block text-white mr-3" />
            Book Your Adventure
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to explore? Book tours, activities, and experiences through our trusted partners
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">City Tours</h3>
              <p className="text-gray-600 mb-6">Guided tours of historical sites and cultural landmarks</p>
              <Button 
                onClick={handleCityTours}
                className="bg-blue-600 text-white hover:bg-blue-700 w-full"
              >
                Browse Tours
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Adventure Activities</h3>
              <p className="text-gray-600 mb-6">Hiking, climbing, and outdoor adventure experiences</p>
              <Button 
                onClick={handleAdventures}
                className="bg-green-600 text-white hover:bg-green-700 w-full"
              >
                Find Adventures
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Food Experiences</h3>
              <p className="text-gray-600 mb-6">Cooking classes, food tours, and culinary experiences</p>
              <Button 
                onClick={handleFoodExperiences}
                className="bg-orange-600 text-white hover:bg-orange-700 w-full"
              >
                Taste Local Flavors
              </Button>
            </div>
          </div>
        </div>
        
        {/* GetYourGuide Integration Placeholder */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Powered by GetYourGuide</h3>
            <p className="text-blue-100 mb-6">Book verified experiences with instant confirmation and flexible cancellation</p>
            <div className="bg-white/5 rounded-xl p-6 border-2 border-dashed border-white/30">
              <Search className="mx-auto text-4xl text-white/60 mb-4" />
              <p className="text-white/80">GetYourGuide booking widget will be integrated here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
