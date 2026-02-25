import { db } from "./db";
import { 
  services, 
  professionals, 
  testimonials, 
  InsertService, 
  InsertProfessional, 
  InsertTestimonial 
} from "@shared/schema";

async function seedServices() {
  const servicesData: InsertService[] = [
    {
      name: "Plumbing",
      slug: "plumbing",
      description: "Professional plumbing services for repairs, installations, and maintenance.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Electrical Work",
      slug: "electrical",
      description: "Expert electrical services for your home, from repairs to new installations.",
      imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Cleaning",
      slug: "cleaning",
      description: "Thorough cleaning services to keep your home spotless and healthy.",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Landscaping",
      slug: "landscaping",
      description: "Transform your outdoor space with our professional landscaping services.",
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Carpentry",
      slug: "carpentry",
      description: "Quality carpentry services for all your woodworking needs and repairs.",
      imageUrl: "https://images.unsplash.com/photo-1601564921647-b446262bbc14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Painting",
      slug: "painting",
      description: "Professional painting services to refresh and beautify your home.",
      imageUrl: "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Home Renovation",
      slug: "renovation",
      description: "Complete renovation services to transform your living space.",
      imageUrl: "https://images.unsplash.com/photo-1534126875314-a33c5aae3b3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      name: "Moving Services",
      slug: "moving",
      description: "Reliable moving services to help you relocate with minimal stress.",
      imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];
  
  for (const service of servicesData) {
    await db.insert(services).values(service).onConflictDoNothing();
  }
  
  console.log("✅ Services seeded");
}

async function seedProfessionals() {
  const professionalsData: Omit<InsertProfessional, 'verifications'>[] = [
    {
      name: "David Okafor",
      profession: "Master Electrician",
      bio: "Specializing in electrical installations and repairs with over 15 years of experience across Lagos.",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5.0,
      reviewCount: 124,
    },
    {
      name: "Amina Diallo",
      profession: "Interior Designer",
      bio: "Award-winning designer transforming homes across Africa with creative, culturally inspired designs.",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4.8,
      reviewCount: 97,
    },
    {
      name: "Ibrahim Mensah",
      profession: "Master Plumber",
      bio: "Expert in all plumbing needs from repairs to installations. Known for reliability and quality work.",
      imageUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4.9,
      reviewCount: 156,
    },
    {
      name: "Emmanuel Adeyemi",
      profession: "Carpenter",
      bio: "Skilled craftsman with expertise in custom furniture, home repairs, and wooden installations.",
      imageUrl: "https://images.unsplash.com/photo-1542142430-59f45f5d9344?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4.7,
      reviewCount: 89,
    },
    {
      name: "Grace Nkosi",
      profession: "Professional Cleaner",
      bio: "Thorough, detail-oriented cleaner specializing in deep cleaning services and organization.",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4.9,
      reviewCount: 112,
    },
    {
      name: "Samuel Kamau",
      profession: "Landscape Architect",
      bio: "Creative landscape designer with expertise in indigenous plants and sustainable garden design.",
      imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 4.6,
      reviewCount: 78,
    }
  ];
  
  // Add verifications as a JSON string for each professional
  for (const professional of professionalsData) {
    const verifications = JSON.stringify([
      "Background checked", 
      "Licensed & insured", 
      `${Math.floor(Math.random() * 5) + 2}+ years on platform`
    ]);
    
    await db.insert(professionals).values({
      ...professional,
      verifications
    }).onConflictDoNothing();
  }
  
  console.log("✅ Professionals seeded");
}

async function seedTestimonials() {
  const testimonialsData: InsertTestimonial[] = [
    {
      name: "Grace Ademola",
      location: "Lagos, Nigeria",
      rating: 5,
      comment: "I was skeptical at first, but HomeProsAfrica connected me with an incredible electrician who fixed issues other professionals couldn't solve. The service was prompt, professional, and reasonably priced. I'll definitely use this platform again!",
      service: "Electrical Repair",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "Samuel Okeke",
      location: "Nairobi, Kenya",
      rating: 5,
      comment: "Finding reliable plumbers was always a challenge until I discovered HomeProsAfrica. The platform connected me with a skilled professional who arrived on time and solved our bathroom issues completely. Very impressed!",
      service: "Plumbing Service",
      imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "Fatima Mensah",
      location: "Accra, Ghana",
      rating: 4,
      comment: "The landscaper I hired through HomeProsAfrica transformed my garden completely. I appreciated the transparent pricing and the ability to view previous work before making my decision. Would recommend to anyone needing quality home services.",
      service: "Landscaping",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];
  
  for (const testimonial of testimonialsData) {
    await db.insert(testimonials).values(testimonial).onConflictDoNothing();
  }
  
  console.log("✅ Testimonials seeded");
}

async function initDatabase() {
  try {
    console.log("🚀 Initializing database...");
    
    // Seed data
    await seedServices();
    await seedProfessionals();
    await seedTestimonials();
    
    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  } finally {
    process.exit(0);
  }
}

// Run the initialization
initDatabase();