import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConsolidatedRestaurantService } from '../utils/consolidatedRestaurantService';
import { Restaurant } from '../utils/dataImporter';
import { Link } from 'wouter';

const popularLocations = [
  'Lagos, Nigeria',
  'Nairobi, Kenya',
  'Accra, Ghana',
  'Johannesburg, South Africa',
  'Addis Ababa, Ethiopia',
  'Cairo, Egypt',
  'Marrakech, Morocco',
  'New York, USA',
  'London, UK',
  'Paris, France',
  'Toronto, Canada',
  'Atlanta, USA'
];

const RestaurantsPage: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [activeLocation, setActiveLocation] = useState('Global African Restaurants');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSources, setActiveSources] = useState({
    local: false,
    yelp: false,
    googleMaps: false,
    apify: false
  });
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'relevance'>('relevance');

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ['restaurants', activeLocation, sortBy],
    queryFn: async () => {
      setIsSearching(true);
      try {
        // Special handling for Global option - use local data only to avoid API errors
        if (activeLocation === 'Global African Restaurants') {
          // For global view, use only local data without location filter
          const { getRestaurantsFromLocalData } = await import('../utils/dataImporter');
          const localRestaurants = await getRestaurantsFromLocalData();

          // Mark them as from local source
          const processedRestaurants = localRestaurants.map(restaurant => ({
            ...restaurant,
            source: 'local'
          }));
          
          // Set the sources
          setActiveSources({
            local: true,
            yelp: false,
            googleMaps: false,
            apify: false
          });
          
          setRestaurants(processedRestaurants);
          setTotalRestaurants(processedRestaurants.length);
          
          return {
            restaurants: processedRestaurants,
            sources: {
              local: true,
              yelp: false,
              googleMaps: false,
              apify: false
            },
            totalCount: processedRestaurants.length
          };
        }
        
        // For specific locations, use the consolidated service
        const result = await ConsolidatedRestaurantService.fetchAllRestaurants(
          activeLocation,
          {
            cuisine: 'African',
            sortBy: sortBy,
            limit: 100
          }
        );
        
        setRestaurants(result.restaurants);
        setActiveSources(result.sources);
        setTotalRestaurants(result.totalCount);
        
        return result;
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        throw err;
      } finally {
        setIsSearching(false);
      }
    },
    enabled: false
  });

  // Fetch restaurants on initial load
  useEffect(() => {
    refetch();
  }, [refetch, activeLocation, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      setActiveLocation(searchLocation);
    }
  };

  const handleLocationSelect = (location: string) => {
    setActiveLocation(location);
    setSearchLocation('');
  };

  const getStarRating = (rating: string | undefined) => {
    if (!rating) return '★★★☆☆';
    const numRating = parseFloat(rating);
    
    if (numRating >= 4.5) return '★★★★★';
    if (numRating >= 4.0) return '★★★★☆';
    if (numRating >= 3.5) return '★★★★☆';
    if (numRating >= 3.0) return '★★★☆☆';
    if (numRating >= 2.5) return '★★★☆☆';
    if (numRating >= 2.0) return '★★☆☆☆';
    return '★★☆☆☆';
  };
  


  const activeSourcesCount = Object.values(activeSources).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-primary/5 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">African Restaurants Worldwide</h1>
        <p className="text-gray-600 mb-6">
          Discover authentic African cuisine from restaurants around the globe. Our platform combines data 
          from multiple sources to provide the most comprehensive directory of African restaurants.
        </p>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by city, country or region"
              className="w-full md:w-2/3 px-4 py-3 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="w-full md:w-1/3 bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search Restaurants'}
            </button>
          </div>
        </form>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Popular Locations</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLocationSelect('Global African Restaurants')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeLocation === 'Global African Restaurants'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Global
            </button>
            {popularLocations.map(location => (
              <button
                key={location}
                onClick={() => handleLocationSelect(location)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeLocation === location
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {location.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="font-semibold">{totalRestaurants}</span> restaurants found
            from <span className="font-semibold">{activeSourcesCount}</span> sources
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'relevance')}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-6">
          <div className={`p-2 rounded ${activeSources.local ? 'bg-green-100' : 'bg-gray-100'}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${activeSources.local ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
            Local Data: {activeSources.local ? 'Active' : 'Inactive'}
          </div>
          <div className={`p-2 rounded ${activeSources.yelp ? 'bg-green-100' : 'bg-gray-100'}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${activeSources.yelp ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
            Yelp: {activeSources.yelp ? 'Active' : 'Inactive'}
          </div>
          <div className={`p-2 rounded ${activeSources.googleMaps ? 'bg-green-100' : 'bg-gray-100'}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${activeSources.googleMaps ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
            Google Maps: {activeSources.googleMaps ? 'Active' : 'Inactive'}
          </div>
          <div className={`p-2 rounded ${activeSources.apify ? 'bg-green-100' : 'bg-gray-100'}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${activeSources.apify ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
            Apify: {activeSources.apify ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {isLoading || isSearching ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 text-red-500 rounded-lg">
          Error loading restaurants: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg">
          No African restaurants found in this location. Try searching for a different city or select one of the popular locations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div key={`${restaurant.name}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative flex items-center justify-center" style={{
                backgroundColor: 
                  // Bold, vibrant background colors like in the example image
                  restaurant.country === 'Ethiopia' ? '#b8860b' : 
                  restaurant.country === 'Nigeria' ? '#cd853f' :
                  restaurant.country === 'Morocco' ? '#8b4513' :
                  restaurant.country === 'Kenya' ? '#a0522d' :
                  restaurant.country === 'South Africa' ? '#b22222' :
                  restaurant.country === 'Senegal' ? '#d2691e' :
                  restaurant.country === 'Egypt' ? '#cd5c5c' :
                  // Default warm colors
                  ['#daa520', '#b8860b', '#cd853f', '#d2691e'][Math.floor(Math.random() * 4)]
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {restaurant.country}
                  </span>
                </div>
                {/* Simplified image handling with text always on top */}
                
                {/* Source badge - smaller and less obtrusive */}
                {restaurant.source && (
                  <div className="absolute top-2 right-2 bg-white/70 text-xs px-1.5 py-0.5 rounded text-gray-700">
                    {restaurant.source}
                  </div>
                )}
                
                {/* No text overlay at the bottom as per user request */}
              </div>
              <div className="p-4">
                {/* Restaurant name and rating */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg truncate pr-2">{restaurant.name}</h3>
                  {restaurant.rating && (
                    <div className="text-yellow-500 text-sm whitespace-nowrap">
                      {getStarRating(restaurant.rating)}
                    </div>
                  )}
                </div>
                
                {/* Address - simplified */}
                {restaurant.address && (
                  <p className="text-gray-500 text-xs mb-3 truncate">{restaurant.address}</p>
                )}
                
                {/* Description - limited to 2 lines */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                  {restaurant.description}
                </p>
                
                {/* Action buttons */}
                <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                  <Link 
                    to={`/restaurant/${restaurant.id || index}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View Details
                  </Link>
                  
                  {/* Contact links */}
                  <div className="flex gap-3 text-xs text-gray-500">
                    {restaurant.phoneNumber && (
                      <a href={`tel:${restaurant.phoneNumber}`} className="hover:text-primary">
                        Call
                      </a>
                    )}
                    {restaurant.website && (
                      <a 
                        href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;