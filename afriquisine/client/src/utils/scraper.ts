import axios from 'axios';
import { Restaurant } from './dataImporter';

/**
 * Scrapes restaurant data from public sources without requiring API keys
 * 
 * Note: This is an example using our server-side endpoint which
 * would perform the actual scraping. In a production environment,
 * consider using a more robust solution with proper rate limiting and caching.
 */
export async function scrapeRestaurants(location: string, cuisine: string = 'African'): Promise<Restaurant[]> {
  try {
    // Use our server-side endpoint that handles the actual scraping
    const response = await axios.get('/api/scrape/restaurants', {
      params: { 
        location,
        cuisine
      }
    });
    
    return response.data.restaurants;
  } catch (error) {
    console.error('Error scraping restaurants:', error);
    throw error;
  }
}

/**
 * Scrape restaurant details for a specific restaurant
 * @param url URL of the restaurant page to scrape
 * @returns Restaurant details
 */
export async function scrapeRestaurantDetails(url: string): Promise<Restaurant> {
  try {
    const response = await axios.post('/api/scrape/restaurant-details', {
      url
    });
    
    return response.data.restaurant;
  } catch (error) {
    console.error('Error scraping restaurant details:', error);
    throw error;
  }
}

/**
 * Find African restaurants on Yelp through web scraping
 * @param location Location to search for restaurants (city, neighborhood)
 * @returns Array of restaurant objects
 */
export async function findYelpRestaurants(location: string): Promise<Restaurant[]> {
  try {
    // This will use our server-side scraping endpoint
    const response = await axios.get('/api/scrape/yelp', {
      params: { 
        location,
        term: 'African restaurants'
      }
    });
    
    return response.data.restaurants;
  } catch (error) {
    console.error('Error finding Yelp restaurants:', error);
    throw error;
  }
}