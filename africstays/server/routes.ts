import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/properties", async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (_req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/unique-stays", async (_req, res) => {
    try {
      const properties = await storage.getUniqueStays();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unique stays" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(Number(req.params.id));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.get("/api/destinations", async (_req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const guests = req.query.guests ? Number(req.query.guests) : undefined;
      const checkIn = req.query.checkIn ? new Date(req.query.checkIn as string) : undefined;
      const checkOut = req.query.checkOut ? new Date(req.query.checkOut as string) : undefined;
      
      const properties = await storage.searchProperties(query, checkIn, checkOut, guests);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validation = insertBookingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid booking data" });
      }
      
      const booking = await storage.createBooking(validation.data);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/users/:id/bookings", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
