import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertReservationSchema, 
  insertReviewSchema 
} from "@shared/schema";
import { translateText, getLanguageOptions, generatePronunciationGuide } from "./services/openai";
import { getFoodPairingSuggestions } from "./services/foodPairingService";
import { scrapeGoogleForAfricanCuisine } from "./services/scrapeGoogleService";
import { getAfricanCuisineImages, enhanceRestaurantImages, enhanceMenuItemImages } from "./services/imageService";
import { setupAuth } from "./auth";
import { z } from "zod";
import path from "path";
import fs from "fs";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Create a middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Create a middleware to check if user is not a guest
  const isNotGuest = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (!req.user.isGuest)) {
      return next();
    }
    res.status(403).json({ message: "Access denied. This action requires a full account." });
  };

  // prefix all routes with /api
  const httpServer = createServer(app);

  // Restaurant endpoints
  app.get("/api/restaurants", async (_req: Request, res: Response) => {
    try {
      const restaurants = await storage.getRestaurants();
      res.json({ restaurants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      const restaurant = await storage.getRestaurantById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json({ restaurant });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  app.get("/api/restaurants/cuisine/:cuisineType", async (req: Request, res: Response) => {
    try {
      const { cuisineType } = req.params;
      const restaurants = await storage.getRestaurantsByCuisine(cuisineType);
      res.json({ restaurants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants by cuisine" });
    }
  });

  app.get("/api/restaurants/city/:city", async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      const restaurants = await storage.getRestaurantsByCity(city);
      res.json({ restaurants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants by city" });
    }
  });

  // Menu items endpoints
  app.get("/api/restaurants/:id/menu", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      const menuItems = await storage.getMenuItemsByRestaurantId(id);
      res.json({ menuItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/restaurants/:id/menu/featured", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      const featuredItems = await storage.getFeaturedMenuItemsByRestaurantId(id);
      res.json({ featuredItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured menu items" });
    }
  });

  // User endpoints
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userResult = insertUserSchema.safeParse(req.body);
      
      if (!userResult.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: userResult.error.errors 
        });
      }

      const existingUser = await storage.getUserByUsername(userResult.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userResult.data);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const loginSchema = z.object({
        username: z.string(),
        password: z.string()
      });
      
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid login data", 
          errors: result.error.errors 
        });
      }

      const { username, password } = result.data;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Review endpoints
  app.get("/api/restaurants/:id/reviews", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      const reviews = await storage.getReviewsByRestaurantId(id);
      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewResult = insertReviewSchema.safeParse(req.body);
      
      if (!reviewResult.success) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: reviewResult.error.errors 
        });
      }

      const review = await storage.createReview(reviewResult.data);
      res.status(201).json({ review });
    } catch (error) {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // User profile endpoints
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add user preferences (would be from a separate table in a real DB)
      const userWithPreferences = {
        ...user,
        preferences: {
          favoriteRegions: ["West African", "North African"],
          dietaryRestrictions: ["Vegetarian options"],
          spiceLevel: "Medium",
          notifications: true
        }
      };

      res.json(userWithPreferences);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.get("/api/users/:id/reviews", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const reviews = await storage.getReviewsByUserId(id);
      
      // Enhance reviews with restaurant details
      const enhancedReviews = await Promise.all(reviews.map(async (review) => {
        const restaurant = await storage.getRestaurantById(review.restaurantId);
        return {
          ...review,
          restaurant: restaurant ? {
            name: restaurant.name,
            cuisineType: restaurant.cuisineType,
            imageUrl: restaurant.imageUrl
          } : undefined
        };
      }));

      res.json({ reviews: enhancedReviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  app.get("/api/users/:id/favorites", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Since we don't have a favorites table yet, return sample data
      // In a real implementation, you'd query a user_favorites table
      const favoriteRestaurantIds = [1, 3, 4]; // Example favorite restaurant IDs
      const restaurants = await Promise.all(
        favoriteRestaurantIds.map(async (restaurantId) => {
          const restaurant = await storage.getRestaurantById(restaurantId);
          return restaurant;
        })
      );

      const favorites = restaurants
        .filter((restaurant): restaurant is NonNullable<typeof restaurant> => Boolean(restaurant))
        .map((restaurant, index) => ({
          id: index + 1,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            cuisineType: restaurant.cuisineType,
            address: restaurant.address,
            imageUrl: restaurant.imageUrl,
            rating: restaurant.rating
          },
          addedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
        }));

      res.json({ favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real implementation, you would update the user in the database
      // For now, we'll just return the user with the requested changes

      const updatedUser = {
        ...user,
        ...req.body,
        // Don't allow updating id or created at timestamp
        id: user.id,
        createdAt: user.createdAt
      };

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Reservation endpoints
  app.get("/api/users/:id/reservations", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const reservations = await storage.getReservationsByUserId(id);
      res.json({ reservations });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req: Request, res: Response) => {
    try {
      const reservationResult = insertReservationSchema.safeParse(req.body);
      
      if (!reservationResult.success) {
        return res.status(400).json({ 
          message: "Invalid reservation data", 
          errors: reservationResult.error.errors 
        });
      }

      const reservation = await storage.createReservation(reservationResult.data);
      res.status(201).json({ reservation });
    } catch (error) {
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }

      const statusSchema = z.object({
        status: z.string().refine(val => ["confirmed", "cancelled", "completed"].includes(val))
      });
      
      const result = statusSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid status data", 
          errors: result.error.errors 
        });
      }

      const updatedReservation = await storage.updateReservationStatus(id, result.data.status);
      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      res.json({ reservation: updatedReservation });
    } catch (error) {
      res.status(500).json({ message: "Failed to update reservation status" });
    }
  });

  // Cultural insight endpoints
  app.get("/api/cultural-insights", async (_req: Request, res: Response) => {
    try {
      const insights = await storage.getCulturalInsights();
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cultural insights" });
    }
  });

  app.get("/api/cultural-insights/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid insight ID" });
      }

      const insight = await storage.getCulturalInsightById(id);
      if (!insight) {
        return res.status(404).json({ message: "Cultural insight not found" });
      }

      res.json({ insight });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cultural insight" });
    }
  });

  app.get("/api/cultural-insights/cuisine/:cuisineType", async (req: Request, res: Response) => {
    try {
      const { cuisineType } = req.params;
      const insights = await storage.getCulturalInsightsByCuisine(cuisineType);
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cultural insights by cuisine" });
    }
  });

  // Recipe translation endpoints
  app.get("/api/translation/languages", (_req: Request, res: Response) => {
    try {
      const languages = getLanguageOptions();
      res.json({ languages });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch language options" });
    }
  });

  app.post("/api/translation/translate", async (req: Request, res: Response) => {
    try {
      const translationSchema = z.object({
        text: z.string().min(1),
        sourceLanguage: z.string().optional().default('auto'),
        targetLanguage: z.string().min(2),
      });
      
      const result = translationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid translation request", 
          errors: result.error.errors 
        });
      }

      const { text, sourceLanguage, targetLanguage } = result.data;
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      
      res.json({ 
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage
      });
    } catch (error: any) {
      console.error("Translation error:", error);
      res.status(500).json({ 
        message: "Failed to translate text",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Pronunciation guide endpoint
  app.post("/api/translation/pronunciation", async (req: Request, res: Response) => {
    try {
      const pronunciationSchema = z.object({
        terms: z.array(z.string()),
        language: z.string().optional().default('en')
      });
      
      const result = pronunciationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid pronunciation guide request", 
          errors: result.error.errors 
        });
      }

      const { terms, language } = result.data;
      if (terms.length === 0) {
        return res.status(400).json({ message: "No terms provided for pronunciation" });
      }

      const pronunciationGuides = await generatePronunciationGuide(terms, language);
      
      res.json({ 
        guides: pronunciationGuides,
        language
      });
    } catch (error: any) {
      console.error("Pronunciation guide error:", error);
      res.status(500).json({ 
        message: "Failed to generate pronunciation guide",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Food Origin Story endpoints
  app.get("/api/food-origin-stories", async (_req: Request, res: Response) => {
    try {
      const stories = await storage.getFoodOriginStories();
      res.json({ stories });
    } catch (error) {
      console.error("Error fetching food origin stories:", error);
      res.status(500).json({ message: "Failed to fetch food origin stories" });
    }
  });

  app.get("/api/food-origin-stories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const story = await storage.getFoodOriginStoryById(id);
      if (!story) {
        return res.status(404).json({ message: "Food origin story not found" });
      }

      res.json({ story });
    } catch (error) {
      console.error("Error fetching food origin story:", error);
      res.status(500).json({ message: "Failed to fetch food origin story" });
    }
  });

  app.get("/api/food-origin-stories/dish/:dishName", async (req: Request, res: Response) => {
    try {
      const { dishName } = req.params;
      if (!dishName) {
        return res.status(400).json({ message: "Missing dish name parameter" });
      }

      const stories = await storage.getFoodOriginStoriesByDishName(dishName);
      res.json({ stories });
    } catch (error) {
      console.error("Error fetching food origin stories by dish name:", error);
      res.status(500).json({ message: "Failed to fetch food origin stories by dish name" });
    }
  });

  app.get("/api/food-origin-stories/cuisine/:cuisineType", async (req: Request, res: Response) => {
    try {
      const { cuisineType } = req.params;
      if (!cuisineType) {
        return res.status(400).json({ message: "Missing cuisine type parameter" });
      }

      const stories = await storage.getFoodOriginStoriesByCuisine(cuisineType);
      res.json({ stories });
    } catch (error) {
      console.error("Error fetching food origin stories by cuisine:", error);
      res.status(500).json({ message: "Failed to fetch food origin stories by cuisine" });
    }
  });

  app.post("/api/food-origin-stories", async (req: Request, res: Response) => {
    try {
      const storySchema = z.object({
        dishName: z.string(),
        cuisineType: z.string(),
        country: z.string(),
        storyContent: z.string(),
        historicalPeriod: z.string().optional(),
        culturalSignificance: z.string().optional(),
        ingredients: z.string().optional(),
        imageUrl: z.string().optional()
      });
      
      const result = storySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid food origin story data", 
          errors: result.error.errors 
        });
      }

      const newStory = await storage.createFoodOriginStory(result.data);
      res.status(201).json({ story: newStory });
    } catch (error) {
      console.error("Error creating food origin story:", error);
      res.status(500).json({ message: "Failed to create food origin story" });
    }
  });
  
  // Food Pairing Suggestions endpoints
  app.post("/api/food-pairings", async (req: Request, res: Response) => {
    try {
      const pairingSchema = z.object({
        dish: z.string(),
        cuisine: z.string().optional(),
        dietaryRestrictions: z.array(z.string()).optional()
      });
      
      const result = pairingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid food pairing request", 
          errors: result.error.errors 
        });
      }

      const { dish, cuisine, dietaryRestrictions } = result.data;
      const pairingSuggestions = await getFoodPairingSuggestions(dish, cuisine, dietaryRestrictions);
      
      res.json({ pairingSuggestions });
    } catch (error: any) {
      console.error("Food pairing suggestions error:", error);
      res.status(500).json({ 
        message: "Failed to generate food pairing suggestions",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get pairing suggestions for a specific dish
  app.get("/api/food-pairings/:dish", async (req: Request, res: Response) => {
    try {
      const { dish } = req.params;
      if (!dish) {
        return res.status(400).json({ message: "Missing dish parameter" });
      }
      
      // Extract optional query parameters
      const cuisine = typeof req.query.cuisine === 'string' ? req.query.cuisine : undefined;
      const dietaryRestrictions = req.query.diet 
        ? (Array.isArray(req.query.diet) 
            ? req.query.diet.map(d => String(d))
            : [String(req.query.diet)])
        : undefined;
      
      const pairingSuggestions = await getFoodPairingSuggestions(dish, cuisine, dietaryRestrictions);
      
      res.json({ pairingSuggestions });
    } catch (error: any) {
      console.error("Food pairing suggestions error:", error);
      res.status(500).json({ 
        message: "Failed to generate food pairing suggestions",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // AR Measurement Guide API Endpoints
  app.get("/api/ar-measurement/ingredients", (_req: Request, res: Response) => {
    // In a real app, this would come from the database
    const ingredients = [
      {
        id: 1,
        name: "Berbere",
        localName: "በርበሬ",
        description: "A hot spice blend used in Ethiopian and Eritrean cooking. It's a complex mixture typically including chili peppers, garlic, ginger, dried basil, korarima, rue, white and black pepper, and fenugreek.",
        standardEquivalent: "1 tablespoon of berbere = approximately 15g",
        imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "Always start with less and add more to taste",
          "The color should be deep red to dark brick red",
          "Store in a cool, dark place in an airtight container"
        ],
        region: "East Africa"
      },
      {
        id: 2,
        name: "Suya Spice",
        localName: "Yaji",
        description: "A spicy peanut-based seasoning used in Nigerian cuisine, particularly for grilled meat skewers (suya). It typically contains ground peanuts, chili pepper, ginger, and other spices.",
        standardEquivalent: "1 tablespoon of suya spice = approximately 12g",
        imageUrl: "https://images.unsplash.com/photo-1608197492882-89f61708c753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "The peanut should be finely ground, almost to a powder",
          "Balance the heat level by adjusting the amount of chili",
          "Can be used as a dry rub or mixed with oil to form a paste"
        ],
        region: "West Africa"
      },
      {
        id: 3,
        name: "Ras el Hanout",
        localName: "راس الحانوت",
        description: "A complex, aromatic North African spice blend used throughout Morocco, Algeria, and Tunisia. The name means 'head of the shop' in Arabic, implying a mixture of the best spices the merchant has to offer.",
        standardEquivalent: "1 tablespoon of ras el hanout = approximately 14g",
        imageUrl: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "Traditional blends can contain more than 30 ingredients",
          "The color ranges from reddish-brown to deep mahogany",
          "Add it early in cooking to infuse the flavors properly"
        ],
        region: "North Africa"
      },
      {
        id: 4,
        name: "Fufu Flour",
        description: "A staple food made from starchy vegetables like cassava, yams, or plantains that have been boiled, pounded, and fermented. The flour is used to make a dough-like consistency that is eaten with soups and stews.",
        standardEquivalent: "1 cup of fufu flour = approximately 130g",
        imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "Measure accurately as too much or too little water affects consistency",
          "When prepared, fufu should be smooth without lumps",
          "Different types of flour (cassava, plantain, etc.) require slightly different measurements"
        ],
        region: "West Africa"
      },
      {
        id: 5,
        name: "Harissa",
        localName: "هريسة",
        description: "A hot chili pepper paste native to North Africa made from roasted red peppers, Baklouti peppers, spices and herbs such as garlic paste, caraway seeds, coriander seeds, cumin and olive oil.",
        standardEquivalent: "1 tablespoon of harissa paste = approximately 18g",
        imageUrl: "https://images.unsplash.com/photo-1612187286573-e11a07b5cba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "Homemade harissa tends to be spicier than commercial versions",
          "The texture should be smooth but thick enough to hold its shape",
          "A little goes a long way, especially with authentic harissa"
        ],
        region: "North Africa"
      },
      {
        id: 6,
        name: "Chakalaka Spice Mix",
        description: "A South African vegetable relish that is typically spicy and usually served cold. The spice mix includes paprika, curry powder, chili, and other spices.",
        standardEquivalent: "1 tablespoon of chakalaka spice = approximately 13g",
        imageUrl: "https://images.unsplash.com/photo-1505714091216-22e6a5aac7cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tips: [
          "The mix should have a balanced heat, not overwhelmingly spicy",
          "Can be customized based on personal preference for heat level",
          "Store in an airtight container away from light and moisture"
        ],
        region: "Southern Africa"
      }
    ];
    
    res.json({ ingredients });
  });
  
  app.post("/api/ar-measurement/analyze", (req: Request, res: Response) => {
    try {
      const { ingredientId, imageData } = req.body;
      
      if (!ingredientId) {
        return res.status(400).json({ error: "Missing ingredient ID" });
      }
      
      // In a real app, this would use computer vision to analyze the image
      // For this demo, we'll simulate a measurement
      const estimatedAmount = (Math.random() * 3 + 1).toFixed(1);
      const confidenceScore = (Math.random() * 0.4 + 0.6).toFixed(2); // Between 0.6 and 1.0
      
      // Simulate processing delay
      setTimeout(() => {
        res.json({
          measurement: {
            ingredientId,
            estimatedAmount,
            unit: "tablespoons",
            confidenceScore,
            timestamp: new Date().toISOString()
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error analyzing AR measurement:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Image proxy to handle CORS issues with external images
  app.get("/api/image-proxy", async (req: Request, res: Response) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter is required" });
      }
      
      // Make sure the URL is encoded properly
      const decodedUrl = decodeURIComponent(url);
      
      // Fetch the image
      const response = await axios.get(decodedUrl, {
        responseType: 'arraybuffer'
      });
      
      // Set appropriate headers
      const contentType = response.headers['content-type'];
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Send the image data
      res.send(response.data);
    } catch (error: any) {
      console.error("Error proxying image:", error.message);
      res.status(500).json({ 
        error: "Failed to proxy image",
        message: error.message
      });
    }
  });
  
  // Enhanced image endpoints - retrieve high-quality African cuisine images
  app.get("/api/cuisine-images/:dish", async (req: Request, res: Response) => {
    try {
      const { dish } = req.params;
      const count = req.query.count ? parseInt(req.query.count as string) : 5;
      const region = req.query.region as string | undefined;
      
      console.log(`Fetching images for dish "${dish}"${region ? ` in ${region} region` : ''}, count: ${count}`);
      
      const images = await getAfricanCuisineImages(dish, count, region);
      
      console.log(`Found ${images.length} images for "${dish}". Sample URL: ${images.length > 0 ? images[0].substring(0, 100) + '...' : 'none'}`);
      
      res.json({ images });
    } catch (error: any) {
      console.error("Error fetching cuisine images:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch cuisine images",
        message: error.message 
      });
    }
  });
  
  // Get available African regions for filtering
  app.get("/api/cuisine-regions", (_req: Request, res: Response) => {
    try {
      // Define the regions directly to avoid the import dependency
      const regions = [
        'West African',
        'North African',
        'East African',
        'Southern African',
        'Central African'
      ];
      res.json({ regions });
    } catch (error: any) {
      console.error("Error fetching cuisine regions:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch cuisine regions",
        message: error.message 
      });
    }
  });
  
  // Enhanced restaurants with better images
  app.get("/api/enhanced-restaurants", async (_req: Request, res: Response) => {
    try {
      const restaurants = await storage.getRestaurants();
      const enhancedRestaurants = await enhanceRestaurantImages(restaurants);
      res.json({ restaurants: enhancedRestaurants });
    } catch (error: any) {
      console.error("Error enhancing restaurant images:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch enhanced restaurants",
        message: error.message 
      });
    }
  });
  
  // Enhanced menu items with better images
  app.get("/api/restaurants/:id/enhanced-menu", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid restaurant ID" });
      }
      
      const menuItems = await storage.getMenuItemsByRestaurantId(id);
      const enhancedMenuItems = await enhanceMenuItemImages(menuItems);
      res.json({ menuItems: enhancedMenuItems });
    } catch (error: any) {
      console.error("Error enhancing menu item images:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch enhanced menu items",
        message: error.message 
      });
    }
  });

  // Endpoint to serve African dishes data from attached files
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

  // Special routes for serving HTML test files directly
  // This bypasses the Vite middleware that might be causing issues
  app.get("/direct-test.html", (req: Request, res: Response) => {
    try {
      const htmlPath = path.join(process.cwd(), 'public', 'simple-image-test.html');
      
      if (fs.existsSync(htmlPath)) {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        res.header('Content-Type', 'text/html');
        res.send(htmlContent);
      } else {
        res.status(404).send('Test file not found');
      }
    } catch (error) {
      console.error('Error serving direct-test.html:', error);
      res.status(500).send('Error loading test file');
    }
  });

  // Another route for african dishes test
  app.get("/direct-african-test.html", (req: Request, res: Response) => {
    try {
      const htmlPath = path.join(process.cwd(), 'public', 'african-dishes-test.html');
      
      if (fs.existsSync(htmlPath)) {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        res.header('Content-Type', 'text/html');
        res.send(htmlContent);
      } else {
        res.status(404).send('African dishes test file not found');
      }
    } catch (error) {
      console.error('Error serving direct-african-test.html:', error);
      res.status(500).send('Error loading test file');
    }
  });
  
  // New standalone test route - simplified approach
  app.get("/test", (req: Request, res: Response) => {
    try {
      const htmlPath = path.join(process.cwd(), 'public', 'standalone-test.html');
      console.log('Attempting to serve file from path:', htmlPath);
      
      if (fs.existsSync(htmlPath)) {
        console.log('File exists, sending content');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlContent);
      } else {
        console.log('File not found');
        res.status(404).send('Standalone test file not found');
      }
    } catch (error) {
      console.error('Error serving standalone test:', error);
      res.status(500).send('Error loading standalone test file');
    }
  });

  // Apify web scraping integration
  app.post("/api/scrape/apify", async (req: Request, res: Response) => {
    try {
      const { actorId, input } = req.body;
      
      if (!actorId) {
        return res.status(400).json({ error: "Actor ID is required" });
      }
      
      // Note: In production, you would check for an APIFY_API_KEY in env variables
      // For now, we'll return example data to demonstrate the flow
      
      res.json({ 
        success: true,
        data: {
          message: "Apify integration demo - would call actor: " + actorId
        }
      });
    } catch (error: any) {
      console.error("Error with Apify integration:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch data from Apify",
        message: error.message
      });
    }
  });
  
  // Endpoint to search for African restaurants by location
  app.get("/api/scrape/restaurants", async (req: Request, res: Response) => {
    try {
      const { location, cuisine = 'African' } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: "Location parameter is required" });
      }
      
      // In production, this would call an Apify actor or other scraping service
      console.log(`Searching for ${cuisine} restaurants in ${location}`);
      
      // For demo purposes, we're returning example data
      // In a real app, this would come from web scraping
      const restaurants = [
        {
          name: "Mama Africa Restaurant",
          address: `123 Main St, ${location}`,
          description: "Authentic West African cuisine with a modern twist",
          rating: "4.5",
          phoneNumber: "+1-555-123-4567",
          website: "https://example.com/mama-africa",
          imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=500&h=350",
          cuisineType: "West African"
        },
        {
          name: "Ethiopian House",
          address: `456 Food Ave, ${location}`,
          description: "Traditional Ethiopian dishes served on injera",
          rating: "4.7",
          phoneNumber: "+1-555-987-6543",
          website: "https://example.com/ethiopian-house",
          imageUrl: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&w=500&h=350",
          cuisineType: "Ethiopian"
        },
        {
          name: "Taste of Morocco",
          address: `789 Spice Blvd, ${location}`,
          description: "Moroccan tajines, couscous, and mint tea in a cozy setting",
          rating: "4.3",
          phoneNumber: "+1-555-246-8101",
          website: "https://example.com/taste-of-morocco",
          imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef9b17585?auto=format&w=500&h=350",
          cuisineType: "North African"
        }
      ];
      
      // Return the processed data
      res.json({ restaurants });
    } catch (error: any) {
      console.error("Error fetching restaurant data:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch restaurant data",
        message: error.message
      });
    }
  });
  
  // Google Maps Places API integration (simulated)
  app.get("/api/google/places", async (req: Request, res: Response) => {
    try {
      const { location, type = 'restaurant', keyword = 'African' } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: "Location parameter is required" });
      }
      
      console.log(`Searching for ${keyword} ${type}s in ${location} via Google Maps`);
      
      // In production, this would use the Google Places API
      // For demo purposes, we're returning realistic example data
      const restaurants = [
        {
          name: "Accra Foods",
          address: `${typeof location === 'string' ? location : 'New York, NY'}, USA`,
          description: "Authentic Ghanaian cuisine in the heart of the city",
          rating: "4.6",
          phoneNumber: "(212) 555-1234",
          website: "https://www.accrafoods.com",
          imageUrl: "/src/assets/images/waakye_ghana.png",
          cuisineType: "West African",
          country: "Ghana",
          reviewCount: "256",
          priceRange: "$$",
          openNow: true,
          distance: "1.2 mi"
        },
        {
          name: "Little Lagos",
          address: `${typeof location === 'string' ? location : 'New York, NY'}, USA`,
          description: "Nigerian cuisine with authentic jollof rice and more",
          rating: "4.4",
          phoneNumber: "(212) 555-5678",
          website: "https://www.littlelagos.com",
          imageUrl: "/src/assets/images/nigerian_cuisine.png",
          cuisineType: "West African",
          country: "Nigeria",
          reviewCount: "187",
          priceRange: "$$",
          openNow: true,
          distance: "0.8 mi"
        },
        {
          name: "Casablanca Kitchen",
          address: `${typeof location === 'string' ? location : 'New York, NY'}, USA`,
          description: "Moroccan tagines and couscous with traditional spices",
          rating: "4.7",
          phoneNumber: "(212) 555-9012",
          website: "https://www.casablancakitchen.com",
          imageUrl: "/src/assets/images/moroccan_cuisine.png",
          cuisineType: "North African",
          country: "Morocco",
          reviewCount: "312",
          priceRange: "$$$",
          openNow: false,
          distance: "1.5 mi"
        },
        {
          name: "Addis Bistro",
          address: `${typeof location === 'string' ? location : 'New York, NY'}, USA`,
          description: "Ethiopian injera and stews served in a cozy atmosphere",
          rating: "4.5",
          phoneNumber: "(212) 555-3456",
          website: "https://www.addisbistro.com",
          imageUrl: "/src/assets/images/ethiopian_cuisine.png",
          cuisineType: "East African",
          country: "Ethiopia",
          reviewCount: "228",
          priceRange: "$$",
          openNow: true,
          distance: "2.3 mi"
        },
        {
          name: "Cape Town Grill",
          address: `${typeof location === 'string' ? location : 'New York, NY'}, USA`,
          description: "South African braai and traditional dishes",
          rating: "4.3",
          phoneNumber: "(212) 555-7890",
          website: "https://www.capetowngrill.com",
          imageUrl: "/src/assets/images/south_african_cuisine.png",
          cuisineType: "South African",
          country: "South Africa",
          reviewCount: "143",
          priceRange: "$$$",
          openNow: true,
          distance: "3.1 mi"
        }
      ];
      
      // Return the sample data
      res.json({ restaurants });
    } catch (error: any) {
      console.error("Error with Google Places API:", error.message);
      res.status(500).json({ 
        error: "Failed to fetch data from Google Places API",
        message: error.message
      });
    }
  });

  // Endpoint to scrape Yelp for African restaurants
  app.get("/api/scrape/yelp", async (req: Request, res: Response) => {
    try {
      const { location, term = 'African restaurants' } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: "Location parameter is required" });
      }
      
      console.log(`Scraping Yelp for ${term} in ${location}`);
      
      // NOTE: In a production environment, we would implement actual web scraping here
      // using Cheerio to parse the HTML from Yelp search results
      
      // For demo purposes, we're returning example data that mimics Yelp listings
      // In a real implementation, this would be dynamically scraped from Yelp
      const restaurants = [
        {
          name: "Jubba Restaurant",
          address: `${ typeof location === 'string' ? location : 'San Jose, CA' }`,
          description: "Authentic Somali cuisine with a wide range of traditional dishes",
          rating: "4.5",
          phoneNumber: "(408) 440-1829",
          website: "https://www.jubbarestaurant.com",
          imageUrl: "/src/assets/images/ethiopian_cuisine.png", // Using our local images for reliability
          cuisineType: "East African",
          country: "Somalia",
          reviewCount: "238",
          priceRange: "$$"
        },
        {
          name: "Flavors of Africa",
          address: `${ typeof location === 'string' ? location : 'Oakland, CA' }`,
          description: "Serving delicious West African cuisine for over 10 years",
          rating: "4.3",
          phoneNumber: "(510) 553-2321",
          website: "https://www.flavorsofafrica.com",
          imageUrl: "/src/assets/images/nigerian_cuisine.png",
          cuisineType: "West African",
          country: "Nigeria",
          reviewCount: "182",
          priceRange: "$$"
        },
        {
          name: "Durban Spice",
          address: `${ typeof location === 'string' ? location : 'Berkeley, CA' }`,
          description: "South African cuisine with authentic flavors and spices",
          rating: "4.7",
          phoneNumber: "(510) 290-8985",
          website: "https://www.durbanspice.com",
          imageUrl: "/src/assets/images/south_african_cuisine.png",
          cuisineType: "South African",
          country: "South Africa",
          reviewCount: "145",
          priceRange: "$$$"
        },
        {
          name: "Tagine House",
          address: `${ typeof location === 'string' ? location : 'San Francisco, CA' }`,
          description: "Moroccan dishes served in traditional clay tagines",
          rating: "4.8",
          phoneNumber: "(415) 845-7712",
          website: "https://www.taginehouse.com",
          imageUrl: "/src/assets/images/moroccan_cuisine.png",
          cuisineType: "North African",
          country: "Morocco",
          reviewCount: "312",
          priceRange: "$$$"
        },
        {
          name: "Abyssinia Ethiopian",
          address: `${ typeof location === 'string' ? location : 'Oakland, CA' }`,
          description: "Family-owned restaurant serving authentic Ethiopian cuisine",
          rating: "4.6",
          phoneNumber: "(510) 658-9244",
          website: "https://www.abyssiniaethiopian.com",
          imageUrl: "/src/assets/images/ethiopian_cuisine.png",
          cuisineType: "East African",
          country: "Ethiopia",
          reviewCount: "274",
          priceRange: "$$"
        }
      ];
      
      // Return the sample data
      res.json({ restaurants });
    } catch (error: any) {
      console.error("Error scraping Yelp data:", error.message);
      res.status(500).json({ 
        error: "Failed to scrape Yelp data",
        message: error.message,
        note: "This is a demo implementation. In production, we would implement proper web scraping."
      });
    }
  });
  
  // Endpoint to get details for a specific restaurant
  app.post("/api/scrape/restaurant-details", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
      }
      
      console.log(`Scraping restaurant details from: ${url}`);
      
      // In production, we would actually scrape the restaurant details page
      // For demo purposes, we're returning example data
      const restaurant = {
        name: "Simba Restaurant",
        address: "123 Lion St, New York, NY",
        description: "Authentic East African cuisine with a fusion twist",
        rating: "4.6",
        phoneNumber: "(212) 555-7890",
        website: "https://www.simbarestaurant.com",
        imageUrl: "/src/assets/images/ethiopian_cuisine.png",
        cuisineType: "East African",
        country: "Kenya",
        hours: {
          Monday: "11:00 AM - 9:00 PM",
          Tuesday: "11:00 AM - 9:00 PM",
          Wednesday: "11:00 AM - 9:00 PM",
          Thursday: "11:00 AM - 10:00 PM",
          Friday: "11:00 AM - 11:00 PM",
          Saturday: "12:00 PM - 11:00 PM",
          Sunday: "12:00 PM - 8:00 PM"
        },
        popularDishes: [
          "Nyama Choma (Grilled Meat)",
          "Ugali with Sukuma Wiki",
          "Kenyan Pilau"
        ],
        reviewCount: "187",
        priceRange: "$$"
      };
      
      // Return the sample data
      res.json({ restaurant });
    } catch (error: any) {
      console.error("Error scraping restaurant details:", error.message);
      res.status(500).json({ 
        error: "Failed to scrape restaurant details",
        message: error.message
      });
    }
  });
  
  // Endpoint to scrape Google for African cuisine information
  app.get("/api/scrape/african-cuisine", async (req: Request, res: Response) => {
    try {
      const url = String(req.query.url || "https://www.google.com/search?q=african+cuisine");
      
      const cuisineData = await scrapeGoogleForAfricanCuisine(url);
      
      res.json({ cuisineData });
    } catch (error: any) {
      console.error("Error scraping Google for African cuisine:", error.message);
      res.status(500).json({ 
        error: "Failed to scrape Google for African cuisine",
        message: error.message
      });
    }
  });

  return httpServer;
}
