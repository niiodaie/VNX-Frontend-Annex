import { db } from './db';
import { mentors, journeySteps, inspirationItems, collaborations, challenges, artistSync } from '@shared/schema';

async function seedMentors() {
  const existingMentors = await db.select().from(mentors);
  
  if (existingMentors.length > 0) {
    console.log('Mentors already seeded, skipping...');
    return;
  }
  
  console.log('Seeding mentors...');
  
  const timestamp = new Date().toISOString();
  
  await db.insert(mentors).values([
    {
      name: "Kendrick Flow",
      inspiredBy: "Kendrick Lamar",
      profileImage: "/assets/kendrick-mentor.png",
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
      lastUpdated: timestamp,
      autoUpdated: false
    },
    {
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
      lastUpdated: timestamp,
      autoUpdated: false
    },
    {
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
      lastUpdated: timestamp,
      autoUpdated: false
    },
    {
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
      lastUpdated: timestamp,
      autoUpdated: false
    },
    {
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
      lastUpdated: timestamp,
      autoUpdated: false
    },
    {
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
      lastUpdated: timestamp,
      autoUpdated: false
    }
  ]);

  console.log('Mentors seeded successfully.');
}

async function seedJourneySteps() {
  const existingSteps = await db.select().from(journeySteps);
  
  if (existingSteps.length > 0) {
    console.log('Journey steps already seeded, skipping...');
    return;
  }
  
  console.log('Seeding journey steps...');
  
  await db.insert(journeySteps).values([
    {
      title: "Find Your Voice",
      description: "Exploring vocal techniques and lyrical styles",
      status: "completed",
      order: 1,
      icon: "fa-check"
    },
    {
      title: "Beat Selection & Composition",
      description: "Crafting unique beats that complement your style",
      status: "in-progress",
      order: 2,
      icon: "fa-music"
    },
    {
      title: "Advanced Lyricism",
      description: "Developing complex metaphors and storytelling",
      status: "locked",
      order: 3,
      icon: "fa-pen-fancy"
    }
  ]);

  console.log('Journey steps seeded successfully.');
}

async function seedInspirationItems() {
  const existingItems = await db.select().from(inspirationItems);
  
  if (existingItems.length > 0) {
    console.log('Inspiration items already seeded, skipping...');
    return;
  }
  
  console.log('Seeding inspiration items...');
  
  const timestamp1 = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const timestamp2 = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
  const timestamp3 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  // Get mentor IDs
  const allMentors = await db.select().from(mentors);
  if (allMentors.length < 4) {
    console.log('Not enough mentors to seed inspiration items, skipping...');
    return;
  }
  
  await db.insert(inspirationItems).values([
    {
      mentorId: 4, // Blaze420
      type: "text",
      title: "Finding Your Narrative Voice",
      content: "The best stories come from truth. Write from your experiences but find the universal in them.",
      imageUrl: "/assets/blaze420.png",
      audioUrl: null,
      createdAt: timestamp1
    },
    {
      mentorId: 2, // Nova Rae
      type: "audio",
      title: "Emotional R&B Beat",
      content: "A smooth R&B beat with emotional chord progressions",
      imageUrl: "/assets/nova-rae.png",
      audioUrl: "beat-sample.mp3",
      createdAt: timestamp2
    },
    {
      mentorId: 3, // MetroDeep
      type: "prompt",
      title: "Writing Prompt",
      content: "Write a hook about the moment you realized your dreams were starting to come true. Focus on the contrast between expectation and reality.",
      imageUrl: "/assets/metro-deep.png",
      audioUrl: null,
      createdAt: timestamp3
    },
    {
      mentorId: 5, // IvyMuse
      type: "text",
      title: "Soul Searching in Your Lyrics",
      content: "Connect your personal journey to a larger message. The most powerful songs balance vulnerability with universal truth.",
      imageUrl: "/assets/ivy-muse.png",
      audioUrl: null,
      createdAt: timestamp1
    },
    {
      mentorId: 6, // Yemi Sound
      type: "audio",
      title: "Afrobeats Fusion Sample",
      content: "A rhythmic Afrobeats-inspired instrumental that blends traditional and modern elements.",
      imageUrl: "/assets/yemi-sound.png",
      audioUrl: "afrobeats-sample.mp3",
      createdAt: timestamp2
    }
  ]);

  console.log('Inspiration items seeded successfully.');
}

