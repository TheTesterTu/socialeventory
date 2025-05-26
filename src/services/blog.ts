
import { blogPosts } from "@/lib/mock-data/blog-data";
import { BlogPost } from "@/lib/types/blog";

// Temporary mock service until Supabase types are regenerated
export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    // Return mock data for now - will be replaced with real Supabase queries
    // once the types are regenerated
    return new Promise((resolve) => {
      setTimeout(() => resolve(blogPosts), 100);
    });
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // Return mock data for now - will be replaced with real Supabase queries
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = blogPosts.find(p => p.slug === slug);
        resolve(post || null);
      }, 100);
    });
  }
};
