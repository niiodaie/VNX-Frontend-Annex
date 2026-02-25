import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateLandingPageImage() {
  try {
    console.log("Generating landing page image using DALL-E...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a dark, moody landing page image for a music application called 'DarkNotes'. The image should feature silhouettes of music artists with purple lighting effects against a black background, similar to 'The Voice' TV show aesthetic. Include subtle musical elements like sound waves or music notes. The image should convey 'Where your rawest thoughts become your realest sound'. Clean, modern look with a lo-fi meets futuristic AI vibe.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    console.log("Image generated successfully:", imageUrl);
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    // Save to client/src/assets directory
    const assetsDir = path.join(__dirname, "../client/src/assets");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    const imagePath = path.join(assetsDir, "landing-page-image.png");
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    
    console.log("Image saved to:", imagePath);
    return imagePath;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

// Export function
export { generateLandingPageImage };