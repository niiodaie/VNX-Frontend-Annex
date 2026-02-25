import OpenAI from 'openai';

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. Food pairing suggestions will use fallback data.');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Food Pairing Service
 * Provides AI-powered recommendations for food pairings with African dishes
 */
export interface FoodPairing {
  dish: string;
  pairings: {
    name: string;
    description: string;
    compatibilityScore: number; // 1-100
    type: 'drink' | 'side' | 'dessert' | 'appetizer';
  }[];
  reasoning: string;
}

/**
 * Fallback pairing data when OpenAI is not available
 */
const fallbackPairings: Record<string, FoodPairing> = {
  'Jollof Rice': {
    dish: 'Jollof Rice',
    pairings: [
      {
        name: 'Chapman Cocktail',
        description: 'A popular Nigerian non-alcoholic mixed fruit drink',
        compatibilityScore: 92,
        type: 'drink'
      },
      {
        name: 'Plantain Chips',
        description: 'Crispy fried plantain slices, perfect for contrasting the rice',
        compatibilityScore: 88,
        type: 'side'
      },
      {
        name: 'Suya',
        description: 'Spicy grilled meat skewers that complement the rice',
        compatibilityScore: 94,
        type: 'side'
      }
    ],
    reasoning: 'Jollof Rice has a savory, spicy profile that pairs well with cooling drinks and complementary sides that add texture contrast.'
  },
  'Injera': {
    dish: 'Injera',
    pairings: [
      {
        name: 'Tej',
        description: 'Ethiopian honey wine that balances the tangy injera',
        compatibilityScore: 91,
        type: 'drink'
      },
      {
        name: 'Doro Wat',
        description: 'Spicy Ethiopian chicken stew traditionally served with injera',
        compatibilityScore: 97,
        type: 'side'
      },
      {
        name: 'Azifa',
        description: 'Lentil salad that adds freshness to the meal',
        compatibilityScore: 85,
        type: 'side'
      }
    ],
    reasoning: 'Injera has a slightly sour taste that pairs beautifully with rich, spicy stews and is traditionally complemented by honey wine.'
  }
};

/**
 * Get AI-powered food pairing suggestions for a specific dish
 * @param dish The name of the dish to get pairings for
 * @param cuisine The cuisine type (optional, for more context)
 * @param dietaryRestrictions Any dietary restrictions to consider
 */
export async function getFoodPairingSuggestions(
  dish: string,
  cuisine?: string,
  dietaryRestrictions?: string[]
): Promise<FoodPairing> {
  // If dish has fallback data and no API key, return the fallback
  if (fallbackPairings[dish] && !process.env.OPENAI_API_KEY) {
    return fallbackPairings[dish];
  }

  try {
    // Format any dietary restrictions for the prompt
    const dietaryContext = dietaryRestrictions?.length 
      ? `Consider these dietary restrictions: ${dietaryRestrictions.join(', ')}.` 
      : '';

    // Craft the prompt for OpenAI
    const prompt = `Generate food pairing suggestions for "${dish}"${cuisine ? ` (${cuisine} cuisine)` : ''}.
    ${dietaryContext}
    
    Please recommend 3-4 items that would pair well with this dish, including drinks and sides.
    
    For each pairing, provide:
    1. The name
    2. A brief description
    3. A compatibility score (1-100)
    4. The type (drink, side, dessert, or appetizer)
    
    Also include a brief reasoning for these pairings.
    
    Respond with JSON in this format:
    {
      "dish": "dish name",
      "pairings": [
        {
          "name": "pairing name",
          "description": "brief description",
          "compatibilityScore": score number,
          "type": "drink|side|dessert|appetizer"
        }
      ],
      "reasoning": "brief explanation of why these pairings work well"
    }`;

    // Call OpenAI API
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a culinary expert specialized in African cuisines and food pairings." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const pairingData = JSON.parse(content) as FoodPairing;
    return pairingData;
  } catch (error) {
    console.error("Error getting food pairing suggestions:", error);
    
    // Return fallback data if available, otherwise create basic fallback
    if (fallbackPairings[dish]) {
      return fallbackPairings[dish];
    }
    
    return {
      dish,
      pairings: [
        {
          name: 'Water',
          description: 'Clean, refreshing water pairs with any dish',
          compatibilityScore: 70,
          type: 'drink'
        },
        {
          name: 'Fresh Salad',
          description: 'A light side dish that complements most meals',
          compatibilityScore: 75,
          type: 'side'
        }
      ],
      reasoning: 'These are general pairings that work with most dishes.'
    };
  }
}