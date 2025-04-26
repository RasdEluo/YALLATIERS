import axios from "axios";
import { delay } from "@/lib/utils";
import { SearchData } from "@/components/search-section";
import { ProductResult } from "@/components/results-section";

// VPIC API URL for vehicle data
const VPIC_API_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// OpenRouter API for AI responses
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_API_KEY || 
                           "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";

export async function getMakes(vehicleType: string, year: string): Promise<string[]> {
  try {
    const response = await axios.get(`${VPIC_API_BASE_URL}/GetMakesForVehicleType/${vehicleType}?format=json&modelYear=${year}`);
    if (response.data && response.data.Results) {
      return response.data.Results.map((result: any) => result.MakeName);
    }
    return [];
  } catch (error) {
    console.error("Error fetching makes:", error);
    // Fallback data in case API fails
    return ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Nissan"];
  }
}

export async function getModels(vehicleType: string, year: string, make: string): Promise<string[]> {
  try {
    const response = await axios.get(`${VPIC_API_BASE_URL}/GetModelsForMakeYear/make/${make}/modelyear/${year}/vehicleType/${vehicleType}?format=json`);
    if (response.data && response.data.Results) {
      return response.data.Results.map((result: any) => result.Model_Name);
    }
    return [];
  } catch (error) {
    console.error("Error fetching models:", error);
    
    // Fallback logic based on make
    if (make === "Toyota") {
      return ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"];
    } else if (make === "Honda") {
      return ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"];
    } else if (make === "Ford") {
      return ["F-150", "Mustang", "Explorer", "Escape", "Focus"];
    } else {
      return ["Model 1", "Model 2", "Model 3", "Model 4", "Model 5"];
    }
  }
}

export async function getProductResults(searchData: SearchData): Promise<ProductResult[]> {
  const { vehicleType, year, make, model, mileage, partSearch } = searchData;
  
  // Store vehicle data in localStorage for later use in Analysis
  localStorage.setItem('yallaTiersVehicleData', JSON.stringify({
    type: vehicleType,
    year,
    make,
    model,
    mileage: `${mileage} ${vehicleType === 'motorcycle' ? 'miles' : 'miles'}`
  }));
  
  try {
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
      OPENROUTER_API_URL,
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
          "HTTP-Referer": window.location.href,
          "X-Title": "Yalla Tiers"
        }
      }
    );
    
    if (response.data && response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content;
      try {
        // Parse the JSON response from the AI
        const results = JSON.parse(content.trim());
        
        // Ensure we have valid results array
        if (Array.isArray(results)) {
          return results.map(result => ({
            ...result,
            // Ensure the condition rating is a number
            conditionRating: typeof result.conditionRating === 'number' 
              ? result.conditionRating 
              : parseInt(result.conditionRating, 10) || 75
          }));
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    }
    
    // Fallback if API response format is unexpected
    return generateFallbackResults(searchData);
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    return generateFallbackResults(searchData);
  }
}

function generateFallbackResults(searchData: SearchData): ProductResult[] {
  const { partSearch, make, model, year } = searchData;
  
  // Default images for fallback results
  const imageUrls = [
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1609752788425-2b8696381d95?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ];
  
  // Create fallback results
  return [
    {
      id: "fallback-1",
      name: `Premium ${partSearch} for ${year} ${make} ${model}`,
      description: `High-quality ${partSearch} specifically designed for your ${year} ${make} ${model}. Features enhanced durability and performance compared to standard options.`,
      conditionRating: 85,
      estimatedPrice: "$79.99",
      imageUrl: imageUrls[0]
    },
    {
      id: "fallback-2",
      name: `OEM Replacement ${partSearch}`,
      description: `Genuine OEM specification replacement ${partSearch} for ${make} vehicles. Direct fit for your ${year} ${model} with factory-level quality.`,
      conditionRating: 92,
      estimatedPrice: "$129.99",
      imageUrl: imageUrls[1]
    },
    {
      id: "fallback-3",
      name: `Economy ${partSearch} Kit`,
      description: `Budget-friendly complete ${partSearch} kit compatible with ${year}-${parseInt(year)+5} ${make} ${model} models. Includes all necessary components for installation.`,
      conditionRating: 78,
      estimatedPrice: "$59.99",
      imageUrl: imageUrls[2]
    }
  ];
}
