import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, DollarSign, ExternalLink, Anchor, Heart, Mountain } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocation } from "@/hooks/useLocation";
// Mock travel events data
const travelEvents: TravelEvent[] = [
  {
    "id": "1",
    "title": "Mediterranean Luxury Cruise",
    "category": "cruise",
    "location": "Barcelona, Spain to Rome, Italy",
    "startDate": "2024-07-15",
    "endDate": "2024-07-22",
    "duration": "7 days",
    "price": 1299,
    "currency": "USD",
    "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    "description": "Experience the ultimate Mediterranean adventure aboard our luxury cruise ship. Visit iconic ports including Nice, Monaco, and Corsica.",
    "highlights": ["All-inclusive dining", "Private balcony rooms", "Shore excursions included", "Spa & wellness center"],
    "provider": "Mediterranean Cruises",
    "bookingUrl": "https://example.com/book/med-cruise",
    "ageGroup": "Adults only",
    "groupType": "Couples & families"
  },
  {
    "id": "2", 
    "title": "Singles Adventure in Costa Rica",
    "category": "singles",
    "location": "San José, Costa Rica",
    "startDate": "2024-08-10",
    "endDate": "2024-08-17",
    "duration": "8 days",
    "price": 899,
    "currency": "USD",
    "image": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400",
    "description": "Join fellow solo travelers for an unforgettable Costa Rican adventure featuring zip-lining, wildlife spotting, and beach relaxation.",
    "highlights": ["Zip-line canopy tours", "Wildlife sanctuary visits", "Beach time in Manuel Antonio", "Group activities"],
    "provider": "Solo Adventures Co",
    "bookingUrl": "https://example.com/book/costa-rica-singles",
    "ageGroup": "25-45",
    "groupType": "Solo travelers"
  },
  {
    "id": "3",
    "title": "Himalayan Trekking Expedition",
    "category": "adventure", 
    "location": "Kathmandu, Nepal",
    "startDate": "2024-09-05",
    "endDate": "2024-09-19",
    "duration": "15 days",
    "price": 2199,
    "currency": "USD",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400",
    "description": "Embark on a challenging trek through the Himalayas with experienced guides. Reach Everest Base Camp and witness breathtaking mountain views.",
    "highlights": ["Everest Base Camp trek", "Professional mountain guides", "Cultural village visits", "Photography workshops"],
    "provider": "Mountain Adventures",
    "bookingUrl": "https://example.com/book/himalayan-trek",
    "ageGroup": "18-65",
    "groupType": "Adventure seekers"
  }
];

interface TravelEvent {
  id: string;
  title: string;
  category: "cruise" | "singles" | "adventure";
  location: string;
  startDate: string;
  endDate: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  highlights: string[];
  provider: string;
  bookingUrl: string;
  ageGroup: string;
  groupType: string;
}

export default function LiveTravelEvents() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "cruise" | "singles" | "adventure">("all");
  const { t } = useTranslation();
  const { location } = useLocation();
  const [sortByDistance, setSortByDistance] = useState(false);

  // Location-aware filtering and sorting
  const getDistanceFromUser = (eventLocation: string): number => {
    if (!location) return 0;
    
    // Simplified distance calculation based on event location keywords
    const locationKeywords = eventLocation.toLowerCase();
    const { country } = location;
    
    if (!country) return 0;
    
    // Basic continent/region matching for distance approximation
    const userCountryLower = country.toLowerCase();
    
    if (locationKeywords.includes(userCountryLower)) return 100; // Same country
    if (locationKeywords.includes('europe') && userCountryLower.includes('europe')) return 300;
    if (locationKeywords.includes('asia') && userCountryLower.includes('asia')) return 400;
    if (locationKeywords.includes('america') && userCountryLower.includes('america')) return 500;
    
    return 1000; // Default distance for far locations
  };

  let filteredEvents = selectedCategory === "all" 
    ? (travelEvents as TravelEvent[])
    : (travelEvents as TravelEvent[]).filter(event => event.category === selectedCategory);

  // Sort by distance if location is available and user prefers it
  if (sortByDistance && location) {
    filteredEvents = [...filteredEvents].sort((a, b) => 
      getDistanceFromUser(a.location) - getDistanceFromUser(b.location)
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cruise': return <Anchor className="w-4 h-4" />;
      case 'singles': return <Heart className="w-4 h-4" />;
      case 'adventure': return <Mountain className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cruise': return 'bg-blue-100 text-blue-800';
      case 'singles': return 'bg-pink-100 text-pink-800';
      case 'adventure': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleBookEvent = (event: any) => {
    window.open(event.bookingUrl, '_blank');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('liveTravelEvents')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('liveEventsDescription')}
          </p>
        </div>

        {/* Location-based sorting toggle */}
        {location && (
          <div className="flex justify-center mb-6">
            <Button
              variant={sortByDistance ? "default" : "outline"}
              onClick={() => setSortByDistance(!sortByDistance)}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {sortByDistance ? t('showingNearestEvents') : t('sortByDistance')}
            </Button>
          </div>
        )}

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('allEvents')}
            </TabsTrigger>
            <TabsTrigger value="cruise" className="flex items-center gap-2">
              <Anchor className="w-4 h-4" />
              {t('cruises')}
            </TabsTrigger>
            <TabsTrigger value="singles" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {t('singlesTravel')}
            </TabsTrigger>
            <TabsTrigger value="adventure" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              {t('adventures')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`text-xs font-medium flex items-center gap-1 ${getCategoryColor(event.category)}`}>
                        {getCategoryIcon(event.category)}
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1">
                      <span className="text-sm font-bold text-gray-900">
                        ${event.price}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.startDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.duration}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('highlights')}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.highlights.slice(0, 3).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {event.ageGroup} • {event.groupType}
                        </div>
                        <div className="mt-1">{t('by')} {event.provider}</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookEvent(event)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('bookNow')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('noEventsFound')}</h3>
                <p className="text-gray-500">{t('tryDifferentCategory')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}