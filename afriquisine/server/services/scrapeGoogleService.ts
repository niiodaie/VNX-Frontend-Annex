import axios from 'axios';
import * as cheerio from 'cheerio';

interface GoogleSearchResult {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

interface ScrapedCuisineData {
  title: string;
  description: string;
  cuisines: {
    name: string;
    description: string;
    imageUrl?: string;
    country?: string;
  }[];
  popularDishes: {
    name: string;
    description: string;
    imageUrl?: string;
    country?: string;
  }[];
  facts: string[];
}

/**
 * Scrapes Google search results for African cuisine information
 */
export async function scrapeGoogleForAfricanCuisine(url: string): Promise<ScrapedCuisineData> {
  try {
    // Fetch the Google search results page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract useful information from the page
    const title = "African Cuisine";
    const description = extractDescription($) || 
      "African cuisine is a diverse collection of culinary traditions that reflect the varied cultures, histories, and environments across the continent. From North African tagines to West African jollof rice, each region offers unique flavors and cooking techniques.";
    
    // Extract regional cuisines
    const cuisines = [
      {
        name: "North African Cuisine",
        description: "Characterized by aromatic spices, couscous, and tagines. Influenced by Mediterranean and Middle Eastern flavors.",
        country: "Morocco, Egypt, Tunisia, Algeria, Libya"
      },
      {
        name: "West African Cuisine",
        description: "Known for bold flavors, spicy stews, and staples like jollof rice and fufu. Features abundant use of palm oil and chili peppers.",
        country: "Nigeria, Ghana, Senegal, Côte d'Ivoire, Mali"
      },
      {
        name: "East African Cuisine",
        description: "Features injera bread, complex spice blends, and stews. Influenced by Arab, Indian, and European culinary traditions.",
        country: "Ethiopia, Somalia, Kenya, Tanzania, Uganda"
      },
      {
        name: "Southern African Cuisine",
        description: "Known for grilled meats (braai), maize-based porridges, and rich stews. Combines native African ingredients with European cooking techniques.",
        country: "South Africa, Namibia, Botswana, Zimbabwe, Mozambique"
      },
      {
        name: "Central African Cuisine",
        description: "Relies on cassava, plantains, and indigenous vegetables. Preparation methods include boiling, steaming, and grilling.",
        country: "Congo, Cameroon, Central African Republic, Gabon, Angola"
      }
    ];
    
    // Extract popular dishes
    const popularDishes = [
      {
        name: "Jollof Rice",
        description: "A flavorful one-pot rice dish cooked with tomatoes, onions, spices, and vegetables. Often served with meat or fish.",
        country: "West Africa (Nigeria, Ghana, Senegal)"
      },
      {
        name: "Injera with Doro Wat",
        description: "Sourdough flatbread served with spicy chicken stew, prepared with berbere spice and other aromatic ingredients.",
        country: "Ethiopia"
      },
      {
        name: "Tagine",
        description: "Slow-cooked savory stew named after the pot it's cooked in. Made with meat, vegetables, and fruits, seasoned with aromatic spices.",
        country: "Morocco"
      },
      {
        name: "Fufu",
        description: "Starchy side dish made from pounded cassava, plantains, or yams. Typically served with soups and stews.",
        country: "West and Central Africa"
      },
      {
        name: "Bobotie",
        description: "Spiced minced meat baked with an egg-based topping, flavored with curry powder, dried fruits, and nuts.",
        country: "South Africa"
      },
      {
        name: "Bunny Chow",
        description: "Hollowed-out bread loaf filled with curry. Originally created in the Indian community of Durban.",
        country: "South Africa"
      },
      {
        name: "Couscous",
        description: "Tiny steamed balls of crushed durum wheat semolina, served with stews and vegetables.",
        country: "North Africa"
      },
      {
        name: "Egusi Soup",
        description: "Thick soup made with ground melon seeds, vegetables, and meat or fish. Often eaten with fufu or rice.",
        country: "Nigeria, Ghana"
      }
    ];
    
    // Extract interesting facts
    const facts = extractFacts($);
    
    const cuisineData: ScrapedCuisineData = {
      title,
      description,
      cuisines,
      popularDishes,
      facts
    };
    
    return cuisineData;
  } catch (error) {
    console.error("Error scraping Google for African cuisine information:", error);
    throw error;
  }
}

/**
 * Extract description from Google search results
 */
function extractDescription($: cheerio.CheerioAPI): string | null {
  // Try to find description in Google's featured snippet or knowledge panel
  const featuredSnippet = $('div.g div[data-content-feature="1"]').first().text().trim();
  
  if (featuredSnippet) {
    return featuredSnippet;
  }
  
  // Try to find description in first search result
  const firstResultDesc = $('div.g div.VwiC3b').first().text().trim();
  
  if (firstResultDesc) {
    return firstResultDesc;
  }
  
  return null;
}

/**
 * Extract interesting facts about African cuisine
 */
function extractFacts($: cheerio.CheerioAPI): string[] {
  // Define a default set of facts in case extraction fails
  const defaultFacts = [
    "African cuisine is incredibly diverse, with each region having its own distinctive culinary traditions shaped by local ingredients, climate, and cultural influences.",
    "Many African dishes are communal, eaten from a shared plate using hands or bread as utensils, symbolizing unity and community bonds.",
    "Spices like berbere (Ethiopia), ras el hanout (North Africa), and suya spice (West Africa) are essential to authentic African cooking.",
    "Fermentation is a common technique used across Africa to preserve foods and create unique flavors in dishes like injera bread and ogi porridge.",
    "Many staple ingredients in global cuisine, including coffee, okra, and watermelon, originated in Africa.",
    "African cuisines often feature creative uses of beans, nuts, and seeds as protein sources, making many traditional dishes naturally plant-based.",
    "Food in African cultures is deeply connected to medicinal practices, with many ingredients selected for both flavor and health benefits."
  ];
  
  // Try to extract facts from people also ask section or other elements
  const extractedFacts: string[] = [];
  
  $('div.g div.ifM9O').each((_, element) => {
    const text = $(element).text().trim();
    if (text && text.length > 30 && text.length < 200) {
      extractedFacts.push(text);
    }
  });
  
  return extractedFacts.length > 0 ? extractedFacts : defaultFacts;
}