import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Podcasts table
export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: varchar("cover_image_url"),
  category: varchar("category", { length: 100 }),
  creatorId: varchar("creator_id").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Episodes table
export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: varchar("audio_url").notNull(),
  duration: integer("duration"), // in seconds
  episodeNumber: integer("episode_number"),
  coverImageUrl: varchar("cover_image_url"),
  podcastId: integer("podcast_id").notNull(),
  playCount: integer("play_count").default(0),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").notNull(),
  podcastId: integer("podcast_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Play history table
export const playHistory = pgTable("play_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  episodeId: integer("episode_id").notNull(),
  progress: integer("progress").default(0), // in seconds
  completed: boolean("completed").default(false),
  playedAt: timestamp("played_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  podcasts: many(podcasts),
  follows: many(follows),
  playHistory: many(playHistory),
}));

export const podcastsRelations = relations(podcasts, ({ one, many }) => ({
  creator: one(users, {
    fields: [podcasts.creatorId],
    references: [users.id],
  }),
  episodes: many(episodes),
  follows: many(follows),
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  podcast: one(podcasts, {
    fields: [episodes.podcastId],
    references: [podcasts.id],
  }),
  playHistory: many(playHistory),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  podcast: one(podcasts, {
    fields: [follows.podcastId],
    references: [podcasts.id],
  }),
}));

export const playHistoryRelations = relations(playHistory, ({ one }) => ({
  user: one(users, {
    fields: [playHistory.userId],
    references: [users.id],
  }),
  episode: one(episodes, {
    fields: [playHistory.episodeId],
    references: [episodes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPodcastSchema = createInsertSchema(podcasts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
  playCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export const insertPlayHistorySchema = createInsertSchema(playHistory).omit({
  id: true,
  playedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type Podcast = typeof podcasts.$inferSelect;

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

export type InsertPlayHistory = z.infer<typeof insertPlayHistorySchema>;
export type PlayHistory = typeof playHistory.$inferSelect;

// Additional types for API responses
export type PodcastWithCreator = Podcast & {
  creator: User;
  _count: {
    episodes: number;
    follows: number;
  };
};

export type EpisodeWithPodcast = Episode & {
  podcast: Podcast & { creator: User };
};

export type PodcastWithEpisodes = Podcast & {
  creator: User;
  episodes: Episode[];
  _count: {
    follows: number;
  };
  isFollowed?: boolean;
};
