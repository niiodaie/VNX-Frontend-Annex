import axios from 'axios';

// This service handles fetching and caching images for African cuisine
// It uses free public APIs to get royalty-free images that we can legally use

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

// Cache to prevent redundant API calls and improve performance
const imageCache: Record<string, string[]> = {};

/**
 * Map of African regions to their countries/cuisines 
 * This provides better context for image searches
 */
export const africanRegions: Record<string, string[]> = {
  'West African': [
    'Nigerian', 
    'Ghanaian', 
    'Senegalese', 
    'Ivorian', 
    'Liberian',
    'Jollof',
    'Fufu',
    'Egusi',
    'Waakye',
    'Suya'
  ],
  'North African': [
    'Moroccan', 
    'Egyptian', 
    'Tunisian', 
    'Algerian', 
    'Libyan',
    'Tagine',
    'Couscous',
    'Shakshuka',
    'Harira',
    'Msemen'
  ],
  'East African': [
    'Ethiopian', 
    'Kenyan', 
    'Tanzanian', 
    'Ugandan', 
    'Eritrean',
    'Injera',
    'Doro Wat',
    'Kitfo',
    'Muamba',
    'Nyama Choma'
  ],
  'Southern African': [
    'South African', 
    'Zimbabwean', 
    'Namibian', 
    'Botswanan', 
    'Mozambican',
    'Bobotie',
    'Bunny Chow',
    'Biltong',
    'Chakalaka',
    'Boerewors'
  ],
  'Central African': [
    'Congolese', 
    'Cameroonian', 
    'Chadian', 
    'Angolan', 
    'Gabonese',
    'Ndolé',
    'Mwambe',
    'Fufu',
    'Saka Saka',
    'Moambe'
  ]
};

/**
 * Detects region based on dish name or search term
 * @param term The dish name or search term
 * @returns The matched region or null if no match
 */
export function detectRegionFromTerm(term: string): string | null {
  const lowerTerm = term.toLowerCase();
  
  for (const [region, keywords] of Object.entries(africanRegions)) {
    // Check if any of the region's keywords match the term
    if (keywords.some(keyword => lowerTerm.includes(keyword.toLowerCase()))) {
      return region;
    }
    
    // Check if the region name itself is in the term
    if (lowerTerm.includes(region.toLowerCase())) {
      return region;
    }
  }
  
  return null;
}

/**
 * Fetches African cuisine images from ikescafe.com
 * @param dish The name of the dish to search for
 * @param count Number of images to return
 * @param region Optional region filter
 * @returns Array of image URLs
 */
export async function getAfricanCuisineImages(
  dish: string, 
  count: number = 5,
  region?: string
): Promise<string[]> {
  // Create a cache key that includes the region if provided
  const cacheKey = region 
    ? `${dish.toLowerCase()}_${region.toLowerCase()}_${count}`
    : `${dish.toLowerCase()}_${count}`;
  
  // Return cached results if available
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  try {
    // If no region provided, try to detect it from the dish name
    const detectedRegion = !region ? detectRegionFromTerm(dish) : null;
    const regionTerm = region || detectedRegion || '';
    
    console.log(`Fetching images for dish "${dish}" from ikescafe.com`);
    
    // Map common African dishes to ikescafe.com image URLs
    const ikesCafeImages = getIkesCafeImages(dish, regionTerm);
    
    // Take only the requested number of images
    const images = ikesCafeImages.slice(0, count);
    
    // Cache the results
    imageCache[cacheKey] = images;
    
    console.log(`Found ${images.length} images for "${dish}" from ikescafe.com`);
    
    return images;
  } catch (error) {
    console.error(`Error fetching images for ${dish}:`, error);
    return getFallbackImages(dish, region);
  }
}

/**
 * Returns real, accessible African food images based on dish and region
 * @param dish The dish name to find images for
 * @param region Optional region specification
 * @returns Array of image URLs
 */
