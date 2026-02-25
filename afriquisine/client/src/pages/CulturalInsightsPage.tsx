import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Info, Globe, Book, Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Types for cultural insights
interface CulturalInsight {
  id: number;
  title: string;
  content: string;
  cuisineType: string;
  region: string;
  imageUrl: string;
}

// Types for food origin stories
interface FoodOriginStory {
  id: number;
  dishName: string;
  cuisineType: string;
  country: string;
  storyContent: string;
  historicalPeriod?: string;
  imageUrl?: string;
}

export default function CulturalInsightsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<CulturalInsight | null>(null);
  const [selectedStory, setSelectedStory] = useState<FoodOriginStory | null>(null);
  
  // Cultural Insights Query
  const { 
    data: insights, 
    isLoading: insightsLoading, 
    error: insightsError 
  } = useQuery({
    queryKey: ['/api/cultural-insights'],
    queryFn: async () => {
      const response = await fetch('/api/cultural-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch cultural insights');
      }
      const data = await response.json();
      return data.insights as CulturalInsight[];
    }
  });

  // Food Origin Stories Query
  const { 
    data: stories, 
    isLoading: storiesLoading, 
    error: storiesError 
  } = useQuery({
    queryKey: ['/api/food-origin-stories'],
    queryFn: async () => {
      const response = await fetch('/api/food-origin-stories');
      if (!response.ok) {
        throw new Error('Failed to fetch food origin stories');
      }
      const data = await response.json();
      return data.stories as FoodOriginStory[];
    }
  });

  // Filter insights and stories based on search query
  const filteredInsights = React.useMemo(() => {
    if (!insights || !searchQuery.trim()) return insights;
    
    const query = searchQuery.toLowerCase();
    return insights.filter(insight => 
      insight.title.toLowerCase().includes(query) || 
      insight.content.toLowerCase().includes(query) || 
      insight.cuisineType.toLowerCase().includes(query) || 
      insight.region.toLowerCase().includes(query)
    );
  }, [insights, searchQuery]);

  const filteredStories = React.useMemo(() => {
    if (!stories || !searchQuery.trim()) return stories;
    
    const query = searchQuery.toLowerCase();
    return stories.filter(story => 
      story.dishName.toLowerCase().includes(query) || 
      story.storyContent.toLowerCase().includes(query) || 
      story.cuisineType.toLowerCase().includes(query) || 
      story.country.toLowerCase().includes(query) ||
      (story.historicalPeriod && story.historicalPeriod.toLowerCase().includes(query))
    );
  }, [stories, searchQuery]);

  // Get color based on region
  const getRegionColor = (region: string): string => {
    const lowerRegion = region.toLowerCase();
    if (lowerRegion.includes('north')) return 'from-orange-500 to-amber-600';
    if (lowerRegion.includes('west')) return 'from-green-500 to-emerald-600';
    if (lowerRegion.includes('east')) return 'from-red-500 to-rose-600';
    if (lowerRegion.includes('south')) return 'from-yellow-500 to-amber-500';
    if (lowerRegion.includes('central')) return 'from-purple-500 to-indigo-600';
    return 'from-blue-500 to-indigo-600';
  };

  // Loading state
  if (insightsLoading || storiesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (insightsError || storiesError) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Cultural Information</h1>
        <p className="text-gray-600 mb-6">
          We couldn't load cultural insights and food origin stories. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">African Culinary Heritage</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Dive into the rich cultural heritage, traditions, and stories behind African cuisine.
          Learn how food connects people to their history and shapes cultural identity.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Search Cultural Information
              </h2>
              <p className="text-gray-600 mb-4">
                Search for insights, stories, or specific cuisines and regions.
              </p>
              <Input
                placeholder="Search for insights, stories, cuisines, or regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cultural Insights Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Info className="h-6 w-6 mr-2 text-primary" />
          Cultural Insights
        </h2>
        
        {insights && insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredInsights || insights).map((insight) => (
              <Card 
                key={insight.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedInsight(insight)}
              >
                <div 
                  className={`h-48 bg-gradient-to-r ${getRegionColor(insight.region)} relative overflow-hidden`}
                >
                  {insight.imageUrl ? (
                    <img 
                      src={insight.imageUrl} 
                      alt={insight.title} 
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : null}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
                    <h3 className="text-lg font-bold truncate">{insight.title}</h3>
                    <div className="flex items-center text-xs mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{insight.region}</span>
                      <span className="mx-2">•</span>
                      <span>{insight.cuisineType}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {insight.content.substring(0, 150)}...
                  </p>
                  <p className="text-xs text-primary mt-2">Click to read more</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No cultural insights available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Food Origin Stories Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Book className="h-6 w-6 mr-2 text-primary" />
          Food Origin Stories
        </h2>
        
        {stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(filteredStories || stories).map((story) => (
              <Card 
                key={story.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedStory(story)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRegionColor(story.country)} flex items-center justify-center mr-4 flex-shrink-0`}>
                      <span className="text-white font-bold text-xl">{story.dishName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{story.dishName}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        <span>{story.country}</span>
                        <span className="mx-2">•</span>
                        <span>{story.cuisineType}</span>
                        {story.historicalPeriod && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{story.historicalPeriod}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {story.storyContent.substring(0, 150)}...
                      </p>
                      <p className="text-xs text-primary mt-2">Click to read the full story</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No food origin stories available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Cultural Insight Dialog */}
      <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
        {selectedInsight && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedInsight.title}</DialogTitle>
              <DialogDescription>
                {selectedInsight.region} • {selectedInsight.cuisineType}
              </DialogDescription>
            </DialogHeader>
            
            {selectedInsight.imageUrl && (
              <div className="h-64 overflow-hidden rounded-md mb-6">
                <img 
                  src={selectedInsight.imageUrl} 
                  alt={selectedInsight.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Use a colored background if image fails to load
                    const target = e.target as HTMLImageElement;
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r ${getRegionColor(selectedInsight.region)} text-white rounded-md">
                          <div class="text-2xl font-bold text-center p-4">${selectedInsight.title}</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            )}
            
            <div className="text-gray-700 prose prose-sm max-w-none">
              {selectedInsight.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedInsight(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Food Origin Story Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        {selectedStory && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedStory.dishName}</DialogTitle>
              <DialogDescription>
                {selectedStory.country} • {selectedStory.cuisineType}
                {selectedStory.historicalPeriod && ` • ${selectedStory.historicalPeriod}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedStory.imageUrl && (
              <div className="h-64 overflow-hidden rounded-md mb-6">
                <img 
                  src={selectedStory.imageUrl} 
                  alt={selectedStory.dishName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Use a colored background if image fails to load
                    const target = e.target as HTMLImageElement;
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r ${getRegionColor(selectedStory.country)} text-white rounded-md">
                          <div class="text-2xl font-bold text-center p-4">${selectedStory.dishName}</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            )}
            
            <div className="text-gray-700 prose prose-sm max-w-none">
              {selectedStory.storyContent.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedStory(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}