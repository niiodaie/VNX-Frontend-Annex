import {
  users, subjects, courses, lessons, userProgress, quizQuestions, 
  userQuizAttempts, aiInstructors, userInstructors, activityFeed,
  type User, type InsertUser, type Subject, type InsertSubject,
  type Course, type InsertCourse, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type QuizQuestion, 
  type InsertQuizQuestion, type UserQuizAttempt, type InsertUserQuizAttempt,
  type AiInstructor, type InsertAiInstructor, type UserInstructor,
  type InsertUserInstructor, type ActivityFeed, type InsertActivityFeed
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCoursesBySubject(subjectId: number): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Lesson operations
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress operations
  getUserProgress(userId: number, courseId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, courseId: number, data: Partial<UserProgress>): Promise<UserProgress>;
  getUserCoursesWithProgress(userId: number): Promise<(Course & { progress: number })[]>;

  // Quiz operations
  getQuizQuestionsByLesson(lessonId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  recordQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt>;
  getUserQuizAttempts(userId: number, lessonId: number): Promise<UserQuizAttempt[]>;

  // AI Instructor operations
  getAllInstructors(): Promise<AiInstructor[]>;
  getInstructor(id: number): Promise<AiInstructor | undefined>;
  createInstructor(instructor: InsertAiInstructor): Promise<AiInstructor>;
  getUserInstructors(userId: number): Promise<(AiInstructor & { isCustomized: boolean })[]>;
  saveUserInstructor(userInstructor: InsertUserInstructor): Promise<UserInstructor>;

  // Activity Feed operations
  getUserActivityFeed(userId: number, limit?: number): Promise<ActivityFeed[]>;
  createActivityFeedEntry(activity: InsertActivityFeed): Promise<ActivityFeed>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private courses: Map<number, Course>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<string, UserProgress>; // key: userId-courseId
  private quizQuestions: Map<number, QuizQuestion>;
  private userQuizAttempts: Map<number, UserQuizAttempt>;
  private aiInstructors: Map<number, AiInstructor>;
  private userInstructors: Map<number, UserInstructor>;
  private activityFeed: Map<number, ActivityFeed>;

  private currentIds: {
    users: number;
    subjects: number;
    courses: number;
    lessons: number;
    userProgress: number;
    quizQuestions: number;
    userQuizAttempts: number;
    aiInstructors: number;
    userInstructors: number;
    activityFeed: number;
  };

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.courses = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.quizQuestions = new Map();
    this.userQuizAttempts = new Map();
    this.aiInstructors = new Map();
    this.userInstructors = new Map();
    this.activityFeed = new Map();

    this.currentIds = {
      users: 1,
      subjects: 1,
      courses: 1,
      lessons: 1,
      userProgress: 1,
      quizQuestions: 1,
      userQuizAttempts: 1,
      aiInstructors: 1,
      userInstructors: 1,
      activityFeed: 1,
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentIds.subjects++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesBySubject(subjectId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.subjectId === subjectId
    );
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentIds.courses++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Lesson operations
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter((lesson) => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentIds.lessons++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // User Progress operations
  async getUserProgress(userId: number, courseId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${courseId}`);
  }

  async updateUserProgress(userId: number, courseId: number, data: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${courseId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const now = new Date();
      const updated: UserProgress = { ...existing, ...data, lastAccessed: now };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentIds.userProgress++;
      const now = new Date();
      const newProgress: UserProgress = {
        id,
        userId,
        courseId,
        lastLessonId: data.lastLessonId,
        percentComplete: data.percentComplete || 0,
        lastAccessed: now,
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }

  async getUserCoursesWithProgress(userId: number): Promise<(Course & { progress: number })[]> {
    const courses = await this.getAllCourses();
    return Promise.all(courses.map(async (course) => {
      const progress = await this.getUserProgress(userId, course.id);
      return {
        ...course,
        progress: progress?.percentComplete || 0,
      };
    }));
  }

  // Quiz operations
  async getQuizQuestionsByLesson(lessonId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(
      (question) => question.lessonId === lessonId
    );
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentIds.quizQuestions++;
    const question: QuizQuestion = { ...insertQuestion, id };
    this.quizQuestions.set(id, question);
    return question;
  }

  async recordQuizAttempt(insertAttempt: InsertUserQuizAttempt): Promise<UserQuizAttempt> {
    const id = this.currentIds.userQuizAttempts++;
    const now = new Date();
    const attempt: UserQuizAttempt = { ...insertAttempt, id, attemptedAt: now };
    this.userQuizAttempts.set(id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: number, lessonId: number): Promise<UserQuizAttempt[]> {
    return Array.from(this.userQuizAttempts.values())
      .filter((attempt) => attempt.userId === userId && attempt.lessonId === lessonId)
      .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime());
  }

  // AI Instructor operations
  async getAllInstructors(): Promise<AiInstructor[]> {
    return Array.from(this.aiInstructors.values());
  }

  async getInstructor(id: number): Promise<AiInstructor | undefined> {
    return this.aiInstructors.get(id);
  }

  async createInstructor(insertInstructor: InsertAiInstructor): Promise<AiInstructor> {
    const id = this.currentIds.aiInstructors++;
    const instructor: AiInstructor = { 
      ...insertInstructor, 
      id, 
      rating: 45 + Math.floor(Math.random() * 6), // Random initial rating between 45-50
      ratingCount: Math.floor(Math.random() * 200) // Random initial rating count
    };
    this.aiInstructors.set(id, instructor);
    return instructor;
  }

  async getUserInstructors(userId: number): Promise<(AiInstructor & { isCustomized: boolean })[]> {
    const userInstructorEntries = Array.from(this.userInstructors.values())
      .filter((entry) => entry.userId === userId);
    
    if (userInstructorEntries.length === 0) {
      // Return all available instructors if user has no saved instructors
      const allInstructors = await this.getAllInstructors();
      return allInstructors.map(instructor => ({
        ...instructor,
        isCustomized: false
      }));
    }

    return Promise.all(userInstructorEntries.map(async (entry) => {
      const instructor = await this.getInstructor(entry.instructorId);
      if (!instructor) {
        throw new Error(`Instructor with ID ${entry.instructorId} not found`);
      }
      
      return {
        ...instructor,
        isCustomized: entry.isCustomized
      };
    }));
  }

  async saveUserInstructor(insertUserInstructor: InsertUserInstructor): Promise<UserInstructor> {
    const id = this.currentIds.userInstructors++;
    const userInstructor: UserInstructor = { ...insertUserInstructor, id };
    this.userInstructors.set(id, userInstructor);
    return userInstructor;
  }

  // Activity Feed operations
  async getUserActivityFeed(userId: number, limit = 10): Promise<ActivityFeed[]> {
    return Array.from(this.activityFeed.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createActivityFeedEntry(insertActivity: InsertActivityFeed): Promise<ActivityFeed> {
    const id = this.currentIds.activityFeed++;
    const now = new Date();
    const activity: ActivityFeed = { ...insertActivity, id, timestamp: now };
    this.activityFeed.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
