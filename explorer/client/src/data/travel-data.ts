export interface NaturalWonder {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

export interface HistoricalLandmark {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface CulturalEvent {
  id: string;
  name: string;
  location: string;
  description: string;
  month: string;
  imageUrl: string;
  color: string;
}

export interface FoodMarket {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  tag: string;
  tagColor: string;
}

export const naturalWonders: NaturalWonder[] = [
  {
    id: "1",
    name: "Grand Canyon",
    location: "Arizona, USA",
    imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "2",
    name: "Northern Lights",
    location: "Iceland",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "3",
    name: "Maldives Beach",
    location: "Maldives",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "4",
    name: "Swiss Alps",
    location: "Switzerland",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  }
];

export const historicalLandmarks: HistoricalLandmark[] = [
  {
    id: "1",
    name: "Colosseum",
    location: "Rome, Italy",
    description: "Ancient Roman amphitheater and iconic symbol of Imperial Rome",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "2",
    name: "Pyramids of Giza",
    location: "Cairo, Egypt",
    description: "Ancient wonders and eternal monuments to pharaonic power",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "3",
    name: "Great Wall",
    location: "Beijing, China",
    description: "Magnificent fortification stretching across northern China",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "4",
    name: "Taj Mahal",
    location: "Agra, India",
    description: "Ivory-white marble mausoleum and symbol of eternal love",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "5",
    name: "Machu Picchu",
    location: "Cusco, Peru",
    description: "Ancient Incan citadel high in the Andes Mountains",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "6",
    name: "Stonehenge",
    location: "Wiltshire, England",
    description: "Prehistoric monument shrouded in mystery and ancient wisdom",
    imageUrl: "https://images.unsplash.com/photo-1599833975787-5764e30d2b9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  }
];

export const culturalEvents: CulturalEvent[] = [
  {
    id: "1",
    name: "Rio Carnival",
    location: "Rio de Janeiro, Brazil",
    description: "The world's biggest carnival with samba, music, and spectacular parades",
    month: "February",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    color: "bg-red-500"
  },
  {
    id: "2",
    name: "Cherry Blossom Festival",
    location: "Tokyo, Japan",
    description: "Celebrate the beauty of sakura season with traditional festivities",
    month: "April",
    imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    color: "bg-pink-500"
  },
  {
    id: "3",
    name: "Holi Festival",
    location: "India",
    description: "Festival of colors celebrating the arrival of spring",
    month: "March",
    imageUrl: "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    color: "bg-yellow-500"
  },
  {
    id: "4",
    name: "Oktoberfest",
    location: "Munich, Germany",
    description: "World's largest beer festival with Bavarian culture and tradition",
    month: "October",
    imageUrl: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    color: "bg-orange-500"
  }
];

export const foodMarkets: FoodMarket[] = [
  {
    id: "1",
    name: "Bangkok Night Market",
    location: "Bangkok, Thailand",
    description: "Street food paradise with authentic Thai flavors",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Street Food",
    tagColor: "bg-green-100 text-green-800"
  },
  {
    id: "2",
    name: "Borough Market",
    location: "London, England",
    description: "Historic market with artisanal foods and local producers",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Artisanal",
    tagColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "3",
    name: "Marrakech Souk",
    location: "Marrakech, Morocco",
    description: "Ancient spice market with exotic flavors and aromas",
    imageUrl: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Spices",
    tagColor: "bg-red-100 text-red-800"
  },
  {
    id: "4",
    name: "Tsukiji Market",
    location: "Tokyo, Japan",
    description: "World's largest fish market and sushi experience",
    imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Seafood",
    tagColor: "bg-purple-100 text-purple-800"
  },
  {
    id: "5",
    name: "Gelato di Roma",
    location: "Rome, Italy",
    description: "Authentic Italian gelato in the heart of Rome",
    imageUrl: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Desserts",
    tagColor: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "6",
    name: "Mercado Central",
    location: "Mexico City, Mexico",
    description: "Traditional Mexican cuisine and local specialties",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tag: "Traditional",
    tagColor: "bg-orange-100 text-orange-800"
  }
];
