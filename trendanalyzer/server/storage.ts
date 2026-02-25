import { trends, aiInsights, trendSubmissions, type Trend, type InsertTrend, type AiInsight, type InsertAiInsight, type TrendSubmission, type InsertTrendSubmission } from "@shared/schema";

export interface IStorage {
  // Trends
  getTrends(): Promise<Trend[]>;
  getTrendsByCategory(category: string): Promise<Trend[]>;
  getTrendsByRegion(region: string): Promise<Trend[]>;
  createTrend(trend: InsertTrend): Promise<Trend>;
  updateTrend(id: number, trend: Partial<InsertTrend>): Promise<Trend | undefined>;
  
  // AI Insights
  getAiInsights(): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  
  // Trend Submissions
  getTrendSubmissions(): Promise<TrendSubmission[]>;
  createTrendSubmission(submission: InsertTrendSubmission): Promise<TrendSubmission>;
}

export class MemStorage implements IStorage {
  private trends: Map<number, Trend>;
  private aiInsights: Map<number, AiInsight>;
  private trendSubmissions: Map<number, TrendSubmission>;
  private currentTrendId: number;
  private currentInsightId: number;
  private currentSubmissionId: number;

  constructor() {
    this.trends = new Map();
    this.aiInsights = new Map();
    this.trendSubmissions = new Map();
    this.currentTrendId = 1;
    this.currentInsightId = 1;
    this.currentSubmissionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTrends: Trend[] = [
      {
        id: this.currentTrendId++,
        title: "AI coding assistant",
        category: "viral",
        searches: 1200000,
        growth: "+342%",
        countries: 15,
        aiSummary: "Trending due to major tech companies announcing new AI-powered coding tools. Expected to grow as developers adopt these technologies for faster development cycles.",
        prediction: "will_grow",
        region: "global",
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: this.currentTrendId++,
        title: "Climate summit 2024",
        category: "news",
        searches: 890000,
        growth: "+189%",
        countries: 23,
        aiSummary: "Major announcements from global leaders at the annual climate summit driving widespread public interest and policy discussions across multiple nations.",
        prediction: "will_stabilize",
        region: "global",
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: this.currentTrendId++,
        title: "World Cup qualifiers",
        category: "sports",
        searches: 2100000,
        growth: "+278%",
        countries: 31,
        aiSummary: "Critical qualification matches determining which teams advance to the next World Cup. High-stakes games generating massive global viewership and engagement.",
        prediction: "will_grow",
        region: "global",
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: this.currentTrendId++,
        title: "Bitcoin ETF approval",
        category: "finance",
        searches: 756000,
        growth: "-23%",
        countries: 18,
        aiSummary: "Regulatory developments around cryptocurrency ETFs creating market volatility. Institutional investors closely monitoring approval status and market implications.",
        prediction: "will_fade",
        region: "global",
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: this.currentTrendId++,
        title: "New Marvel movie trailer",
        category: "culture",
        searches: 1800000,
        growth: "+156%",
        countries: 27,
        aiSummary: "Highly anticipated superhero movie trailer release generating massive social media engagement and fan theories across platforms worldwide.",
        prediction: "will_grow",
        region: "global",
        createdAt: new Date(),
        isActive: true,
      },
    ];

    sampleTrends.forEach(trend => this.trends.set(trend.id, trend));

    const sampleInsights: AiInsight[] = [
      {
        id: this.currentInsightId++,
        type: "prediction",
        title: "AI coding tools",
        description: "Will grow",
        status: "will_grow",
        createdAt: new Date(),
      },
      {
        id: this.currentInsightId++,
        type: "prediction",
        title: "Climate summit",
        description: "Will stabilize",
        status: "will_stabilize",
        createdAt: new Date(),
      },
      {
        id: this.currentInsightId++,
        type: "content_opportunity",
        title: "AI Development Tutorials",
        description: "High demand for coding assistant guides",
        status: "will_grow",
        createdAt: new Date(),
      },
      {
        id: this.currentInsightId++,
        type: "content_opportunity",
        title: "Climate Action Plans",
        description: "Sustainability content trending",
        status: "will_grow",
        createdAt: new Date(),
      },
    ];

    sampleInsights.forEach(insight => this.aiInsights.set(insight.id, insight));
  }

  async getTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values()).filter(trend => trend.isActive);
  }

  async getTrendsByCategory(category: string): Promise<Trend[]> {
    return Array.from(this.trends.values()).filter(
      trend => trend.isActive && trend.category === category
    );
  }

  async getTrendsByRegion(region: string): Promise<Trend[]> {
    return Array.from(this.trends.values()).filter(
      trend => trend.isActive && trend.region === region
    );
  }

  async createTrend(insertTrend: InsertTrend): Promise<Trend> {
    const id = this.currentTrendId++;
    const trend: Trend = {
      id,
      title: insertTrend.title,
      category: insertTrend.category,
      searches: insertTrend.searches,
      growth: insertTrend.growth,
      countries: insertTrend.countries,
      aiSummary: insertTrend.aiSummary,
      prediction: insertTrend.prediction ?? null,
      region: insertTrend.region ?? "global",
      createdAt: new Date(),
      isActive: insertTrend.isActive ?? true,
    };
    this.trends.set(id, trend);
    return trend;
  }

  async updateTrend(id: number, updateData: Partial<InsertTrend>): Promise<Trend | undefined> {
    const trend = this.trends.get(id);
    if (!trend) return undefined;

    const updatedTrend = { ...trend, ...updateData };
    this.trends.set(id, updatedTrend);
    return updatedTrend;
  }

  async getAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values());
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentInsightId++;
    const insight: AiInsight = {
      ...insertInsight,
      id,
      createdAt: new Date(),
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async getTrendSubmissions(): Promise<TrendSubmission[]> {
    return Array.from(this.trendSubmissions.values());
  }

  async createTrendSubmission(insertSubmission: InsertTrendSubmission): Promise<TrendSubmission> {
    const id = this.currentSubmissionId++;
    const submission: TrendSubmission = {
      id,
      topic: insertSubmission.topic,
      category: insertSubmission.category,
      region: insertSubmission.region,
      description: insertSubmission.description ?? null,
      createdAt: new Date(),
    };
    this.trendSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
