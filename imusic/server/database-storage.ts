import { users, mentors, userMentors, journeySteps, userJourneySteps, inspirationItems, collaborations, challenges, artistSync } from "@shared/schema";
import type { User, InsertUser, Mentor, UserMentor, InsertUserMentor, JourneyStep, UserJourneyStep, InspirationItem, Collaboration, Challenge, ArtistSync, InsertArtistSync } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Use 'any' to avoid type issues with session store

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  // Username is used in place of email in our application
  async getUserByEmail(email: string): Promise<User | undefined> {
    // Since there's no email field, we retrieve by username instead
    const [user] = await db.select().from(users).where(eq(users.username, email));
    return user;
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user;
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const timestamp = new Date().toISOString();
    // Ensure profileImage is explicitly null if undefined
    const userValues = {
      ...insertUser,
      profileImage: insertUser.profileImage || null,
      subscriptionStatus: "free",
      createdAt: timestamp
    };
    
    const [user] = await db.insert(users).values(userValues).returning();
    return user;
  }
  
  // Stripe subscription methods
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }
  
  async updateUserSubscription(userId: number, subscriptionId: string, status: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: status 
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }
  
  async updateUserResetToken(userId: number, token: string | null, expiresAt: string | null): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        resetToken: token,
        resetTokenExpiresAt: expiresAt
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }
  
  async updateUserPassword(userId: number, password: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }

  // Mentor operations
  async getMentor(id: number): Promise<Mentor | undefined> {
    try {
      // Use sql tagged template for parameterized queries
      const mentorResults = await db.execute(sql`
        SELECT id, name FROM mentors WHERE id = ${id}
      `);
      
      if (!mentorResults.rows || !mentorResults.rows.length) {
        return undefined;
      }
      
      // Create a fallback mentor object
      const row = mentorResults.rows[0];
      return {
        id: row.id,
        name: row.name,
        inspiredBy: "Artist",
        profileImage: "/assets/default-mentor.png",
        genre: "Various",
        genres: ["Various"],
        region: null,
        country: null,
        bio: "Music mentor",
        description: "Provides feedback on your music",
        artistType: null,
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: null,
        specialties: null,
        yearsActive: null,
        spotifyId: null,
        geniusId: null,
        mediaUrl: null,
        samplePrompt: null,
        lastUpdated: null,
        autoUpdated: null
      } as Mentor;
    } catch (error) {
      console.error("Error in getMentor:", error);
      return undefined;
    }
  }

  async getMentors(): Promise<Mentor[]> {
    try {
      // Use sql tagged template for SQL queries
      const mentorResults = await db.execute(sql`
        SELECT id, name FROM mentors
      `);
      
      if (!mentorResults.rows || !mentorResults.rows.length) {
        return [];
      }
      
      // Map the results to full mentor objects with default values
      return mentorResults.rows.map(row => {
        // Create a fallback mentor object with default values
        return {
          id: row.id,
          name: row.name,
          inspiredBy: "Artist",
          profileImage: "/assets/default-mentor.png",
          genre: "Various",
          genres: ["Various"],
          region: null,
          country: null,
          bio: "Music mentor",
          description: "Provides feedback on your music",
          artistType: null,
          mentorAvailable: true,
          cloneStatus: "AI",
          personalityProfile: null,
          specialties: null,
          yearsActive: null,
          spotifyId: null,
          geniusId: null,
          mediaUrl: null,
          samplePrompt: null,
          lastUpdated: null,
          autoUpdated: null
        } as Mentor;
      });
    } catch (error) {
      console.error("Error in getMentors:", error);
      return [];
    }
  }

  // UserMentor operations
  async getUserMentor(userId: number): Promise<(UserMentor & Mentor) | undefined> {
    try {
      // Get the user mentor record
      const userMentorResults = await db
        .select()
        .from(userMentors)
        .where(eq(userMentors.userId, userId));

      if (!userMentorResults.length) return undefined;
      
      const userMentor = userMentorResults[0];
      
      // Create a hard-coded mentor object with the user's mentor ID
      // This is a fallback since we're having DB schema issues
      const mentor = {
        id: userMentor.mentorId,
        name: "Mentor", // Use a default name
        inspiredBy: "Artist",
        profileImage: "/assets/default-mentor.png",
        genre: "Various",
        genres: ["Various"],
        region: null,
        country: null,
        bio: "Music mentor",
        description: "Provides feedback on your music",
        artistType: null,
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: null,
        specialties: null,
        yearsActive: null,
        spotifyId: null,
        geniusId: null,
        mediaUrl: null,
        samplePrompt: null,
        lastUpdated: null,
        autoUpdated: null
      } as Mentor; // Type assertion
      
      return { ...userMentor, ...mentor };
    } catch (error) {
      console.error("Error in getUserMentor:", error);
      // Return null instead of throwing to avoid breaking the API
      return undefined;
    }
  }

  async createUserMentor(insertUserMentor: InsertUserMentor): Promise<UserMentor> {
    const timestamp = new Date().toISOString();
    // Ensure required fields have default values if not provided
    const userMentorValues = {
      ...insertUserMentor,
      progress: insertUserMentor.progress ?? 0, // Set default value if undefined
      currentMessage: insertUserMentor.currentMessage ?? null, // Set to null if undefined
      createdAt: timestamp
    };
    
    const [userMentor] = await db
      .insert(userMentors)
      .values(userMentorValues)
      .returning();
    
    return userMentor;
  }

  async updateUserMentorMessage(id: number, message: string): Promise<UserMentor> {
    const [updatedUserMentor] = await db
      .update(userMentors)
      .set({ currentMessage: message })
      .where(eq(userMentors.id, id))
      .returning();
    
    if (!updatedUserMentor) {
      throw new Error('UserMentor not found');
    }
    
    return updatedUserMentor;
  }

  // Journey operations
  async getJourneySteps(): Promise<JourneyStep[]> {
    return await db.select().from(journeySteps).orderBy(journeySteps.order);
  }

  async getUserJourneySteps(userId: number): Promise<(UserJourneyStep & JourneyStep)[]> {
    const userSteps = await db
      .select()
      .from(userJourneySteps)
      .where(eq(userJourneySteps.userId, userId));

    const results: (UserJourneyStep & JourneyStep)[] = [];
    
    for (const userStep of userSteps) {
      const [step] = await db
        .select()
        .from(journeySteps)
        .where(eq(journeySteps.id, userStep.stepId));
      
      if (step) {
        results.push({ ...userStep, ...step });
      }
    }
    
    return results.sort((a, b) => a.order - b.order);
  }

  // Inspiration operations
  async getInspirationItems(): Promise<InspirationItem[]> {
    return await db.select().from(inspirationItems);
  }

  // Collaboration operations
  async getCollaborations(): Promise<Collaboration[]> {
    return await db.select().from(collaborations);
  }

  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges);
  }
  
  // Artist Sync operations
  async getArtistSync(id: number): Promise<ArtistSync | undefined> {
    const [sync] = await db.select().from(artistSync).where(eq(artistSync.id, id));
    return sync;
  }
  
  async getArtistSyncBySourceId(source: string, sourceId: string): Promise<ArtistSync | undefined> {
    const [sync] = await db
      .select()
      .from(artistSync)
      .where(and(
        eq(artistSync.source, source),
        eq(artistSync.sourceId, sourceId)
      ));
    
    return sync;
  }
  
  async getArtistSyncsByMentorId(mentorId: number): Promise<ArtistSync[]> {
    return await db
      .select()
      .from(artistSync)
      .where(eq(artistSync.mentorId, mentorId));
  }
  
  async getPendingSyncs(limit?: number): Promise<ArtistSync[]> {
    const pendingSyncs = await db
      .select()
      .from(artistSync)
      .where(eq(artistSync.syncStatus, 'pending'))
      .orderBy(artistSync.priority);
    
    return limit ? pendingSyncs.slice(0, limit) : pendingSyncs;
  }
  
  async createArtistSync(insertArtistSync: InsertArtistSync): Promise<ArtistSync> {
    const timestamp = new Date().toISOString();
    const syncValues = {
      ...insertArtistSync,
      lastSynced: timestamp,
      syncStatus: insertArtistSync.syncStatus || 'pending',
      syncInterval: insertArtistSync.syncInterval || 'daily',
      priority: insertArtistSync.priority || 5,
      createdAt: timestamp
    };
    
    const [artistSyncResult] = await db
      .insert(artistSync)
      .values(syncValues)
      .returning();
    
    return artistSyncResult;
  }
  
  async updateArtistSyncStatus(id: number, status: string, error?: string): Promise<ArtistSync> {
    const timestamp = new Date().toISOString();
    const [updatedSync] = await db
      .update(artistSync)
      .set({ 
        syncStatus: status,
        syncError: error || null,
        lastSynced: timestamp
      })
      .where(eq(artistSync.id, id))
      .returning();
    
    if (!updatedSync) {
      throw new Error('Artist sync not found');
    }
    
    return updatedSync;
  }
  
  async updateArtistSyncData(id: number, rawData: string): Promise<ArtistSync> {
    const timestamp = new Date().toISOString();
    const [updatedSync] = await db
      .update(artistSync)
      .set({ 
        rawData,
        lastSynced: timestamp
      })
      .where(eq(artistSync.id, id))
      .returning();
    
    if (!updatedSync) {
      throw new Error('Artist sync not found');
    }
    
    return updatedSync;
  }
  
  async linkArtistSyncToMentor(id: number, mentorId: number): Promise<ArtistSync> {
    // First check if the mentor exists
    const mentor = await this.getMentor(mentorId);
    if (!mentor) {
      throw new Error('Mentor not found');
    }
    
    const [updatedSync] = await db
      .update(artistSync)
      .set({ mentorId })
      .where(eq(artistSync.id, id))
      .returning();
    
    if (!updatedSync) {
      throw new Error('Artist sync not found');
    }
    
    return updatedSync;
  }
}