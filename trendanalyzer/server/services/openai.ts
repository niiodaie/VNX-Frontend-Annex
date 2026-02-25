import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

// Enhanced trend summarization function
export async function summarizeTrend(trendTitle: string): Promise<string> {
  const prompt = `Explain why the term "${trendTitle}" is currently trending online. Provide a short, human-readable summary in 2-3 sentences that explains the context and significance.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content?.trim() || "No summary available.";
  } catch (error: any) {
    console.error('AI summary failed:', error.message);
    return "No summary available.";
  }
}

export interface TrendAnalysis {
  summary: string;
  prediction: "will_grow" | "will_stabilize" | "will_fade";
  contentOpportunities: string[];
  relatedTopics: string[];
}

export async function analyzeTrend(trendTitle: string, category: string, searchVolume: number): Promise<TrendAnalysis> {
  try {
    const prompt = `Analyze the search trend "${trendTitle}" in the ${category} category with ${searchVolume} searches. 

Please provide:
1. A concise summary (2-3 sentences) explaining why this is trending
2. A prediction if it will grow, stabilize, or fade
3. 3 content opportunities related to this trend
4. 3 related topics people might search for

Respond with JSON in this exact format: {
  "summary": "string",
  "prediction": "will_grow" | "will_stabilize" | "will_fade",
  "contentOpportunities": ["string", "string", "string"],
  "relatedTopics": ["string", "string", "string"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert trend analyst with deep knowledge of global search patterns, social media, and cultural movements. Provide accurate, insightful analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Analysis unavailable",
      prediction: result.prediction || "will_stabilize",
      contentOpportunities: result.contentOpportunities || [],
      relatedTopics: result.relatedTopics || [],
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    return {
      summary: "Unable to analyze trend at this time. Please try again later.",
      prediction: "will_stabilize",
      contentOpportunities: [],
      relatedTopics: [],
    };
  }
}

export async function generateInsights(trends: any[]): Promise<{
  predictions: Array<{ title: string; status: string; confidence: number }>;
  opportunities: Array<{ title: string; description: string; demand: string }>;
}> {
  try {
    const trendTitles = trends.map(t => t.title).join(", ");
    
    const prompt = `Based on these current trending topics: ${trendTitles}

Generate:
1. 4 trend predictions with confidence scores
2. 4 content opportunities with demand levels

Respond with JSON in this exact format: {
  "predictions": [
    {"title": "string", "status": "will_grow/will_stabilize/will_fade", "confidence": 0.8}
  ],
  "opportunities": [
    {"title": "string", "description": "string", "demand": "high/medium/low"}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI insights expert providing trend predictions and content opportunities."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      predictions: result.predictions || [],
      opportunities: result.opportunities || [],
    };
  } catch (error) {
    console.error("OpenAI insights generation failed:", error);
    return {
      predictions: [],
      opportunities: [],
    };
  }
}
