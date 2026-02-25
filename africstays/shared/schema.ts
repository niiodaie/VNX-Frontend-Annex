import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  country: text("country"),
  profileImage: text("profile_image"),
  isHost: boolean("is_host").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  country: true,
  profileImage: true,
  isHost: true,
});

// Properties
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  price: numeric("price").notNull(),
  imageUrl: text("image_url").notNull(),
  hostId: integer("host_id").notNull(),
  rating: numeric("rating"),
  reviewCount: integer("review_count").default(0),
  propertyType: text("property_type").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isUniqueStay: boolean("is_unique_stay").default(false),
  uniqueStayType: text("unique_stay_type"),
  availableStart: timestamp("available_start"),
  availableEnd: timestamp("available_end"),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  description: true,
  location: true,
  city: true,
  country: true,
  price: true,
  imageUrl: true,
  hostId: true,
  rating: true,
  reviewCount: true,
  propertyType: true,
  isFeatured: true,
  isUniqueStay: true,
  uniqueStayType: true,
  availableStart: true,
  availableEnd: true,
  bedrooms: true,
  bathrooms: true,
  maxGuests: true,
});

// Destinations
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  imageUrl: true,
  description: true,
  featured: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  userCountry: text("user_country"),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  propertyId: integer("property_id"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  userId: true,
  rating: true,
  comment: true,
  userCountry: true,
  userName: true,
  userImage: true,
  propertyId: true,
});

// Booking
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: numeric("total_price").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  propertyId: true,
  checkIn: true,
  checkOut: true,
  guests: true,
  totalPrice: true,
  status: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
