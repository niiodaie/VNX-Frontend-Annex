import { pgTable, text, serial, integer, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Professionals table
export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  profession: varchar("profession", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  verifications: text("verifications").notNull(), // In PostgreSQL, we'll store this as JSON string
});

export const insertProfessionalSchema = createInsertSchema(professionals).pick({
  name: true,
  profession: true,
  bio: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  verifications: true,
});

export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Professional = typeof professionals.$inferSelect;

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  service: varchar("service", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  location: true,
  rating: true,
  comment: true,
  service: true,
  imageUrl: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Contact forms table
export const contactForms = pgTable("contact_forms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactFormSchema = createInsertSchema(contactForms).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type ContactForm = typeof contactForms.$inferSelect;

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  professionals: many(professionals),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  professionals: many(professionals),
}));

export const professionalsRelations = relations(professionals, ({ many }) => ({
  testimonials: many(testimonials),
}));
