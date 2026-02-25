import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the audio directory for storing generated TTS files
const AUDIO_DIR = path.join(__dirname, "..", "client", "public", "audio");

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Configure voice mappings for each mentor
const mentorVoices: Record<string, string> = {
  "Kendrick AI": "onyx", // Deeper, more serious tone
  "Drake AI": "echo", // Smooth, melodic voice
  "SZA AI": "shimmer", // Feminine voice with range
  "J. Cole AI": "fable" // Versatile, story-telling voice
};

// Default to 'nova' if mentor not found in mapping
const getVoiceForMentor = (mentorName: string): string => {
  return mentorVoices[mentorName] || "nova";
};

// Function to get a response from the mentor based on the user's message
export async function getMentorResponse(
  mentor: { name: string, inspiredBy: string },
  userMessage: string
): Promise<string> {
  const mentorName = mentor.name;
  const mentorStyle = mentor.inspiredBy;
  try {
    const systemPrompt = `You are ${mentorName}, a music mentor with the style and sensibilities of ${mentorStyle}. 
    Respond to the user's musical queries, lyrics, or compositions with insightful feedback.
    Use the distinctive voice, vocabulary, and perspective that ${mentorStyle} would use.
    Be encouraging but also provide specific constructive criticism to help the user improve.
    Keep your responses relatively concise (under 250 words).`;

    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm thinking about your music...";
  } catch (error) {
    console.error("Error getting mentor response:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}

// Type for music analysis result
interface MusicAnalysisResult {
  strengths: string[];
  improvements: string[];
  overallRating: number;
  analysis: string;
}

// Function to analyze musical composition or lyrics
export async function analyzeMusic(
  lyrics: string, 
  title: string = "Untitled",
  mentorName: string = "Mentor"
): Promise<MusicAnalysisResult> {
  try {
    const analysisPrompt = `Analyze the following lyrics for a song titled "${title}":\n\n${lyrics}\n\nProvide an analysis in JSON format with these fields:
    - strengths: Array of 3-5 specific strengths
    - improvements: Array of 3-5 specific areas for improvement
    - overallRating: A number from 1-10 rating the lyrics
    - analysis: A paragraph summarizing your thoughts as if you were ${mentorName}`;

    const analysisResponse = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert music critic and mentor with decades of experience in the music industry."
        },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const responseText = analysisResponse.choices[0].message.content || "{}";
    const parsedResult = JSON.parse(responseText) as Partial<MusicAnalysisResult>;
    
    return {
      strengths: parsedResult.strengths || [],
      improvements: parsedResult.improvements || [],
      overallRating: parsedResult.overallRating || 5,
      analysis: parsedResult.analysis || "Analysis unavailable."
    };
  } catch (error) {
    console.error("Error analyzing music:", error);
    return {
      strengths: ["Unable to analyze strengths"],
      improvements: ["Unable to analyze improvements"],
      overallRating: 5,
      analysis: "Analysis failed. Please try again later."
    };
  }
}

// Type for music idea generation result
interface MusicIdeaResult {
  concept: string;
  lyricalHooks: string[];
  melodyDescription: string;
  structureIdea: string;
}

// Function to generate speech from text using OpenAI TTS
export async function generateSpeech(
  text: string,
  mentorName: string
): Promise<string> {
  try {
    // Create a hash of the text to use as a unique filename
    const hash = createHash('md5').update(text).digest('hex');
    const voice = getVoiceForMentor(mentorName);
    const filename = `${voice}-${hash.substring(0, 10)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    
    // Check if we already have this audio file cached
    if (fs.existsSync(filePath)) {
      return `/audio/${filename}`;
    }

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Using the base TTS model
      voice: voice,
      input: text,
      speed: 1.0,
    });

    // Convert the response to buffer and save to file
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    // Return the public URL to the audio file
    return `/audio/${filename}`;
  } catch (error) {
    console.error("Error generating speech:", error);
    return ""; // Return empty string if speech generation fails
  }
}

// Function to generate creative music ideas or inspiration
export async function generateMusicIdea(
  genre: string, 
  mood: string,
  theme: string
): Promise<MusicIdeaResult> {
  try {
    const ideaPrompt = `Generate a creative music idea for a ${genre} song about ${theme} with a ${mood} mood.
    Provide the response in JSON format with these fields:
    - concept: A creative concept for the song
    - lyricalHooks: Array of 3-5 potential lyrical hooks or lines
    - melodyDescription: A description of a potential melody
    - structureIdea: An idea for the song structure`;

    const ideaResponse = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a creative music producer and songwriter with expertise in multiple genres." 
        },
        { role: "user", content: ideaPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const responseText = ideaResponse.choices[0].message.content || "{}";
    const parsedResult = JSON.parse(responseText) as Partial<MusicIdeaResult>;
    
    return {
      concept: parsedResult.concept || "Concept unavailable",
      lyricalHooks: parsedResult.lyricalHooks || [],
      melodyDescription: parsedResult.melodyDescription || "Melody description unavailable",
      structureIdea: parsedResult.structureIdea || "Structure idea unavailable"
    };
  } catch (error) {
    console.error("Error generating music idea:", error);
    return {
      concept: "Idea generation failed",
      lyricalHooks: ["Unable to generate hooks"],
      melodyDescription: "Melody description unavailable",
      structureIdea: "Structure idea unavailable"
    };
  }
}