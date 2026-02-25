import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { stripeService } from "./services/stripeService";
import { subscriptionService } from "./services/subscriptionService";
import { insertProjectSchema, insertTaskSchema, insertAIPromptSchema, insertReminderSchema, insertAILogSchema } from "@shared/schema";
import { z } from "zod";
import type { Request, Response } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user for development (in production, implement proper auth)
  const MOCK_USER_ID = 1;
  
  // Initialize with a default user and sample data
  try {
    await storage.createUser({
      username: "demo",
      email: "demo@nexustracker.com",
      password: "demo123"
    });

    // Create sample projects
    const project1 = await storage.createProject({
      name: "Website Redesign",
      description: "Modernizing company website with new design",
      color: "#3B82F6",
      userId: MOCK_USER_ID
    });

    // Create sample AI logs
    await storage.createAILog({
      userId: MOCK_USER_ID,
      projectId: project1.id,
      source: "ChatGPT",
      content: "Implement a responsive navigation menu with mobile-friendly hamburger menu and smooth transitions. Consider accessibility features and ensure proper keyboard navigation support.",
      prompt: "How to create a responsive navigation menu for a modern website?",
      taskCreated: false,
      metadata: { model: "gpt-4o", tokens: 156 }
    });

    await storage.createAILog({
      userId: MOCK_USER_ID,
      projectId: project1.id,
      source: "GitHub Copilot",
      content: "// Function to handle form validation\nconst validateForm = (formData) => {\n  const errors = {};\n  if (!formData.email.includes('@')) {\n    errors.email = 'Invalid email format';\n  }\n  return errors;\n};",
      taskCreated: true,
      metadata: { completionId: "cmpl_xyz123" }
    });

    await storage.createAILog({
      userId: MOCK_USER_ID,
      source: "Claude",
      content: "Create a comprehensive SEO strategy focusing on technical SEO, content optimization, and link building. Include schema markup implementation and Core Web Vitals optimization for better search rankings.",
      prompt: "What are the best practices for SEO in 2024?",
      taskCreated: false,
      metadata: { conversation_id: "conv_abc789" }
    });
  } catch (error) {
    // Data might already exist
  }

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(MOCK_USER_ID);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const project = await storage.updateProject(id, updateData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Tasks
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const tasks = await storage.getTasksByProjectId(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const task = await storage.updateTask(id, updateData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // AI Prompts
  app.post("/api/ai/prompt", async (req, res) => {
    try {
      const { prompt, context, projectId, taskId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const aiResponse = await aiService.processPrompt(prompt, context);
      
      // Save the prompt and response
      const promptData = insertAIPromptSchema.parse({
        prompt,
        response: aiResponse.content,
        context: context || "general",
        projectId: projectId || null,
        taskId: taskId || null,
        userId: MOCK_USER_ID
      });

      const savedPrompt = await storage.createAIPrompt(promptData);
      
      res.json({
        id: savedPrompt.id,
        response: aiResponse.content,
        suggestions: aiResponse.suggestions || [],
        createdAt: savedPrompt.createdAt
      });
    } catch (error) {
      console.error("AI prompt error:", error);
      res.status(500).json({ message: "Failed to process AI prompt" });
    }
  });

  app.get("/api/ai/prompts", async (req, res) => {
    try {
      const { projectId, search } = req.query;
      
      let prompts;
      if (search) {
        prompts = await storage.searchAIPrompts(MOCK_USER_ID, search as string);
      } else if (projectId) {
        prompts = await storage.getAIPromptsByProjectId(parseInt(projectId as string));
      } else {
        prompts = await storage.getAIPromptsByUserId(MOCK_USER_ID);
      }
      
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI prompts" });
    }
  });

  app.post("/api/ai/generate-project-plan", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Project description is required" });
      }

      const aiResponse = await aiService.generateProjectPlan(prompt);
      
      res.json(aiResponse);
    } catch (error) {
      console.error("Project plan generation error:", error);
      res.status(500).json({ message: "Failed to generate project plan" });
    }
  });

  app.post("/api/ai/generate-plan", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Project description is required" });
      }

      const aiResponse = await aiService.generateProjectPlan(description);
      
      res.json(aiResponse);
    } catch (error) {
      console.error("AI plan generation error:", error);
      res.status(500).json({ message: "Failed to generate project plan" });
    }
  });

  app.post("/api/ai/save-plan", async (req, res) => {
    try {
      const { userId, plan, savedAt } = req.body;
      
      if (!userId || !plan) {
        return res.status(400).json({ message: "User ID and plan are required" });
      }

      // For now, we'll just store this as an AI prompt/log
      // In a real implementation, you'd save to a dedicated plans table
      const aiLog = await storage.createAILog({
        userId: parseInt(userId),
        prompt: `Project Plan: ${plan.title}`,
        content: JSON.stringify(plan),
        source: 'project_planner',
        projectId: null // Could link to a specific project if needed
      });
      
      res.json({ 
        success: true, 
        savedId: aiLog.id,
        message: "Project plan saved successfully" 
      });
    } catch (error) {
      console.error("Plan save error:", error);
      res.status(500).json({ message: "Failed to save project plan" });
    }
  });

  app.post("/api/ai/task-suggestions", async (req, res) => {
    try {
      const { projectId } = req.body;
      
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const tasks = await storage.getTasksByProjectId(projectId);
      const existingTasks = tasks.map(task => task.title);

      const suggestions = await aiService.generateTaskSuggestions(
        project.description || project.name,
        existingTasks
      );

      res.json({ suggestions });
    } catch (error) {
      console.error("Task suggestion error:", error);
      res.status(500).json({ message: "Failed to generate task suggestions" });
    }
  });

  // Reminders
  app.get("/api/reminders", async (req, res) => {
    try {
      const { type } = req.query;
      
      let reminders;
      if (type === "today") {
        reminders = await storage.getTodayReminders(MOCK_USER_ID);
      } else if (type === "overdue") {
        reminders = await storage.getOverdueReminders(MOCK_USER_ID);
      } else {
        reminders = await storage.getRemindersByUserId(MOCK_USER_ID);
      }
      
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const reminder = await storage.createReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ message: "Invalid reminder data" });
    }
  });

  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const reminder = await storage.updateReminder(id, updateData);
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  // AI Logs
  app.get("/api/ai-logs", async (req, res) => {
    try {
      const { source, projectId } = req.query;
      let aiLogs = await storage.getAILogsByUserId(MOCK_USER_ID);
      
      if (source && source !== 'all') {
        aiLogs = aiLogs.filter(log => log.source.toLowerCase() === (source as string).toLowerCase());
      }
      
      if (projectId) {
        aiLogs = aiLogs.filter(log => log.projectId === parseInt(projectId as string));
      }
      
      // Enhance with project information
      const enhancedLogs = await Promise.all(
        aiLogs.map(async (log) => {
          if (log.projectId) {
            const project = await storage.getProject(log.projectId);
            return {
              ...log,
              project: project ? { name: project.name, color: project.color } : null
            };
          }
          return log;
        })
      );
      
      res.json(enhancedLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI logs" });
    }
  });

  app.post("/api/ai-logs", async (req, res) => {
    try {
      const aiLogData = insertAILogSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const aiLog = await storage.createAILog(aiLogData);
      res.json(aiLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid AI log data" });
    }
  });

  app.patch("/api/ai-logs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const aiLog = await storage.updateAILog(id, updateData);
      if (aiLog) {
        res.json(aiLog);
      } else {
        res.status(404).json({ message: "AI log not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid AI log data" });
    }
  });

  app.delete("/api/ai-logs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAILog(id);
      if (success) {
        res.json({ message: "AI log deleted successfully" });
      } else {
        res.status(404).json({ message: "AI log not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete AI log" });
    }
  });

  // AI Helper route
  app.post('/api/ai/helper', async (req, res) => {
    try {
      const { prompt, context, userId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'AI service not configured' });
      }

      const { aiService } = await import('./services/aiService');
      
      // Build context for the AI prompt
      let contextualPrompt = prompt;
      if (context) {
        contextualPrompt = `Project Context: ${context.projectName} - ${context.projectDescription}\n\nUser Question: ${prompt}`;
      }

      const response = await aiService.processPrompt(contextualPrompt, context ? JSON.stringify(context) : undefined);
      
      // Store the conversation in AI logs for history
      if (userId) {
        await storage.createAILog({
          userId: parseInt(userId) || 1,
          projectId: context?.projectId || null,
          prompt: prompt,
          content: response.content,
          source: 'ai-helper',
          metadata: context ? JSON.stringify(context) : null
        });
      }

      res.json({ answer: response.content });
    } catch (error) {
      console.error('AI Helper error:', error);
      res.status(500).json({ error: 'Failed to process AI request' });
    }
  });

  // AI History route
  app.get('/api/ai/history', async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const logs = await storage.getAILogsByUserId(userId);
      
      // Format for AI Helper history
      const history = logs
        .filter(log => log.source === 'ai-helper')
        .map(log => ({
          prompt: log.prompt,
          answer: log.content,
          timestamp: log.createdAt
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching AI history:', error);
      res.status(500).json({ error: 'Failed to fetch AI history' });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { userId, email, priceId } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "Missing required fields: userId, email" });
      }

      const session = await stripeService.createCheckoutSession({
        userId,
        email,
        priceId
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook Handler (requires raw body)
  app.post("/api/stripe-webhook", async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const event = await stripeService.constructWebhookEvent(
        req.body, 
        signature as string
      );

      console.log('Webhook event received:', event.type);

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const userId = session.metadata?.userId;
          
          if (userId) {
            // Determine subscription level based on price or metadata
            const subscriptionLevel = session.metadata?.plan || 'pro';
            
            if (subscriptionLevel === 'premium') {
              await subscriptionService.upgradeUserToPremium(
                userId,
                session.customer as string,
                session.subscription as string
              );
            } else {
              await subscriptionService.upgradeUserToPro(
                userId,
                session.customer as string,
                session.subscription as string
              );
            }
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          const customerId = subscription.customer;
          
          // Find user by stripe customer ID and cancel subscription
          // This would require adding a lookup function
          console.log('Subscription cancelled for customer:', customerId);
          break;
        }
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  // Get user subscription status
  app.get("/api/subscription/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const subscription = await subscriptionService.getUserSubscription(userId);
      res.json(subscription);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
