
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog";
import { BlogPost } from "@/lib/types/blog";

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => blogService.getAllPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
