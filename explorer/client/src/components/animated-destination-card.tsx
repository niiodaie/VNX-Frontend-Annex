import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Heart, ExternalLink, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import FootprintIntegration from "./footprint-integration";

interface AnimatedDestinationCardProps {
  destination: {
    id?: number;
    name: string;
    location: string;
    image: string;
    description: string;
    continent: string;
    type: string;
    slug?: string;
  };
  onExplore: (destination: any) => void;
}

export default function AnimatedDestinationCard({ destination, onExplore }: AnimatedDestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useTranslation();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    // Add heart animation effect
    const heartElement = e.currentTarget as HTMLElement;
    heartElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
      heartElement.style.transform = 'scale(1)';
    }, 200);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nature': return '🌿';
      case 'heritage': return '🏛️';
      case 'culture': return '🎭';
      case 'adventure': return '⛰️';
      case 'food': return '🍜';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nature': return 'bg-green-100 text-green-800';
      case 'heritage': return 'bg-amber-100 text-amber-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      case 'food': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
        isHovered ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Floating Sparkles Animation */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute top-12 left-6 w-3 h-3 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-8 right-8 w-3 h-3 text-purple-400 animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Image Container with Overlay Effects */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300`} />
        
        {/* Like Button with Animation */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getTypeColor(destination.type)} backdrop-blur-sm`}>
            <span className="mr-1">{getTypeIcon(destination.type)}</span>
            {destination.type === 'nature' ? (t as any)('nature') : 
             destination.type === 'heritage' ? (t as any)('heritage') : 
             destination.type === 'culture' ? (t as any)('culture') : 
             destination.type === 'adventure' ? (t as any)('adventure') : 
             destination.type === 'food' ? (t as any)('food') : destination.type}
          </Badge>
        </div>

        {/* Floating Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">4.8</span>
        </div>
      </div>

      <CardContent className="p-6 relative">
        {/* Location with Animated Pin */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${
                isHovered ? 'animate-bounce' : ''
              }`} />
              <span className="text-sm text-gray-500">{destination.location}</span>
            </div>
            <h3 className={`font-bold text-lg text-gray-900 transition-colors duration-300 ${
              isHovered ? 'text-blue-600' : ''
            }`}>
              {destination.name}
            </h3>
          </div>
        </div>

        {/* Description with Expand Animation */}
        <p className={`text-gray-600 mb-4 transition-all duration-300 ${
          showDetails ? 'max-h-full' : 'max-h-12 overflow-hidden'
        }`}>
          {destination.description}
        </p>

        {/* Action Buttons with Hover Effects */}
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onExplore(destination);
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('exploreNow')}
          </Button>
          
          <Button
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            className="px-3 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
          >
            <Clock className="w-4 h-4" />
          </Button>
        </div>

        {/* Expandable Details Section */}
        <div className={`overflow-hidden transition-all duration-500 ${
          showDetails ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-gray-200 pt-4">
            <FootprintIntegration 
              destination={{
                name: destination.name,
                slug: destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-'),
                image: destination.image
              }}
            />
          </div>
        </div>

        {/* Animated Border Effect */}
        <div className={`absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} 
             style={{ 
               background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)', 
               WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               WebkitMaskComposite: 'subtract'
             }} 
        />
      </CardContent>

      {/* Loading Shimmer Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      }`} />
    </Card>
  );
}