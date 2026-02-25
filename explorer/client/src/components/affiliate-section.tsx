import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Ticket, Camera, ShoppingBag } from "lucide-react";

export default function AffiliateSection() {
  const handleAffiliateClick = (partner: string) => {
    const partnerUrls: Record<string, string> = {
      'getyourguide': 'https://www.getyourguide.com/?partner_id=vnx-explorer',
      'amazon-travel': 'https://amazon.com/travel-gear?tag=vnx-explorer-20',
      'viator': 'https://www.viator.com/?mcid=vnx-explorer'
    };
    
    const url = partnerUrls[partner];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Trip
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for your next adventure
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GetYourGuide Integration */}
          <Card className="bg-gradient-to-br from-blue-500 to-vnx-blue-600 text-white relative overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-8 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">🎟️ Book Tours</h3>
              <p className="text-blue-100 mb-6">
                Discover guided tours, skip-the-line tickets, and unique local experiences
              </p>
              <Button 
                onClick={() => handleAffiliateClick('getyourguide')}
                className="bg-white text-vnx-blue-600 hover:bg-blue-50 font-semibold"
              >
                Explore GetYourGuide
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Amazon Photography Gear */}
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white relative overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-8 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">📷 Capture Moments</h3>
              <p className="text-orange-100 mb-6">
                Professional cameras, lenses, and accessories for stunning travel photography
              </p>
              <Button 
                onClick={() => handleAffiliateClick('amazon-cameras')}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Shop Amazon Cameras
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Travel Essentials */}
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white relative overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-8 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">🧳 Travel Essentials</h3>
              <p className="text-emerald-100 mb-6">
                Quality luggage, comfort items, and gear to make your journey smoother
              </p>
              <Button 
                onClick={() => handleAffiliateClick('amazon-travel')}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
              >
                Shop Travel Gear
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
