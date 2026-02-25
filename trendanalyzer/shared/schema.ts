import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trends = pgTable("trends", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  searches: integer("searches").notNull(),
  growth: text("growth").notNull(),
  countries: integer("countries").notNull(),
  aiSummary: text("ai_summary").notNull(),
  prediction: text("prediction"),
  region: text("region").notNull().default("global"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const trendSubmissions = pgTable("trend_submissions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'prediction' | 'content_opportunity'
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // 'will_grow' | 'will_stabilize' | 'will_fade'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrendSchema = createInsertSchema(trends).omit({
  id: true,
  createdAt: true,
});

export const insertTrendSubmissionSchema = createInsertSchema(trendSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type Trend = typeof trends.$inferSelect;

export type InsertTrendSubmission = z.infer<typeof insertTrendSubmissionSchema>;
export type TrendSubmission = typeof trendSubmissions.$inferSelect;

export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

// Category types
export const TrendCategory = z.enum(["viral", "news", "sports", "finance", "culture"]);
export type TrendCategoryType = z.infer<typeof TrendCategory>;

// Region types
export const Region = z.enum(["global", "us", "uk", "jp", "de", "fr", "es"]);
export type RegionType = z.infer<typeof Region>;
