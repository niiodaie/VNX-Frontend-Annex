import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { trendService } from "./services/trendService";
import { insertTrendSubmissionSchema, TrendCategory, Region } from "@shared/schema";
import { z } from "zod";


export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced trends endpoint with AI summaries
  app.get("/api/trends/enhanced", async (req, res) => {
    try {
      const { category, region } = req.query;
      
      let trends;
      if (category && category !== 'all') {
        trends = await storage.getTrendsByCategory(category as string);
      } else if (region && region !== 'global') {
        trends = await storage.getTrendsByRegion(region as string);
      } else {
        trends = await storage.getTrends();
      }

      res.json(trends);
    } catch (error) {
      console.error("Failed to fetch enhanced trends:", error);
      res.status(500).json({ error: "Failed to fetch enhanced trends" });
    }
  });

  // Get all trends
  app.get("/api/trends", async (req, res) => {
    try {
      const { category, region } = req.query;
      
      let trends;
      if (category && category !== 'all') {
        trends = await storage.getTrendsByCategory(category as string);
      } else if (region && region !== 'global') {
        trends = await storage.getTrendsByRegion(region as string);
      } else {
        trends = await storage.getTrends();
      }
      
      res.json(trends);
    } catch (error) {
      console.error("Failed to fetch trends:", error);
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // Get AI insights
  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await trendService.generateAIInsights();
      res.json(insights);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  // Analyze specific trend with AI
  app.post("/api/trends/:id/analyze", async (req, res) => {
    try {
      const { id } = req.params;
      const trends = await storage.getTrends();
      const trend = trends.find(t => t.id === parseInt(id));
      
      if (!trend) {
        return res.status(404).json({ error: "Trend not found" });
      }

      const analysis = await trendService.analyzeTrendWithAI(trend.title, trend.category);
      res.json({ analysis });
    } catch (error) {
      console.error("Failed to analyze trend:", error);
      res.status(500).json({ error: "Failed to analyze trend" });
    }
  });

  // Submit new trend idea
  app.post("/api/trends/submit", async (req, res) => {
    try {
      const validatedData = insertTrendSubmissionSchema.parse(req.body);
      
      // Store the submission
      const submission = await storage.createTrendSubmission(validatedData);
      
      // Create actual trend from submission (in background)
      await trendService.createTrendFromSubmission(
        validatedData.topic,
        validatedData.category,
        validatedData.region,
        validatedData.description ?? undefined
      );
      
      res.json({ 
        message: "Trend submitted successfully",
        submissionId: submission.id 
      });
    } catch (error) {
      console.error("Failed to submit trend:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid submission data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit trend" });
    }
  });

  // Get country-specific trends
  app.get("/api/trends/countries", async (req, res) => {
    try {
      const countryData = [
        {
          name: "United States",
          flag: "🇺🇸",
          topTrend: "AI coding assistant",
          searches: "2.1M",
          growth: "+342%",
          code: "us"
        },
        {
          name: "United Kingdom", 
          flag: "🇬🇧",
          topTrend: "Climate summit 2024",
          searches: "1.8M",
          growth: "+189%",
          code: "uk"
        },
        {
          name: "Japan",
          flag: "🇯🇵", 
          topTrend: "New Marvel movie trailer",
          searches: "1.5M",
          growth: "+156%",
          code: "jp"
        },
        {
          name: "Germany",
          flag: "🇩🇪",
          topTrend: "World Cup qualifiers", 
          searches: "1.2M",
          growth: "+278%",
          code: "de"
        }
      ];
      
      res.json(countryData);
    } catch (error) {
      console.error("Failed to fetch country trends:", error);
      res.status(500).json({ error: "Failed to fetch country trends" });
    }
  });

  // Refresh trends (simulates hourly update)
  app.post("/api/trends/refresh", async (req, res) => {
    try {
      await trendService.refreshTrends();
      res.json({ message: "Trends refreshed successfully" });
    } catch (error) {
      console.error("Failed to refresh trends:", error);
      res.status(500).json({ error: "Failed to refresh trends" });
    }
  });

  // Refresh specific trend summary with enhanced AI
  app.post("/api/trends/:id/refresh-summary", async (req, res) => {
    try {
      const { id } = req.params;
      const trends = await storage.getTrends();
      const trend = trends.find(t => t.id === parseInt(id));
      
      if (!trend) {
        return res.status(404).json({ error: "Trend not found" });
      }

      // Import here to avoid circular dependency
      const { summarizeTrend } = await import("./services/openai");
      const freshSummary = await summarizeTrend(trend.title);
      
      const updatedTrend = await storage.updateTrend(trend.id, {
        aiSummary: freshSummary
      });

      res.json({
        success: true,
        trend: updatedTrend,
        message: "AI summary refreshed successfully"
      });
    } catch (error) {
      console.error("Failed to refresh trend summary:", error);
      res.status(500).json({ error: "Failed to refresh trend summary" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Initialize real-time trend service with WebSocket broadcasting
  trendService.initializeRealTime(wss);
  
  return httpServer;
}
