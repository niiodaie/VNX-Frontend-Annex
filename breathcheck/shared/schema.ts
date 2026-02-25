import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  subscriptionExpiry: timestamp("subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  subscriptionTier: true,
  subscriptionExpiry: true,
});

// Breath Tests table
export const breathTests = pgTable("breath_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bac: real("bac").notNull(),  // Blood Alcohol Content
  level: text("level").notNull(), // 'safe', 'warning', 'danger'
  message: text("message").notNull(),
  location: text("location"),
  audioSample: text("audio_sample"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBreathTestSchema = createInsertSchema(breathTests).pick({
  userId: true,
  bac: true,
  level: true,
  message: true,
  location: true,
  audioSample: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBreathTest = z.infer<typeof insertBreathTestSchema>;
export type BreathTest = typeof breathTests.$inferSelect;

// Breath sample schema
export const breathSampleSchema = z.object({
  userId: z.number().optional(),
  audioSample: z.string().min(1, "Audio sample is required"),
  location: z.string().optional(),
});

export type BreathSampleInput = z.infer<typeof breathSampleSchema>;

// Breath result schema
export const breathResultSchema = z.object({
  bac: z.string(),
  level: z.enum(["safe", "warning", "danger"]),
  message: z.string(),
});

export type BreathResult = z.infer<typeof breathResultSchema>;

// Subscription plan schema
export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  period: z.enum(["month", "year"]),
  features: z.array(z.string()),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
