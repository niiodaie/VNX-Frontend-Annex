# African Cuisine Webpage: Image Integration & Restaurant Data Connection

## Project Analysis

After reviewing the codebase, I've identified the following components related to adding images to the African Cuisine webpage and connecting it to restaurant data:

### Current Implementation

1. **Image Handling**
   - The schema for restaurants includes an `imageUrl` field
   - The DirectoryPage component already has image rendering capabilities
   - Home page already displays cuisine categories with imported images
   - The attached JSON/CSV files contain valid image URLs for African dishes

2. **Restaurant Data Sources**
   - DirectoryIntegration component exists to import restaurant data
   - API endpoints for Apify integration have been set up
   - Server routes for restaurant queries exist
   - Mock restaurant data is returned for development purposes

3. **Issues to Address**
   - Need to connect the sample restaurant data with real images
   - No endpoint to import dish data from attached files
   - Restaurant import doesn't use the authentic data provided in your files
   - No way to use the external images from Wikimedia/Unsplash

## Implementation Plan

### 1. Create Data Import Service for Restaurant Images

This service will allow importing restaurant and dish data from the provided JSON/CSV files:

```javascript
// client/src/utils/dataImporter.ts
import axios from 'axios';

export async function importLocalRestaurantData() {
  try {
    // Fetch the local JSON file
    const response = await axios.get('/api/import/african-dishes');
    return response.data;
  } catch (error) {
    console.error('Error importing local restaurant data:', error);
    throw error;
  }
}

export async function convertDishesToRestaurants(dishes) {
  // Convert dish data to restaurant format
  return dishes.map(dish => ({
    name: `${dish.country} Restaurant - ${dish.name}`,
    description: `Authentic ${dish.country} restaurant featuring ${dish.name} and other local specialties.`,
    address: `123 ${dish.country} Street, Food District`,
    imageUrl: dish.image,
    rating: (3 + Math.random() * 2).toFixed(1), // Random rating between 3-5
    phoneNumber: '+1-555-123-4567',
    website: `https://example.com/${dish.name.toLowerCase().replace(/\s+/g, '-')}`,
    cuisineType: `${dish.country} Cuisine`
  }));
}
```

### 2. Add Server Endpoint to Access Dish Data

Create an endpoint to serve the attached dish data:

```javascript
// In server/routes.ts
app.get("/api/import/african-dishes", async (_req: Request, res: Response) => {
  try {
    // Path to the JSON file in the attached assets
    const dishDataPath = path.join(process.cwd(), 'attached_assets', 'african_dishes.json');
    
    if (fs.existsSync(dishDataPath)) {
      const dishData = JSON.parse(fs.readFileSync(dishDataPath, 'utf8'));
      res.json({ dishes: dishData });
    } else {
      res.status(404).json({ error: "African dishes data file not found" });
    }
  } catch (error: any) {
    console.error("Error serving African dishes data:", error.message);
    res.status(500).json({ 
      error: "Failed to serve African dishes data",
      message: error.message
    });
  }
});
```

### 3. Enhance DirectoryIntegration Component

Modify the DirectoryIntegration component to include a new data source option for local files:

```jsx
// In client/src/components/DirectoryIntegration.tsx
// Add a new import source option
const [importSource, setImportSource] = useState<'apify' | 'google' | 'yelp' | 'local'>('apify');

// In the handleImport function, add a new case:
case 'local':
  // Import from local JSON file
  const localResult = await axios.get('/api/import/african-dishes');
  const dishes = localResult.data.dishes;
  const restaurantsFromDishes = await convertDishesToRestaurants(dishes);
  result = { data: { restaurants: restaurantsFromDishes }};
  break;

// Add a new button in the UI
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
```

### 4. Create Image Preloader Utility

Add a utility to preload and validate external images before displaying them:

```javascript
// client/src/utils/imageHandler.ts
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

export const getFallbackImageUrl = (cuisineType: string): string => {
  const defaultImages = {
    'Nigerian': '/src/assets/images/nigerianCuisine.png',
    'Ethiopian': '/src/assets/images/ethiopian_cuisine.png',
    'Ghanaian': '/src/assets/images/waakye.png',
    'default': '/src/assets/images/reference-design.png'
  };
  
  return defaultImages[cuisineType] || defaultImages.default;
};

