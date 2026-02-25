import {
  users, type User, type InsertUser,
  restaurants, type Restaurant, type InsertRestaurant,
  menuItems, type MenuItem, type InsertMenuItem,
  reviews, type Review, type InsertReview,
  reservations, type Reservation, type InsertReservation,
  culturalInsights, type CulturalInsight, type InsertCulturalInsight,
  foodOriginStories, type FoodOriginStory, type InsertFoodOriginStory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Restaurant methods
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]>;
  getRestaurantsByCity(city: string): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurantRating(id: number, rating: number, reviewCount: number): Promise<Restaurant | undefined>;
  
  // Menu item methods
  getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]>;
  getFeaturedMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Review methods
  getReviewsByRestaurantId(restaurantId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Reservation methods
  getReservationsByRestaurantId(restaurantId: number): Promise<Reservation[]>;
  getReservationsByUserId(userId: number): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
  
  // Cultural Insight methods
  getCulturalInsights(): Promise<CulturalInsight[]>;
  getCulturalInsightById(id: number): Promise<CulturalInsight | undefined>;
  getCulturalInsightsByCuisine(cuisineType: string): Promise<CulturalInsight[]>;
  createCulturalInsight(insight: InsertCulturalInsight): Promise<CulturalInsight>;
  
  // Food Origin Story methods
  getFoodOriginStories(): Promise<FoodOriginStory[]>;
  getFoodOriginStoryById(id: number): Promise<FoodOriginStory | undefined>;
  getFoodOriginStoriesByDishName(dishName: string): Promise<FoodOriginStory[]>;
  getFoodOriginStoriesByCuisine(cuisineType: string): Promise<FoodOriginStory[]>;
  createFoodOriginStory(story: InsertFoodOriginStory): Promise<FoodOriginStory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  private reviews: Map<number, Review>;
  private reservations: Map<number, Reservation>;
  private culturalInsights: Map<number, CulturalInsight>;
  private foodOriginStories: Map<number, FoodOriginStory>;
  
  private currentUserId: number;
  private currentRestaurantId: number;
  private currentMenuItemId: number;
  private currentReviewId: number;
  private currentReservationId: number;
  private currentInsightId: number;
  private currentFoodOriginStoryId: number;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.reviews = new Map();
    this.reservations = new Map();
    this.culturalInsights = new Map();
    this.foodOriginStories = new Map();
    
    this.currentUserId = 1;
    this.currentRestaurantId = 1;
    this.currentMenuItemId = 1;
    this.currentReviewId = 1;
    this.currentReservationId = 1;
    this.currentInsightId = 1;
    this.currentFoodOriginStoryId = 1;
    
    this.initializeData();
  }

  // Initialize with sample data for development
  private initializeData() {
    // Sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "afrofoodie",
        password: "hashed_password_123",
        fullName: "Amara Johnson",
        email: "amara.johnson@example.com",
        phoneNumber: "+1 (555) 123-4567"
      }
    ];
    
    sampleUsers.forEach(user => {
      const userId = this.currentUserId++;
      const newUser: User = {
        ...user,
        id: userId,
        createdAt: new Date(),
        phoneNumber: user.phoneNumber || null,
        isGuest: false
      };
      this.users.set(userId, newUser);
    });
    
    // Sample restaurants
    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "Abyssinia Ethiopian",
        description: "Authentic Ethiopian cuisine featuring traditional injera and diverse stews.",
        cuisineType: "Ethiopian",
        country: "Ethiopia",
        address: "123 Kimathi Street",
        city: "Nairobi",
        phoneNumber: "+254 123 456 789",
        website: "https://ikescafe.com",
        openingHours: "Mon-Fri: 11:00 AM - 10:00 PM, Sat-Sun: 12:00 PM - 11:00 PM",
        priceRange: "$$",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Tagine House",
        description: "Traditional tagines and couscous in an immersive Moroccan setting.",
        cuisineType: "Moroccan",
        country: "Morocco",
        address: "45 Jemaa el-Fnaa",
        city: "Marrakesh",
        phoneNumber: "+212 524 555 7890",
        website: "https://immysafricancuisine.com",
        openingHours: "Daily: 12:00 PM - 11:00 PM",
        priceRange: "$$$",
        imageUrl: "/images/cuisines/tagine-house.png",
      },
      {
        name: "Lagos Kitchen",
        description: "Famous for jollof rice, pounded yam, and egusi soup with live music.",
        cuisineType: "Nigerian",
        country: "Nigeria",
        address: "78 Balogun Street",
        city: "Lagos",
        phoneNumber: "+234 80 277 8901",
        website: "www.lagoskitchen.com",
        openingHours: "Mon-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 8:00 PM",
        priceRange: "$$",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Accra Flavors",
        description: "Authentic Ghanaian cuisine featuring banku, waakye, and red-red beans.",
        cuisineType: "Ghanaian",
        country: "Ghana",
        address: "25 Liberation Road",
        city: "Accra",
        phoneNumber: "+233 24 455 6789",
        website: "www.accraflavors.com",
        openingHours: "Daily: 10:00 AM - 9:00 PM",
        priceRange: "$$",
        imageUrl: "https://images.unsplash.com/photo-1583588354531-9c0fd9fef6e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ];
    
    sampleRestaurants.forEach(restaurant => {
      this.createRestaurant({
        ...restaurant,
      });
    });

    // Sample menu items
    const sampleMenuItems: InsertMenuItem[] = [
      {
        restaurantId: 1,
        name: "Doro Wat",
        description: "Spicy chicken stew with berbere spice blend",
        price: 18.99,
        imageUrl: "https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 1,
        name: "Injera Platter",
        description: "Sourdough flatbread with 6 different stews",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 1,
        name: "Kitfo",
        description: "Minced beef seasoned with mitmita and niter kibbeh",
        price: 16.99,
        imageUrl: "https://images.unsplash.com/photo-1606755957235-41eb44ce5ff6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 2,
        name: "Lamb Tagine",
        description: "Slow-cooked lamb with apricots, prunes and aromatic spices",
        price: 22.99,
        imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 3,
        name: "Waakye",
        description: "Traditional Ghanaian dish of rice and beans cooked with millet leaves, served with various accompaniments",
        price: 13.99,
        imageUrl: "/assets/waakye-ghana.png",
        featured: true,
      },
      {
        restaurantId: 3,
        name: "Jollof Rice",
        description: "Nigerian-style fragrant rice cooked in a rich tomato and pepper sauce",
        price: 15.99,
        imageUrl: "/assets/jollof-rice.png",
        featured: true,
      },
      {
        restaurantId: 3,
        name: "Red-Red",
        description: "Black-eyed bean stew cooked with palm oil, served with fried plantains",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1591241900019-33dc10b3f5e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 4,
        name: "Jollof Rice",
        description: "Ghanaian-style aromatic rice cooked with tomatoes, peppers and spices",
        price: 14.99,
        imageUrl: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 4,
        name: "Egusi Soup",
        description: "Melon seed-based soup with leafy vegetables and choice of protein",
        price: 16.99,
        imageUrl: "https://images.unsplash.com/photo-1548352318-4ff2a7a233fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
      {
        restaurantId: 4,
        name: "Pounded Yam with Afang Soup",
        description: "Smooth pounded yam served with traditional Afang leaf soup",
        price: 17.99,
        imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        featured: true,
      },
    ];
    
    sampleMenuItems.forEach(menuItem => {
      this.createMenuItem(menuItem);
    });

    // Sample cultural insights
    const sampleInsights: InsertCulturalInsight[] = [
      {
        title: "The Art of Injera Making",
        content: "Discover the ancient fermentation techniques behind Ethiopia's famous sourdough flatbread and its cultural significance.",
        cuisineType: "Ethiopian",
        region: "East Africa",
        imageUrl: "/assets/injera-making.png",
      },
      {
        title: "The Jollof Rice Debate",
        content: "Explore the friendly rivalry between Ghana, Nigeria, and Senegal over who makes the best version of this beloved rice dish.",
        cuisineType: "West African",
        region: "West Africa",
        imageUrl: "/assets/jollof-rice.png",
      },
      {
        title: "Spices of Morocco",
        content: "Learn about the essential spice blends that give Moroccan cuisine its distinctive flavors and aromas.",
        cuisineType: "North African",
        region: "North Africa",
        imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ];
    
    sampleInsights.forEach(insight => {
      this.createCulturalInsight(insight);
    });

    // Sample food origin stories
    const sampleFoodOriginStories: InsertFoodOriginStory[] = [
      {
        dishName: "Jollof Rice",
        cuisineType: "Nigerian",
        country: "Nigeria",
        storyContent: "Jollof rice, one of West Africa's most famous dishes, is believed to have originated from the Senegambia region of West Africa, among the Wolof people. This aromatic red rice dish has become a staple across the region, especially in Nigeria, Ghana, and Senegal, with each country claiming to make the most authentic version. The dish emerged from traditional one-pot cooking methods, where rice was cooked with tomatoes, peppers, and various spices. As trade routes expanded in the 14th century, the popularity of Jollof rice spread throughout West Africa, and each region added their own unique twist to the recipe. Today, the 'Jollof Wars' – friendly rivalries between countries about whose version is superior – have become a cultural phenomenon, celebrating the shared heritage and diverse interpretations of this iconic dish.",
        historicalPeriod: "14th century",
        culturalSignificance: "Jollof rice is more than just food; it's a symbol of cultural identity and pride. It is present at virtually every celebration and gathering, from weddings to funerals, and serves as a binding element across diverse West African cultures. The vibrancy of its red-orange color symbolizes joy and festivity, which aligns with its role in celebrations.",
        ingredients: "Rice, tomatoes, tomato paste, onions, red bell peppers, scotch bonnet peppers, vegetable oil, seasonings (including curry powder, thyme, bay leaves, ginger), meat or vegetable stock",
        imageUrl: "/assets/jollof-rice.png"
      },
      {
        dishName: "Waakye",
        cuisineType: "Ghanaian",
        country: "Ghana",
        storyContent: "Waakye (pronounced 'waa-chay') is a beloved Ghanaian dish with roots tracing back several centuries. It originated in northern Ghana among the Hausa people before spreading throughout the country. The dish consists of rice and beans cooked together with dried millet leaves or sorghum leaves, which give it its distinctive reddish-brown color. The name 'waakye' comes from the Hausa word for beans. As trade routes connected different regions of Ghana, waakye made its way to urban centers like Accra, where it became a popular street food. Street vendors would prepare large batches early in the morning, serving it throughout the day to workers, students, and families. Today, waakye stands can be found on nearly every street corner in Ghana's major cities, recognizable by their large aluminum pots wrapped in distinctive cloth to maintain the temperature.",
        historicalPeriod: "17th century",
        culturalSignificance: "Waakye transcends socioeconomic boundaries in Ghana, eaten by everyone from laborers to business executives. It symbolizes the resourcefulness of Ghanaian cuisine, creating a nutritionally complete meal from simple ingredients. Waakye is also emblematic of Ghanaian identity and community - the shared experience of buying waakye from local vendors creates neighborhood connections. In Ghanaian diaspora communities worldwide, preparing waakye is a way to maintain cultural ties and pass down traditions to younger generations.",
        ingredients: "Rice, beans (usually black-eyed peas or cowpeas), dried millet leaves or sorghum leaves (waakye leaves), baking soda, salt, water. Served with toppings: spaghetti, gari (cassava flakes), fried plantains, boiled eggs, meat or fish, shito (hot pepper sauce), and stew",
        imageUrl: "/assets/waakye-ghana.png"
      },
      {
        dishName: "Doro Wat",
        cuisineType: "Ethiopian",
        country: "Ethiopia",
        storyContent: "Doro Wat, often considered Ethiopia's national dish, has a rich history dating back centuries in Ethiopian royal kitchens. This spicy chicken stew is deeply embedded in Ethiopian cultural traditions and is one of the centerpieces of Ethiopian cuisine. The preparation of Doro Wat has been passed down through generations, with families having their own closely guarded recipes. Historically, it was prepared for special occasions and royal feasts, showcasing its significance in Ethiopian culinary heritage. The complex blend of spices in berbere, which gives Doro Wat its distinctive flavor, reflects Ethiopia's position along ancient spice trade routes and its unique culinary evolution isolated in the highlands of East Africa.",
        historicalPeriod: "13th century",
        culturalSignificance: "Doro Wat plays a central role in Ethiopian communal dining traditions, where it is served on injera (sourdough flatbread) and shared from a common plate, symbolizing unity and community. It is an essential dish during religious celebrations, particularly during fasting periods in the Ethiopian Orthodox Church, where it marks the breaking of fasts. The meticulous preparation process reflects Ethiopian values of patience, attention to detail, and the importance of communal meals in strengthening social bonds.",
        ingredients: "Chicken, onions, berbere spice blend, niter kibbeh (spiced clarified butter), garlic, ginger, hard-boiled eggs",
        imageUrl: "https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      {
        dishName: "Tagine",
        cuisineType: "Moroccan",
        country: "Morocco",
        storyContent: "The Moroccan tagine, both a dish and the conical earthenware pot it's cooked in, has a history spanning over a thousand years. The unique design of the tagine pot – with its wide base and conical top – developed as a practical solution for cooking in the arid regions of North Africa, where water and fuel were scarce. The conical shape allows steam to condense and return to the base, creating a self-basting cooking environment that requires minimal water and fuel. The earliest written records of tagine cooking date back to the 9th century in 'The Thousand and One Nights,' though the cooking technique is believed to be much older. This slow-cooking method was embraced by Berber nomads who could easily transport the tagine pot and cook hearty, flavorful meals with limited resources in the harsh desert environment.",
        historicalPeriod: "9th century",
        culturalSignificance: "The tagine represents Moroccan hospitality and the art of gathering people around food. In Moroccan culture, preparing a tagine is a labor of love and an expression of care for family and guests. The communal nature of eating from the tagine pot symbolizes unity and sharing. Additionally, the tagine showcases Morocco's position at the crossroads of trade routes, with its blend of sweet and savory flavors incorporating influences from Arab, Mediterranean, Berber, and Sub-Saharan African culinary traditions. The diverse varieties of tagine also reflect regional identities within Morocco, with coastal areas featuring seafood tagines, while inland regions favor meat variations.",
        ingredients: "Meat (lamb, chicken, or beef), dried fruits (apricots, prunes, dates), honey, nuts, vegetables (carrots, potatoes, zucchini), olive oil, aromatic spices (cinnamon, saffron, cumin, ginger, turmeric)",
        imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      }
    ];

    sampleFoodOriginStories.forEach(story => {
      this.createFoodOriginStory(story);
    });
    
    // Sample reviews
    const sampleReviews: InsertReview[] = [
      {
        userId: 1,
        restaurantId: 1,
        rating: 4.5,
        comment: "Incredible injera with amazing wat selection. The Doro Wat was particularly flavorful!"
      },
      {
        userId: 1,
        restaurantId: 3,
        rating: 5,
        comment: "The jollof rice was perfectly spiced and the plantains were deliciously sweet. Can't wait to return!"
      }
    ];
    
    sampleReviews.forEach(review => {
      this.createReview(review);
    });
    
    // Sample reservations
    const sampleReservations: InsertReservation[] = [
      {
        userId: 1,
        restaurantId: 2,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
        partySize: 2,
        status: "confirmed",
        specialRequests: "Window table if possible"
      },
      {
        userId: 1,
        restaurantId: 4,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        partySize: 4,
        status: "completed",
        specialRequests: ""
      },
      {
        userId: 1,
        restaurantId: 1,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        partySize: 2,
        status: "cancelled",
        specialRequests: "Vegetarian options needed"
      }
    ];
    
    sampleReservations.forEach(reservation => {
      this.createReservation(reservation);
    });
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
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      phoneNumber: insertUser.phoneNumber || null,
      isGuest: insertUser.isGuest || false
    };
    this.users.set(id, user);
    return user;
  }

  // Restaurant methods
  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values())
      .filter((restaurant) => restaurant.cuisineType === cuisineType);
  }

  async getRestaurantsByCity(city: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values())
      .filter((restaurant) => restaurant.city.toLowerCase().includes(city.toLowerCase()));
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant: Restaurant = { 
      ...insertRestaurant, 
      id, 
      rating: 0, 
      reviewCount: 0,
      phoneNumber: insertRestaurant.phoneNumber || null,
      website: insertRestaurant.website || null
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurantRating(id: number, rating: number, reviewCount: number): Promise<Restaurant | undefined> {
    const restaurant = await this.getRestaurantById(id);
    if (!restaurant) return undefined;

    const updatedRestaurant: Restaurant = {
      ...restaurant,
      rating,
      reviewCount,
    };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  // Menu item methods
  async getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter((menuItem) => menuItem.restaurantId === restaurantId);
  }

  async getFeaturedMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter((menuItem) => menuItem.restaurantId === restaurantId && menuItem.featured);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const menuItem: MenuItem = { 
      ...insertMenuItem, 
      id,
      imageUrl: insertMenuItem.imageUrl || null,
      featured: insertMenuItem.featured || null
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  // Review methods
  async getReviewsByRestaurantId(restaurantId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.restaurantId === restaurantId);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.userId === userId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const createdAt = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt,
      comment: insertReview.comment || null 
    };
    this.reviews.set(id, review);

    // Update restaurant rating
    const restaurantId = review.restaurantId;
    const restaurantReviews = await this.getReviewsByRestaurantId(restaurantId);
    const totalRating = restaurantReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / restaurantReviews.length;
    
    await this.updateRestaurantRating(restaurantId, Number(avgRating.toFixed(1)), restaurantReviews.length);

    return review;
  }

  // Reservation methods
  async getReservationsByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values())
      .filter((reservation) => reservation.restaurantId === restaurantId);
  }

  async getReservationsByUserId(userId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values())
      .filter((reservation) => reservation.userId === userId);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const createdAt = new Date();
    const reservation: Reservation = { 
      ...insertReservation, 
      id, 
      createdAt,
      status: insertReservation.status || "pending",
      specialRequests: insertReservation.specialRequests || null
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;

    const updatedReservation: Reservation = {
      ...reservation,
      status,
    };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  // Cultural Insight methods
  async getCulturalInsights(): Promise<CulturalInsight[]> {
    return Array.from(this.culturalInsights.values());
  }

  async getCulturalInsightById(id: number): Promise<CulturalInsight | undefined> {
    return this.culturalInsights.get(id);
  }

  async getCulturalInsightsByCuisine(cuisineType: string): Promise<CulturalInsight[]> {
    return Array.from(this.culturalInsights.values())
      .filter((insight) => insight.cuisineType === cuisineType);
  }

  async createCulturalInsight(insertInsight: InsertCulturalInsight): Promise<CulturalInsight> {
    const id = this.currentInsightId++;
    const insight: CulturalInsight = { ...insertInsight, id };
    this.culturalInsights.set(id, insight);
    return insight;
  }

  // Food Origin Story methods
  async getFoodOriginStories(): Promise<FoodOriginStory[]> {
    return Array.from(this.foodOriginStories.values());
  }

  async getFoodOriginStoryById(id: number): Promise<FoodOriginStory | undefined> {
    return this.foodOriginStories.get(id);
  }

  async getFoodOriginStoriesByDishName(dishName: string): Promise<FoodOriginStory[]> {
    return Array.from(this.foodOriginStories.values())
      .filter(story => story.dishName.toLowerCase().includes(dishName.toLowerCase()));
  }

  async getFoodOriginStoriesByCuisine(cuisineType: string): Promise<FoodOriginStory[]> {
    return Array.from(this.foodOriginStories.values())
      .filter(story => story.cuisineType === cuisineType);
  }

  async createFoodOriginStory(insertStory: InsertFoodOriginStory): Promise<FoodOriginStory> {
    const id = this.currentFoodOriginStoryId++;
    const story: FoodOriginStory = { 
      ...insertStory, 
      id,
      imageUrl: insertStory.imageUrl || null,
      historicalPeriod: insertStory.historicalPeriod || null,
      culturalSignificance: insertStory.culturalSignificance || null,
      ingredients: insertStory.ingredients || null
    };
    this.foodOriginStories.set(id, story);
    return story;
  }
}

export const storage = new MemStorage();
