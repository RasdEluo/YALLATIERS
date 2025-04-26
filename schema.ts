import { pgTable, text, serial, integer, timestamp, boolean, date, jsonb, foreignKey, primaryKey, unique, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  searches: many(searchHistory),
  favorites: many(favorites),
}));

// Search History table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  vehicleType: text("vehicle_type").notNull(),
  year: text("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  mileage: text("mileage"),
  partSearch: text("part_search").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

// Parts table
export const parts = pgTable("parts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  conditionRating: integer("condition_rating").notNull(),
  estimatedPrice: text("estimated_price").notNull(),
  imageUrl: text("image_url").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  year: text("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  partId: integer("part_id").references(() => parts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  part: one(parts, {
    fields: [favorites.partId],
    references: [parts.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).pick({
  userId: true,
  vehicleType: true,
  year: true,
  make: true,
  model: true,
  mileage: true,
  partSearch: true,
});

export const insertPartSchema = createInsertSchema(parts).pick({
  name: true,
  description: true,
  conditionRating: true,
  estimatedPrice: true,
  imageUrl: true,
  vehicleType: true,
  year: true,
  make: true,
  model: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  partId: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

export type InsertPart = z.infer<typeof insertPartSchema>;
export type Part = typeof parts.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
