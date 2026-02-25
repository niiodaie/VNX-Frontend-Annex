import { apiRequest } from "./queryClient";
import { 
  type User, type Mentor, type ChatSession, 
  type ChatMessage, type Project, 
  type ChatResponse, type MentorFeedbackResponse,
  type MentorFeedbackInput, type ChatMessageInput
} from "@shared/schema";

// User API calls

/**
 * Register a new user
 */
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
  genres?: string[];
}): Promise<Omit<User, 'password'>> {
  const response = await apiRequest("POST", "/api/users/register", userData);
  
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  
  return await response.json();
}

/**
 * Login a user
 */
export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<Omit<User, 'password'>> {
  const response = await apiRequest("POST", "/api/users/login", credentials);
  
  if (!response.ok) {
    throw new Error("Login failed");
  }
  
  return await response.json();
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: number): Promise<Omit<User, 'password'>> {
  const response = await apiRequest("GET", `/api/users/${userId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  
  return await response.json();
}

// Mentor API calls

/**
 * Get all mentors
 */
export async function getMentors(): Promise<Mentor[]> {
  const response = await apiRequest("GET", "/api/mentors");
  
  if (!response.ok) {
    throw new Error("Failed to fetch mentors");
  }
  
  return await response.json();
}

/**
 * Get mentor by ID
 */
export async function getMentor(mentorId: number): Promise<Mentor> {
  const response = await apiRequest("GET", `/api/mentors/${mentorId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch mentor");
  }
  
  return await response.json();
}

/**
 * Get mentors by genre
 */
export async function getMentorsByGenre(genre: string): Promise<Mentor[]> {
  const response = await apiRequest("GET", `/api/mentors/genre/${encodeURIComponent(genre)}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch mentors by genre");
  }
  
  return await response.json();
}

// Chat API calls

/**
 * Create a new chat session
 */
export async function createChatSession(sessionData: {
  userId: number;
  mentorId: number;
  title: string;
}): Promise<ChatSession> {
  const response = await apiRequest("POST", "/api/chat/sessions", sessionData);
  
  if (!response.ok) {
    throw new Error("Failed to create chat session");
  }
  
  return await response.json();
}

/**
 * Get chat sessions for a user
 */
export async function getUserChatSessions(userId: number): Promise<ChatSession[]> {
  const response = await apiRequest("GET", `/api/chat/sessions/user/${userId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch chat sessions");
  }
  
  return await response.json();
}

/**
 * Get chat messages for a session
 */
export async function getChatMessages(sessionId: number): Promise<ChatMessage[]> {
  const response = await apiRequest("GET", `/api/chat/messages/${sessionId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }
  
  return await response.json();
}

/**
 * Send a message to a mentor
 */
export async function sendMessage(messageData: ChatMessageInput): Promise<ChatResponse & { messageId: number }> {
  const response = await apiRequest("POST", "/api/chat/messages", messageData);
  
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  
  return await response.json();
}

// Project API calls

/**
 * Create a new project
 */
export async function createProject(projectData: {
  userId: number;
  mentorId: number;
  title: string;
  description?: string;
  genre?: string;
  status?: string;
  content?: any;
}): Promise<Project> {
  const response = await apiRequest("POST", "/api/projects", projectData);
  
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  
  return await response.json();
}

/**
 * Get projects for a user
 */
export async function getUserProjects(userId: number): Promise<Project[]> {
  const response = await apiRequest("GET", `/api/projects/user/${userId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  
  return await response.json();
}

/**
 * Get a project by ID
 */
export async function getProject(projectId: number): Promise<Project> {
  const response = await apiRequest("GET", `/api/projects/${projectId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  
  return await response.json();
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: number, 
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Project> {
  const response = await apiRequest("PUT", `/api/projects/${projectId}`, updates);
  
  if (!response.ok) {
    throw new Error("Failed to update project");
  }
  
  return await response.json();
}

/**
 * Get mentor feedback on creative content
 */
export async function getMentorFeedback(feedbackRequest: MentorFeedbackInput): Promise<MentorFeedbackResponse> {
  const response = await apiRequest("POST", "/api/projects/feedback", feedbackRequest);
  
  if (!response.ok) {
    throw new Error("Failed to get feedback");
  }
  
  return await response.json();
}

/**
 * Generate a creative roadmap
 */
export async function generateCreativeRoadmap(roadmapRequest: {
  userId: number;
  mentorId: number;
  genres: string[];
  goal: string;
  experience: string;
  influences: string[];
}): Promise<any> {
  const response = await apiRequest("POST", "/api/projects/roadmap", roadmapRequest);
  
  if (!response.ok) {
    throw new Error("Failed to generate roadmap");
  }
  
  return await response.json();
}
