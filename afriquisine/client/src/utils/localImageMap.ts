// Import images directly
import jollofRiceImg from '../assets/images/image_1744604754983.png';
import nigerianCuisineImg from '../assets/images/nigerian_cuisine.png';
import ethiopianCuisineImg from '../assets/images/ethiopian_cuisine.png';
import waakyeImg from '../assets/images/waakye_ghana.png';
import southAfricanCuisineImg from '../assets/images/south_african_cuisine.png';
import senegaleseCuisineImg from '../assets/images/senegalese_cuisine.png';
import moroccanCuisineImg from '../assets/images/moroccan_cuisine.png';
import referenceDesignImg from '../assets/images/reference-design.png';

/**
 * Map of dish names to local image imports for African dishes
 * This serves as a local fallback when external images fail to load
 */
export const dishToImageMap: Record<string, string> = {
  // Nigerian dishes
  'Jollof Rice': jollofRiceImg, 
  'Fufu and Egusi Soup': nigerianCuisineImg,
  
  // Ethiopian dishes
  'Injera with Doro Wat': ethiopianCuisineImg,
  
  // Ghanaian dishes
  'Waakye': waakyeImg,
  
  // South African dishes
  'Bunny Chow': southAfricanCuisineImg,
  
  // Senegalese dishes
  'Thieboudienne': senegaleseCuisineImg,
  
  // Moroccan dishes
  'Tagine': moroccanCuisineImg,
  
  // Fallbacks by country
  'Nigeria': nigerianCuisineImg,
  'Ethiopia': ethiopianCuisineImg,
  'Ghana': waakyeImg,
  'South Africa': southAfricanCuisineImg,
  'Senegal': senegaleseCuisineImg,
  'Morocco': moroccanCuisineImg,
  'Kenya': referenceDesignImg,
  'Uganda': referenceDesignImg,
};

/**
 * Get a local image path for a dish or country
 * @param dishName Name of the dish
 * @param country Country of origin
 * @returns Path to local image or undefined if not found
 */
export function getLocalImageForDish(dishName: string, country: string): string | undefined {
  // First try to find an image for the specific dish
  if (dishToImageMap[dishName]) {
    return dishToImageMap[dishName];
  }
  
  // Then try to find an image for the country
  if (dishToImageMap[country]) {
    return dishToImageMap[country];
  }
  
  // Default fallback
  return referenceDesignImg;
}