export const processRestaurantImage = async (restaurant) => {
  try {
    if (restaurant.imageUrl) {
      await preloadImage(restaurant.imageUrl);
      return restaurant;
    }
    // If no image URL or loading fails, assign a default based on cuisine
    restaurant.imageUrl = getFallbackImageUrl(restaurant.cuisineType);
    return restaurant;
  } catch (error) {
    restaurant.imageUrl = getFallbackImageUrl(restaurant.cuisineType);
    return restaurant;
  }
};
```

### 5. Enhance the DirectoryPage with Image Error Handling

Improve the restaurant listing to handle image loading errors:

```jsx
// In client/src/pages/DirectoryPage.tsx
// Import the image handler
import { processRestaurantImage } from '../utils/imageHandler';

// Update the handleImportComplete function
const handleImportComplete = async (restaurants: Restaurant[]) => {
  // Process all restaurant images with error handling
  const processedRestaurants = await Promise.all(
    restaurants.map(async (restaurant) => await processRestaurantImage(restaurant))
  );
  setImportedRestaurants(processedRestaurants);
};

// Add image error handling in the restaurant card
<img 
  src={restaurant.imageUrl} 
  alt={restaurant.name}
  className="w-full h-48 object-cover rounded-md"
  onError={(e) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = getFallbackImageUrl(restaurant.cuisineType);
  }}
/>
```

### 6. Create an Import Script for Restaurants

Add a script to populate the database with restaurants generated from the dish data:

```javascript
// scripts/import-restaurants.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function importRestaurants() {
  try {
    console.log('Starting restaurant import from African dishes data...');
    
    // Read the african_dishes.json file
    const filePath = path.join(__dirname, '..', 'attached_assets', 'african_dishes.json');
    const dishesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`Found ${dishesData.length} dishes to convert to restaurants`);
    
    // Convert dishes to restaurants
    const restaurants = dishesData.map(dish => ({
      name: `${dish.country} Restaurant - ${dish.name}`,
      description: `Authentic ${dish.country} restaurant featuring ${dish.name} and other local specialties.`,
      cuisineType: `${dish.country} Cuisine`,
      country: dish.country,
      address: `123 ${dish.country} Street, Food District`,
      city: `${dish.country} City`,
      phoneNumber: '+1-555-123-4567',
      website: `https://example.com/${dish.name.toLowerCase().replace(/\s+/g, '-')}`,
      openingHours: '11:00 AM - 10:00 PM',
      priceRange: '$$ - $$$',
      imageUrl: dish.image,
    }));
    
    // Now we would typically insert these into the database
    // For now, we'll write them to a file for demonstration
    const outputPath = path.join(__dirname, '..', 'generated-restaurants.json');
    fs.writeFileSync(outputPath, JSON.stringify(restaurants, null, 2));
    
    console.log(`Successfully created ${restaurants.length} restaurants from dish data`);
    console.log(`Output saved to: ${outputPath}`);
    
    // Note: In a real implementation, we would call an API endpoint to save to the database
    
  } catch (error) {
    console.error('Error importing restaurants:', error);
  }
}

// Execute the function
importRestaurants();
```

### 7. Add Static Public Image Fallbacks

Add fallback images to the public folder for when external images fail to load:

```
// Create these directories and add default cuisine images
public/images/cuisines/ethiopian.jpg
public/images/cuisines/nigerian.jpg
public/images/cuisines/ghanaian.jpg
public/images/cuisines/moroccan.jpg
public/images/cuisines/default.jpg
```

## Implementation Steps

1. First, implement the server-side endpoint to access the attached dish data
2. Create the data importer utility to convert dishes to restaurants
3. Enhance the DirectoryIntegration component with the local data option
4. Add image preloading and fallback handling utilities
5. Update the DirectoryPage to use the enhanced image handling
6. Test the full flow by importing data and verifying images display properly
7. Optimize image loading with preloading and error handling

## Potential Issues and Solutions

1. **Issue**: External image URLs might be blocked by CORS policies
   **Solution**: Add server-side proxy route to fetch images

2. **Issue**: Some image URLs in the JSON/CSV files might be outdated
   **Solution**: Implement fallback images based on cuisine type

3. **Issue**: Restaurant data lacks detailed information
   **Solution**: Enhance the data with AI-generated descriptions

4. **Issue**: Performance issues with loading many images
   **Solution**: Implement lazy loading and image optimization

## Long-term Improvements

1. Implement a proper image CDN for hosting restaurant images
2. Add image upload functionality for user-submitted restaurant content
3. Implement image resizing and optimization for different viewports
4. Add image moderation for user-submitted content

By following this implementation plan, you'll be able to successfully integrate images with your restaurant data in the African Cuisine webpage, providing users with a visually appealing experience while browsing restaurants.