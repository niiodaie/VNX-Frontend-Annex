import {
  users,
  podcasts,
  episodes,
  follows,
  playHistory,
  type User,
  type UpsertUser,
  type Podcast,
  type InsertPodcast,
  type Episode,
  type InsertEpisode,
  type Follow,
  type InsertFollow,
  type InsertPlayHistory,
  type PodcastWithCreator,
  type EpisodeWithPodcast,
  type PodcastWithEpisodes,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Podcast operations
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  getPodcast(id: number): Promise<PodcastWithEpisodes | undefined>;
  getPodcastsByCreator(creatorId: string): Promise<PodcastWithCreator[]>;
  getFeaturedPodcasts(limit?: number): Promise<PodcastWithCreator[]>;
  searchPodcasts(query: string): Promise<PodcastWithCreator[]>;
  getPodcastsByCategory(category: string): Promise<PodcastWithCreator[]>;
  updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined>;

  // Episode operations
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  getEpisode(id: number): Promise<EpisodeWithPodcast | undefined>;
  getEpisodesByPodcast(podcastId: number): Promise<Episode[]>;
  updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined>;
  incrementPlayCount(episodeId: number): Promise<void>;

  // Follow operations
  followPodcast(followData: InsertFollow): Promise<Follow>;
  unfollowPodcast(followerId: string, podcastId: number): Promise<void>;
  getFollowedPodcasts(userId: string): Promise<PodcastWithCreator[]>;
  isFollowing(followerId: string, podcastId: number): Promise<boolean>;

  // Play history operations
  recordPlay(playData: InsertPlayHistory): Promise<void>;
  getPlayHistory(userId: string, limit?: number): Promise<EpisodeWithPodcast[]>;

  // Analytics
  getPodcastAnalytics(podcastId: number): Promise<{
    totalPlays: number;
    totalFollows: number;
    episodeCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Podcast operations
  async createPodcast(podcast: InsertPodcast): Promise<Podcast> {
    const [newPodcast] = await db
      .insert(podcasts)
      .values(podcast)
      .returning();
    return newPodcast;
  }

  async getPodcast(id: number): Promise<PodcastWithEpisodes | undefined> {
    const [podcast] = await db
      .select({
        podcast: podcasts,
        creator: users,
      })
      .from(podcasts)
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .where(eq(podcasts.id, id));

    if (!podcast) return undefined;

    const episodesList = await db
      .select()
      .from(episodes)
      .where(and(eq(episodes.podcastId, id), eq(episodes.isPublished, true)))
      .orderBy(desc(episodes.episodeNumber));

    const [followCount] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.podcastId, id));

    return {
      ...podcast.podcast,
      creator: podcast.creator!,
      episodes: episodesList,
      _count: {
        follows: followCount.count,
      },
    };
  }

  async getPodcastsByCreator(creatorId: string): Promise<PodcastWithCreator[]> {
    const results = await db
      .select({
        podcast: podcasts,
        creator: users,
        episodeCount: count(episodes.id),
        followCount: count(follows.id),
      })
      .from(podcasts)
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .leftJoin(episodes, eq(podcasts.id, episodes.podcastId))
      .leftJoin(follows, eq(podcasts.id, follows.podcastId))
      .where(eq(podcasts.creatorId, creatorId))
      .groupBy(podcasts.id, users.id);

    return results.map(result => ({
      ...result.podcast,
      creator: result.creator!,
      _count: {
        episodes: result.episodeCount,
        follows: result.followCount,
      },
    }));
  }

  async getFeaturedPodcasts(limit = 6): Promise<PodcastWithCreator[]> {
    const results = await db
      .select({
        podcast: podcasts,
        creator: users,
        episodeCount: count(episodes.id),
        followCount: count(follows.id),
      })
      .from(podcasts)
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .leftJoin(episodes, eq(podcasts.id, episodes.podcastId))
      .leftJoin(follows, eq(podcasts.id, follows.podcastId))
      .where(eq(podcasts.isPublished, true))
      .groupBy(podcasts.id, users.id)
      .orderBy(desc(count(follows.id)))
      .limit(limit);

    return results.map(result => ({
      ...result.podcast,
      creator: result.creator!,
      _count: {
        episodes: result.episodeCount,
        follows: result.followCount,
      },
    }));
  }

  async searchPodcasts(query: string): Promise<PodcastWithCreator[]> {
    const results = await db
      .select({
        podcast: podcasts,
        creator: users,
        episodeCount: count(episodes.id),
        followCount: count(follows.id),
      })
      .from(podcasts)
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .leftJoin(episodes, eq(podcasts.id, episodes.podcastId))
      .leftJoin(follows, eq(podcasts.id, follows.podcastId))
      .where(
        and(
          eq(podcasts.isPublished, true),
          or(
            like(podcasts.title, `%${query}%`),
            like(podcasts.description, `%${query}%`)
          )
        )
      )
      .groupBy(podcasts.id, users.id)
      .orderBy(desc(count(follows.id)));

    return results.map(result => ({
      ...result.podcast,
      creator: result.creator!,
      _count: {
        episodes: result.episodeCount,
        follows: result.followCount,
      },
    }));
  }

  async getPodcastsByCategory(category: string): Promise<PodcastWithCreator[]> {
    const results = await db
      .select({
        podcast: podcasts,
        creator: users,
        episodeCount: count(episodes.id),
        followCount: count(follows.id),
      })
      .from(podcasts)
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .leftJoin(episodes, eq(podcasts.id, episodes.podcastId))
      .leftJoin(follows, eq(podcasts.id, follows.podcastId))
      .where(
        and(
          eq(podcasts.isPublished, true),
          eq(podcasts.category, category)
        )
      )
      .groupBy(podcasts.id, users.id)
      .orderBy(desc(count(follows.id)));

    return results.map(result => ({
      ...result.podcast,
      creator: result.creator!,
      _count: {
        episodes: result.episodeCount,
        follows: result.followCount,
      },
    }));
  }

  async updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined> {
    const [updated] = await db
      .update(podcasts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(podcasts.id, id))
      .returning();
    return updated;
  }

  // Episode operations
  async createEpisode(episode: InsertEpisode): Promise<Episode> {
    const [newEpisode] = await db
      .insert(episodes)
      .values(episode)
      .returning();
    return newEpisode;
  }

  async getEpisode(id: number): Promise<EpisodeWithPodcast | undefined> {
    const [result] = await db
      .select({
        episode: episodes,
        podcast: podcasts,
        creator: users,
      })
      .from(episodes)
      .leftJoin(podcasts, eq(episodes.podcastId, podcasts.id))
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .where(eq(episodes.id, id));

    if (!result) return undefined;

    return {
      ...result.episode,
      podcast: {
        ...result.podcast!,
        creator: result.creator!,
      },
    };
  }

  async getEpisodesByPodcast(podcastId: number): Promise<Episode[]> {
    return await db
      .select()
      .from(episodes)
      .where(and(eq(episodes.podcastId, podcastId), eq(episodes.isPublished, true)))
      .orderBy(desc(episodes.episodeNumber));
  }

  async updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined> {
    const [updated] = await db
      .update(episodes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(episodes.id, id))
      .returning();
    return updated;
  }

  async incrementPlayCount(episodeId: number): Promise<void> {
    await db
      .update(episodes)
      .set({ playCount: sql`${episodes.playCount} + 1` })
      .where(eq(episodes.id, episodeId));
  }

  // Follow operations
  async followPodcast(followData: InsertFollow): Promise<Follow> {
    const [follow] = await db
      .insert(follows)
      .values(followData)
      .returning();
    return follow;
  }

  async unfollowPodcast(followerId: string, podcastId: number): Promise<void> {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.podcastId, podcastId)
        )
      );
  }

  async getFollowedPodcasts(userId: string): Promise<PodcastWithCreator[]> {
    const results = await db
      .select({
        podcast: podcasts,
        creator: users,
        episodeCount: count(episodes.id),
        followCount: count(follows.id),
      })
      .from(follows)
      .leftJoin(podcasts, eq(follows.podcastId, podcasts.id))
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .leftJoin(episodes, eq(podcasts.id, episodes.podcastId))
      .where(eq(follows.followerId, userId))
      .groupBy(podcasts.id, users.id)
      .orderBy(desc(follows.createdAt));

    return results.map(result => ({
      ...result.podcast!,
      creator: result.creator!,
      _count: {
        episodes: result.episodeCount,
        follows: result.followCount,
      },
    }));
  }

  async isFollowing(followerId: string, podcastId: number): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.podcastId, podcastId)
        )
      );
    return !!follow;
  }

  // Play history operations
  async recordPlay(playData: InsertPlayHistory): Promise<void> {
    await db
      .insert(playHistory)
      .values(playData)
      .onConflictDoUpdate({
        target: [playHistory.userId, playHistory.episodeId],
        set: {
          progress: playData.progress,
          completed: playData.completed,
          playedAt: new Date(),
        },
      });
  }

  async getPlayHistory(userId: string, limit = 20): Promise<EpisodeWithPodcast[]> {
    const results = await db
      .select({
        episode: episodes,
        podcast: podcasts,
        creator: users,
      })
      .from(playHistory)
      .leftJoin(episodes, eq(playHistory.episodeId, episodes.id))
      .leftJoin(podcasts, eq(episodes.podcastId, podcasts.id))
      .leftJoin(users, eq(podcasts.creatorId, users.id))
      .where(eq(playHistory.userId, userId))
      .orderBy(desc(playHistory.playedAt))
      .limit(limit);

    return results.map(result => ({
      ...result.episode!,
      podcast: {
        ...result.podcast!,
        creator: result.creator!,
      },
    }));
  }

  // Analytics
  async getPodcastAnalytics(podcastId: number): Promise<{
    totalPlays: number;
    totalFollows: number;
    episodeCount: number;
  }> {
    const [totalPlays] = await db
      .select({ total: sql<number>`sum(${episodes.playCount})` })
      .from(episodes)
      .where(eq(episodes.podcastId, podcastId));

    const [totalFollows] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.podcastId, podcastId));

    const [episodeCount] = await db
      .select({ count: count() })
      .from(episodes)
      .where(eq(episodes.podcastId, podcastId));

    return {
      totalPlays: totalPlays.total || 0,
      totalFollows: totalFollows.count,
      episodeCount: episodeCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
