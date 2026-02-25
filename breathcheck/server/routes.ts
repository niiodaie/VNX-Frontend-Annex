import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { evaluateBreathSample } from "./utils/breathalyzer";
import { 
  breathSampleSchema,
  insertUserSchema,
  insertBreathTestSchema,
  type BreathResult
} from "../shared/schema";
import { z, ZodError } from "zod";

// Import parent notification routes
import notifyParentRoute from "./routes/notifyParent";

function formatZodError(error: ZodError) {
  const formatted = error.format();
  const result: Record<string, string> = {};
  
  // Iterate through the formatted object to extract error messages
  Object.entries(formatted).forEach(([key, value]) => {
    if (key !== '_errors' && typeof value === 'object' && value !== null) {
      // Access _errors array safely using type assertion
      const errors = (value as { _errors?: string[] })._errors;
      if (Array.isArray(errors) && errors.length > 0) {
        result[key] = errors.join(', ');
      }
    }
  });
  
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Promotions API route
  app.get('/api/promotions', async (req: Request, res: Response) => {
    try {
      // In a real app, these would come from a database or external ad network
      const promotions = [
        { id: 1, title: '25% Off Ride with Uber', url: 'https://uber.com/referral/breathecheck' },
        { id: 2, title: 'Top Rated Breathalyzer on Amazon', url: 'https://amzn.to/example-link' },
        { id: 3, title: 'Legal Help for DUI Defense', url: 'https://legalpartners.com/dui-support' }
      ];
      
      res.json(promotions);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      res.status(500).json({ error: 'Failed to fetch promotions' });
    }
  });
  // User routes
  const userRoutes = express.Router();
  
  /**
   * Register a new user
   */
  userRoutes.post("/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid registration data", 
          details: validation.error.format() 
        });
      }
      
      const { username, email, password, displayName, subscriptionTier } = validation.data;
      
      // Check if user already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ error: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }
      
      // Create the user
      const user = await storage.createUser({
        username,
        email,
        password, // In a real app, this would be hashed
        displayName,
        subscriptionTier: subscriptionTier || "free"
      });
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.error("User registration error:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  /**
   * Login user
   */
  userRoutes.post("/login", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        username: z.string(),
        password: z.string()
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid login data", 
          details: validation.error.format() 
        });
      }
      
      const { username, password } = validation.data;
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (err) {
      console.error("User login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  /**
   * Get user profile
   */
  userRoutes.get("/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  });
  
  /**
   * Get breath test history for a user
   */
  userRoutes.get("/:userId/breath-tests", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const tests = await storage.getBreathTestsByUser(userId);
      res.json(tests);
    } catch (err) {
      console.error("Get breath tests error:", err);
      res.status(500).json({ error: "Failed to retrieve breath test history" });
    }
  });
  
  // Breath test routes
  const breathRoutes = express.Router();
  
  /**
   * Process a breath sample
   */
  breathRoutes.post("/scan", async (req: Request, res: Response) => {
    try {
      const validation = breathSampleSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid breath sample data", 
          details: validation.error.format() 
        });
      }
      
      const { userId, audioSample, location } = validation.data;
      
      // Process the audio sample
      const result = await evaluateBreathSample(audioSample);
      
      // Save the test result if user is provided
      if (userId) {
        const user = await storage.getUser(userId);
        
        if (user) {
          await storage.createBreathTest({
            userId,
            bac: parseFloat(result.bac),
            level: result.level,
            message: result.message,
            location: location || null,
            audioSample
          });
        }
      }
      
      res.json(result);
    } catch (err) {
      console.error("Process breath sample error:", err);
      res.status(500).json({ error: "Breath analysis failed" });
    }
  });
  
  /**
   * Get a specific breath test
   */
  breathRoutes.get("/:testId", async (req: Request, res: Response) => {
    try {
      const testId = parseInt(req.params.testId);
      
      if (isNaN(testId)) {
        return res.status(400).json({ error: "Invalid test ID" });
      }
      
      const test = await storage.getBreathTest(testId);
      
      if (!test) {
        return res.status(404).json({ error: "Breath test not found" });
      }
      
      res.json(test);
    } catch (err) {
      console.error("Get breath test error:", err);
      res.status(500).json({ error: "Failed to retrieve breath test" });
    }
  });
  
  // Register all routes
  app.use("/api/users", userRoutes);
  app.use("/api/breath", breathRoutes);
  app.use("/api", notifyParentRoute); // Add the parent notification routes
  
  const httpServer = createServer(app);
  return httpServer;
}