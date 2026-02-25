import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-demo-key" });

// Generate homework questions based on the subject, course, and lesson
export async function generateHomeworkQuestions(
  subject: string,
  course: string,
  lesson: string,
  count: number = 5,
  language: string = 'en'
): Promise<Array<{ question: string, answer?: string }>> {
  try {
    // Mock data for development/demo - in production this would use the OpenAI API
    const mockQuestions = [
      {
        question: "Solve the equation: 2x + 5 = 15",
        answer: "x = 5"
      },
      {
        question: "Find the derivative of f(x) = x² + 3x",
        answer: "f'(x) = 2x + 3"
      },
      {
        question: "If a triangle has sides of length 3, 4, and 5, what is its area?",
        answer: "6 square units"
      },
      {
        question: "What is the chain rule used for in calculus?",
        answer: "The chain rule is used to find the derivative of a composite function."
      },
      {
        question: "Find the indefinite integral of 2x with respect to x.",
        answer: "x² + C"
      }
    ];

    // Return mock questions for development
    return mockQuestions.slice(0, count);

    // In production, use OpenAI to generate questions
    /*
    const prompt = `Generate ${count} homework questions about ${lesson} for a ${course} course in ${subject}. 
    Each question should be challenging but appropriate for the subject level. 
    Provide both the question and the answer, formatted as JSON.
    Language: ${language === 'es' ? 'Spanish' : 'English'}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions;
    */
  } catch (error) {
    console.error("Error generating homework questions:", error);
    throw new Error("Failed to generate homework questions");
  }
}

// Generate quiz questions (multiple choice) based on the subject, course, and lesson
export async function generateQuizQuestions(
  subject: string,
  course: string,
  lesson: string,
  count: number = 5,
  language: string = 'en'
): Promise<Array<{ question: string, options: string[], correctAnswer: string, explanation: string }>> {
  try {
    // Mock data for development/demo - in production this would use the OpenAI API
    const mockQuestions = [
      {
        question: "What is the derivative of x³?",
        options: ["x²", "3x²", "3x", "x³"],
        correctAnswer: "3x²",
        explanation: "The derivative of x^n is n*x^(n-1). For x³, n=3, so the derivative is 3x²."
      },
      {
        question: "Which of the following is an example of the chain rule?",
        options: [
          "d/dx(x² + x³) = 2x + 3x²", 
          "d/dx(x² · x³) = 5x⁴", 
          "d/dx(sin(x²)) = 2x·cos(x²)", 
          "d/dx(x² + 5) = 2x"
        ],
        correctAnswer: "d/dx(sin(x²)) = 2x·cos(x²)",
        explanation: "The chain rule is used when differentiating composite functions. In d/dx(sin(x²)), sin is the outer function and x² is the inner function."
      },
      {
        question: "If f(x) = 3x + 2 and g(x) = x², find f(g(2)).",
        options: ["8", "14", "20", "26"],
        correctAnswer: "14",
        explanation: "f(g(2)) = f(2²) = f(4) = 3(4) + 2 = 12 + 2 = 14"
      },
      {
        question: "What is the area of a circle with radius 3 units?",
        options: ["3π square units", "6π square units", "9π square units", "18π square units"],
        correctAnswer: "9π square units",
        explanation: "The area of a circle is πr². With r = 3, the area is π(3)² = 9π square units."
      },
      {
        question: "Solve for x: ln(x) = 2",
        options: ["x = e", "x = e²", "x = 2e", "x = ln(2)"],
        correctAnswer: "x = e²",
        explanation: "If ln(x) = 2, then x = e² ≈ 7.389."
      }
    ];

    // Return mock questions for development
    return mockQuestions.slice(0, count);

    // In production, use OpenAI to generate questions
    /*
    const prompt = `Generate ${count} multiple-choice quiz questions about ${lesson} for a ${course} course in ${subject}. 
    Each question should have 4 options with only one correct answer. 
    Include an explanation for the correct answer.
    Format the response as JSON with fields: question, options (array), correctAnswer, and explanation.
    Language: ${language === 'es' ? 'Spanish' : 'English'}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions;
    */
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

// Generate AI instructor response to a student question
export async function generateInstructorResponse(
  instructorName: string,
  subject: string,
  course: string,
  lesson: string,
  question: string,
  language: string = 'en'
): Promise<string> {
  try {
    // Mock data for development/demo - in production this would use the OpenAI API
    const mockResponses = [
      "That's an excellent question! The chain rule is used when differentiating composite functions. Think of it as finding the rate of change when one quantity depends on another, which in turn depends on a third variable. For example, if you have f(g(x)), the chain rule says that the derivative is f'(g(x)) × g'(x).",
      "Great question! In the context of this lesson, we need to consider how one function affects another. Let me explain with a real-world example: if the temperature changes over time, and the length of a metal rod depends on temperature, then the chain rule helps us find how the length changes with respect to time.",
      "I understand your confusion. Let's break this down step by step. First, identify the outer function and the inner function. Then, find the derivative of the outer function (evaluated at the inner function) and multiply by the derivative of the inner function.",
      "You've touched on an important concept. The key difference between the chain rule and the product rule is that the chain rule is for composite functions (one function inside another), while the product rule is for multiplying functions together."
    ];

    // Return a mock response for development
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // In production, use OpenAI to generate a response
    /*
    const prompt = `You are ${instructorName}, an AI instructor teaching ${subject}, specifically a course on ${course}. 
    The current lesson is about ${lesson}.
    A student has asked: "${question}"
    
    Provide a helpful, informative, and encouraging response that thoroughly answers the question. 
    Use a conversational, supportive tone while maintaining educational authority.
    Language: ${language === 'es' ? 'Spanish' : 'English'}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content;
    */
  } catch (error) {
    console.error("Error generating instructor response:", error);
    throw new Error("Failed to generate instructor response");
  }
}
