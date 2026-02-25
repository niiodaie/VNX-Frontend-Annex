import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Search, MapPin, Star, Phone, Globe, Filter, Loader2, Navigation, AlertTriangle } from 'lucide-react';
import { ConsolidatedRestaurantService } from '../utils/consolidatedRestaurantService';
import { Restaurant } from '../utils/dataImporter';
import { processRestaurantImage } from '../utils/imageHandler';

// Popular locations people might search for
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

const RestaurantSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'relevance'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ['restaurants', activeLocation, sortBy],
    queryFn: async () => {
      setIsSearching(true);
      try {
        let result;
        if (!activeLocation) {
          // If no location is specified, show global results
          const { getRestaurantsFromLocalData } = await import('../utils/dataImporter');
          const localRestaurants = await getRestaurantsFromLocalData();
          
          // Mark them as from local source
          const processedRestaurants = await Promise.all(
            localRestaurants.map(async restaurant => {
              const processed = await processRestaurantImage(restaurant);
              return {
                ...processed,
                source: 'local'
              };
            })
          );
          
          setRestaurants(processedRestaurants);
          setTotalRestaurants(processedRestaurants.length);
          
          return {
            restaurants: processedRestaurants,
            totalCount: processedRestaurants.length
          };
        } else {
          // For specific locations, use the consolidated service
          result = await ConsolidatedRestaurantService.fetchAllRestaurants(
            activeLocation,
            {
              cuisine: 'African',
              sortBy: sortBy,
              limit: 100
            }
          );
          
          setRestaurants(result.restaurants);
          setTotalRestaurants(result.totalCount);
          
          return result;
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        throw err;
      } finally {
        setIsSearching(false);
      }
    },
    enabled: false
  });

  useEffect(() => {
    // Search automatically when there's an active location
    if (activeLocation) {
      refetch();
    }
  }, [activeLocation, sortBy, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveLocation(searchTerm);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSearchTerm(location);
    setActiveLocation(location);
  };

  const handleSortChange = (newSortBy: 'rating' | 'distance' | 'relevance') => {
    setSortBy(newSortBy);
  };
  
  // Geolocation functionality
  const handleUseMyLocation = () => {
    setIsGeolocating(true);
    setGeoError(null);
    
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setIsGeolocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location name');
          }
          
          const data = await response.json();
          let locationName = '';
          
          // Extract city and country from the response
          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
            const country = data.address.country;
            
            if (city && country) {
              locationName = `${city}, ${country}`;
            } else if (city) {
              locationName = city;
            } else if (country) {
              locationName = country;
            }
          }
          
          if (!locationName && data.display_name) {
            // Fallback to display name if address components aren't available
            locationName = data.display_name.split(',').slice(0, 2).join(',');
          }
          
          if (locationName) {
            setSearchTerm(locationName);
            setActiveLocation(locationName);
          } else {
            setGeoError('Could not determine your location name');
          }
        } catch (error) {
          console.error('Error getting location:', error);
          setGeoError('Could not determine your location. Please try again.');
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location';
        
        if (error.code === 1) {
          errorMessage = 'Location access denied. Please enable location permissions.';
        } else if (error.code === 2) {
          errorMessage = 'Could not determine your location. Please try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }
        
        setGeoError(errorMessage);
        setIsGeolocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find African Restaurants</h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover authentic African cuisine from around the world
        </p>
        
        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search for restaurants by city, country or region..."
            />
            <button
              type="submit"
              className="absolute right-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
          
          {/* Use my location button */}
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isGeolocating}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark focus:outline-none"
            >
              <Navigation size={16} />
              {isGeolocating ? 'Getting your location...' : 'Use my current location'}
            </button>
          </div>
          
          {/* Geolocation error message */}
          {geoError && (
            <div className="mt-3 p-2 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{geoError}</span>
            </div>
          )}
        </form>
      </div>
      
      {/* Popular locations */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-3">Popular Locations</h2>
        <div className="flex flex-wrap gap-2">
          {popularLocations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationSelect(location)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                activeLocation === location
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results area */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeLocation ? (
            <>
              {totalRestaurants} African Restaurants in <span className="text-orange-600">{activeLocation}</span>
            </>
          ) : (
            'Featured African Restaurants'
          )}
        </h2>
        
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="flex items-center gap-1 text-gray-600 hover:text-orange-500"
        >
          <Filter size={16} />
          <span>Filter & Sort</span>
        </button>
      </div>
      
      {/* Filters area */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-medium mb-2">Sort By</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('relevance')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'relevance' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Relevance
                </button>
                <button
                  onClick={() => handleSortChange('rating')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'rating' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Highest Rated
                </button>
                <button
                  onClick={() => handleSortChange('distance')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'distance' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Distance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {(isLoading || isSearching) && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600">Searching for the best African restaurants...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {isError && !isLoading && (
        <div className="p-6 bg-red-50 text-red-500 rounded-lg">
          Error loading restaurants: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !isSearching && !isError && restaurants.length === 0 && (
        <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg text-center">
          <p className="font-medium mb-2">No African restaurants found in this location.</p>
          <p>Try searching for a different city or select one of the popular locations above.</p>
        </div>
      )}
      
      {/* Results grid */}
      {!isLoading && !isSearching && !isError && restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div 
              key={`${restaurant.name}-${index}`} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Restaurant card header with image or color background */}
              <div 
                className="h-48 relative bg-gradient-to-br from-amber-500 to-orange-600"
              >
                {restaurant.imageUrl ? (
                  <>
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        
                        // Get a cuisine-specific fallback image
                        const cuisineType = restaurant.cuisineType || '';
                        let country = cuisineType.split(' ')[0];
                        
                        const fallbackImages: Record<string, string> = {
                          'Nigerian': '/images/cuisines/nigerian.jpg',
                          'Ethiopian': '/images/cuisines/ethiopian.jpg',
                          'Ghanaian': '/images/african-dishes/waakye.jpg',
                          'South': '/images/cuisines/south-african.jpg',  
                          'Senegalese': '/images/cuisines/senegalese.jpg',
                          'Moroccan': '/images/cuisines/moroccan.jpg',
                          'default': '/images/african-dish-main.jpg'
                        };
                        
                        e.currentTarget.src = fallbackImages[country] || fallbackImages.default;
                      }}
                    />
                    
                    {/* Subtle gradient at the bottom with just the country name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 bg-gradient-to-t from-black to-transparent">
                      <span className="text-white text-xl font-semibold">
                        {restaurant.country || 'Africa'}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Fallback when no image is available */
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {restaurant.country || 'Africa'}
                    </span>
                  </div>
                )}
                
                {restaurant.rating && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 rounded text-white text-sm font-medium flex items-center">
                    <Star size={14} className="mr-1" />
                    {restaurant.rating}
                  </div>
                )}
              </div>
              
              {/* Restaurant info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-800">{restaurant.name}</h3>
                
                {/* Cuisine type */}
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {restaurant.cuisineType || 'African Cuisine'}
                  </span>
                </div>
                
                {/* Address */}
                {restaurant.address && (
                  <div className="flex items-start gap-1 mb-2 text-gray-600 text-sm">
                    <MapPin size={14} className="shrink-0 mt-1" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                )}
                
                {/* Restaurant description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {restaurant.description || `Authentic ${restaurant.cuisineType || 'African'} cuisine in ${restaurant.country || activeLocation || 'this location'}.`}
                </p>
                
                {/* Contact and details */}
                <div className="border-t pt-3 mt-2 flex justify-between items-center">
                  <Link href={`/restaurant/${restaurant.id || index}`}>
                    <span className="text-orange-600 hover:underline text-sm font-medium">
                      View Details
                    </span>
                  </Link>
                  
                  <div className="flex gap-2">
                    {restaurant.phoneNumber && (
                      <a
                        href={`tel:${restaurant.phoneNumber}`}
                        className="text-gray-500 hover:text-orange-500"
                        aria-label="Call restaurant"
                      >
                        <Phone size={16} />
                      </a>
                    )}
                    
                    {restaurant.website && (
                      <a
                        href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-orange-500"
                        aria-label="Visit website"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Load initial data */}
      {!activeLocation && restaurants.length === 0 && !isLoading && !isSearching && (
        <div className="text-center p-12">
          <p className="text-gray-500 mb-4">
            Search for African restaurants by entering a location above or select one of the popular locations.
          </p>
          <button
            onClick={() => handleLocationSelect('Global African Restaurants')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Show All African Restaurants
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantSearchPage;