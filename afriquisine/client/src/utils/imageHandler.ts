import { Restaurant } from './dataImporter';

/**
 * Preloads an image and returns the URL if successful
 * @param url Image URL to preload
 * @returns Promise with the image URL
 */
export const preloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      reject(new Error(`Failed to load image: ${url}`));
    };
  });
};

/**
 * Get a fallback image URL based on cuisine type
 * @param cuisineType The type of cuisine
 * @returns URL to a fallback image
 */
export const getFallbackImageUrl = (cuisineType: string = ''): string => {
  // Extract the country from the cuisine type if present
  let country = cuisineType.split(' ')[0];
  
  const defaultImages: Record<string, string> = {
    'Nigerian': '/images/cuisines/nigerian.jpg',
    'Ethiopian': '/images/cuisines/ethiopian.jpg',
    'Ghanaian': '/images/african-dishes/waakye.jpg',
    'South': '/images/cuisines/south-african.jpg',  // South African
    'Senegalese': '/images/cuisines/senegalese.jpg',
    'Moroccan': '/images/cuisines/moroccan.jpg',
    'default': '/images/african-dish-main.jpg'
  };
  
  return defaultImages[country] || defaultImages.default;
};

/**
 * Handle special case for Wikimedia images - some may need URL adjustments
 * @param url Original image URL
 * @returns Potentially modified URL
 */
export const fixWikimediaUrl = (url: string): string => {
  // Some Wikimedia image URLs might need adjustments
  if (url.includes('wikimedia.org') && url.includes('%')) {
    // If URL contains encoded characters, try to fix known issues
    try {
      // Try decoding and re-encoding as needed
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl; 
    } catch (e) {
      console.warn('Error fixing Wikimedia URL:', e);
      return url;
    }
  }
  return url;
};

/**
 * Process a restaurant by checking its image URL and providing a fallback if needed
 * @param restaurant Restaurant object
 * @returns Restaurant with validated image URL
 */
export const processRestaurantImage = async (restaurant: Restaurant): Promise<Restaurant> => {
  try {
    if (restaurant.imageUrl) {
      // Fix potential Wikimedia URL issues
      if (restaurant.imageUrl.includes('wikimedia.org')) {
        restaurant.imageUrl = fixWikimediaUrl(restaurant.imageUrl);
      }
      
      await preloadImage(restaurant.imageUrl);
      return restaurant;
    }
    // If no image URL or loading fails, assign a default based on cuisine
    restaurant.imageUrl = getFallbackImageUrl(restaurant.cuisineType);
    return restaurant;
  } catch (error) {
    console.warn(`Image load failed for ${restaurant.name}, using fallback image`);
    restaurant.imageUrl = getFallbackImageUrl(restaurant.cuisineType);
    return restaurant;
  }
};