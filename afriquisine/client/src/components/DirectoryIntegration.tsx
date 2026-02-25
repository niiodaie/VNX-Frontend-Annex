import React, { useState } from 'react';
import axios from 'axios';
import { Restaurant, getRestaurantsFromLocalData } from '../utils/dataImporter';
import { processRestaurantImage } from '../utils/imageHandler';
import { findYelpRestaurants } from '../utils/scraper';
import { ConsolidatedRestaurantService } from '../utils/consolidatedRestaurantService';

interface DirectoryIntegrationProps {
  onImportComplete?: (data: Restaurant[]) => void;
}

const DirectoryIntegration: React.FC<DirectoryIntegrationProps> = ({ onImportComplete }) => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSource, setImportSource] = useState<'all' | 'apify' | 'google' | 'yelp' | 'local'>('all');
  const [activeSources, setActiveSources] = useState<{
    local: boolean;
    yelp: boolean;
    googleMaps: boolean;
    apify: boolean;
  }>({
    local: true,
    yelp: true,
    googleMaps: true,
    apify: true
  });
  
  const handleImport = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let restaurants: Restaurant[] = [];
      
      if (importSource === 'all') {
        // Use the consolidated service to fetch from all sources
        console.log('Fetching from all available sources...');
        const result = await ConsolidatedRestaurantService.fetchAllRestaurants(
          location,
          {
            cuisine: 'African',
            sortBy: 'rating'
          }
        );
        
        restaurants = result.restaurants;
        setActiveSources(result.sources);
        
        // Log the sources that were successful
        console.log('Active data sources:', 
          Object.entries(result.sources)
            .filter(([_, active]) => active)
            .map(([source]) => source)
            .join(', ')
        );
        
      } else {
        // Individual source handling
        let result;
        
        switch (importSource) {
          case 'apify':
            // Using server-side proxy to access Apify
            result = await axios.get(`/api/scrape/restaurants?location=${encodeURIComponent(location)}`);
            restaurants = result.data.restaurants;
            setActiveSources({
              local: false,
              yelp: false,
              googleMaps: false,
              apify: true
            });
            break;
            
          case 'google':
            // Google Maps Places API integration
            result = await axios.get('/api/google/places', {
              params: {
                location: encodeURIComponent(location),
                type: 'restaurant',
                keyword: 'African' 
              }
            });
            restaurants = result.data.restaurants;
            
            // Process images to ensure they load properly
            const processedGoogleRestaurants = await Promise.all(
              restaurants.map(async (restaurant) => await processRestaurantImage(restaurant))
            );
            restaurants = processedGoogleRestaurants;
            setActiveSources({
              local: false,
              yelp: false,
              googleMaps: true,
              apify: false
            });
            break;
            
          case 'yelp':
            // Using web scraping to get Yelp data without API key
            restaurants = await findYelpRestaurants(location);
            
            // Process images to ensure they load properly
            const processedYelpRestaurants = await Promise.all(
              restaurants.map(async (restaurant) => await processRestaurantImage(restaurant))
            );
            restaurants = processedYelpRestaurants;
            setActiveSources({
              local: false,
              yelp: true,
              googleMaps: false,
              apify: false
            });
            break;
            
          case 'local':
            // Import from local JSON file with African dishes
            const localRestaurants = await getRestaurantsFromLocalData();
            
            // Filter by location if provided (case insensitive)
            if (location.trim()) {
              const locationLower = location.toLowerCase();
              restaurants = localRestaurants.filter(restaurant => 
                restaurant.country?.toLowerCase().includes(locationLower) || 
                restaurant.name.toLowerCase().includes(locationLower) ||
                restaurant.cuisineType.toLowerCase().includes(locationLower)
              );
            } else {
              restaurants = localRestaurants;
            }
            
            // Process images to ensure they load properly
            const processedRestaurants = await Promise.all(
              restaurants.map(async (restaurant) => await processRestaurantImage(restaurant))
            );
            restaurants = processedRestaurants;
            setActiveSources({
              local: true,
              yelp: false,
              googleMaps: false,
              apify: false
            });
            break;
        }
      }
      
      // Process and format the data
      if (restaurants && restaurants.length > 0) {
        if (onImportComplete) {
          onImportComplete(restaurants);
        }
      } else {
        setError('No restaurants found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import directory data');
      console.error('Directory import error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Import Restaurant Directory</h2>
      <p className="text-gray-600 mb-4">
        Quickly populate your restaurant directory by importing data from external sources.
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setImportSource('all')}
            className={`w-full px-4 py-3 rounded-md text-center ${
              importSource === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="font-bold">All Sources</span>
            <span className="ml-2 text-xs">(Recommended)</span>
          </button>
        </div>
        
        {importSource !== 'all' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setImportSource('local')}
              className={`px-4 py-2 rounded-md ${
                importSource === 'local' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Local Data
            </button>
            <button
              type="button"
              onClick={() => setImportSource('apify')}
              className={`px-4 py-2 rounded-md ${
                importSource === 'apify' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Apify Web Scraping
            </button>
            <button
              type="button"
              onClick={() => setImportSource('google')}
              className={`px-4 py-2 rounded-md ${
                importSource === 'google' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Google Maps
            </button>
            <button
              type="button"
              onClick={() => setImportSource('yelp')}
              className={`px-4 py-2 rounded-md ${
                importSource === 'yelp' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Yelp
            </button>
          </div>
        )}
        
        {importSource === 'all' && (
          <p className="text-xs text-gray-500 mt-1">
            The system will automatically search across all data sources and intelligently combine the results.
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city, state, or country"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <p className="text-sm text-gray-500 mt-1">
          Example: "Lagos, Nigeria" or "Addis Ababa, Ethiopia"
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleImport}
        disabled={isLoading}
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Importing...' : 'Import Restaurants'}
      </button>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-700 mb-2">
          {importSource === 'all'
            ? 'Using All Available Data Sources'
            : importSource === 'local' 
              ? 'Using Local African Dishes Data' 
              : importSource === 'apify'
                ? 'Using Apify Web Scraping'
                : importSource === 'google'
                  ? 'Using Google Maps API'
                  : 'Using Yelp API'}
        </h3>
        <p className="text-sm text-gray-600">
          {importSource === 'all'
            ? 'This will automatically search and consolidate results from all available data sources including local data, Yelp, Google Maps, and web scraping. The system intelligently merges results, eliminates duplicates, and presents the most comprehensive set of African restaurants available.'
            : importSource === 'local' 
              ? 'This will import African cuisine restaurants based on the dish data provided in the attached files. The restaurants will include authentic images from reliable sources.' 
              : importSource === 'apify'
                ? 'This tool will search for and import African restaurants from the specified location using Apify\'s web scraping capabilities. No API keys required for the demo!'
                : importSource === 'google'
                  ? 'This integration simulates the Google Maps Places API to find African restaurants in the specified location. No API key required!'
                  : 'This integration uses web scraping to find African restaurants on Yelp in the specified location. No API key required!'}
        </p>
        
        {importSource === 'all' && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
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
        )}
      </div>
    </div>
  );
};

export default DirectoryIntegration;