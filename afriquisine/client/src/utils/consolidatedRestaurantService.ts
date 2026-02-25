import axios from 'axios';
import { Restaurant, getRestaurantsFromLocalData } from './dataImporter';
import { processRestaurantImage } from './imageHandler';
import { findYelpRestaurants } from './scraper';

/**
 * Consolidated service that fetches restaurant data from multiple sources
 * and combines them into a unified result set
 */
export class ConsolidatedRestaurantService {
  
  /**
   * Fetch restaurants from all available sources and consolidate results
   * @param location Location to search for restaurants
   * @param options Additional search options
   * @returns Promise with combined restaurant data
   */
  static async fetchAllRestaurants(
    location: string,
    options: {
      cuisine?: string;
      priceRange?: string;
      sortBy?: 'rating' | 'distance' | 'relevance';
      limit?: number;
    } = {}
  ): Promise<{
    restaurants: Restaurant[];
    sources: {
      local: boolean;
      yelp: boolean;
      googleMaps: boolean;
      apify: boolean;
    };
    totalCount: number;
  }> {
    try {
      const sources = {
        local: false,
        yelp: false,
        googleMaps: false,
        apify: false
      };
      
      // Default options
      const { 
        cuisine = 'African',
        sortBy = 'rating',
        limit = 50 
      } = options;
      
      // Parallel fetch from all available sources
      const [localPromise, yelpPromise, googlePromise, apifyPromise] = await Promise.allSettled([
        // Local data source
        (async () => {
          try {
            const localRestaurants = await getRestaurantsFromLocalData();
            
            // Filter by location if provided
            let filteredResults = localRestaurants;
            if (location) {
              const locationLower = location.toLowerCase();
              filteredResults = localRestaurants.filter(restaurant => 
                restaurant.country?.toLowerCase().includes(locationLower) || 
                restaurant.name.toLowerCase().includes(locationLower) ||
                restaurant.cuisineType.toLowerCase().includes(locationLower)
              );
            }
            
            // Process images to ensure they load properly
            const processedRestaurants = await Promise.all(
              filteredResults.map(async (restaurant) => await processRestaurantImage(restaurant))
            );
            
            sources.local = true;
            return { 
              restaurants: processedRestaurants,
              source: 'local'
            };
          } catch (error) {
            console.warn('Error fetching from local data:', error);
            return { restaurants: [], source: 'local' };
          }
        })(),
        
        // Yelp source
        (async () => {
          try {
            const restaurants = await findYelpRestaurants(location);
            
            // Process images to ensure they load properly
            const processedRestaurants = await Promise.all(
              restaurants.map(async (restaurant) => {
                const processed = await processRestaurantImage(restaurant);
                return {
                  ...processed,
                  source: 'yelp'
                };
              })
            );
            
            sources.yelp = true;
            return { 
              restaurants: processedRestaurants,
              source: 'yelp'
            };
          } catch (error) {
            console.warn('Error fetching from Yelp:', error);
            return { restaurants: [], source: 'yelp' };
          }
        })(),
        
        // Google Maps source
        (async () => {
          try {
            const result = await axios.get('/api/google/places', {
              params: {
                location: encodeURIComponent(location),
                type: 'restaurant',
                keyword: cuisine
              }
            });
            
            // Process images to ensure they load properly
            const processedRestaurants = await Promise.all(
              result.data.restaurants.map(async (restaurant: Restaurant) => {
                const processed = await processRestaurantImage(restaurant);
                return {
                  ...processed,
                  source: 'google'
                };
              })
            );
            
            sources.googleMaps = true;
            return { 
              restaurants: processedRestaurants,
              source: 'google'
            };
          } catch (error) {
            console.warn('Error fetching from Google Maps:', error);
            return { restaurants: [], source: 'google' };
          }
        })(),
        
        // Apify source
        (async () => {
          try {
            const result = await axios.get(`/api/scrape/restaurants`, {
              params: { 
                location: encodeURIComponent(location),
                cuisine
              }
            });
            
            // Process images to ensure they load properly
            const processedRestaurants = await Promise.all(
              result.data.restaurants.map(async (restaurant: Restaurant) => {
                const processed = await processRestaurantImage(restaurant);
                return {
                  ...processed,
                  source: 'apify'
                };
              })
            );
            
            sources.apify = true;
            return { 
              restaurants: processedRestaurants,
              source: 'apify'
            };
          } catch (error) {
            console.warn('Error fetching from Apify:', error);
            return { restaurants: [], source: 'apify' };
          }
        })()
      ]);
      
      // Combine results from all sources
      let allRestaurants: Restaurant[] = [];
      
      // Process results from each source
      [localPromise, yelpPromise, googlePromise, apifyPromise].forEach(promise => {
        if (promise.status === 'fulfilled') {
          allRestaurants = [...allRestaurants, ...promise.value.restaurants];
        }
      });
      
      // Remove duplicates (based on name and address)
      const uniqueRestaurants = removeDuplicateRestaurants(allRestaurants);
      
      // Sort the results
      const sortedRestaurants = sortRestaurants(uniqueRestaurants, sortBy);
      
      // Limit the number of results
      const limitedResults = sortedRestaurants.slice(0, limit);
      
      return {
        restaurants: limitedResults,
        sources,
        totalCount: uniqueRestaurants.length
      };
    } catch (error) {
      console.error('Error in consolidated restaurant service:', error);
      throw error;
    }
  }
}

