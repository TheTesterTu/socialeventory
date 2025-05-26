
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Temporary mock categories until Supabase types are regenerated
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Music",
    slug: "music",
    icon: "🎵",
    color: "#8b5cf6",
    description: "Concerts, festivals, and musical performances",
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2", 
    name: "Technology",
    slug: "technology",
    icon: "💻",
    color: "#6366f1",
    description: "Tech conferences, workshops, and meetups",
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Food & Drink", 
    slug: "food-drink",
    icon: "🍽️",
    color: "#f59e0b",
    description: "Culinary events, tastings, and food festivals",
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Art & Culture",
    slug: "art-culture", 
    icon: "🎨",
    color: "#ec4899",
    description: "Art exhibitions, cultural events, and creative workshops",
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Sports",
    slug: "sports",
    icon: "⚽",
    color: "#10b981", 
    description: "Sporting events, tournaments, and fitness activities",
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Business",
    slug: "business",
    icon: "💼",
    color: "#8b5cf6",
    description: "Networking events, conferences, and professional development", 
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const categoriesService = {
  async getAllCategories(): Promise<Category[]> {
    // Return mock data for now - will be replaced with real Supabase queries
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCategories), 100);
    });
  },

  async getCategoryNames(): Promise<string[]> {
    const categories = await this.getAllCategories();
    return categories.map(cat => cat.name);
  }
};
