import OpenAI from "openai";
import { ChatResponse, MentorFeedbackResponse } from "../../shared/schema";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a mentor response based on chat history and mentor characteristics
 */
export async function generateMentorResponse(
  userMessage: string,
  chatHistory: { isUser: boolean; content: string }[],
  mentorInfo: {
    name: string;
    traits: Record<string, any>;
    description: string;
  }
): Promise<ChatResponse> {
  try {
    const mentorTraits = mentorInfo.traits;
    const mentorCharacter = `
      You are ${mentorInfo.name}, a music artist with the following characteristics:
      - Style: ${mentorTraits.style}
      - Influences: ${mentorTraits.influences.join(', ')}
      - Strengths: ${mentorTraits.strengths.join(', ')}
      - Signature: ${mentorTraits.signature}
      - Description: ${mentorInfo.description}
      
      As a mentor on DarkNotes, you help aspiring musicians develop their style and skills.
      Your responses should reflect your unique voice, perspective, and experience.
      Be encouraging but honest, providing specific and actionable advice.
      Use terminology and references relevant to your musical style and background.
      Keep your responses concise (maximum 200 words) but impactful.
    `;

    // Convert chat history to OpenAI message format
    const historyMessages = chatHistory.map(msg => ({
      role: msg.isUser ? "user" as const : "assistant" as const,
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system" as const, content: mentorCharacter },
        ...historyMessages,
        { role: "user" as const, content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      message: response.choices[0].message.content || "I'm not sure how to respond to that.",
      mentorId: 0, // Will be set by the route handler
      sessionId: 0, // Will be set by the route handler
    };
  } catch (error) {
    console.error("Error generating mentor response:", error);
    throw new Error("Failed to generate mentor response");
  }
}

/**
 * Provide feedback on musical content (lyrics, beats, etc.)
 */
export async function generateMentorFeedback(
  content: string,
  contentType: string,
  mentorInfo: {
    name: string;
    traits: Record<string, any>;
    description: string;
  }
): Promise<MentorFeedbackResponse> {
  try {
    const mentorTraits = mentorInfo.traits;
    const mentorCharacter = `
      You are ${mentorInfo.name}, a music artist with the following characteristics:
      - Style: ${mentorTraits.style}
      - Influences: ${mentorTraits.influences.join(', ')}
      - Strengths: ${mentorTraits.strengths.join(', ')}
      - Signature: ${mentorTraits.signature}
      - Description: ${mentorInfo.description}
      
      As a mentor on DarkNotes, you're reviewing a user's ${contentType}.
      Provide honest, constructive feedback that reflects your artistic style and expertise.
      Be specific about what works well and what could be improved.
      Your feedback should help the artist develop their unique sound while learning from your expertise.
    `;

    const prompt = `
      Review the following ${contentType}:

      ${content}

      Provide feedback that includes:
      1. Your overall impression
      2. Specific strengths you noticed
      3. Areas that could be improved
      4. Concrete suggestions for development
      5. A score from 1-10 representing the quality of the work
      
      Format your response as JSON with the following structure:
      {
        "feedback": "Your overall feedback as a paragraph",
        "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
        "score": 7
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system" as const, content: mentorCharacter },
        { role: "user" as const, content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content || "{}";
    const parsedResponse = JSON.parse(responseContent);
    
    return {
      feedback: parsedResponse.feedback || "No feedback provided.",
      suggestions: parsedResponse.suggestions || [],
      score: parsedResponse.score || 5,
      mentorId: 0, // Will be set by the route handler
    };
  } catch (error) {
    console.error("Error generating mentor feedback:", error);
    throw new Error("Failed to generate mentor feedback");
  }
}

/**
 * Generate a creative roadmap for an artist based on their goals and preferences
 */
export async function generateCreativeRoadmap(
  userInfo: {
    genres: string[];
    goal: string;
    experience: string;
    influences: string[];
  },
  mentorInfo: {
    name: string;
    traits: Record<string, any>;
  }
): Promise<any> {
  try {
    const mentorTraits = mentorInfo.traits;
    const mentorCharacter = `
      You are ${mentorInfo.name}, a music artist with the following characteristics:
      - Style: ${mentorTraits.style}
      - Influences: ${mentorTraits.influences.join(', ')}
      - Strengths: ${mentorTraits.strengths.join(', ')}
      - Signature: ${mentorTraits.signature}
      
      As a mentor on DarkNotes, you're creating a personalized creative roadmap for an aspiring artist.
      Tailor your guidance to their specific goals, genres, and level of experience.
    `;

    const prompt = `
      Create a personalized creative development roadmap for an artist with the following profile:
      - Genres: ${userInfo.genres.join(', ')}
      - Goal: ${userInfo.goal}
      - Experience level: ${userInfo.experience}
      - Influences: ${userInfo.influences.join(', ')}
      
      The roadmap should include:
      1. A 3-month creative journey with specific milestones
      2. Skill development recommendations
      3. Project ideas that build toward their goal
      4. Specific techniques to practice
      5. Resources and reference tracks to study
      
      Format your response as JSON with the following structure:
      {
        "title": "Your Roadmap Title",
        "overview": "Brief overview of the roadmap and its goals",
        "milestones": [
          {
            "title": "Milestone 1 Title",
            "description": "Description of what to achieve",
            "tasks": ["Task 1", "Task 2", "Task 3"],
            "timeframe": "2 weeks"
          },
          ...
        ],
        "skillFocus": ["Skill 1", "Skill 2", "Skill 3"],
        "projectIdeas": ["Project idea 1", "Project idea 2"],
        "resources": ["Resource 1", "Resource 2", "Resource 3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system" as const, content: mentorCharacter },
        { role: "user" as const, content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content || "{}";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating creative roadmap:", error);
    throw new Error("Failed to generate creative roadmap");
  }
}