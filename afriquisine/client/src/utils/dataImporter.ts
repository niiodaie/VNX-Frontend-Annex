import axios from 'axios';
import { getLocalImageForDish } from './localImageMap';

interface Dish {
  name: string;
  country: string;
  image: string;
}

export interface Restaurant {
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  originalImageUrl?: string; // Original external image URL (may not be reliable)
  rating?: string;
  phoneNumber?: string;
  website?: string;
  cuisineType: string;
  country?: string;
  id?: number;
  source?: string;
  reviewCount?: string;
  distance?: string;
}

/**
 * Fetches African dishes data from the local JSON file
 * @returns Promise with the dishes data
 */
export async function importLocalRestaurantData(): Promise<Dish[]> {
  try {
    // Fetch the local JSON file
    const response = await axios.get('/api/import/african-dishes');
    return response.data.dishes;
  } catch (error) {
    console.error('Error importing local restaurant data:', error);
    throw error;
  }
}

/**
 * Converts dish data to restaurant format
 * @param dishes Array of dish objects
 * @returns Array of restaurant objects
 */
export function convertDishesToRestaurants(dishes: Dish[]): Restaurant[] {
  // Convert dish data to restaurant format
  return dishes.map(dish => {
    // Use local images instead of external URLs for reliability
    const localImagePath = getLocalImageForDish(dish.name, dish.country);
    
    return {
      name: dish.name,
      description: `Authentic restaurant with traditional specialties.`,
      address: `${dish.country}`, 
      // Use local image path which will reliably work
      imageUrl: localImagePath || '/src/assets/images/reference-design.png',
      // Include the original image URL as a backup
      originalImageUrl: dish.image,
      rating: (3 + Math.random() * 2).toFixed(1), // Random rating between 3-5
      phoneNumber: '+1-555-123-4567',
      website: `https://example.com/${dish.name.toLowerCase().replace(/\s+/g, '-')}`,
      cuisineType: `African`,
      country: dish.country
    };
  });
}

/**
 * Fetches and converts African dishes data to restaurant format in one step
 * @returns Promise with array of restaurant objects
 */
export async function getRestaurantsFromLocalData(): Promise<Restaurant[]> {
  try {
    const dishes = await importLocalRestaurantData();
    return convertDishesToRestaurants(dishes);
  } catch (error) {
    console.error('Error getting restaurants from local data:', error);
    throw error;
  }
}