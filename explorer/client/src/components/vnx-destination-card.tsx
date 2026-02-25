import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Plane, MapPin, Calendar, ShoppingBag } from "lucide-react";
import FootprintIntegration from "@/components/footprint-integration";
import { useTranslation } from "@/hooks/useTranslation";

interface VNXDestination {
  name: string;
  image: string;
  slug: string;
  description: string;
  continent: string;
  type: string;
}

interface VNXDestinationCardProps {
  destination: VNXDestination;
}

export default function VNXDestinationCard({ destination }: VNXDestinationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFootprint, setShowFootprint] = useState(false);
  const { t } = useTranslation();

  const handleFlightTracker = () => {
    window.open(`https://flight-tracker-viusmedia.replit.app?destination=${destination.slug}`, '_blank');
  };

  const handleGMPIntegration = () => {
    window.open(`https://travel-nexus-hub-viusmedia.replit.app/gmp?location=${destination.slug}`, '_blank');
  };

  const handleExploreEvents = () => {
    window.open(`https://vnx-directory.com/events?city=${destination.slug}`, '_blank');
  };

  const handleShopGear = () => {
    window.open(`https://www.amazon.com/s?k=travel+gear&tag=yourAffiliateTag`, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nature': return 'bg-emerald-100 text-emerald-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'heritage': return 'bg-amber-100 text-amber-800';
      case 'adventure': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <div className="absolute top-4 left-4">
          <Badge className={`text-xs font-medium ${getTypeColor(destination.type)}`}>
            {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-3">
          {destination.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleFlightTracker}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plane className="w-3 h-3 mr-1" />
            {t('trackFlights')}
          </Button>
          
          <Button
            onClick={handleGMPIntegration}
            size="sm"
            variant="outline"
            className="text-xs border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <MapPin className="w-3 h-3 mr-1" />
            VNX-GMP
          </Button>
          
          <Button
            onClick={handleExploreEvents}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {t('exploreEvents')}
          </Button>
          
          <Button
            onClick={handleShopGear}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            {t('shopGear')}
          </Button>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={() => setShowFootprint(!showFootprint)}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {showFootprint ? 'Hide' : 'Show'} {t('myFootprint')}
          </Button>
        </div>
        
        {showFootprint && (
          <FootprintIntegration destination={destination} />
        )}
      </CardContent>
    </Card>
  );
}