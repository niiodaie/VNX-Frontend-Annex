import { users, breathTests } from "@shared/schema";
import { 
  type User, type InsertUser, 
  type BreathTest, type InsertBreathTest,
  type BreathResult
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Breath test methods
  getBreathTest(id: number): Promise<BreathTest | undefined>;
  getBreathTestsByUser(userId: number): Promise<BreathTest[]>;
  createBreathTest(test: InsertBreathTest): Promise<BreathTest>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }
  
  // Breath test methods
  async getBreathTest(id: number): Promise<BreathTest | undefined> {
    const results = await db.select().from(breathTests).where(eq(breathTests.id, id));
    return results[0];
  }
  
  async getBreathTestsByUser(userId: number): Promise<BreathTest[]> {
    return await db
      .select()
      .from(breathTests)
      .where(eq(breathTests.userId, userId))
      .orderBy(breathTests.createdAt);
  }
  
  async createBreathTest(test: InsertBreathTest): Promise<BreathTest> {
    const results = await db.insert(breathTests).values(test).returning();
    return results[0];
  }
}

// Create a demo user on first use
async function initializeDemoUser(storage: DatabaseStorage) {
  const existingUser = await storage.getUserByUsername("demo");
  if (!existingUser) {
    const demoUser: InsertUser = {
      username: "demo",
      password: "password123",
      email: "demo@example.com",
      displayName: "Demo User",
      subscriptionTier: "free",
      subscriptionExpiry: null
    };
    await storage.createUser(demoUser);
    console.log("Created demo user");
  }
}

// Initialize the database storage
export const storage = new DatabaseStorage();

// Create demo user (will run on first server start)
initializeDemoUser(storage).catch(err => {
  console.error("Failed to initialize demo user:", err);
});
