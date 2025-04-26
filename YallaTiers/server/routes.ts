import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      
      // Create new user
      const user = await storage.createUser(validatedData);
      
      // Return user data (excluding password)
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Compare password
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Return user data (excluding password)
      res.json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // User profile endpoint
  app.get("/api/user/profile", async (req, res) => {
    try {
      const userId = req.query.id as string;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  
  // Favorites endpoints
  app.post("/api/user/favorites", async (req, res) => {
    try {
      const { userId, partId } = req.body;
      
      if (!userId || !partId) {
        return res.status(400).json({ error: "User ID and Part ID are required" });
      }
      
      const favorite = await storage.addFavorite({ userId, partId });
      
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });
  
  app.delete("/api/user/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const partId = parseInt(req.query.partId as string);
      
      if (!userId || !partId) {
        return res.status(400).json({ error: "User ID and Part ID are required" });
      }
      
      await storage.removeFavorite(userId, partId);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });
  
  app.get("/api/user/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const favorites = await storage.getUserFavorites(userId);
      
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
  
  // Search history endpoints
  app.post("/api/user/search-history", async (req, res) => {
    try {
      const { userId, vehicleType, year, make, model, mileage, partSearch } = req.body;
      
      if (!userId || !vehicleType || !year || !make || !model || !partSearch) {
        return res.status(400).json({ error: "Missing required search information" });
      }
      
      const searchHistory = await storage.createSearchHistory({
        userId,
        vehicleType,
        year,
        make,
        model,
        mileage,
        partSearch
      });
      
      res.status(201).json(searchHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to save search history" });
    }
  });
  
  app.get("/api/user/search-history", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const searchHistory = await storage.getUserSearchHistory(userId);
      
      res.json(searchHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });
  
  // Parts API endpoints
  app.post("/api/parts", async (req, res) => {
    try {
      const { name, description, conditionRating, estimatedPrice, imageUrl, vehicleType, year, make, model } = req.body;
      
      if (!name || !description || !conditionRating || !estimatedPrice || !imageUrl || 
          !vehicleType || !year || !make || !model) {
        return res.status(400).json({ error: "Missing required part information" });
      }
      
      const part = await storage.savePart({
        name,
        description,
        conditionRating,
        estimatedPrice,
        imageUrl,
        vehicleType,
        year,
        make,
        model
      });
      
      res.status(201).json(part);
    } catch (error) {
      console.error("Error saving part:", error);
      res.status(500).json({ error: "Failed to save part" });
    }
  });
  
  app.get("/api/parts", async (req, res) => {
    try {
      const { vehicleType, year, make, model } = req.query;
      
      if (!vehicleType || !year || !make || !model) {
        return res.status(400).json({ error: "Vehicle information is required" });
      }
      
      const parts = await storage.getPartsByVehicle(
        vehicleType as string,
        year as string,
        make as string,
        model as string
      );
      
      res.json(parts);
    } catch (error) {
      console.error("Error fetching parts:", error);
      res.status(500).json({ error: "Failed to fetch parts" });
    }
  });
  
  app.get("/api/parts/:id", async (req, res) => {
    try {
      const partId = parseInt(req.params.id);
      
      if (!partId) {
        return res.status(400).json({ error: "Part ID is required" });
      }
      
      const part = await storage.getPartById(partId);
      
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      res.json(part);
    } catch (error) {
      console.error("Error fetching part:", error);
      res.status(500).json({ error: "Failed to fetch part" });
    }
  });
  // API endpoint to fetch vehicle makes from VPIC API
  app.get("/api/vehicle/makes", async (req, res) => {
    const { vehicleType, year } = req.query;
    
    if (!vehicleType || !year) {
      return res.status(400).json({ error: "Vehicle type and year are required" });
    }
    
    try {
      const response = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${vehicleType}?format=json&modelYear=${year}`
      );
      
      if (response.data && response.data.Results) {
        const makes = response.data.Results.map((result: any) => result.MakeName);
        return res.json(makes);
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching makes from VPIC API:", error);
      res.status(500).json({ error: "Failed to fetch vehicle makes" });
    }
  });
  
  // API endpoint to fetch vehicle models from VPIC API
  app.get("/api/vehicle/models", async (req, res) => {
    const { vehicleType, year, make } = req.query;
    
    if (!vehicleType || !year || !make) {
      return res.status(400).json({ error: "Vehicle type, year, and make are required" });
    }
    
    try {
      const response = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}/vehicleType/${vehicleType}?format=json`
      );
      
      if (response.data && response.data.Results) {
        const models = response.data.Results.map((result: any) => result.Model_Name);
        return res.json(models);
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching models from VPIC API:", error);
      res.status(500).json({ error: "Failed to fetch vehicle models" });
    }
  });
  
  // API endpoint for OpenRouter AI product recommendations
  app.post("/api/products/search", async (req, res) => {
    const { vehicleType, year, make, model, mileage, partSearch } = req.body;
    
    if (!vehicleType || !year || !make || !model || !partSearch) {
      return res.status(400).json({ error: "Missing required vehicle or part information" });
    }
    
    try {
      const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY || 
                                "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";
      
      const prompt = `
        You are an automotive parts expert. Please generate detailed information for the following automotive part search:
        
        Vehicle Details:
        - Type: ${vehicleType}
        - Year: ${year}
        - Make: ${make}
        - Model: ${model}
        - Mileage/Hours: ${mileage}
        
        Part/Product Searched: ${partSearch}
        
        For each result (generate 3 results), provide:
        1. Product name
        2. Detailed description including compatibility and features
        3. Condition rating as a percentage (between 50% and 98%)
        4. Estimated price in USD
        
        Format your response as JSON with this structure:
        [
          {
            "id": "unique-id",
            "name": "Product Name",
            "description": "Detailed product description",
            "conditionRating": 85,
            "estimatedPrice": "$XX.XX",
            "imageUrl": "https://images.unsplash.com/photo-URL"
          }
        ]
        
        Only return the JSON array with no additional text or commentary.
      `;
      
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an automotive parts expert that responds only with JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://yallatiers.com",
            "X-Title": "Yalla Tiers"
          }
        }
      );
      
      if (response.data && response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content;
        try {
          // Parse the JSON response
          const results = JSON.parse(content.trim());
          return res.json(results);
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          return res.status(500).json({ error: "Failed to parse AI response" });
        }
      }
      
      res.status(500).json({ error: "Failed to get AI recommendations" });
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      res.status(500).json({ error: "Failed to get product recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
