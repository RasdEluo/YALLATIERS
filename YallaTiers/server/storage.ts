import { users, parts, searchHistory, favorites, 
  type User, type InsertUser, 
  type SearchHistory, type InsertSearchHistory,
  type Part, type InsertPart,
  type Favorite, type InsertFavorite
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSearchHistory(searchHistory: InsertSearchHistory): Promise<SearchHistory>;
  getUserSearchHistory(userId: number): Promise<SearchHistory[]>;
  savePart(part: InsertPart): Promise<Part>;
  getPartById(id: number): Promise<Part | undefined>;
  getPartsByVehicle(vehicleType: string, year: string, make: string, model: string): Promise<Part[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, partId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<Part[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSearchHistory(insertSearchHistory: InsertSearchHistory): Promise<SearchHistory> {
    const [history] = await db
      .insert(searchHistory)
      .values(insertSearchHistory)
      .returning();
    return history;
  }

  async getUserSearchHistory(userId: number): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(searchHistory.createdAt);
  }

  async savePart(insertPart: InsertPart): Promise<Part> {
    const [part] = await db
      .insert(parts)
      .values(insertPart)
      .returning();
    return part;
  }

  async getPartById(id: number): Promise<Part | undefined> {
    const [part] = await db.select().from(parts).where(eq(parts.id, id));
    return part || undefined;
  }

  async getPartsByVehicle(vehicleType: string, year: string, make: string, model: string): Promise<Part[]> {
    return await db
      .select()
      .from(parts)
      .where(
        and(
          eq(parts.vehicleType, vehicleType),
          eq(parts.year, year),
          eq(parts.make, make),
          eq(parts.model, model)
        )
      );
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async removeFavorite(userId: number, partId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.partId, partId)
        )
      );
  }

  async getUserFavorites(userId: number): Promise<Part[]> {
    const userFavorites = await db
      .select({
        part: parts
      })
      .from(favorites)
      .innerJoin(parts, eq(favorites.partId, parts.id))
      .where(eq(favorites.userId, userId));
    
    return userFavorites.map(item => item.part);
  }
}

export const storage = new DatabaseStorage();
