import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  color: text("color").notNull(),
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  subjectId: integer("subject_id").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  imageUrl: text("image_url"),
  certificationType: text("certification_type"), // SAT, IELTS, null for regular courses
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url"),
  order: integer("order").notNull(),
  duration: integer("duration").notNull(), // in minutes
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  lastLessonId: integer("last_lesson_id"),
  percentComplete: integer("percent_complete").default(0).notNull(),
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

// Quiz Questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

// User Quiz Attempts table
export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).omit({
  id: true,
  attemptedAt: true,
});

// AI Instructors table
export const aiInstructors = pgTable("ai_instructors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  appearance: text("appearance").notNull(), // URL or identifier for appearance
  voice: text("voice").notNull(), // identifier for voice type
  subjectSpecialties: json("subject_specialties").notNull(), // array of subject IDs
  language: text("language").default("en").notNull(),
  rating: integer("rating").default(50).notNull(), // 0-50 scale for rating
  ratingCount: integer("rating_count").default(0).notNull(),
});

export const insertAiInstructorSchema = createInsertSchema(aiInstructors).omit({
  id: true,
  rating: true,
  ratingCount: true,
});

// User Instructors (for custom/favorite instructors)
export const userInstructors = pgTable("user_instructors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  instructorId: integer("instructor_id").notNull(),
  isCustomized: boolean("is_customized").default(false).notNull(),
  customSettings: json("custom_settings"), // customization settings if any
});

export const insertUserInstructorSchema = createInsertSchema(userInstructors).omit({
  id: true,
});

// Activity Feed table
export const activityFeed = pgTable("activity_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityType: text("activity_type").notNull(), // quiz_completed, lesson_watched, etc.
  resourceId: integer("resource_id"), // lesson ID, quiz ID, etc.
  resourceType: text("resource_type"), // lesson, quiz, etc.
  details: json("details"), // Additional details specific to activity type
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertActivityFeedSchema = createInsertSchema(activityFeed).omit({
  id: true,
  timestamp: true,
});

// Define export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;

export type AiInstructor = typeof aiInstructors.$inferSelect;
export type InsertAiInstructor = z.infer<typeof insertAiInstructorSchema>;

export type UserInstructor = typeof userInstructors.$inferSelect;
export type InsertUserInstructor = z.infer<typeof insertUserInstructorSchema>;

export type ActivityFeed = typeof activityFeed.$inferSelect;
export type InsertActivityFeed = z.infer<typeof insertActivityFeedSchema>;