async function seedCollaborations() {
  const existingCollabs = await db.select().from(collaborations);
  
  if (existingCollabs.length > 0) {
    console.log('Collaborations already seeded, skipping...');
    return;
  }
  
  console.log('Seeding collaborations...');
  
  const timestamp = new Date().toISOString();
  
  await db.insert(collaborations).values([
    {
      title: "Lo-Fi Beat Collection",
      description: "Looking for vocalists & writers",
      createdBy: 1,
      lookingFor: "vocalists, writers",
      genre: "Lo-Fi",
      tags: "Lo-Fi,Chill",
      imageUrl: null,
      createdAt: timestamp
    },
    {
      title: "Trap EP Project",
      description: "Need producers & engineers",
      createdBy: 2,
      lookingFor: "producers, engineers",
      genre: "Trap",
      tags: "Trap,Hip-Hop",
      imageUrl: null,
      createdAt: timestamp
    }
  ]);

  console.log('Collaborations seeded successfully.');
}

async function seedChallenges() {
  const existingChallenges = await db.select().from(challenges);
  
  if (existingChallenges.length > 0) {
    console.log('Challenges already seeded, skipping...');
    return;
  }
  
  console.log('Seeding challenges...');
  
  const timestamp = new Date().toISOString();
  
  await db.insert(challenges).values([
    {
      title: "MetroDeep Hook Challenge",
      description: "Create a melodic hook in the style of Drake using the provided beat. Top entries get featured on the platform.",
      entries: 247,
      daysLeft: 2,
      prize: "Featured + Pro Plan",
      isFeatured: true,
      audioUrl: "drake-challenge.mp3",
      createdAt: timestamp
    }
  ]);

  console.log('Challenges seeded successfully.');
}

async function seedArtistSyncs() {
  const existingSyncs = await db.select().from(artistSync);
  
  if (existingSyncs.length > 0) {
    console.log('Artist sync records already seeded, skipping...');
    return;
  }
  
  console.log('Seeding artist sync data...');
  
  const timestamp = new Date().toISOString();
  const futureTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow
  
  // Get mentor IDs
  const allMentors = await db.select().from(mentors);
  if (allMentors.length < 2) {
    console.log('Not enough mentors to seed artist syncs, skipping...');
    return;
  }
  
  // Mock raw API data for Spotify
  const spotifyRawData = JSON.stringify({
    id: "spotify:artist:mock-kendrick",
    name: "Kendrick Lamar",
    genres: ["conscious hip hop", "hip hop", "rap", "west coast rap"],
    popularity: 89,
    followers: { total: 19876543 },
    images: [{ url: "https://example.com/kendrick.jpg" }],
    external_urls: { spotify: "https://open.spotify.com/artist/mock-kendrick" }
  });
  
  // Mock raw API data for Genius
  const geniusRawData = JSON.stringify({
    id: 1234567,
    name: "Kendrick Lamar",
    alternate_names: ["K-Dot", "Kung Fu Kenny"],
    description: { plain: "Kendrick Lamar Duckworth is an American rapper and songwriter..." },
    image_url: "https://example.com/kendrick_genius.jpg",
    is_verified: true
  });
  
  await db.insert(artistSync).values([
    {
      source: "spotify",
      sourceId: "spotify:artist:mock-kendrick",
      mentorId: allMentors[0].id, // Link to Kendrick Flow
      lastSynced: timestamp,
      syncStatus: "success",
      rawData: spotifyRawData,
      syncError: null,
      syncInterval: "daily",
      priority: 1, // High priority
      createdAt: timestamp
    },
    {
      source: "genius",
      sourceId: "genius:artist:mock-kendrick",
      mentorId: allMentors[0].id, // Link to Kendrick Flow
      lastSynced: timestamp,
      syncStatus: "success",
      rawData: geniusRawData,
      syncError: null,
      syncInterval: "weekly",
      priority: 2,
      createdAt: timestamp
    },
    {
      source: "spotify",
      sourceId: "spotify:artist:mock-drake",
      mentorId: allMentors[2].id, // Link to MetroDeep
      lastSynced: timestamp,
      syncStatus: "pending", // Pending update
      rawData: null,
      syncError: null,
      syncInterval: "daily",
      priority: 3,
      createdAt: timestamp
    },
    {
      source: "spotify",
      sourceId: "spotify:artist:mock-newcomer",
      mentorId: null, // Not linked to a mentor yet
      lastSynced: timestamp,
      syncStatus: "pending",
      rawData: null,
      syncError: null,
      syncInterval: "daily",
      priority: 5,
      createdAt: timestamp
    },
    {
      source: "spotify",
      sourceId: "spotify:artist:mock-error-example",
      mentorId: null,
      lastSynced: timestamp,
      syncStatus: "failed",
      rawData: null,
      syncError: "API rate limit exceeded, retry after 3600 seconds",
      syncInterval: "daily",
      priority: 10, // Low priority
      createdAt: timestamp
    }
  ]);
  
  console.log('Artist sync data seeded successfully.');
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Seed in sequence to maintain relationships
    await seedMentors();
    await seedJourneySteps();
    await seedInspirationItems();
    await seedCollaborations();
    await seedChallenges();
    await seedArtistSyncs();
    
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();