/**
 * Remove duplicate restaurants from combined results
 * Uses name and partial address matching to identify duplicates
 */
function removeDuplicateRestaurants(restaurants: Restaurant[]): Restaurant[] {
  const uniqueMap = new Map<string, Restaurant>();
  
  restaurants.forEach(restaurant => {
    // Create a key based on the restaurant name and a simplified address
    const simplifiedAddress = restaurant.address?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const nameKey = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `${nameKey}-${simplifiedAddress.substring(0, 10)}`;
    
    // If this is a new restaurant or a better version of an existing one (has more fields)
    if (!uniqueMap.has(key) || 
        Object.keys(restaurant).length > Object.keys(uniqueMap.get(key)!).length) {
      uniqueMap.set(key, restaurant);
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Sort restaurants by the specified criteria
 */
function sortRestaurants(
  restaurants: Restaurant[], 
  sortBy: 'rating' | 'distance' | 'relevance'
): Restaurant[] {
  switch (sortBy) {
    case 'rating':
      return restaurants.sort((a, b) => {
        const ratingA = a.rating ? parseFloat(a.rating) : 0;
        const ratingB = b.rating ? parseFloat(b.rating) : 0;
        return ratingB - ratingA; // Higher ratings first
      });
      
    case 'distance':
      return restaurants.sort((a, b) => {
        const distanceA = (a as any).distance ? 
          parseFloat((a as any).distance.replace(/[^0-9.]/g, '')) : 
          Number.MAX_VALUE;
        const distanceB = (b as any).distance ? 
          parseFloat((b as any).distance.replace(/[^0-9.]/g, '')) : 
          Number.MAX_VALUE;
        return distanceA - distanceB; // Shorter distances first
      });
      
    case 'relevance':
    default:
      // For relevance we'll use a weighted score based on completeness of the data
      return restaurants.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a);
        const scoreB = calculateRelevanceScore(b);
        return scoreB - scoreA; // Higher scores first
      });
  }
}

/**
 * Calculate a relevance score for a restaurant based on data completeness
 */
function calculateRelevanceScore(restaurant: Restaurant): number {
  let score = 0;
  
  // More complete entries get higher scores
  if (restaurant.name) score += 1;
  if (restaurant.description) score += 2;
  if (restaurant.address) score += 1;
  if (restaurant.imageUrl) score += 2;
  if (restaurant.rating) score += 3;
  if (restaurant.phoneNumber) score += 1;
  if (restaurant.website) score += 1;
  if (restaurant.cuisineType) score += 2;
  if (restaurant.country) score += 2;
  
  // Boost score for restaurants with high ratings
  if (restaurant.rating) {
    const rating = parseFloat(restaurant.rating);
    if (rating >= 4.5) score += 5;
    else if (rating >= 4.0) score += 3;
    else if (rating >= 3.5) score += 1;
  }
  
  // Boost score for restaurants with review counts
  if ((restaurant as any).reviewCount) {
    const reviewCount = parseInt((restaurant as any).reviewCount);
    if (reviewCount >= 200) score += 4;
    else if (reviewCount >= 100) score += 2;
    else if (reviewCount >= 50) score += 1;
  }
  
  return score;
}