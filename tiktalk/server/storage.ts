import { products, newsletters, users, type Product, type InsertProduct, type Newsletter, type InsertNewsletter, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(filters?: {
    category?: string;
    brand?: string[];
    priceRange?: { min: number; max: number };
    rating?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Newsletter methods
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscriptions(): Promise<Newsletter[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private newsletters: Map<number, Newsletter>;
  private currentUserId: number;
  private currentProductId: number;
  private currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.newsletters = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentNewsletterId = 1;
    
    // Initialize with sample products
    this.initializeSampleProducts();
  }

  private initializeSampleProducts() {
    const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
      {
        name: "Audio-Technica ATR2100x-USB Microphone",
        description: "The exact microphone used by Joe Rogan on The Joe Rogan Experience. Dynamic microphone perfect for podcast recording with crystal clear audio quality",
        price: "129.99",
        imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "equipment",
        brand: "Audio-Technica",
        rating: "4.8",
        reviewCount: 124,
        inStock: true,
        featured: true,
        amazonUrl: "https://www.amazon.com/dp/B07ZPBFVKK",
        podcastShow: "The Joe Rogan Experience",
      },
      {
        name: "Sony MDR-7506 Headphones",
        description: "Industry standard studio monitor headphones used by Marc Maron on WTF with Marc Maron. Professional-grade for crystal clear audio monitoring",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "accessories",
        brand: "Sony",
        rating: "4.9",
        reviewCount: 89,
        inStock: true,
        featured: false,
        amazonUrl: "https://www.amazon.com/dp/B000AJIF4E",
        podcastShow: "WTF with Marc Maron",
      },
      {
        name: "Primacoustic Foam Panels",
        description: "Professional acoustic treatment used in the Call Her Daddy studio. Perfect for creating that broadcast-quality sound",
        price: "79.99",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "studio",
        brand: "Primacoustic",
        rating: "4.6",
        reviewCount: 156,
        inStock: true,
        featured: false,
        amazonUrl: "https://www.amazon.com/dp/B01L1B1WNO",
        podcastShow: "Call Her Daddy",
      },
      {
        name: "Focusrite Scarlett 2i2 Audio Interface",
        description: "The go-to audio interface used by countless podcasters including Tim Ferriss. Professional 2-channel recording interface for studio-quality sound",
        price: "149.99",
        imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "equipment",
        brand: "Focusrite",
        rating: "4.7",
        reviewCount: 203,
        inStock: true,
        featured: true,
        amazonUrl: "https://www.amazon.com/dp/B01E6T56CM",
        podcastShow: "The Tim Ferriss Show",
      },
      {
        name: "Rode PSA1 Boom Arm",
        description: "Professional broadcast boom arm used in the Conan O'Brien Needs a Friend podcast studio. Heavy-duty with smooth positioning",
        price: "89.99",
        imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "accessories",
        brand: "Rode",
        rating: "4.5",
        reviewCount: 87,
        inStock: true,
        featured: false,
        amazonUrl: "https://www.amazon.com/dp/B001D7UYBO",
        podcastShow: "Conan O'Brien Needs a Friend",
      },
      {
        name: "Podcast Logo T-Shirt",
        description: "Official merchandise from your favorite podcast shows. Premium cotton blend for ultimate comfort",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "merchandise",
        brand: "Various Shows",
        rating: "4.4",
        reviewCount: 67,
        inStock: true,
        featured: false,
        amazonUrl: "https://www.amazon.com/dp/B08XQVPQ2K",
        podcastShow: "Various Podcasts",
      },
      {
        name: "Shure SM7B Microphone",
        description: "The legendary microphone made famous by Joe Rogan and used by countless top podcasters. The gold standard for broadcast audio",
        price: "399.99",
        imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "equipment",
        brand: "Shure",
        rating: "4.8",
        reviewCount: 294,
        inStock: true,
        featured: true,
        amazonUrl: "https://www.amazon.com/dp/B0002E4Z8M",
        podcastShow: "The Joe Rogan Experience",
      },
      {
        name: "Elgato Key Light",
        description: "Professional LED lighting used by video podcasters like Hasan Piker. Perfect for creating that professional broadcast look",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        category: "studio",
        brand: "Elgato",
        rating: "4.6",
        reviewCount: 112,
        inStock: true,
        featured: false,
        amazonUrl: "https://www.amazon.com/dp/B07L755X9G",
        podcastShow: "HasanAbi",
      },
    ];

    sampleProducts.forEach(product => {
      const fullProduct: Product = {
        ...product,
        id: this.currentProductId++,
        createdAt: new Date(),
        brand: product.brand || null,
        rating: product.rating || null,
        reviewCount: product.reviewCount || null,
        inStock: product.inStock || null,
        featured: product.featured || null,
        amazonUrl: product.amazonUrl || null,
        podcastShow: product.podcastShow || null,
      };
      this.products.set(fullProduct.id, fullProduct);
    });
  }

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

  async getProducts(filters?: {
    category?: string;
    brand?: string[];
    priceRange?: { min: number; max: number };
    rating?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    let filteredProducts = Array.from(this.products.values());

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters.brand && filters.brand.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.brand && filters.brand!.includes(p.brand)
        );
      }

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p => {
          const price = parseFloat(p.price);
          return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
        });
      }

      if (filters.rating) {
        filteredProducts = filteredProducts.filter(p => 
          parseFloat(p.rating || "0") >= filters.rating!
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          (p.brand && p.brand.toLowerCase().includes(searchLower))
        );
      }
    }

    // Sort by featured first, then by rating
    filteredProducts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
    });

    if (filters?.offset) {
      filteredProducts = filteredProducts.slice(filters.offset);
    }

    if (filters?.limit) {
      filteredProducts = filteredProducts.slice(0, filters.limit);
    }

    return filteredProducts;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date(),
      brand: product.brand || null,
      rating: product.rating || null,
      reviewCount: product.reviewCount || null,
      inStock: product.inStock || null,
      featured: product.featured || null,
      amazonUrl: product.amazonUrl || null,
      podcastShow: product.podcastShow || null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const newSubscription: Newsletter = {
      ...newsletter,
      id,
      subscribedAt: new Date(),
    };
    this.newsletters.set(id, newSubscription);
    return newSubscription;
  }

  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }
}

export const storage = new MemStorage();