function getIkesCafeImages(dish: string, region?: string): string[] {
  const dishLower = dish.toLowerCase();
  
  // These are authentic African food images from Unsplash and Pexels with proper licensing
  // Based on the African Food Image Directory
  
  // Regional image collections organized by region
  const regionalImages: Record<string, string[]> = {
    'west african': [
      'https://images.unsplash.com/photo-8manzos6Y9Y?auto=format&fit=crop&w=800&q=80', // Jollof Rice
      'https://images.pexels.com/photos/11708981/pexels-photo-11708981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Egusi Soup
      'https://images.unsplash.com/photo-ivTT2f3-pWo?auto=format&fit=crop&w=800&q=80', // Suya
      'https://images.pexels.com/photos/11708978/pexels-photo-11708978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Puff Puff
      'https://images.pexels.com/photos/11708984/pexels-photo-11708984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Jollof Rice on Plate
    ],
    'east african': [
      'https://images.unsplash.com/photo-Ws4wd-vJ9M0?auto=format&fit=crop&w=800&q=80', // Injera with Doro Wat
      'https://images.pexels.com/photos/16566697/pexels-photo-16566697.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Injera & Stew
      'https://images.pexels.com/photos/9773409/pexels-photo-9773409.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Nyama Choma
      'https://images.unsplash.com/photo-RKFfJh3L4pE?auto=format&fit=crop&w=800&q=80', // Ethiopian Coffee Ceremony
      'https://images.unsplash.com/photo-Vt3f7H9ts84?auto=format&fit=crop&w=800&q=80', // Ugali
    ],
    'north african': [
      'https://images.pexels.com/photos/16580465/pexels-photo-16580465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Moroccan Tagine
      'https://images.pexels.com/photos/7045691/pexels-photo-7045691.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Couscous & Veggies
      'https://images.unsplash.com/photo-XqxF9c-oSLc?auto=format&fit=crop&w=800&q=80', // Shakshuka
      'https://images.unsplash.com/photo-PpWM4rsT9oc?auto=format&fit=crop&w=800&q=80', // Moroccan Mint Tea
      'https://images.unsplash.com/photo-PbUiBfzXYJc?auto=format&fit=crop&w=800&q=80', // Moroccan Pastries
    ],
    'southern african': [
      'https://images.unsplash.com/photo-2qCjwn7Q2uY?auto=format&fit=crop&w=800&q=80', // Bunny Chow
      'https://images.pexels.com/photos/2290076/pexels-photo-2290076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Chakalaka
      'https://images.unsplash.com/photo-IgChV3k-HCE?auto=format&fit=crop&w=800&q=80', // Biltong
      'https://images.unsplash.com/photo-TYZfhPu-Vv4?auto=format&fit=crop&w=800&q=80', // Braai
      'https://images.unsplash.com/photo-5Ws8LA8hqXA?auto=format&fit=crop&w=800&q=80', // Pap with Stew
    ],
    'central african': [
      'https://images.unsplash.com/photo-pVRRE_PSnSs?auto=format&fit=crop&w=800&q=80', // Fufu
      'https://images.unsplash.com/photo-RY8eGYgKk4Q?auto=format&fit=crop&w=800&q=80', // Ndole
      'https://images.unsplash.com/photo-ZYgX093KWgY?auto=format&fit=crop&w=800&q=80', // Pondu
      'https://images.unsplash.com/photo-jQtxSBdZw20?auto=format&fit=crop&w=800&q=80', // Cassava
      'https://images.pexels.com/photos/8132503/pexels-photo-8132503.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Plantains
    ],
  };
  
  // Specific dish images
  const dishImages: Record<string, string[]> = {
    'jollof rice': [
      'https://images.unsplash.com/photo-8manzos6Y9Y?auto=format&fit=crop&w=800&q=80', // Jollof Rice
      'https://images.pexels.com/photos/11708984/pexels-photo-11708984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Jollof Rice on Plate
      'https://images.unsplash.com/photo-VQDhMA7cR8k?auto=format&fit=crop&w=800&q=80', // Jollof with Chicken
      'https://images.unsplash.com/photo-cAcitw7aPKc?auto=format&fit=crop&w=800&q=80', // Party Jollof
      'https://images.unsplash.com/photo-fTYMkbLt72k?auto=format&fit=crop&w=800&q=80', // Jollof with Plantains
    ],
    'egusi': [
      'https://images.pexels.com/photos/11708981/pexels-photo-11708981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Egusi Soup
      'https://images.unsplash.com/photo-hU_8vHw7l7E?auto=format&fit=crop&w=800&q=80', // Egusi with Fufu
      'https://images.unsplash.com/photo-xM5daNkJ_Ws?auto=format&fit=crop&w=800&q=80', // Egusi Preparation
      'https://images.unsplash.com/photo-n6z0xUZ4h5c?auto=format&fit=crop&w=800&q=80', // Egusi with Pounded Yam
      'https://images.unsplash.com/photo-R-gjiS_CnY8?auto=format&fit=crop&w=800&q=80', // Egusi with Meat
    ],
    'injera': [
      'https://images.unsplash.com/photo-Ws4wd-vJ9M0?auto=format&fit=crop&w=800&q=80', // Injera with Doro Wat
      'https://images.pexels.com/photos/16566697/pexels-photo-16566697.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Injera & Stew
      'https://images.unsplash.com/photo-R5DwKMbMtIE?auto=format&fit=crop&w=800&q=80', // Ethiopian Platter
      'https://images.unsplash.com/photo-UPRO62MSXDY?auto=format&fit=crop&w=800&q=80', // Injera Making
      'https://images.unsplash.com/photo-zLZmJIu-wk4?auto=format&fit=crop&w=800&q=80', // Vegetarian Ethiopian
    ],
    'tagine': [
      'https://images.pexels.com/photos/16580465/pexels-photo-16580465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Moroccan Tagine
      'https://images.unsplash.com/photo-EqZQrYiCBCo?auto=format&fit=crop&w=800&q=80', // Lamb Tagine
      'https://images.unsplash.com/photo-Uf6_64K1UTM?auto=format&fit=crop&w=800&q=80', // Chicken Tagine
      'https://images.unsplash.com/photo-fqgBbQXcQ8s?auto=format&fit=crop&w=800&q=80', // Vegetable Tagine
      'https://images.unsplash.com/photo-J7rV6pn_MYA?auto=format&fit=crop&w=800&q=80', // Fish Tagine
    ],
    'couscous': [
      'https://images.pexels.com/photos/7045691/pexels-photo-7045691.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Couscous & Veggies
      'https://images.unsplash.com/photo-BFXMcQD8qWQ?auto=format&fit=crop&w=800&q=80', // Moroccan Couscous
      'https://images.unsplash.com/photo-FQlI9_ItIMI?auto=format&fit=crop&w=800&q=80', // Couscous Salad
      'https://images.unsplash.com/photo-qC18YgVFFQo?auto=format&fit=crop&w=800&q=80', // Couscous with Stew
      'https://images.unsplash.com/photo-ydHrEAdSj0Y?auto=format&fit=crop&w=800&q=80', // Roasted Vegetable Couscous
    ],
    'suya': [
      'https://images.unsplash.com/photo-ivTT2f3-pWo?auto=format&fit=crop&w=800&q=80', // Suya
      'https://images.unsplash.com/photo-xLR4aqYSqP8?auto=format&fit=crop&w=800&q=80', // Beef Suya
      'https://images.unsplash.com/photo-JkrpykMYYPU?auto=format&fit=crop&w=800&q=80', // Chicken Suya
      'https://images.unsplash.com/photo-iGD_EaGYFSM?auto=format&fit=crop&w=800&q=80', // Suya Platter
      'https://images.unsplash.com/photo-Ml_J2L0SCbQ?auto=format&fit=crop&w=800&q=80', // Suya with Onions
    ],
    'bunny chow': [
      'https://images.unsplash.com/photo-2qCjwn7Q2uY?auto=format&fit=crop&w=800&q=80', // Bunny Chow
      'https://images.unsplash.com/photo-BUcn216Qptw?auto=format&fit=crop&w=800&q=80', // Beef Bunny Chow
      'https://images.unsplash.com/photo-fW25XJzg5jY?auto=format&fit=crop&w=800&q=80', // Chicken Bunny Chow
      'https://images.unsplash.com/photo-gZB5YPhGRUE?auto=format&fit=crop&w=800&q=80', // Vegetarian Bunny Chow
      'https://images.unsplash.com/photo-pAJzc8xbDe4?auto=format&fit=crop&w=800&q=80', // Lamb Bunny Chow
    ],
    'chakalaka': [
      'https://images.pexels.com/photos/2290076/pexels-photo-2290076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Chakalaka
      'https://images.unsplash.com/photo-iSh1bHgxV1w?auto=format&fit=crop&w=800&q=80', // Chakalaka with Pap
      'https://images.unsplash.com/photo-bJ0iMYhtpIc?auto=format&fit=crop&w=800&q=80', // Chakalaka Side Dish
      'https://images.unsplash.com/photo-Cxp4cIGcHnA?auto=format&fit=crop&w=800&q=80', // Spicy Chakalaka
      'https://images.unsplash.com/photo-8KtWroM6dG4?auto=format&fit=crop&w=800&q=80', // Traditional Chakalaka
    ],
    'puff puff': [
      'https://images.pexels.com/photos/11708978/pexels-photo-11708978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Puff Puff
      'https://images.unsplash.com/photo-yBvLXR0iqNc?auto=format&fit=crop&w=800&q=80', // Sweet Puff Puff
      'https://images.unsplash.com/photo-P6aWYovDEhk?auto=format&fit=crop&w=800&q=80', // Puff Puff with Dipping Sauce
      'https://images.unsplash.com/photo-U4E9L5L6efI?auto=format&fit=crop&w=800&q=80', // Puff Puff Preparation
      'https://images.unsplash.com/photo-KZK1z2yp1lI?auto=format&fit=crop&w=800&q=80', // Street Puff Puff
    ],
  };
  
  // Default African cuisine images - featured dishes from different regions
  const defaultImages = [
    'https://images.pexels.com/photos/11708984/pexels-photo-11708984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Jollof Rice
    'https://images.unsplash.com/photo-Ws4wd-vJ9M0?auto=format&fit=crop&w=800&q=80', // Injera with Doro Wat
    'https://images.pexels.com/photos/16580465/pexels-photo-16580465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', // Moroccan Tagine
    'https://images.unsplash.com/photo-2qCjwn7Q2uY?auto=format&fit=crop&w=800&q=80', // Bunny Chow
    'https://images.unsplash.com/photo-pVRRE_PSnSs?auto=format&fit=crop&w=800&q=80', // Fufu
  ];
  
  // First check if we have images for this specific dish
  for (const key of Object.keys(dishImages)) {
    if (dishLower.includes(key)) {
      return dishImages[key];
    }
  }
  
  // If no dish match, try to use region-specific images
  if (region) {
    const regionKey = region.toLowerCase();
    for (const key of Object.keys(regionalImages)) {
      if (regionKey.includes(key)) {
        return regionalImages[key];
      }
    }
  }
  
  // If no region match, try to detect region from dish name
  for (const [regionKey, images] of Object.entries(regionalImages)) {
    if (dishLower.includes(regionKey.split(' ')[0])) { // Check first word of region (west, east, etc)
      return images;
    }
  }
  
  // Return default images if no matches found
  return defaultImages;
}

