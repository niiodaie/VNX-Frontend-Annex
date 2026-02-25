import { users, projects, tasks, aiPrompts, reminders, aiLogs, type User, type InsertUser, type Project, type InsertProject, type Task, type InsertTask, type AIPrompt, type InsertAIPrompt, type Reminder, type InsertReminder, type AILog, type InsertAILog } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProjectId(projectId: number): Promise<Task[]>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // AI Prompts
  getAIPrompt(id: number): Promise<AIPrompt | undefined>;
  getAIPromptsByProjectId(projectId: number): Promise<AIPrompt[]>;
  getAIPromptsByUserId(userId: number): Promise<AIPrompt[]>;
  createAIPrompt(prompt: InsertAIPrompt): Promise<AIPrompt>;
  searchAIPrompts(userId: number, query: string): Promise<AIPrompt[]>;

  // Reminders
  getReminder(id: number): Promise<Reminder | undefined>;
  getRemindersByUserId(userId: number): Promise<Reminder[]>;
  getTodayReminders(userId: number): Promise<Reminder[]>;
  getOverdueReminders(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;

  // AI Logs
  getAILog(id: number): Promise<AILog | undefined>;
  getAILogsByUserId(userId: number): Promise<AILog[]>;
  getAILogsByProjectId(projectId: number): Promise<AILog[]>;
  createAILog(aiLog: InsertAILog): Promise<AILog>;
  updateAILog(id: number, aiLog: Partial<InsertAILog>): Promise<AILog | undefined>;
  deleteAILog(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private tasks: Map<number, Task> = new Map();
  private aiPrompts: Map<number, AIPrompt> = new Map();
  private reminders: Map<number, Reminder> = new Map();
  private aiLogs: Map<number, AILog> = new Map();
  private currentId: number = 1;

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      plan: insertUser.plan || 'free',
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      subscriptionStatus: insertUser.subscriptionStatus || null,
      planExpiresAt: insertUser.planExpiresAt || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject,
      id, 
      createdAt: now, 
      updatedAt: now,
      color: insertProject.color || "#0EA5E9",
      description: insertProject.description || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = { 
      ...project, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Tasks
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    const userProjects = await this.getProjectsByUserId(userId);
    const projectIds = userProjects.map(p => p.id);
    return Array.from(this.tasks.values()).filter(task => projectIds.includes(task.projectId));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const now = new Date();
    const task: Task = { 
      ...insertTask,
      id, 
      createdAt: now, 
      updatedAt: now,
      status: insertTask.status || "todo",
      priority: insertTask.priority || "medium",
      progress: insertTask.progress || 0,
      description: insertTask.description || null,
      dueDate: insertTask.dueDate || null,
      assigneeId: insertTask.assigneeId || null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { 
      ...task, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // AI Prompts
  async getAIPrompt(id: number): Promise<AIPrompt | undefined> {
    return this.aiPrompts.get(id);
  }

  async getAIPromptsByProjectId(projectId: number): Promise<AIPrompt[]> {
    return Array.from(this.aiPrompts.values()).filter(prompt => prompt.projectId === projectId);
  }

  async getAIPromptsByUserId(userId: number): Promise<AIPrompt[]> {
    return Array.from(this.aiPrompts.values()).filter(prompt => prompt.userId === userId);
  }

  async createAIPrompt(insertPrompt: InsertAIPrompt): Promise<AIPrompt> {
    const id = this.currentId++;
    const prompt: AIPrompt = { 
      ...insertPrompt,
      id, 
      createdAt: new Date(),
      context: insertPrompt.context || "general",
      projectId: insertPrompt.projectId || null,
      taskId: insertPrompt.taskId || null
    };
    this.aiPrompts.set(id, prompt);
    return prompt;
  }

  async searchAIPrompts(userId: number, query: string): Promise<AIPrompt[]> {
    const userPrompts = await this.getAIPromptsByUserId(userId);
    return userPrompts.filter(prompt => 
      prompt.prompt.toLowerCase().includes(query.toLowerCase()) ||
      prompt.response.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Reminders
  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async getRemindersByUserId(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(reminder => reminder.userId === userId);
  }

  async getTodayReminders(userId: number): Promise<Reminder[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.reminders.values()).filter(reminder => 
      reminder.userId === userId && 
      !reminder.completed &&
      reminder.dueDate >= today && 
      reminder.dueDate < tomorrow
    );
  }

  async getOverdueReminders(userId: number): Promise<Reminder[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from(this.reminders.values()).filter(reminder => 
      reminder.userId === userId && 
      !reminder.completed &&
      reminder.dueDate < today
    );
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentId++;
    const reminder: Reminder = { 
      id,
      title: insertReminder.title,
      description: insertReminder.description || null,
      dueDate: insertReminder.dueDate,
      completed: insertReminder.completed ?? false,
      taskId: insertReminder.taskId || null,
      projectId: insertReminder.projectId || null,
      userId: insertReminder.userId,
      createdAt: new Date()
    };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updateData: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder: Reminder = { 
      ...reminder, 
      ...updateData 
    };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }

  // AI Logs
  async getAILog(id: number): Promise<AILog | undefined> {
    return this.aiLogs.get(id);
  }

  async getAILogsByUserId(userId: number): Promise<AILog[]> {
    return Array.from(this.aiLogs.values()).filter(log => log.userId === userId);
  }

  async getAILogsByProjectId(projectId: number): Promise<AILog[]> {
    return Array.from(this.aiLogs.values()).filter(log => log.projectId === projectId);
  }

  async createAILog(insertAILog: InsertAILog): Promise<AILog> {
    const id = this.currentId++;
    const aiLog: AILog = { 
      id,
      userId: insertAILog.userId,
      projectId: insertAILog.projectId || null,
      source: insertAILog.source,
      content: insertAILog.content,
      prompt: insertAILog.prompt || null,
      taskCreated: insertAILog.taskCreated || false,
      taskId: insertAILog.taskId || null,
      metadata: insertAILog.metadata || null,
      createdAt: new Date()
    };
    this.aiLogs.set(id, aiLog);
    return aiLog;
  }

  async updateAILog(id: number, updateData: Partial<InsertAILog>): Promise<AILog | undefined> {
    const aiLog = this.aiLogs.get(id);
    if (!aiLog) return undefined;
    
    const updatedAILog: AILog = { 
      ...aiLog, 
      ...updateData 
    };
    this.aiLogs.set(id, updatedAILog);
    return updatedAILog;
  }

  async deleteAILog(id: number): Promise<boolean> {
    return this.aiLogs.delete(id);
  }
}

export const storage = new MemStorage();
