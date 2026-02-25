import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isGuest: boolean("is_guest").default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Restaurant schema
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisineType: text("cuisine_type").notNull(),
  country: text("country").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phoneNumber: text("phone_number"),
  website: text("website"),
  openingHours: text("opening_hours").notNull(),
  priceRange: text("price_range").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

// Menu item schema
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

// Review schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Reservation schema
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  partySize: integer("party_size").notNull(),
  status: text("status").notNull().default("confirmed"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

// Cultural Insight schema
export const culturalInsights = pgTable("cultural_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  cuisineType: text("cuisine_type").notNull(),
  region: text("region").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertCulturalInsightSchema = createInsertSchema(culturalInsights).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type CulturalInsight = typeof culturalInsights.$inferSelect;
export type InsertCulturalInsight = z.infer<typeof insertCulturalInsightSchema>;

// Food origin stories
export const foodOriginStories = pgTable("food_origin_stories", {
  id: serial("id").primaryKey(),
  dishName: text("dish_name").notNull(),
  cuisineType: text("cuisine_type").notNull(),
  country: text("country").notNull(),
  storyContent: text("story_content").notNull(),
  historicalPeriod: text("historical_period"),
  culturalSignificance: text("cultural_significance"),
  ingredients: text("ingredients"),
  imageUrl: text("image_url")
});

export const insertFoodOriginStorySchema = createInsertSchema(foodOriginStories).omit({
  id: true
});

export type FoodOriginStory = typeof foodOriginStories.$inferSelect;
export type InsertFoodOriginStory = z.infer<typeof insertFoodOriginStorySchema>;
