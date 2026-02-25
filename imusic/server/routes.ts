import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { getMentorResponse, analyzeMusic, generateMusicIdea, generateSpeech } from "./openai";
import Stripe from "stripe";

// Import the image generation function - using ES modules
import { generateLandingPageImage } from "./generate-image";

// Stripe setup for payments
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing required environment variable: STRIPE_SECRET_KEY');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" })
  : null;

// Custom function to handle "The Voice"-style blind auditions
async function handleBlindAudition(lyrics: string) {
  try {
    // Get all mentors from storage
    const mentors = await storage.getMentors();
    
    // Analyze the lyrics using OpenAI
    const analysis = await analyzeMusic(lyrics, "lyrics");
    
    // Determine which mentors would "turn their chairs" based on rating
    // Higher-rated lyrics get more mentor interest
    const mentorsTurned = mentors
      .filter(() => {
        // Simple algorithm: 
        // - Ratings 1-3: No mentors turn
        // - Rating 4-6: 1 mentor might turn (25% chance)
        // - Rating 7-8: 1-2 mentors likely turn (50% chance for each)
        // - Rating 9-10: 2-4 mentors turn (75% chance for each)
        
        const rating = analysis.overallRating;
        let turnChance = 0;
        
        if (rating <= 3) turnChance = 0;
        else if (rating <= 6) turnChance = 0.25;
        else if (rating <= 8) turnChance = 0.5;
        else turnChance = 0.75;
        
        return Math.random() < turnChance;
      })
      .map(mentor => mentor.id);
    
    // Generate personalized feedback based on the analysis
    let feedbackText = "";
    
    if (mentorsTurned.length === 0) {
      feedbackText = `Thank you for your audition! While none of our mentors turned this time, we see potential in your work. ${analysis.analysis} Focus on these areas: ${analysis.improvements.join(", ")}. Keep developing your unique voice and style!`;
    } else {
      feedbackText = `Congratulations! You've impressed ${mentorsTurned.length} of our mentors. ${analysis.analysis} Your strengths include: ${analysis.strengths.join(", ")}. To continue improving, consider: ${analysis.improvements.join(", ")}. Choose a mentor to start your journey!`;
    }
    
    // Generate audio for the feedback using a neutral voice
    const audioUrl = await generateSpeech(feedbackText, "Audition Results");
    
    return {
      mentorsTurned,
      feedbackText,
      overallRating: analysis.overallRating,
      audioUrl
    };
  } catch (error) {
    console.error("Error in blind audition:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Image Generation API
  app.post("/api/generate-landing-image", async (req, res) => {
    try {
      const imagePath = await generateLandingPageImage();
      res.json({ 
        success: true, 
        message: "Landing page image generated successfully",
        path: '/assets/landing-page-image.png'
      });
    } catch (error) {
      console.error("Error generating landing page image:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate landing page image" 
      });
    }
  });

  // Mentor API routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const mentor = await storage.getMentor(parseInt(req.params.id));
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      res.json(mentor);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch mentor" });
    }
  });

  // User's current mentor
  app.get("/api/user/mentor", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      // Use a default user ID for the prototype
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : 1;
      
      try {
        const userMentor = await storage.getUserMentor(userId);
        
        if (!userMentor) {
          // Return null instead of 404 error for easier handling on the client
          return res.json(null);
        }
        
        res.json(userMentor);
      } catch (mentorErr) {
        console.error("Error fetching mentor:", mentorErr);
        // Return null instead of error for more graceful handling
        return res.json(null);
      }
    } catch (err) {
      console.error("Server error in /api/user/mentor:", err);
      res.status(500).json({ message: "Failed to fetch user's mentor" });
    }
  });

  // Creative journey routes
  app.get("/api/journey", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const steps = await storage.getJourneySteps();
      res.json(steps);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch journey steps" });
    }
  });
  
  // User's journey steps
  app.get("/api/user/journey", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      // Use a default user ID for the prototype
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : 1;
      const userJourneySteps = await storage.getUserJourneySteps(userId);
      res.json(userJourneySteps);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user journey steps" });
    }
  });

  // Inspiration feed routes
  app.get("/api/inspiration", async (req, res) => {
    try {
      const items = await storage.getInspirationItems();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch inspiration items" });
    }
  });

  // Collaboration routes
  app.get("/api/collaborations", async (req, res) => {
    try {
      const collabs = await storage.getCollaborations();
      res.json(collabs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });

  // Challenge routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Assign a mentor to a user
  app.post("/api/user/mentor", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = req.user as Express.User;
      const { mentorId } = req.body;
      
      if (!mentorId) {
        return res.status(400).json({ message: "Mentor ID is required" });
      }
      
      const mentor = await storage.getMentor(parseInt(mentorId));
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      
      // Check if user already has a mentor
      const existingMentor = await storage.getUserMentor(user.id);
      if (existingMentor) {
        return res.status(400).json({ message: "User already has a mentor assigned" });
      }
      
      const userMentor = await storage.createUserMentor({
        userId: user.id,
        mentorId: mentor.id,
        progress: 0,
        currentMessage: "Your flow is getting tighter. Let's work on making those metaphors more layered. Great writers create worlds within worlds. For your next verse, try connecting your personal story to something bigger."
      });
      
      res.status(201).json({ ...userMentor, ...mentor });
    } catch (err) {
      res.status(500).json({ message: "Failed to assign mentor" });
    }
  });

  // AI Mentor Communication with Voice Feedback
  app.post("/api/mentor/chat", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      // Use a default user ID for the prototype
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : 1;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Get the user's current mentor
      const userMentor = await storage.getUserMentor(userId);
      if (!userMentor) {
        return res.status(404).json({ message: "No mentor assigned" });
      }
      
      // Generate a response from the AI mentor
      const mentorResponse = await getMentorResponse(
        userMentor,
        message
      );
      
      // Update the mentor's current message to the user
      await storage.updateUserMentorMessage(userMentor.id, mentorResponse);
      
      // Generate voice feedback from the mentor
      const audioUrl = await generateSpeech(mentorResponse, userMentor.name);
      
      res.json({ 
        mentorName: userMentor.name,
        message: mentorResponse,
        audioUrl: audioUrl || null
      });
    } catch (err) {
      console.error("Error in mentor chat:", err);
      res.status(500).json({ message: "Failed to get mentor response" });
    }
  });
  
  // Music Analysis
  app.post("/api/music/analyze", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { content, contentType } = req.body;
      
      if (!content || !contentType) {
        return res.status(400).json({ 
          message: "Content and contentType are required" 
        });
      }
      
      if (!["lyrics", "composition", "recording"].includes(contentType)) {
        return res.status(400).json({ 
          message: "contentType must be one of: lyrics, composition, recording" 
        });
      }
      
      const analysis = await analyzeMusic(
        content, 
        "Song Analysis", 
        "Music Mentor"
      );
      
      res.json(analysis);
    } catch (err) {
      console.error("Error analyzing music:", err);
      res.status(500).json({ message: "Failed to analyze music" });
    }
  });
  
  // Music Idea Generation
  app.post("/api/music/generate-idea", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { genre, mood, theme } = req.body;
      
      if (!genre || !theme || !mood) {
        return res.status(400).json({ 
          message: "Genre, mood, and theme are required" 
        });
      }
      
      const idea = await generateMusicIdea(
        genre, 
        mood, 
        theme
      );
      
      res.json(idea);
    } catch (err) {
      console.error("Error generating music idea:", err);
      res.status(500).json({ message: "Failed to generate music idea" });
    }
  });
  
  // AI Voice Generation for Mentor Feedback
  app.post("/api/mentor/voice-feedback", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { text, mentorId } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      if (!mentorId) {
        return res.status(400).json({ message: "Mentor ID is required" });
      }
      
      // Get mentor information
      const mentor = await storage.getMentor(parseInt(mentorId));
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      
      // Generate voice based on mentor persona
      const audioUrl = await generateSpeech(text, mentor.name);
      
      if (!audioUrl) {
        return res.status(500).json({ message: "Failed to generate voice feedback" });
      }
      
      res.json({ 
        text,
        audioUrl,
        mentorName: mentor.name
      });
    } catch (err) {
      console.error("Error generating voice feedback:", err);
      res.status(500).json({ message: "Failed to generate voice feedback" });
    }
  });
  
  // The Voice-inspired blind audition endpoint
  app.post("/api/audition/submit", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { lyrics } = req.body;
      
      if (!lyrics) {
        return res.status(400).json({ message: "Lyrics are required for audition" });
      }
      
      // Process the blind audition and get results
      const auditionResults = await handleBlindAudition(lyrics);
      
      res.json(auditionResults);
    } catch (err) {
      console.error("Error in blind audition:", err);
      res.status(500).json({ message: "Failed to process audition" });
    }
  });
  
  // MuseLab - Generate hook API endpoint
  app.post("/api/generate-hook", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { lyrics } = req.body;
      
      if (!lyrics) {
        return res.status(400).json({ message: "Lyrics are required to generate a hook" });
      }
      
      // Generate music idea based on the lyrics
      const idea = await generateMusicIdea(
        "hip-hop", // Default genre for prototype
        "determined", // Default mood for prototype
        lyrics.substring(0, 100) // Use the first 100 chars as theme
      );
      
      // Return the hook suggestion from the generated idea
      res.json({ 
        hook: idea.lyricalHooks.join(' '),
        concept: idea.concept
      });
    } catch (err) {
      console.error("Error generating hook:", err);
      res.status(500).json({ message: "Failed to generate hook" });
    }
  });
  
  // MuseLab - Send to mentor API endpoint
  app.post("/api/send-to-mentor", async (req, res) => {
    // For prototype, we're removing authentication requirement
    try {
      const { lyrics } = req.body;
      const userId = req.isAuthenticated() ? (req.user as Express.User).id : 1;
      
      if (!lyrics) {
        return res.status(400).json({ message: "Lyrics are required for mentor feedback" });
      }
      
      // Get the user's current mentor or default to first mentor
      const userMentor = await storage.getUserMentor(userId) || await storage.getMentor(1);
      
      if (!userMentor) {
        return res.status(404).json({ message: "No mentor available" });
      }
      
      // Generate a detailed analysis of the lyrics
      const analysis = await analyzeMusic(lyrics, "lyrics");
      
      // Generate mentor feedback using the analysis
      let mentorMessage = `${analysis.analysis}\n\n`;
      
      // Add strengths if available
      if (analysis.strengths && analysis.strengths.length > 0) {
        mentorMessage += `Your strengths:\n`;
        analysis.strengths.forEach(strength => {
          mentorMessage += `- ${strength}\n`;
        });
        mentorMessage += `\n`;
      }
      
      // Add areas for improvement
      if (analysis.improvements && analysis.improvements.length > 0) {
        mentorMessage += `Areas to focus on:\n`;
        analysis.improvements.forEach(improvement => {
          mentorMessage += `- ${improvement}\n`;
        });
      }
      
      // Generate mentor feedback with the analysis
      const mentorResponse = await getMentorResponse(
        userMentor, 
        `Please review these lyrics and provide feedback: ${lyrics}`
      );
      
      res.json({ 
        message: mentorResponse,
        analysis: analysis
      });
    } catch (err) {
      console.error("Error getting mentor feedback:", err);
      res.status(500).json({ message: "Failed to get mentor feedback" });
    }
  });

  // Stripe payment routes
  if (stripe) {
    // Create a Payment Intent for subscription
    app.post("/api/create-subscription", async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }

      try {
        const user = req.user as Express.User;
        
        // If user already has an active subscription
        if (user.subscriptionStatus === "active") {
          return res.status(400).json({ 
            message: "User already has an active subscription" 
          });
        }
        
        // Create or retrieve a Stripe customer
        let customerId = user.stripeCustomerId;
        
        if (!customerId) {
          // Create a new customer in Stripe
          const customer = await stripe.customers.create({
            name: user.name,
            metadata: {
              userId: user.id.toString()
            }
          });
          
          customerId = customer.id;
          
          // Update user with the new Stripe customer ID
          await storage.updateStripeCustomerId(user.id, customerId);
        }
        
        // Create a subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [
            {
              price: 'price_1PDI9KJd8oHEVRZoA0tA2lw5', // Monthly subscription price ID
            },
          ],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        });
        
        // Update user's subscription information
        await storage.updateUserSubscription(
          user.id, 
          subscription.id, 
          subscription.status
        );
        
        // Return the client secret for the subscription
        const invoice = subscription.latest_invoice as any;
        res.json({
          subscriptionId: subscription.id,
          clientSecret: invoice.payment_intent.client_secret,
        });
      } catch (err) {
        console.error("Error creating subscription:", err);
        res.status(500).json({ 
          message: "Failed to create subscription" 
        });
      }
    });
    
    // Handle Stripe webhook events
    app.post("/api/stripe-webhook", async (req, res) => {
      let event;
      
      try {
        // Verify the event came from Stripe
        const signature = req.headers['stripe-signature'];
        
        if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
          return res.status(400).send('Webhook signature verification failed');
        }
        
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      
      // Handle the event
      switch (event.type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.created':
          const subscription = event.data.object;
          
          // Find user by Stripe customer ID
          const users = await storage.getUserByStripeCustomerId(subscription.customer as string);
          
          if (users) {
            // Update user's subscription status
            await storage.updateUserSubscription(
              users.id,
              subscription.id,
              subscription.status
            );
          }
          break;
        
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          
          // If this is for a subscription, update the status
          if (invoice.subscription) {
            const subscriptionDetails = await stripe.subscriptions.retrieve(
              invoice.subscription as string
            );
            
            // Find user by Stripe customer ID
            const user = await storage.getUserByStripeCustomerId(invoice.customer as string);
            
            if (user) {
              // Update user's subscription status
              await storage.updateUserSubscription(
                user.id,
                subscriptionDetails.id,
                subscriptionDetails.status
              );
            }
          }
          break;
        
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}`);
      }
      
      // Return a 200 success response
      res.send();
    });
    
    // Check subscription status
    app.get("/api/subscription", async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      
      try {
        const user = req.user as Express.User;
        
        // If user has no subscription
        if (!user.stripeSubscriptionId) {
          return res.json({ status: "none" });
        }
        
        // Check if this is a test subscription (starts with sub_test_)
        if (user.stripeSubscriptionId.startsWith('sub_test_')) {
          // For test subscriptions, we don't contact Stripe
          // Return test subscription data
          return res.json({
            status: user.subscriptionStatus || 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in the future
            cancelAtPeriodEnd: false,
            isTestSubscription: true
          });
        }
        
        // This is a real subscription, contact Stripe
        try {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          // Update user's subscription status if it has changed
          if (subscription.status !== user.subscriptionStatus) {
            await storage.updateUserSubscription(
              user.id,
              subscription.id,
              subscription.status
            );
          }
          
          // Cast to any to access Stripe properties
          const subData = subscription as any;
          
          res.json({
            status: subscription.status,
            currentPeriodEnd: new Date(subData.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          });
        } catch (stripeErr) {
          // If Stripe call fails, use local status data
          console.error("Stripe error checking subscription:", stripeErr);
          
          // Return the local subscription status
          res.json({
            status: user.subscriptionStatus || 'active',
            retrievalError: true,
            message: "Using local subscription status - could not retrieve details from Stripe"
          });
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        res.status(500).json({ message: "Failed to check subscription status" });
      }
    });
    
    // Cancel subscription
    app.post("/api/cancel-subscription", async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      
      try {
        const user = req.user as Express.User;
        
        // If user has no subscription
        if (!user.stripeSubscriptionId) {
          return res.status(400).json({ message: "No active subscription" });
        }
        
        // Check if this is a test subscription
        if (user.stripeSubscriptionId.startsWith('sub_test_')) {
          // For test subscriptions, we don't contact Stripe
          // Just update the local status to indicate it will be canceled
          await storage.updateUserSubscription(
            user.id,
            user.stripeSubscriptionId,
            "active" // Keep status active but mark as canceling at period end
          );
          
          return res.json({
            status: "active",
            cancelAtPeriodEnd: true,
            isTestSubscription: true,
            message: "Test subscription will be canceled at period end"
          });
        }
        
        // For real subscriptions, contact Stripe
        try {
          // Cancel subscription at period end
          const subscription = await stripe.subscriptions.update(
            user.stripeSubscriptionId,
            { cancel_at_period_end: true }
          );
          
          res.json({
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          });
        } catch (stripeErr) {
          console.error("Stripe error canceling subscription:", stripeErr);
          res.status(500).json({ 
            message: "Failed to cancel subscription with Stripe", 
            stripeError: true 
          });
        }
      } catch (err) {
        console.error("Error canceling subscription:", err);
        res.status(500).json({ message: "Failed to cancel subscription" });
      }
    });
    
    // Test endpoints for subscription testing
    
    // Test upgrading to Pro
    app.post("/api/test-subscription-upgrade", async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      
      try {
        const user = req.user as Express.User;
        
        // Generate a fake subscription ID for testing if none exists
        const testSubscriptionId = user.stripeSubscriptionId || `sub_test_${Date.now()}`;
        
        // Update user to have an active subscription
        await storage.updateUserSubscription(
          user.id,
          testSubscriptionId,
          "active"
        );
        
        res.json({ 
          success: true, 
          message: "User upgraded to Pro for testing",
          subscriptionId: testSubscriptionId,
          status: "active"
        });
      } catch (err) {
        console.error("Error in test subscription upgrade:", err);
        res.status(500).json({ message: "Failed to test subscription upgrade" });
      }
    });
    
    // Test downgrading to Free
    app.post("/api/test-subscription-downgrade", async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      
      try {
        const user = req.user as Express.User;
        
        // Update user to have no active subscription
        await storage.updateUserSubscription(
          user.id,
          "", // Empty string instead of null
          "free"
        );
        
        res.json({ 
          success: true, 
          message: "User downgraded to Free for testing"
        });
      } catch (err) {
        console.error("Error in test subscription downgrade:", err);
        res.status(500).json({ message: "Failed to test subscription downgrade" });
      }
    });
  }
  
  // Artist sync API endpoints
  app.get("/api/artist-syncs", async (req, res) => {
    try {
      // If limit parameter is provided, convert to number
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      // Get all syncs or just the pending ones based on status parameter
      let artistSyncs;
      if (req.query.status === 'pending') {
        artistSyncs = await storage.getPendingSyncs(limit);
      } else {
        // Get all artist syncs (implementation needed in storage)
        // For now, just return pending syncs as a placeholder
        artistSyncs = await storage.getPendingSyncs(limit);
      }
      
      res.json(artistSyncs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/artist-syncs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artistSync = await storage.getArtistSync(id);
      
      if (!artistSync) {
        return res.status(404).json({ error: "Artist sync not found" });
      }
      
      res.json(artistSync);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/artist-syncs", async (req, res) => {
    try {
      const { source, sourceId, syncInterval, priority } = req.body;
      
      // Check if this artist is already being synced
      const existingSync = await storage.getArtistSyncBySourceId(source, sourceId);
      if (existingSync) {
        return res.status(409).json({ 
          error: "This artist is already being synced",
          existingSync
        });
      }
      
      // Create new artist sync
      const newSync = await storage.createArtistSync({
        source,
        sourceId,
        syncInterval,
        priority,
        syncStatus: "pending"
      });
      
      res.status(201).json(newSync);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/artist-syncs/:id/refresh", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artistSync = await storage.getArtistSync(id);
      
      if (!artistSync) {
        return res.status(404).json({ error: "Artist sync not found" });
      }
      
      // Update status to pending to trigger a refresh
      const updatedSync = await storage.updateArtistSyncStatus(id, "pending");
      res.json(updatedSync);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/artist-syncs/:id/link/:mentorId", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mentorId = parseInt(req.params.mentorId);
      
      const artistSync = await storage.getArtistSync(id);
      if (!artistSync) {
        return res.status(404).json({ error: "Artist sync not found" });
      }
      
      const mentor = await storage.getMentor(mentorId);
      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }
      
      const linkedSync = await storage.linkArtistSyncToMentor(id, mentorId);
      res.json(linkedSync);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
