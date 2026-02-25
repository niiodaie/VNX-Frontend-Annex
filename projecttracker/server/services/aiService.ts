import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  estimatedDuration: string;
}

export interface AIResponse {
  content: string;
  suggestions?: TaskSuggestion[];
}

export class AIService {
  async generateTaskSuggestions(projectDescription: string, existingTasks: string[]): Promise<TaskSuggestion[]> {
    try {
      const prompt = `
        Based on the project: "${projectDescription}"
        And existing tasks: ${existingTasks.join(", ")}
        
        Suggest 3-5 new tasks that would help complete this project.
        Respond with JSON in this format:
        {
          "suggestions": [
            {
              "title": "Task title",
              "description": "Detailed description",
              "priority": "low|medium|high",
              "estimatedDuration": "2 hours"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a project management expert. Generate practical, actionable task suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.suggestions || [];
    } catch (error) {
      console.error("Error generating task suggestions:", error);
      throw new Error("Failed to generate task suggestions");
    }
  }

  async processPrompt(prompt: string, context?: string): Promise<AIResponse> {
    try {
      const systemMessage = context 
        ? `You are an AI assistant helping with project management. Context: ${context}`
        : "You are an AI assistant helping with project management and productivity.";

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const content = response.choices[0].message.content || "";
      
      // Check if the response might contain actionable items
      const containsActionableItems = content.toLowerCase().includes("task") || 
                                    content.toLowerCase().includes("step") ||
                                    content.toLowerCase().includes("action");

      let suggestions: TaskSuggestion[] = [];
      
      if (containsActionableItems) {
        try {
          const suggestionPrompt = `
            Based on this AI response: "${content}"
            Extract actionable tasks/steps and format them as JSON:
            {
              "suggestions": [
                {
                  "title": "Task title",
                  "description": "Description",
                  "priority": "low|medium|high",
                  "estimatedDuration": "time estimate"
                }
              ]
            }
          `;

          const suggestionResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "Extract actionable tasks from the given content. If no clear tasks exist, return empty suggestions array."
              },
              {
                role: "user",
                content: suggestionPrompt
              }
            ],
            response_format: { type: "json_object" }
          });

          const suggestionResult = JSON.parse(suggestionResponse.choices[0].message.content || "{}");
          suggestions = suggestionResult.suggestions || [];
        } catch (error) {
          console.warn("Could not extract task suggestions:", error);
        }
      }

      return { content, suggestions };
    } catch (error) {
      console.error("Error processing AI prompt:", error);
      throw new Error("Failed to process AI prompt");
    }
  }

  async generateProjectPlan(description: string): Promise<any> {
    try {
      const prompt = `
        Based on this project description: "${description}"
        
        Generate a comprehensive project plan with the following structure:
        {
          "title": "Project title (concise)",
          "estimatedDuration": "Duration estimate (e.g., '4-6 weeks')",
          "milestones": [
            {
              "title": "Milestone name",
              "description": "Milestone description",
              "tasks": [
                {
                  "title": "Task name"
                }
              ]
            }
          ]
        }
        
        Guidelines:
        - Create 3-6 logical milestones that break down the project
        - Each milestone should have 3-8 specific, actionable tasks
        - Milestones should follow a logical progression
        - Tasks should be specific and measurable
        - Consider typical project phases: planning, development, testing, deployment
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert project manager. Generate structured project plans in JSON format. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("Error generating project plan:", error);
      throw new Error("Failed to generate project plan");
    }
  }

  async summarizeProject(projectName: string, tasks: { title: string; status: string; description?: string }[]): Promise<string> {
    try {
      const prompt = `
        Summarize the current state of project "${projectName}" based on these tasks:
        ${tasks.map(task => `- ${task.title} (${task.status}): ${task.description || "No description"}`).join("\n")}
        
        Provide a brief summary of progress, completed work, and what's next.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a project manager providing concise project summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return response.choices[0].message.content || "Unable to generate project summary.";
    } catch (error) {
      console.error("Error summarizing project:", error);
      throw new Error("Failed to summarize project");
    }
  }
}

export const aiService = new AIService();