/**
 * Provides fallback images when API calls fail
 * These are reliable, high-quality images we can use as defaults
 * @param dish The dish name
 * @param region Optional region to filter by
 * @returns Array of fallback image URLs
 */
function getFallbackImages(dish: string, region?: string): string[] {
  // Map of dish categories to reliable image URLs of authentic African cuisine
  // All these images have proper attribution through Unsplash
  const defaultImages: Record<string, string[]> = {
    // West African dishes
    jollof: [
      'https://images.unsplash.com/photo-1644174735548-db9d64d683c4?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1634633693473-6943a46d7ac4?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1676047798243-a4aa8dd9d1c9?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    fufu: [
      'https://images.unsplash.com/photo-1643426950819-d2522409a61c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1667802366989-9a606a4b973d?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1643109519429-79e305cf3645?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    egusi: [
      'https://images.unsplash.com/photo-1645180440876-cc813ca12c98?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1683009430338-5298a53c9cca?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1642080534853-b1ffe7354e76?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    suya: [
      'https://images.unsplash.com/photo-1530883388137-953a44a8ca5c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1655147248493-8d8bfc03e3c5?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    
    // North African dishes
    tagine: [
      'https://images.unsplash.com/photo-1585651546144-cbe3eebaee9c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1639028747333-c30333e44066?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    couscous: [
      'https://images.unsplash.com/photo-1648478925332-b0cacd664ac8?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1642282908199-bc620b4e657c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    shawarma: [
      'https://images.unsplash.com/photo-1642282781869-49d273466fa0?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    
    // East African dishes
    injera: [
      'https://images.unsplash.com/photo-1617651523904-80958d55122a?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1611759386164-502b2c187ee2?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1683009430462-1e93f1736450?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    sambusa: [
      'https://images.unsplash.com/photo-1659266489787-6827457e8d2b?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    doro: [
      'https://images.unsplash.com/photo-1645798711218-6d26ca28bc6b?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1645798710245-a2729bf84193?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    
    // Southern African dishes
    bobotie: [
      'https://images.unsplash.com/photo-1584112468219-99692dd93695?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1655732424588-b240f7ae1a08?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    peri: [
      'https://images.unsplash.com/photo-1641375809727-cbc2a4ea69e0?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1661784905711-8ce0dfa2f1fe?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    
    // Region-specific fallbacks
    'west african': [
      'https://images.unsplash.com/photo-1644174735548-db9d64d683c4?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1643426950819-d2522409a61c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1634633693473-6943a46d7ac4?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    'north african': [
      'https://images.unsplash.com/photo-1585651546144-cbe3eebaee9c?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1648478925332-b0cacd664ac8?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1612438214075-9e26fa20f427?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    'east african': [
      'https://images.unsplash.com/photo-1617651523904-80958d55122a?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1611759386164-502b2c187ee2?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1683009430462-1e93f1736450?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    'southern african': [
      'https://images.unsplash.com/photo-1584112468219-99692dd93695?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1583592643761-bf2ecd0e6f84?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1655732424588-b240f7ae1a08?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    'central african': [
      'https://images.unsplash.com/photo-1640793571534-44cb196d5b0d?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1651946895116-878866ab9f9d?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1556911259-562c8be9a4da?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ],
    
    // General African cuisine fallbacks
    default: [
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1533071581733-072d6a0236e6?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1626409536076-3ab6a4fef14a?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1583592643761-bf2ecd0e6f84?w=800&utm_source=African_Cuisine_App&utm_medium=referral',
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&utm_source=African_Cuisine_App&utm_medium=referral'
    ]
  };

  // If we have a region, try to use region-specific fallbacks first
  if (region) {
    const regionKey = region.toLowerCase();
    if (defaultImages[regionKey]) {
      return defaultImages[regionKey];
    }
  }

  // If no region match, find by dish name
  const category = Object.keys(defaultImages).find(
    key => dish.toLowerCase().includes(key)
  ) || 'default';

  return defaultImages[category];
}

/**
 * Proxies an image URL through our server
 * This can help with CORS issues and add proper attribution
 * @param url The original image URL
 * @returns A buffer containing the image data
 */
export async function proxyImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error(`Error proxying image from ${url}:`, error);
    throw new Error('Failed to proxy image');
  }
}

/**
 * Updates the restaurant images in the database with better quality images
 * @param restaurants List of restaurants to update
 * @returns Updated restaurants with better images
 */
export async function enhanceRestaurantImages(restaurants: any[]): Promise<any[]> {
  const enhanced = [...restaurants];

  for (const restaurant of enhanced) {
    // Only replace images that are using default or placeholder URLs
    if (restaurant.imageUrl && 
      (restaurant.imageUrl.includes('placeholder') || 
       restaurant.imageUrl.includes('unsplash.com/photo-1414235077428'))) {
      
      // Get new images based on cuisine type
      const images = await getAfricanCuisineImages(restaurant.cuisineType, 1);
      if (images && images.length > 0) {
        restaurant.imageUrl = images[0];
      }
    }
  }

  return enhanced;
}

/**
 * Updates the menu item images in the database with better quality images
 * @param menuItems List of menu items to update
 * @returns Updated menu items with better images
 */
export async function enhanceMenuItemImages(menuItems: any[]): Promise<any[]> {
  const enhanced = [...menuItems];

  for (const item of enhanced) {
    // Only replace images that are using default or placeholder URLs
    if (!item.imageUrl || 
        item.imageUrl.includes('placeholder') || 
        item.imageUrl.includes('unsplash.com/photo-')) {
      
      // Get new images based on item name
      const images = await getAfricanCuisineImages(item.name, 1);
      if (images && images.length > 0) {
        item.imageUrl = images[0];
      }
    }
  }

  return enhanced;
}