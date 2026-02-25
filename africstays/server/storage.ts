import { 
  User, InsertUser, 
  Property, InsertProperty, 
  Destination, InsertDestination, 
  Testimonial, InsertTestimonial, 
  Booking, InsertBooking 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getUniqueStays(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  searchProperties(query: string, checkIn?: Date, checkOut?: Date, guests?: number): Promise<Property[]>;
  
  // Destination methods
  getDestination(id: number): Promise<Destination | undefined>;
  getDestinations(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private destinations: Map<number, Destination>;
  private testimonials: Map<number, Testimonial>;
  private bookings: Map<number, Booking>;
  
  private userCurrentId: number;
  private propertyCurrentId: number;
  private destinationCurrentId: number;
  private testimonialCurrentId: number;
  private bookingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.destinations = new Map();
    this.testimonials = new Map();
    this.bookings = new Map();
    
    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.destinationCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.bookingCurrentId = 1;
    
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured
    );
  }

  async getUniqueStays(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isUniqueStay
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }

  async searchProperties(query: string, checkIn?: Date, checkOut?: Date, guests?: number): Promise<Property[]> {
    query = query.toLowerCase();
    return Array.from(this.properties.values()).filter((property) => {
      const matchesQuery = 
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.country.toLowerCase().includes(query);
      
      const matchesGuests = guests ? property.maxGuests >= guests : true;
      
      return matchesQuery && matchesGuests;
    });
  }

  // Destination methods
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.destinationCurrentId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const booking: Booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  // Seed data
  private seedData() {
    // Create host users
    const host1 = this.createUser({
      username: 'kwame_host',
      password: 'password123',
      email: 'kwame@example.com',
      fullName: 'Kwame',
      country: 'South Africa',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      isHost: true
    });

    const host2 = this.createUser({
      username: 'amara_host',
      password: 'password123',
      email: 'amara@example.com',
      fullName: 'Amara',
      country: 'Morocco',
      profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      isHost: true
    });

    const host3 = this.createUser({
      username: 'samuel_host',
      password: 'password123',
      email: 'samuel@example.com',
      fullName: 'Samuel',
      country: 'Kenya',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      isHost: true
    });

    // Create properties
    this.createProperty({
      title: 'Luxury Safari Lodge',
      description: 'Experience the wild in luxury with this amazing safari lodge overlooking the Serengeti plains.',
      location: 'Serengeti',
      city: 'Serengeti',
      country: 'Tanzania',
      price: 275,
      imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
      hostId: 1,
      rating: 4.9,
      reviewCount: 48,
      propertyType: 'Lodge',
      isFeatured: true,
      isUniqueStay: false,
      uniqueStayType: null,
      availableStart: new Date('2023-11-12'),
      availableEnd: new Date('2023-11-18'),
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4
    });

    this.createProperty({
      title: 'Coastal Villa',
      description: 'Beautiful beachfront villa with private access to the pristine beaches of Zanzibar.',
      location: 'Zanzibar',
      city: 'Zanzibar',
      country: 'Tanzania',
      price: 195,
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      hostId: 1,
      rating: 4.8,
      reviewCount: 36,
      propertyType: 'Villa',
      isFeatured: true,
      isUniqueStay: true,
      uniqueStayType: 'Beachside Villas',
      availableStart: new Date('2023-12-05'),
      availableEnd: new Date('2023-12-12'),
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6
    });

    this.createProperty({
      title: 'Desert Retreat',
      description: 'Authentic Moroccan riad with modern amenities in the heart of Marrakech.',
      location: 'Marrakech',
      city: 'Marrakech',
      country: 'Morocco',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1496497243327-9dccd845c35f',
      hostId: 2,
      rating: 4.7,
      reviewCount: 29,
      propertyType: 'Riad',
      isFeatured: true,
      isUniqueStay: false,
      uniqueStayType: null,
      availableStart: new Date('2023-10-20'),
      availableEnd: new Date('2023-10-27'),
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4
    });

    this.createProperty({
      title: 'Mountain Cabin',
      description: 'Cozy cabin with stunning views of Table Mountain and the city below.',
      location: 'Cape Town',
      city: 'Cape Town',
      country: 'South Africa',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea',
      hostId: 1,
      rating: 4.6,
      reviewCount: 24,
      propertyType: 'Cabin',
      isFeatured: true,
      isUniqueStay: false,
      uniqueStayType: null,
      availableStart: new Date('2024-01-05'),
      availableEnd: new Date('2024-01-12'),
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2
    });

    this.createProperty({
      title: 'Treehouse Hideaway',
      description: 'Sleep among the treetops in this eco-friendly, luxurious treehouse retreat.',
      location: 'Nairobi',
      city: 'Nairobi',
      country: 'Kenya',
      price: 220,
      imageUrl: 'https://images.unsplash.com/photo-1604014838575-c9320c8acf7a',
      hostId: 3,
      rating: 4.9,
      reviewCount: 41,
      propertyType: 'Treehouse',
      isFeatured: false,
      isUniqueStay: true,
      uniqueStayType: 'Treehouse Retreats',
      availableStart: new Date('2023-11-01'),
      availableEnd: new Date('2023-11-30'),
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2
    });

    this.createProperty({
      title: 'Traditional Maasai Hut',
      description: 'Experience authentic African living with modern comforts in this traditional Maasai dwelling.',
      location: 'Masai Mara',
      city: 'Narok',
      country: 'Kenya',
      price: 95,
      imageUrl: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d',
      hostId: 3,
      rating: 4.7,
      reviewCount: 32,
      propertyType: 'Hut',
      isFeatured: false,
      isUniqueStay: true,
      uniqueStayType: 'Traditional Huts',
      availableStart: new Date('2023-10-15'),
      availableEnd: new Date('2023-12-15'),
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 3
    });

    this.createProperty({
      title: 'Desert Camp Luxury',
      description: 'Luxury camping in the Sahara Desert with incredible stargazing opportunities.',
      location: 'Sahara Desert',
      city: 'Merzouga',
      country: 'Morocco',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
      hostId: 2,
      rating: 4.8,
      reviewCount: 38,
      propertyType: 'Desert Camp',
      isFeatured: false,
      isUniqueStay: true,
      uniqueStayType: 'Desert Camps',
      availableStart: new Date('2023-09-01'),
      availableEnd: new Date('2023-10-31'),
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2
    });

    this.createProperty({
      title: 'Waterfront Bungalow',
      description: 'Charming bungalow right on the water with panoramic lake views.',
      location: 'Lake Victoria',
      city: 'Entebbe',
      country: 'Uganda',
      price: 160,
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      hostId: 3,
      rating: 4.6,
      reviewCount: 27,
      propertyType: 'Bungalow',
      isFeatured: false,
      isUniqueStay: false,
      uniqueStayType: null,
      availableStart: new Date('2023-11-10'),
      availableEnd: new Date('2023-12-10'),
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4
    });

    // Create destinations
    this.createDestination({
      name: 'Serengeti National Park',
      country: 'Tanzania',
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5',
      description: 'Home to the great migration, one of the most impressive wildlife events worldwide.',
      featured: true
    });

    this.createDestination({
      name: 'Cape Town',
      country: 'South Africa',
      imageUrl: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea',
      description: 'Stunning coastal city with Table Mountain as its backdrop.',
      featured: true
    });

    this.createDestination({
      name: 'Marrakech',
      country: 'Morocco',
      imageUrl: 'https://images.unsplash.com/photo-1496497243327-9dccd845c35f',
      description: 'A bustling city known for its markets, gardens, palaces, and mosques.',
      featured: true
    });

    this.createDestination({
      name: 'Zanzibar',
      country: 'Tanzania',
      imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
      description: 'Archipelago known for its beautiful beaches and historical Stone Town.',
      featured: true
    });

    this.createDestination({
      name: 'Victoria Falls',
      country: 'Zimbabwe/Zambia',
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5',
      description: 'One of the world\'s most impressive waterfalls, located on the Zambezi River.',
      featured: true
    });

    this.createDestination({
      name: 'Cairo',
      country: 'Egypt',
      imageUrl: 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084',
      description: 'Home to the Giza pyramids and the iconic Sphinx.',
      featured: true
    });

    // Create testimonials
    this.createTestimonial({
      userId: 4,
      rating: 5,
      comment: 'Our stay at the treehouse in Kenya was magical! Waking up to the sounds of nature and seeing wildlife from our balcony was an unforgettable experience.',
      userCountry: 'United States',
      userName: 'Sarah',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      propertyId: 5
    });

    this.createTestimonial({
      userId: 5,
      rating: 5,
      comment: 'The coastal villa in Zanzibar exceeded all our expectations. The host was incredibly welcoming and the private beach access made our honeymoon perfect.',
      userCountry: 'Brazil',
      userName: 'James & Maria',
      userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      propertyId: 2
    });

    this.createTestimonial({
      userId: 6,
      rating: 5,
      comment: 'Staying in a traditional Moroccan riad was the highlight of our trip. The architecture, the food, and the warm hospitality made us feel like we were part of the family.',
      userCountry: 'Japan',
      userName: 'Yuki',
      userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      propertyId: 3
    });
  }
}

export const storage = new MemStorage();
