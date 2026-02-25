import { storage } from "../storage";
import { analyzeTrend, generateInsights, summarizeTrend } from "./openai";
import type { InsertTrend } from "@shared/schema";
import type { WebSocketServer, WebSocket } from "ws";

export class TrendService {
  private wss: WebSocketServer | null = null;
  private trendUpdateInterval: NodeJS.Timeout | null = null;
  private metricsUpdateInterval: NodeJS.Timeout | null = null;
  private activityUpdateInterval: NodeJS.Timeout | null = null;

  initializeRealTime(wss: WebSocketServer): void {
    this.wss = wss;
    this.startRealTimeUpdates();
  }

  startRealTimeUpdates(): void {
    // Start initial updates immediately
    this.refreshTrendsAndBroadcast();
    this.broadcastMetricsUpdate();
    this.broadcastActivityUpdate();
    
    // Core trend data updates every 3 minutes (optimal for search trends)
    this.trendUpdateInterval = setInterval(async () => {
      await this.refreshTrendsAndBroadcast();
    }, 180000); // 3 minutes

    // Live metrics update every minute
    this.metricsUpdateInterval = setInterval(async () => {
      await this.broadcastMetricsUpdate();
    }, 60000); // 1 minute

    // Activity feed updates every 45 seconds
    this.activityUpdateInterval = setInterval(async () => {
      await this.broadcastActivityUpdate();
    }, 45000); // 45 seconds
    
    console.log('Multi-tier real-time updates started:');
    console.log('- Trends: 3-minute intervals');
    console.log('- Metrics: 1-minute intervals'); 
    console.log('- Activity: 45-second intervals');
  }

