import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPodcastSchema, insertEpisodeSchema, insertFollowSchema, insertPlayHistorySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio' && file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else if (file.fieldname === 'cover' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for audio files
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public podcast routes
  app.get('/api/podcasts/featured', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const podcasts = await storage.getFeaturedPodcasts(limit);
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching featured podcasts:", error);
      res.status(500).json({ message: "Failed to fetch featured podcasts" });
    }
  });

  app.get('/api/podcasts/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const podcasts = await storage.searchPodcasts(query);
      res.json(podcasts);
    } catch (error) {
      console.error("Error searching podcasts:", error);
      res.status(500).json({ message: "Failed to search podcasts" });
    }
  });

  app.get('/api/podcasts/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const podcasts = await storage.getPodcastsByCategory(category);
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching podcasts by category:", error);
      res.status(500).json({ message: "Failed to fetch podcasts by category" });
    }
  });

  app.get('/api/podcasts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      res.json(podcast);
    } catch (error) {
      console.error("Error fetching podcast:", error);
      res.status(500).json({ message: "Failed to fetch podcast" });
    }
  });

  app.get('/api/episodes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const episode = await storage.getEpisode(id);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      console.error("Error fetching episode:", error);
      res.status(500).json({ message: "Failed to fetch episode" });
    }
  });

  // Protected podcast routes
  app.post('/api/podcasts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const podcastData = insertPodcastSchema.parse({
        ...req.body,
        creatorId: userId,
      });
      
      const podcast = await storage.createPodcast(podcastData);
      res.status(201).json(podcast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating podcast:", error);
      res.status(500).json({ message: "Failed to create podcast" });
    }
  });

  app.get('/api/podcasts/creator/:creatorId', isAuthenticated, async (req: any, res) => {
    try {
      const creatorId = req.params.creatorId;
      const userId = req.user.claims.sub;
      
      // Only allow users to fetch their own podcasts
      if (creatorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const podcasts = await storage.getPodcastsByCreator(creatorId);
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching creator podcasts:", error);
      res.status(500).json({ message: "Failed to fetch creator podcasts" });
    }
  });

  app.put('/api/podcasts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the podcast
      const podcast = await storage.getPodcast(id);
      if (!podcast || podcast.creatorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updates = insertPodcastSchema.partial().parse(req.body);
      const updatedPodcast = await storage.updatePodcast(id, updates);
      res.json(updatedPodcast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating podcast:", error);
      res.status(500).json({ message: "Failed to update podcast" });
    }
  });

  // Episode routes
  app.post('/api/episodes', isAuthenticated, upload.single('audio'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const podcastId = parseInt(req.body.podcastId);
      
      // Check if user owns the podcast
      const podcast = await storage.getPodcast(podcastId);
      if (!podcast || podcast.creatorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "Audio file is required" });
      }
      
      const episodeData = insertEpisodeSchema.parse({
        ...req.body,
        podcastId,
        audioUrl: `/uploads/${req.file.filename}`,
      });
      
      const episode = await storage.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating episode:", error);
      res.status(500).json({ message: "Failed to create episode" });
    }
  });

  app.put('/api/episodes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the episode
      const episode = await storage.getEpisode(id);
      if (!episode || episode.podcast.creatorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updates = insertEpisodeSchema.partial().parse(req.body);
      const updatedEpisode = await storage.updateEpisode(id, updates);
      res.json(updatedEpisode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating episode:", error);
      res.status(500).json({ message: "Failed to update episode" });
    }
  });

  app.post('/api/episodes/:id/play', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementPlayCount(id);
      res.json({ message: "Play count incremented" });
    } catch (error) {
      console.error("Error incrementing play count:", error);
      res.status(500).json({ message: "Failed to increment play count" });
    }
  });

  // Follow routes
  app.post('/api/follows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const followData = insertFollowSchema.parse({
        ...req.body,
        followerId: userId,
      });
      
      const follow = await storage.followPodcast(followData);
      res.status(201).json(follow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error following podcast:", error);
      res.status(500).json({ message: "Failed to follow podcast" });
    }
  });

  app.delete('/api/follows/:podcastId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const podcastId = parseInt(req.params.podcastId);
      
      await storage.unfollowPodcast(userId, podcastId);
      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing podcast:", error);
      res.status(500).json({ message: "Failed to unfollow podcast" });
    }
  });

  app.get('/api/follows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const followedPodcasts = await storage.getFollowedPodcasts(userId);
      res.json(followedPodcasts);
    } catch (error) {
      console.error("Error fetching followed podcasts:", error);
      res.status(500).json({ message: "Failed to fetch followed podcasts" });
    }
  });

  app.get('/api/follows/:podcastId/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const podcastId = parseInt(req.params.podcastId);
      
      const isFollowing = await storage.isFollowing(userId, podcastId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  // Play history routes
  app.post('/api/play-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playData = insertPlayHistorySchema.parse({
        ...req.body,
        userId,
      });
      
      await storage.recordPlay(playData);
      res.json({ message: "Play recorded" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error recording play:", error);
      res.status(500).json({ message: "Failed to record play" });
    }
  });

  app.get('/api/play-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const playHistory = await storage.getPlayHistory(userId, limit);
      res.json(playHistory);
    } catch (error) {
      console.error("Error fetching play history:", error);
      res.status(500).json({ message: "Failed to fetch play history" });
    }
  });

  // Analytics routes
  app.get('/api/podcasts/:id/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the podcast
      const podcast = await storage.getPodcast(id);
      if (!podcast || podcast.creatorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const analytics = await storage.getPodcastAnalytics(id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // RSS feed route
  app.get('/api/podcasts/:id/rss', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const podcast = await storage.getPodcast(id);
      
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      
      // Basic RSS feed generation
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${podcast.title}</title>
    <description>${podcast.description || ''}</description>
    <link>${baseUrl}/podcast/${id}</link>
    <language>en-us</language>
    <itunes:author>${podcast.creator.firstName} ${podcast.creator.lastName}</itunes:author>
    <itunes:image href="${baseUrl}${podcast.coverImageUrl || ''}" />
    <itunes:category text="${podcast.category || 'General'}" />
    ${podcast.episodes.map(episode => `
    <item>
      <title>${episode.title}</title>
      <description>${episode.description || ''}</description>
      <enclosure url="${baseUrl}${episode.audioUrl}" type="audio/mpeg" />
      <pubDate>${episode.publishedAt?.toUTCString() || episode.createdAt?.toUTCString()}</pubDate>
      <itunes:duration>${episode.duration || 0}</itunes:duration>
    </item>`).join('')}
  </channel>
</rss>`;
      
      res.set('Content-Type', 'application/rss+xml');
      res.send(rss);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
