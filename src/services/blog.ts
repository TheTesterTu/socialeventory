
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/lib/types/blog";

export interface DatabaseBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_id: string;
  category: string[];
  tags: string[];
  published_at: string;
  read_time: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (
          username,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.cover_image,
      author: {
        name: post.profiles?.username || 'Unknown Author',
        avatar: post.profiles?.avatar_url || ''
      },
      category: post.category || [],
      tags: post.tags || [],
      publishedAt: post.published_at,
      readTime: post.read_time
    }));
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (
          username,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.cover_image,
      author: {
        name: data.profiles?.username || 'Unknown Author',
        avatar: data.profiles?.avatar_url || ''
      },
      category: data.category || [],
      tags: data.tags || [],
      publishedAt: data.published_at,
      readTime: data.read_time
    };
  }
};
