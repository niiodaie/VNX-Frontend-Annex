import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  profileImage: text("profile_image"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("free"),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: text("reset_token_expires_at"),
  createdAt: text("created_at").notNull()
});

export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  inspiredBy: text("inspired_by").notNull(),
  profileImage: text("profile_image").notNull(),
  genre: text("genre").notNull(), // Primary genre
  genres: text("genres").array(), // Array of all genres
  region: text("region"),
  country: text("country"),
  bio: text("bio").notNull(),
  description: text("description").notNull(),
  artistType: text("artist_type"), // Solo, Band, Producer, etc.
  mentorAvailable: boolean("mentor_available").default(true),
  cloneStatus: text("clone_status").default("AI"), // AI, VoiceClone, RealArtist, Unavailable
  personalityProfile: text("personality_profile"), // JSON string of personality traits
  specialties: text("specialties").array(), // Array of skills/specialties
  yearsActive: text("years_active"),
  spotifyId: text("spotify_id"),
  geniusId: text("genius_id"),
  mediaUrl: text("media_url"), // URL to sample music/content
  samplePrompt: text("sample_prompt"), // Example of mentorship style
  lastUpdated: text("last_updated"), // When the record was last refreshed
  autoUpdated: boolean("auto_updated").default(false) // If this record is managed by auto-update system
});

export const userMentors = pgTable("user_mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mentorId: integer("mentor_id").notNull(),
  progress: integer("progress").notNull().default(0),
  currentMessage: text("current_message"),
  createdAt: text("created_at").notNull()
});

export const journeySteps = pgTable("journey_steps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("locked"), // completed, in-progress, locked
  order: integer("order").notNull(),
  icon: text("icon").notNull()
});

export const userJourneySteps = pgTable("user_journey_steps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stepId: integer("step_id").notNull(),
  status: text("status").notNull().default("locked"), // completed, in-progress, locked
  progress: integer("progress").notNull().default(0),
  updatedAt: text("updated_at").notNull()
});

export const inspirationItems = pgTable("inspiration_items", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull(),
  type: text("type").notNull(), // text, audio, prompt
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  createdAt: text("created_at").notNull()
});

export const collaborations = pgTable("collaborations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdBy: integer("created_by").notNull(),
  lookingFor: text("looking_for").notNull(),
  genre: text("genre").notNull(),
  tags: text("tags").notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull()
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  entries: integer("entries").notNull().default(0),
  daysLeft: integer("days_left").notNull(),
  prize: text("prize").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  audioUrl: text("audio_url"),
  createdAt: text("created_at").notNull()
});

// Table for artist data synchronization
export const artistSync = pgTable("artist_sync", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(), // spotify, genius, lastfm, etc.
  sourceId: text("source_id").notNull(), // ID from the external source
  mentorId: integer("mentor_id"), // Reference to mentor if already created
  lastSynced: text("last_synced").notNull(), // Timestamp of last sync
  syncStatus: text("sync_status").notNull(), // success, pending, failed
  rawData: text("raw_data"), // JSON string of raw API response
  syncError: text("sync_error"), // Error message if sync failed
  syncInterval: text("sync_interval").default("daily"), // How often to sync
  priority: integer("priority").default(5), // 1-10 scale for sync priority
  createdAt: text("created_at").notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  profileImage: true
});

export const insertMentorSchema = createInsertSchema(mentors);
export const insertUserMentorSchema = createInsertSchema(userMentors).pick({
  userId: true,
  mentorId: true,
  progress: true,
  currentMessage: true
});
export const insertJourneyStepSchema = createInsertSchema(journeySteps);
export const insertUserJourneyStepSchema = createInsertSchema(userJourneySteps).pick({
  userId: true,
  stepId: true,
  status: true,
  progress: true
});
export const insertInspirationItemSchema = createInsertSchema(inspirationItems).pick({
  mentorId: true,
  type: true,
  title: true,
  content: true,
  imageUrl: true,
  audioUrl: true
});
export const insertCollaborationSchema = createInsertSchema(collaborations).pick({
  title: true,
  description: true,
  createdBy: true,
  lookingFor: true,
  genre: true,
  tags: true,
  imageUrl: true
});
export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  entries: true,
  daysLeft: true,
  prize: true,
  isFeatured: true,
  audioUrl: true
});

export const insertArtistSyncSchema = createInsertSchema(artistSync).pick({
  source: true,
  sourceId: true,
  mentorId: true,
  syncStatus: true,
  rawData: true,
  syncError: true,
  syncInterval: true,
  priority: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;

export type InsertUserMentor = z.infer<typeof insertUserMentorSchema>;
export type UserMentor = typeof userMentors.$inferSelect;

export type InsertJourneyStep = z.infer<typeof insertJourneyStepSchema>;
export type JourneyStep = typeof journeySteps.$inferSelect;

export type InsertUserJourneyStep = z.infer<typeof insertUserJourneyStepSchema>;
export type UserJourneyStep = typeof userJourneySteps.$inferSelect;

export type InsertInspirationItem = z.infer<typeof insertInspirationItemSchema>;
export type InspirationItem = typeof inspirationItems.$inferSelect;

export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
export type Collaboration = typeof collaborations.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertArtistSync = z.infer<typeof insertArtistSyncSchema>;
export type ArtistSync = typeof artistSync.$inferSelect;
