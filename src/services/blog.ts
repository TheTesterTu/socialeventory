
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/lib/types/blog";

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return data?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.cover_image || '',
        author: {
          name: post.profiles?.full_name || 'Anonymous',
          avatar: post.profiles?.avatar_url || ''
        },
        publishedAt: post.published_at || post.created_at,
        readTime: post.read_time || 5,
        category: post.category || [],
        tags: post.tags || []
      })) || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        coverImage: data.cover_image || '',
        author: {
          name: data.profiles?.full_name || 'Anonymous',
          avatar: data.profiles?.avatar_url || ''
        },
        publishedAt: data.published_at || data.created_at,
        readTime: data.read_time || 5,
        category: data.category || [],
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.cover_image || '',
        author: {
          name: post.profiles?.full_name || 'Anonymous',
          avatar: post.profiles?.avatar_url || ''
        },
        publishedAt: post.published_at || post.created_at,
        readTime: post.read_time || 5,
        category: post.category || [],
        tags: post.tags || []
      })) || [];
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  },

  async createPost(post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.coverImage,
          author_id: user.id,
          category: post.category,
          tags: post.tags,
          read_time: post.readTime,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        coverImage: data.cover_image || '',
        author: post.author,
        publishedAt: data.published_at || data.created_at,
        readTime: data.read_time || 5,
        category: data.category || [],
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return null;
    }
  }
};
