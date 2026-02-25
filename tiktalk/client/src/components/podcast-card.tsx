import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Users, Calendar, MoreHorizontal } from "lucide-react";

interface PodcastCardProps {
  podcast: {
    id: number;
    title: string;
    description?: string;
    coverImageUrl?: string;
    category?: string;
    creator: {
      firstName?: string;
      lastName?: string;
    };
    _count: {
      episodes: number;
      follows: number;
    };
    createdAt?: string;
  };
  compact?: boolean;
}

export default function PodcastCard({ podcast, compact = false }: PodcastCardProps) {
  const handleCardClick = () => {
    window.location.href = `/podcast/${podcast.id}`;
  };

  const getCreatorName = () => {
    const firstName = podcast.creator.firstName || "";
    const lastName = podcast.creator.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Creator";
  };

  if (compact) {
    return (
      <Card 
        className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <div className="flex items-center space-x-4 p-4">
          <img 
            src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=80&h=80&fit=crop"}
            alt={podcast.title}
            className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{podcast.title}</h3>
            <p className="text-sm text-gray-600 mb-2">by {getCreatorName()}</p>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>{podcast._count.episodes} episodes</span>
              <span>{podcast._count.follows} followers</span>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=240&fit=crop"}
          alt={podcast.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Button 
            size="lg"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.stopPropagation();
              // Handle play action
            }}
          >
            <Play className="w-6 h-6 mr-2" />
            Play Latest
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {podcast.title}
          </h3>
          <Button variant="ghost" size="icon" className="flex-shrink-0 ml-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">by {getCreatorName()}</p>
        
        {podcast.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {podcast.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-1" />
              {podcast._count.episodes} episodes
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {podcast._count.follows} followers
            </div>
          </div>
          
          {podcast.category && (
            <Badge variant="secondary" className="text-xs">
              {podcast.category}
            </Badge>
          )}
        </div>
        
        {podcast.createdAt && (
          <div className="flex items-center text-xs text-gray-400 mt-3">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(podcast.createdAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
