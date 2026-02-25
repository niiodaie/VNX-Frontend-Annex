import { users, mentors, userMentors, journeySteps, userJourneySteps, inspirationItems, collaborations, challenges, artistSync } from "@shared/schema";
import type { User, InsertUser, Mentor, UserMentor, InsertUserMentor, JourneyStep, UserJourneyStep, InspirationItem, Collaboration, Challenge, ArtistSync, InsertArtistSync } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserResetToken(userId: number, token: string | null, expiresAt: string | null): Promise<User>;
  updateUserPassword(userId: number, password: string): Promise<User>;
  
  // Stripe subscription operations
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserSubscription(userId: number, subscriptionId: string, status: string): Promise<User>;
  
  // Mentor operations
  getMentor(id: number): Promise<Mentor | undefined>;
  getMentors(): Promise<Mentor[]>;
  
  // UserMentor operations
  getUserMentor(userId: number): Promise<(UserMentor & Mentor) | undefined>;
  createUserMentor(userMentor: InsertUserMentor): Promise<UserMentor>;
  updateUserMentorMessage(id: number, message: string): Promise<UserMentor>;
  
  // Journey operations
  getJourneySteps(): Promise<JourneyStep[]>;
  getUserJourneySteps(userId: number): Promise<(UserJourneyStep & JourneyStep)[]>;
  
  // Inspiration operations
  getInspirationItems(): Promise<InspirationItem[]>;
  
  // Collaboration operations
  getCollaborations(): Promise<Collaboration[]>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  
  // Artist Sync operations
  getArtistSync(id: number): Promise<ArtistSync | undefined>;
  getArtistSyncBySourceId(source: string, sourceId: string): Promise<ArtistSync | undefined>;
  getArtistSyncsByMentorId(mentorId: number): Promise<ArtistSync[]>;
  getPendingSyncs(limit?: number): Promise<ArtistSync[]>;
  createArtistSync(artistSync: InsertArtistSync): Promise<ArtistSync>;
  updateArtistSyncStatus(id: number, status: string, error?: string): Promise<ArtistSync>;
  updateArtistSyncData(id: number, rawData: string): Promise<ArtistSync>;
  linkArtistSyncToMentor(id: number, mentorId: number): Promise<ArtistSync>;
  
  // Session store
  sessionStore: any; // Use 'any' for session store type
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mentors: Map<number, Mentor>;
  private userMentors: Map<number, UserMentor>;
  private journeySteps: Map<number, JourneyStep>;
  private userJourneySteps: Map<number, UserJourneyStep>;
  private inspirationItems: Map<number, InspirationItem>;
  private collaborations: Map<number, Collaboration>;
  private challenges: Map<number, Challenge>;
  private artistSyncs: Map<number, ArtistSync>;
  
  sessionStore: any; // Use 'any' for session store type
  
  private currentUserId: number;
  private currentMentorId: number;
  private currentUserMentorId: number;
  private currentJourneyStepId: number;
  private currentUserJourneyStepId: number;
  private currentInspirationItemId: number;
  private currentCollaborationId: number;
  private currentChallengeId: number;
  private currentArtistSyncId: number;

  constructor() {
    this.users = new Map();
    this.mentors = new Map();
    this.userMentors = new Map();
    this.journeySteps = new Map();
    this.userJourneySteps = new Map();
    this.inspirationItems = new Map();
    this.collaborations = new Map();
    this.challenges = new Map();
    this.artistSyncs = new Map();
    
    this.currentUserId = 1;
    this.currentMentorId = 1;
    this.currentUserMentorId = 1;
    this.currentJourneyStepId = 1;
    this.currentUserJourneyStepId = 1;
    this.currentInspirationItemId = 1;
    this.currentCollaborationId = 1;
    this.currentChallengeId = 1;
    this.currentArtistSyncId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed mentors data
    this.seedMentors();
    
    // Seed journey steps
    this.seedJourneySteps();
    
    // Seed inspiration items
    this.seedInspirationItems();
    
    // Seed collaborations
    this.seedCollaborations();
    
    // Seed challenges
    this.seedChallenges();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  // Since we don't have email in our database, we use username
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === email,
    );
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.resetToken === token,
    );
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.stripeCustomerId === customerId,
    );
  }
  
  async updateUserResetToken(userId: number, token: string | null, expiresAt: string | null): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { 
      ...user, 
      resetToken: token,
      resetTokenExpiresAt: expiresAt
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserPassword(userId: number, password: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { 
      ...user, 
      password: password
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Ensure profileImage is never undefined
    const user: User = { 
      ...insertUser, 
      id,
      profileImage: insertUser.profileImage ?? null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "free",
      resetToken: null,
      resetTokenExpiresAt: null,
      createdAt: new Date().toISOString() 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Stripe subscription methods
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserSubscription(userId: number, subscriptionId: string, status: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    // Convert empty string to null for the database
    const finalSubscriptionId = subscriptionId === "" ? null : subscriptionId;
    
    const updatedUser = { 
      ...user, 
      stripeSubscriptionId: finalSubscriptionId,
      subscriptionStatus: status
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Mentor operations
  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }
  
  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values());
  }
  
  // UserMentor operations
  async getUserMentor(userId: number): Promise<(UserMentor & Mentor) | undefined> {
    const userMentor = Array.from(this.userMentors.values()).find(
      (userMentor) => userMentor.userId === userId
    );
    
    if (!userMentor) return undefined;
    
    const mentor = await this.getMentor(userMentor.mentorId);
    if (!mentor) return undefined;
    
    return { ...userMentor, ...mentor };
  }
  
  async createUserMentor(insertUserMentor: InsertUserMentor): Promise<UserMentor> {
    const id = this.currentUserMentorId++;
    const userMentor: UserMentor = {
      ...insertUserMentor,
      id,
      progress: insertUserMentor.progress ?? 0, // Ensure progress is never undefined
      currentMessage: insertUserMentor.currentMessage ?? null, // Ensure currentMessage is never undefined
      createdAt: new Date().toISOString()
    };
    this.userMentors.set(id, userMentor);
    return userMentor;
  }
  
  async updateUserMentorMessage(id: number, message: string): Promise<UserMentor> {
    const userMentor = this.userMentors.get(id);
    if (!userMentor) throw new Error('UserMentor not found');
    
    const updatedUserMentor = { ...userMentor, currentMessage: message };
    this.userMentors.set(id, updatedUserMentor);
    return updatedUserMentor;
  }
  
  // Journey operations
  async getJourneySteps(): Promise<JourneyStep[]> {
    return Array.from(this.journeySteps.values());
  }
  
  async getUserJourneySteps(userId: number): Promise<(UserJourneyStep & JourneyStep)[]> {
    const userSteps = Array.from(this.userJourneySteps.values()).filter(
      (step) => step.userId === userId
    );
    
    const result: (UserJourneyStep & JourneyStep)[] = [];
    
    for (const userStep of userSteps) {
      const journeyStep = this.journeySteps.get(userStep.stepId);
      if (journeyStep) {
        result.push({ ...userStep, ...journeyStep });
      }
    }
    
    return result.sort((a, b) => a.order - b.order);
  }
  
  // Inspiration operations
  async getInspirationItems(): Promise<InspirationItem[]> {
    return Array.from(this.inspirationItems.values());
  }
  
  // Collaboration operations
  async getCollaborations(): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values());
  }
  
  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }
  
  // Artist Sync operations
  async getArtistSync(id: number): Promise<ArtistSync | undefined> {
    return this.artistSyncs.get(id);
  }
  
  async getArtistSyncBySourceId(source: string, sourceId: string): Promise<ArtistSync | undefined> {
    return Array.from(this.artistSyncs.values()).find(
      (sync) => sync.source === source && sync.sourceId === sourceId
    );
  }
  
  async getArtistSyncsByMentorId(mentorId: number): Promise<ArtistSync[]> {
    return Array.from(this.artistSyncs.values()).filter(
      (sync) => sync.mentorId === mentorId
    );
  }
  
  async getPendingSyncs(limit?: number): Promise<ArtistSync[]> {
    const pendingSyncs = Array.from(this.artistSyncs.values()).filter(
      (sync) => sync.syncStatus === 'pending'
    );
    
    // Sort by priority (highest first), handle null values
    const sortedSyncs = pendingSyncs.sort((a, b) => {
      const priorityA = a.priority ?? 5; // Default to 5 if null
      const priorityB = b.priority ?? 5; // Default to 5 if null
      return priorityB - priorityA;
    });
    
    // Apply limit if provided
    return limit ? sortedSyncs.slice(0, limit) : sortedSyncs;
  }
  
  async createArtistSync(insertArtistSync: InsertArtistSync): Promise<ArtistSync> {
    const id = this.currentArtistSyncId++;
    const timestamp = new Date().toISOString();
    
    // Create a properly typed ArtistSync object with all required fields
    const artistSyncData: ArtistSync = {
      id,
      source: insertArtistSync.source,
      sourceId: insertArtistSync.sourceId,
      mentorId: insertArtistSync.mentorId || null,
      lastSynced: timestamp,
      syncStatus: insertArtistSync.syncStatus || 'pending',
      rawData: insertArtistSync.rawData || null,
      syncError: insertArtistSync.syncError || null,
      syncInterval: insertArtistSync.syncInterval || 'daily',
      priority: insertArtistSync.priority || 5,
      createdAt: timestamp
    };
    
    this.artistSyncs.set(id, artistSyncData);
    return artistSyncData;
  }
  
  async updateArtistSyncStatus(id: number, status: string, error?: string): Promise<ArtistSync> {
    const artistSync = this.artistSyncs.get(id);
    if (!artistSync) throw new Error('Artist sync not found');
    
    const updatedSync = { 
      ...artistSync, 
      syncStatus: status,
      syncError: error || null,
      lastSynced: new Date().toISOString()
    };
    
    this.artistSyncs.set(id, updatedSync);
    return updatedSync;
  }
  
  async updateArtistSyncData(id: number, rawData: string): Promise<ArtistSync> {
    const artistSync = this.artistSyncs.get(id);
    if (!artistSync) throw new Error('Artist sync not found');
    
    const updatedSync = { 
      ...artistSync, 
      rawData,
      lastSynced: new Date().toISOString()
    };
    
    this.artistSyncs.set(id, updatedSync);
    return updatedSync;
  }
  
  async linkArtistSyncToMentor(id: number, mentorId: number): Promise<ArtistSync> {
    const artistSync = this.artistSyncs.get(id);
    if (!artistSync) throw new Error('Artist sync not found');
    
    const mentor = this.mentors.get(mentorId);
    if (!mentor) throw new Error('Mentor not found');
    
    const updatedSync = { ...artistSync, mentorId };
    this.artistSyncs.set(id, updatedSync);
    return updatedSync;
  }
  
  // Seed data methods
  private seedMentors() {
    const mentorsData: Mentor[] = [
      {
        id: this.currentMentorId++,
        name: "Kendrick Flow",
        inspiredBy: "Kendrick Lamar",
        profileImage: "/assets/kendrick-inspiration.png",
        genre: "Hip-Hop",
        genres: ["Hip-Hop", "Conscious Rap", "West Coast"],
        region: "West Coast",
        country: "USA",
        bio: "Kendrick Flow channels the introspective storytelling of Kendrick Lamar, offering guidance on complex lyricism and social commentary.",
        description: "A mentor inspired by Kendrick Lamar's lyrical complexity and storytelling.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          introspective: 9,
          socially_conscious: 10,
          storytelling: 9,
          technical: 8
        }),
        specialties: ["Storytelling", "Social Commentary", "Complex Rhyme Schemes"],
        yearsActive: "2010-present",
        spotifyId: "spotify:artist:mock-kendrick",
        geniusId: "genius:artist:mock-kendrick",
        mediaUrl: "/samples/kendrick-flow-sample.mp3",
        samplePrompt: "Tell me a story about your neighborhood that reveals something deeper about society.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      },
      {
        id: this.currentMentorId++,
        name: "Nova Rae",
        inspiredBy: "SZA",
        profileImage: "/assets/nova-rae.png",
        genre: "R&B",
        genres: ["R&B", "Neo-Soul", "Alternative R&B"],
        region: "Midwest",
        country: "USA",
        bio: "Nova Rae embodies SZA's emotional vulnerability and unique vocal stylings, helping artists find their authentic voice.",
        description: "A mentor inspired by SZA's vocal style and emotional songwriting.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          emotional: 9,
          vulnerable: 8,
          authentic: 10,
          melodic: 9
        }),
        specialties: ["Vocal Styling", "Emotional Songwriting", "Alternative R&B"],
        yearsActive: "2013-present",
        spotifyId: "spotify:artist:mock-sza",
        geniusId: "genius:artist:mock-sza",
        mediaUrl: "/samples/nova-rae-sample.mp3",
        samplePrompt: "Write about your most vulnerable moment, but make it something others can relate to.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      },
      {
        id: this.currentMentorId++,
        name: "MetroDeep",
        inspiredBy: "Drake",
        profileImage: "/assets/metro-deep.png",
        genre: "Hip-Hop",
        genres: ["Hip-Hop", "R&B", "Pop Rap"],
        region: "Toronto",
        country: "Canada",
        bio: "MetroDeep channels Drake's versatility between rapping and singing, with expertise in creating catchy hooks and mainstream appeal.",
        description: "A mentor inspired by Drake's melodic rap style and hit-making ability.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          versatile: 10,
          emotional: 8,
          commercial: 9,
          melodic: 9
        }),
        specialties: ["Hooks", "Mainstream Appeal", "Melodic Rap"],
        yearsActive: "2009-present",
        spotifyId: "spotify:artist:mock-drake",
        geniusId: "genius:artist:mock-drake",
        mediaUrl: "/samples/metro-deep-sample.mp3",
        samplePrompt: "Create a hook that blends singing and rapping about succeeding despite doubters.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      },
      {
        id: this.currentMentorId++,
        name: "Blaze420",
        inspiredBy: "J. Cole",
        profileImage: "/assets/blaze420.png",
        genre: "Hip-Hop",
        genres: ["Hip-Hop", "Conscious Rap", "East Coast"],
        region: "East Coast",
        country: "USA",
        bio: "Blaze420 embodies J. Cole's thoughtful, introspective approach to hip-hop with a focus on authentic storytelling and relatable themes.",
        description: "A mentor inspired by J. Cole's storytelling and conscious rap approach.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          authentic: 10,
          thoughtful: 9,
          relatable: 9,
          storytelling: 8
        }),
        specialties: ["Introspection", "Relatable Storytelling", "Conscious Hip-Hop"],
        yearsActive: "2007-present",
        spotifyId: "spotify:artist:mock-jcole",
        geniusId: "genius:artist:mock-jcole",
        mediaUrl: "/samples/blaze420-sample.mp3",
        samplePrompt: "Write about a personal struggle that taught you something important.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      },
      {
        id: this.currentMentorId++,
        name: "IvyMuse",
        inspiredBy: "Lauryn Hill",
        profileImage: "/assets/ivy-muse.png",
        genre: "Hip-Hop/Soul",
        genres: ["Hip-Hop", "Neo-Soul", "R&B"],
        region: "East Coast",
        country: "USA",
        bio: "IvyMuse channels Lauryn Hill's powerful blend of hip-hop and soul, emphasizing lyrical depth and musical versatility.",
        description: "A mentor inspired by Lauryn Hill's fusion of soul, R&B, and conscious hip-hop.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          soulful: 10,
          conscious: 9,
          versatile: 8,
          poetic: 9
        }),
        specialties: ["Soul-Rap Fusion", "Vocal Versatility", "Conscious Lyrics"],
        yearsActive: "1993-present",
        spotifyId: "spotify:artist:mock-lauryn",
        geniusId: "genius:artist:mock-lauryn",
        mediaUrl: "/samples/ivy-muse-sample.mp3",
        samplePrompt: "Create a verse that fuses singing and rapping while delivering a deep message.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      },
      {
        id: this.currentMentorId++,
        name: "Yemi Sound",
        inspiredBy: "Burna Boy",
        profileImage: "/assets/yemi-sound.png",
        genre: "Afrobeats",
        genres: ["Afrobeats", "Dancehall", "Afro-fusion"],
        region: "Lagos",
        country: "Nigeria",
        bio: "Yemi Sound brings Burna Boy's global Afro-fusion approach, blending African rhythms with contemporary sounds and meaningful lyrics.",
        description: "A mentor inspired by Burna Boy's Afrobeats style and global music perspective.",
        artistType: "Solo",
        mentorAvailable: true,
        cloneStatus: "AI",
        personalityProfile: JSON.stringify({
          global: 9,
          rhythmic: 10,
          cultural: 9,
          innovative: 8
        }),
        specialties: ["Afro-Fusion", "Global Sounds", "Cultural Storytelling"],
        yearsActive: "2012-present",
        spotifyId: "spotify:artist:mock-burna",
        geniusId: "genius:artist:mock-burna",
        mediaUrl: "/samples/yemi-sound-sample.mp3",
        samplePrompt: "Create a verse that blends your heritage with modern global sounds.",
        lastUpdated: new Date().toISOString(),
        autoUpdated: false
      }
    ];
    
    for (const mentor of mentorsData) {
      this.mentors.set(mentor.id, mentor);
    }
  }
  
  private seedJourneySteps() {
    const stepsData: JourneyStep[] = [
      {
        id: this.currentJourneyStepId++,
        title: "Find Your Voice",
        description: "Exploring vocal techniques and lyrical styles",
        status: "completed",
        order: 1,
        icon: "fa-check"
      },
      {
        id: this.currentJourneyStepId++,
        title: "Beat Selection & Composition",
        description: "Crafting unique beats that complement your style",
        status: "in-progress",
        order: 2,
        icon: "fa-music"
      },
      {
        id: this.currentJourneyStepId++,
        title: "Advanced Lyricism",
        description: "Developing complex metaphors and storytelling",
        status: "locked",
        order: 3,
        icon: "fa-pen-fancy"
      }
    ];
    
    for (const step of stepsData) {
      this.journeySteps.set(step.id, step);
    }
  }
  
  private seedInspirationItems() {
    const itemsData: InspirationItem[] = [
      {
        id: this.currentInspirationItemId++,
        mentorId: 4, // Blaze420
        type: "text",
        title: "Finding Your Narrative Voice",
        content: "The best stories come from truth. Write from your experiences but find the universal in them.",
        imageUrl: "/assets/blaze420.png",
        audioUrl: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: this.currentInspirationItemId++,
        mentorId: 2, // Nova Rae
        type: "audio",
        title: "Emotional R&B Beat",
        content: "A smooth R&B beat with emotional chord progressions",
        imageUrl: "/assets/nova-rae.png",
        audioUrl: "beat-sample.mp3",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: this.currentInspirationItemId++,
        mentorId: 3, // MetroDeep
        type: "prompt",
        title: "Writing Prompt",
        content: "Write a hook about the moment you realized your dreams were starting to come true. Focus on the contrast between expectation and reality.",
        imageUrl: "/assets/metro-deep.png",
        audioUrl: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: this.currentInspirationItemId++,
        mentorId: 5, // IvyMuse
        type: "text",
        title: "Soul Searching in Your Lyrics",
        content: "Connect your personal journey to a larger message. The most powerful songs balance vulnerability with universal truth.",
        imageUrl: "/assets/ivy-muse.png",
        audioUrl: null,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: this.currentInspirationItemId++,
        mentorId: 6, // Yemi Sound
        type: "audio",
        title: "Afrobeats Fusion Sample",
        content: "A rhythmic Afrobeats-inspired instrumental that blends traditional and modern elements.",
        imageUrl: "/assets/yemi-sound.png",
        audioUrl: "afrobeats-sample.mp3",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    for (const item of itemsData) {
      this.inspirationItems.set(item.id, item);
    }
  }
  
  private seedCollaborations() {
    const collabsData: Collaboration[] = [
      {
        id: this.currentCollaborationId++,
        title: "Lo-Fi Beat Collection",
        description: "Looking for vocalists & writers",
        createdBy: 1,
        lookingFor: "vocalists, writers",
        genre: "Lo-Fi",
        tags: "Lo-Fi,Chill",
        imageUrl: null,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentCollaborationId++,
        title: "Trap EP Project",
        description: "Need producers & engineers",
        createdBy: 2,
        lookingFor: "producers, engineers",
        genre: "Trap",
        tags: "Trap,Hip-Hop",
        imageUrl: null,
        createdAt: new Date().toISOString()
      }
    ];
    
    for (const collab of collabsData) {
      this.collaborations.set(collab.id, collab);
    }
  }
  
  private seedChallenges() {
    const challengesData: Challenge[] = [
      {
        id: this.currentChallengeId++,
        title: "MetroDeep Hook Challenge",
        description: "Create a melodic hook in the style of Drake using the provided beat. Top entries get featured on the platform.",
        entries: 247,
        daysLeft: 2,
        prize: "Featured + Pro Plan",
        isFeatured: true,
        audioUrl: "drake-challenge.mp3",
        createdAt: new Date().toISOString()
      }
    ];
    
    for (const challenge of challengesData) {
      this.challenges.set(challenge.id, challenge);
    }
  }
}

import { DatabaseStorage } from "./database-storage";

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
