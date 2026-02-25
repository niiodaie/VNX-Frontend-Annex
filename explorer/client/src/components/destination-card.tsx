import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Omit<Destination, 'id'> & { id?: number };
  onExplore: (destination: DestinationCardProps['destination']) => void;
}

export default function DestinationCard({ destination, onExplore }: DestinationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nature': return 'bg-blue-100 text-blue-800';
      case 'heritage': return 'bg-emerald-100 text-emerald-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-indigo-100 text-indigo-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.imageUrl}
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
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs font-medium ${getTypeColor(destination.type)}`}>
            {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)}
          </Badge>
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs text-gray-600 ml-1">{destination.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{destination.name}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {destination.location}
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {destination.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button 
          onClick={() => onExplore(destination)}
          className="w-full bg-vnx-blue-600 hover:bg-vnx-blue-700 text-white font-medium transition-colors"
        >
          Explore
        </Button>
      </CardContent>
    </Card>
  );
}
