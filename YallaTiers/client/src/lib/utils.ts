import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearRange(startYear: number = 1900): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
}

export function formatConditionPercentage(percentage: number): string {
  if (percentage < 50) return "Poor";
  if (percentage < 75) return "Fair";
  if (percentage < 85) return "Good";
  if (percentage < 95) return "Very Good";
  return "Excellent";
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const buildVehicleString = (
  type: string | null, 
  year: string | null, 
  make: string | null, 
  model: string | null
): string => {
  const parts = [year, make, model].filter(Boolean);
  return type && parts.length > 0 
    ? `${type} - ${parts.join(' ')}` 
    : 'No vehicle selected';
};

export const extractPercentageValue = (text: string): number => {
  // Extract number from text like "85%" or "Condition: 75%"
  const match = text.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 50;
};