  stopRealTimeUpdates(): void {
    if (this.trendUpdateInterval) {
      clearInterval(this.trendUpdateInterval);
      this.trendUpdateInterval = null;
    }
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }
    if (this.activityUpdateInterval) {
      clearInterval(this.activityUpdateInterval);
      this.activityUpdateInterval = null;
    }
    console.log('All real-time updates stopped');
  }

  async broadcastMetricsUpdate(): Promise<void> {
    try {
      const trends = await storage.getTrends();
      const totalSearches = trends.reduce((sum, trend) => sum + trend.searches, 0);
      const activeUsers = Math.floor(Math.random() * 500) + 1000; // Simulate active users
      const trendingNow = trends.filter(trend => {
        const growth = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
        return growth > 50;
      }).length;

      this.broadcastToClients({
        type: 'metricsUpdate',
        data: {
          totalSearches,
          activeUsers,
          trendingNow,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Failed to broadcast metrics update:", error);
    }
  }

  async broadcastActivityUpdate(): Promise<void> {
    try {
      const activities = [
        'New emerging trend detected in technology sector',
        'Search spike observed for sustainable energy topics',
        'Regional trend shift in entertainment category',
        'Breaking news driving search volume increases',
        'Viral content spreading across social platforms'
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];

      this.broadcastToClients({
        type: 'activityUpdate',
        data: {
          message: randomActivity,
          timestamp: new Date().toISOString(),
          type: 'general_activity'
        }
      });
    } catch (error) {
      console.error("Failed to broadcast activity update:", error);
    }
  }

  broadcastToClients(data: any): void {
    if (!this.wss) return;
    
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }

  async refreshTrendsAndBroadcast(): Promise<void> {
    try {
      const trends = await storage.getTrends();
      const updatedTrends = [];
      
      // Update trends with real-time variations
      for (const trend of trends) {
        const growthVariation = (Math.random() - 0.5) * 10; // ±5% for more realistic updates
        const currentGrowth = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
        const newGrowth = Math.max(-50, Math.min(500, currentGrowth + growthVariation));
        
        const searchVariation = Math.floor((Math.random() - 0.5) * 50000); // Smaller variations
        const newSearches = Math.max(10000, trend.searches + searchVariation);

        const updatedTrend = await storage.updateTrend(trend.id, {
          searches: newSearches,
          growth: `${newGrowth >= 0 ? '+' : ''}${newGrowth.toFixed(0)}%`,
        });
        
        if (updatedTrend) {
          updatedTrends.push(updatedTrend);
        }
      }

      // Broadcast updates to connected clients
      this.broadcastToClients({
        type: 'trendsUpdate',
        data: updatedTrends,
        timestamp: new Date().toISOString()
      });

      // Check for significant changes and send special notifications
      updatedTrends.forEach(trend => {
        const growthNum = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
        
        // Send surge notifications for high growth trends
        if (growthNum > 150) {
          this.broadcastToClients({
            type: 'trendSurge',
            trend: trend,
            message: `${trend.title} is experiencing a surge with ${trend.growth} growth!`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Send activity feed updates
        if (Math.random() < 0.3) { // 30% chance to generate activity
          this.broadcastToClients({
            type: 'activityUpdate',
            activity: {
              type: 'search_spike',
              message: `${trend.title} searches increased by ${Math.abs(growthNum)}%`,
              category: trend.category,
              region: trend.region
            },
            timestamp: new Date().toISOString()
          });
        }
      });

      console.log(`Trend update: ${updatedTrends.length} trends broadcasted`);
    } catch (error) {
      console.error("Failed to refresh trends in real-time:", error);
    }
  }

  async refreshTrends(): Promise<void> {
    try {
      const trends = await storage.getTrends();
      
      // Simulate trend data updates (in production, this would fetch from Google Trends API)
      for (const trend of trends) {
        // Randomly update search volumes and growth
        const growthVariation = (Math.random() - 0.5) * 20; // ±10%
        const currentGrowth = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
        const newGrowth = Math.max(-50, Math.min(500, currentGrowth + growthVariation));
        
        const searchVariation = Math.floor((Math.random() - 0.5) * 100000);
        const newSearches = Math.max(10000, trend.searches + searchVariation);

        await storage.updateTrend(trend.id, {
          searches: newSearches,
          growth: `${newGrowth >= 0 ? '+' : ''}${newGrowth.toFixed(0)}%`,
        });
      }

      console.log(`Updated ${trends.length} trends`);
    } catch (error) {
      console.error("Failed to refresh trends:", error);
    }
  }

  async analyzeTrendWithAI(trendTitle: string, category: string): Promise<string> {
    try {
      const analysis = await analyzeTrend(trendTitle, category, 1000000);
      return analysis.summary;
    } catch (error) {
      console.error("Failed to analyze trend:", error);
      return "AI analysis unavailable at this time.";
    }
  }

  async createTrendFromSubmission(topic: string, category: string, region: string, description?: string): Promise<void> {
    try {
      // Generate enhanced AI summary using the new summarization function
      const aiSummary = await summarizeTrend(topic);
      
      // Also generate detailed analysis for prediction
      const analysis = await analyzeTrend(topic, category, 50000);
      
      const newTrend: InsertTrend = {
        title: topic,
        category,
        searches: Math.floor(Math.random() * 500000) + 50000,
        growth: `+${Math.floor(Math.random() * 200) + 50}%`,
        countries: Math.floor(Math.random() * 20) + 5,
        aiSummary: aiSummary || analysis.summary, // Use enhanced summary or fallback
        prediction: analysis.prediction,
        region,
      };

      await storage.createTrend(newTrend);
      
      // Broadcast new trend notification
      this.broadcastToClients({
        type: 'newTrend',
        trend: newTrend,
        message: `New trend "${topic}" added to ${category} category`,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Created new trend: ${topic}`);
    } catch (error) {
      console.error("Failed to create trend from submission:", error);
    }
  }

  async generateAIInsights(): Promise<any> {
    try {
      const trends = await storage.getTrends();
      const insights = await generateInsights(trends.slice(0, 5));
      return insights;
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
      return { predictions: [], opportunities: [] };
    }
  }
}

export const trendService = new TrendService();
