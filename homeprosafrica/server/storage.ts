import { 
  users, 
  type User, 
  type InsertUser,
  services,
  type Service,
  type InsertService,
  professionals,
  type Professional,
  type InsertProfessional,
  testimonials,
  type Testimonial,
  type InsertTestimonial,
  contactForms,
  type ContactForm,
  type InsertContactForm
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Professional operations
  getProfessionals(): Promise<Professional[]>;
  getProfessional(id: number): Promise<Professional | undefined>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contact form operation
  saveContactForm(contactForm: InsertContactForm): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private professionals: Map<number, Professional>;
  private testimonials: Map<number, Testimonial>;
  private contactForms: ContactForm[];
  private currentUserId: number;
  private currentServiceId: number;
  private currentProfessionalId: number;
  private currentTestimonialId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.professionals = new Map();
    this.testimonials = new Map();
    this.contactForms = [];
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentProfessionalId = 1;
    this.currentTestimonialId = 1;
    
    // Initialize with seed data
    this.seedServices();
    this.seedProfessionals();
    this.seedTestimonials();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(
      (service) => service.slug === slug
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }
  
  async getProfessional(id: number): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }
  
  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = this.currentProfessionalId++;
    const professional: Professional = { ...insertProfessional, id };
    this.professionals.set(id, professional);
    return professional;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Contact form method
  async saveContactForm(contactForm: InsertContactForm): Promise<void> {
    this.contactForms.push(contactForm as any);
    return Promise.resolve();
  }
  
  // Seed methods
  private seedServices() {
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
    
    servicesData.forEach(service => this.createService(service));
  }
  
  private seedProfessionals() {
    const professionalsData: InsertProfessional[] = [
      {
        name: "David Okafor",
        profession: "Master Electrician",
        bio: "Specializing in electrical installations and repairs with over 15 years of experience across Lagos.",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5.0,
        reviewCount: 124,
        verifications: ["Background checked", "Licensed & insured", "5+ years on platform"]
      },
      {
        name: "Amina Diallo",
        profession: "Interior Designer",
        bio: "Award-winning designer transforming homes across Africa with creative, culturally inspired designs.",
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 4.8,
        reviewCount: 97,
        verifications: ["Background checked", "Certified professional", "3+ years on platform"]
      },
      {
        name: "Ibrahim Mensah",
        profession: "Master Plumber",
        bio: "Expert in all plumbing needs from repairs to installations. Known for reliability and quality work.",
        imageUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 4.9,
        reviewCount: 156,
        verifications: ["Background checked", "Licensed & insured", "4+ years on platform"]
      },
      {
        name: "Emmanuel Adeyemi",
        profession: "Carpenter",
        bio: "Skilled craftsman with expertise in custom furniture, home repairs, and wooden installations.",
        imageUrl: "https://images.unsplash.com/photo-1542142430-59f45f5d9344?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 4.7,
        reviewCount: 89,
        verifications: ["Background checked", "Certified professional", "2+ years on platform"]
      },
      {
        name: "Grace Nkosi",
        profession: "Professional Cleaner",
        bio: "Thorough, detail-oriented cleaner specializing in deep cleaning services and organization.",
        imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 4.9,
        reviewCount: 112,
        verifications: ["Background checked", "Insured", "3+ years on platform"]
      },
      {
        name: "Samuel Kamau",
        profession: "Landscape Architect",
        bio: "Creative landscape designer with expertise in indigenous plants and sustainable garden design.",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
        rating: 4.6,
        reviewCount: 78,
        verifications: ["Background checked", "Certified professional", "2+ years on platform"]
      }
    ];
    
    professionalsData.forEach(professional => this.createProfessional(professional));
  }
  
  private seedTestimonials() {
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
    
    testimonialsData.forEach(testimonial => this.createTestimonial(testimonial));
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async getProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals);
  }

  async getProfessional(id: number): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional || undefined;
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const [professional] = await db
      .insert(professionals)
      .values(insertProfessional)
      .returning();
    return professional;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async saveContactForm(contactForm: InsertContactForm): Promise<void> {
    await db.insert(contactForms).values(contactForm);
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
