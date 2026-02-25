import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a pronunciation guide for culinary terms
 * @param terms List of culinary terms to get pronunciation for
 * @param language The language of the terms
 * @returns Pronunciation guide with phonetic spellings
 */
export async function generatePronunciationGuide(
  terms: string[],
  language: string = 'en'
): Promise<Array<{term: string, pronunciation: string}>> {
  try {
    // Check if the API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: `You are a linguistic expert specializing in culinary terms and food pronunciation. 
          For each culinary term provided, generate a simple phonetic pronunciation guide that's easy for 
          non-native speakers to understand. Use simple phonetic spelling rather than IPA symbols.`
        },
        {
          role: "user",
          content: `Generate pronunciation guides for these ${language} culinary terms: ${terms.join(", ")}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || '{"pronunciations": []}';
    const data = JSON.parse(content);
    
    // Return a standardized format regardless of how GPT structures the response
    if (Array.isArray(data.pronunciations)) {
      return data.pronunciations;
    } else if (typeof data.pronunciations === 'object') {
      return Object.entries(data.pronunciations).map(([term, pronunciation]) => ({
        term,
        pronunciation: pronunciation as string
      }));
    } else {
      // Fallback in case the structure doesn't match expectations
      return terms.map(term => ({
        term,
        pronunciation: "Pronunciation not available"
      }));
    }
  } catch (error: any) {
    console.error("Pronunciation guide error:", error);
    // Return terms with error message instead of throwing
    return terms.map(term => ({
      term,
      pronunciation: "Pronunciation not available"
    }));
  }
}

/**
 * Translate text to another language using OpenAI's API
 * @param text The text to translate
 * @param sourceLanguage The source language (or 'auto' for auto-detection)
 * @param targetLanguage The target language to translate to
 * @returns The translated text
 */
export async function translateText(
  text: string,
  sourceLanguage: string = 'auto',
  targetLanguage: string
): Promise<string> {
  try {
    // Check if the API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Create the prompt for translation
    const languagePrompt = sourceLanguage === 'auto' 
      ? `Translate the following text to ${targetLanguage}:`
      : `Translate the following text from ${sourceLanguage} to ${targetLanguage}:`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a master translator specializing in culinary translations. 
          Preserve cooking technique details, ingredient names, and cultural context.
          Keep the original formatting intact.`
        },
        {
          role: "user",
          content: `${languagePrompt}\n\n${text}`
        }
      ],
      temperature: 0.3, // Lower temperature for more accurate translations
    });

    return response.choices[0].message.content || "Translation failed";
  } catch (error: any) {
    console.error("Translation error:", error);
    throw new Error(`Failed to translate text: ${error.message || String(error)}`);
  }
}

/**
 * Get language options for the recipe translator
 * @returns An array of language options
 */
export function getLanguageOptions() {
  return [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "de", name: "German" },
    { code: "ko", name: "Korean" },
    { code: "it", name: "Italian" },
    { code: "nl", name: "Dutch" },
    { code: "sw", name: "Swahili" },
    { code: "am", name: "Amharic" },
    { code: "ha", name: "Hausa" },
    { code: "yo", name: "Yoruba" },
    { code: "ig", name: "Igbo" },
    { code: "sn", name: "Shona" },
    { code: "xh", name: "Xhosa" },
    { code: "zu", name: "Zulu" },
  ];
}