import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        search,
        limit = "20",
        offset = "0"
      } = req.query;

      const filters: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      if (category && category !== 'all') {
        filters.category = category as string;
      }

      if (brand) {
        filters.brand = Array.isArray(brand) ? brand : [brand];
      }

      if (minPrice || maxPrice) {
        filters.priceRange = {
          min: minPrice ? parseFloat(minPrice as string) : 0,
          max: maxPrice ? parseFloat(maxPrice as string) : 10000,
        };
      }

      if (rating) {
        filters.rating = parseFloat(rating as string);
      }

      if (search) {
        filters.search = search as string;
      }

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create new product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Visual search endpoint (placeholder for image processing)
  app.post("/api/search/visual", async (req, res) => {
    try {
      // In a real implementation, this would process the uploaded image
      // and return similar products based on visual similarity
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "No image data provided" });
      }

      // For now, return featured products as search results
      const products = await storage.getProducts({ limit: 12 });
      const featuredProducts = products.filter(p => p.featured);
      
      res.json({
        message: "Visual search completed",
        results: featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6)
      });
    } catch (error) {
      res.status(500).json({ message: "Visual search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
