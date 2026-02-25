import React, { useState } from 'react';
import DirectoryIntegration from '../components/DirectoryIntegration';
import { Restaurant } from '../utils/dataImporter';
import { getFallbackImageUrl, processRestaurantImage } from '../utils/imageHandler';

const DirectoryPage: React.FC = () => {
  const [importedRestaurants, setImportedRestaurants] = useState<Restaurant[]>([]);
  
  const handleImportComplete = async (restaurants: Restaurant[]) => {
    // Process all restaurant images with error handling if not already processed
    try {
      // Process images if they haven't been processed yet by the data source
      const processedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => 
          restaurant.imageUrl ? await processRestaurantImage(restaurant) : restaurant
        )
      );
      setImportedRestaurants(processedRestaurants);
    } catch (error) {
      console.error('Error processing restaurant images:', error);
      setImportedRestaurants(restaurants);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">African Restaurant Directory</h1>
        <p className="text-lg text-gray-600">
          Discover authentic African restaurants around the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DirectoryIntegration onImportComplete={handleImportComplete} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-2xl font-bold mb-4">
              {importedRestaurants.length > 0 
                ? 'Imported Restaurants' 
                : 'No Restaurants Imported Yet'}
            </h2>
            
            {importedRestaurants.length > 0 ? (
              <div className="grid gap-6">
                {importedRestaurants.map((restaurant, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="md:w-1/3">
                      {restaurant.imageUrl ? (
                        <img 
                          src={restaurant.imageUrl} 
                          alt={restaurant.name}
                          className="w-full h-48 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = getFallbackImageUrl(restaurant.cuisineType);
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                          <span className="text-gray-500">No image available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                        {restaurant.rating && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
                            ★ {restaurant.rating}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{restaurant.cuisineType}</p>
                      <p className="text-gray-700 mb-4">{restaurant.description}</p>
                      
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>{restaurant.address}</p>
                        {restaurant.phoneNumber && <p>{restaurant.phoneNumber}</p>}
                        {restaurant.website && (
                          <a 
                            href={restaurant.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <button className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                          View Details
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200">
                          Save to Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto text-gray-300 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M17 21v-8H7v8M7 3v5h8" 
                  />
                </svg>
                <p className="text-gray-500">
                  Use the directory integration tool to import African restaurants
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  You can search for restaurants by location, city, or country
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;