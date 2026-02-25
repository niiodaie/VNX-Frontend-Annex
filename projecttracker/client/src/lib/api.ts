import { apiRequest } from "./queryClient";

export interface APIProject {
  id: number;
  name: string;
  description?: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface APITask {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: number;
  assigneeId?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface APIPrompt {
  id: number;
  prompt: string;
  response: string;
  context: string;
  projectId?: number;
  taskId?: number;
  userId: number;
  createdAt: string;
}

export interface APIReminder {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  taskId?: number;
  projectId?: number;
  userId: number;
  createdAt: string;
}

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  estimatedDuration: string;
}

export const api = {
  // Projects
  async getProjects(): Promise<APIProject[]> {
    const res = await apiRequest("GET", "/api/projects");
    return res.json();
  },

  async getProject(id: number): Promise<APIProject> {
    const res = await apiRequest("GET", `/api/projects/${id}`);
    return res.json();
  },

  async createProject(data: { name: string; description?: string; color?: string }): Promise<APIProject> {
    const res = await apiRequest("POST", "/api/projects", data);
    return res.json();
  },

  async updateProject(id: number, data: Partial<APIProject>): Promise<APIProject> {
    const res = await apiRequest("PUT", `/api/projects/${id}`, data);
    return res.json();
  },

  async deleteProject(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/projects/${id}`);
  },

  // Tasks
  async getProjectTasks(projectId: number): Promise<APITask[]> {
    const res = await apiRequest("GET", `/api/projects/${projectId}/tasks`);
    return res.json();
  },

  async createTask(data: {
    title: string;
    description?: string;
    projectId: number;
    status?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<APITask> {
    const res = await apiRequest("POST", "/api/tasks", data);
    return res.json();
  },

  async updateTask(id: number, data: Partial<APITask>): Promise<APITask> {
    const res = await apiRequest("PUT", `/api/tasks/${id}`, data);
    return res.json();
  },

  async deleteTask(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/tasks/${id}`);
  },

  // AI
  async sendPrompt(data: {
    prompt: string;
    context?: string;
    projectId?: number;
    taskId?: number;
  }): Promise<{
    id: number;
    response: string;
    suggestions: TaskSuggestion[];
    createdAt: string;
  }> {
    const res = await apiRequest("POST", "/api/ai/prompt", data);
    return res.json();
  },

  async getPrompts(params?: { projectId?: number; search?: string }): Promise<APIPrompt[]> {
    const searchParams = new URLSearchParams();
    if (params?.projectId) searchParams.append("projectId", params.projectId.toString());
    if (params?.search) searchParams.append("search", params.search);
    
    const res = await apiRequest("GET", `/api/ai/prompts?${searchParams.toString()}`);
    return res.json();
  },

  async getTaskSuggestions(projectId: number): Promise<{ suggestions: TaskSuggestion[] }> {
    const res = await apiRequest("POST", "/api/ai/task-suggestions", { projectId });
    return res.json();
  },

  // Reminders
  async getReminders(type?: "today" | "overdue"): Promise<APIReminder[]> {
    const params = type ? `?type=${type}` : "";
    const res = await apiRequest("GET", `/api/reminders${params}`);
    return res.json();
  },

  async createReminder(data: {
    title: string;
    description?: string;
    dueDate: string;
    taskId?: number;
    projectId?: number;
  }): Promise<APIReminder> {
    const res = await apiRequest("POST", "/api/reminders", data);
    return res.json();
  },

  async updateReminder(id: number, data: Partial<APIReminder>): Promise<APIReminder> {
    const res = await apiRequest("PUT", `/api/reminders/${id}`, data);
    return res.json();
  },
};
