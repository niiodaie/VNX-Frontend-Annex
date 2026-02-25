import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ExternalLink, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FootprintEntry {
  id: string;
  destination: string;
  date: string;
  type: 'visited' | 'planned' | 'wishlist';
  notes?: string;
}

interface FootprintIntegrationProps {
  destination: {
    name: string;
    slug: string;
    image: string;
  };
}

export default function FootprintIntegration({ destination }: FootprintIntegrationProps) {
  const [footprintEntries, setFootprintEntries] = useState<FootprintEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  const handleAddToFootprint = async (type: 'visited' | 'planned' | 'wishlist') => {
    setIsAdding(true);
    
    // Simulate API call to travel-footprints service
    try {
      const response = await fetch(`https://travel-footprints-viusmedia.replit.app/api/footprint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: destination.name,
          slug: destination.slug,
          type,
          date: new Date().toISOString(),
          image: destination.image
        })
      });

      if (response.ok) {
        const newEntry: FootprintEntry = {
          id: Date.now().toString(),
          destination: destination.name,
          date: new Date().toISOString(),
          type
        };
        setFootprintEntries(prev => [...prev, newEntry]);
      }
    } catch (error) {
      // Redirect to VNX Travel Nexus Hub with destination context
      const vnxUrl = `https://travel-nexus-hub-viusmedia.replit.app/footprint?destination=${destination.slug}&name=${encodeURIComponent(destination.name)}&type=${type}&source=vnx-explorer`;
      window.open(vnxUrl, '_blank');
    }
    
    setIsAdding(false);
  };

  const handleViewFullFootprint = () => {
    window.open('https://travel-footprints-viusmedia.replit.app/', '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visited': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'wishlist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          {t('myFootprint')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleAddToFootprint('visited')}
              disabled={isAdding}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              Visited
            </Button>
            <Button
              size="sm"
              onClick={() => handleAddToFootprint('planned')}
              disabled={isAdding}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              Planning to Visit
            </Button>
            <Button
              size="sm"
              onClick={() => handleAddToFootprint('wishlist')}
              disabled={isAdding}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add to Wishlist
            </Button>
          </div>

          {footprintEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recent Additions:</h4>
              {footprintEntries.slice(-3).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getTypeColor(entry.type)}`}>
                      {entry.type}
                    </Badge>
                    <span className="text-sm text-gray-700">{entry.destination}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewFullFootprint}
            className="w-full mt-3"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {t('viewFootprint')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}