
import { BlogPost } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "@/components/blog/BlogCard";

interface FeaturedBlogProps {
  posts: BlogPost[];
}

export const FeaturedBlog = ({ posts }: FeaturedBlogProps) => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">
          Latest from our{" "}
          <span className="text-gradient">Blog</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Tips, guides, and insights from the event community
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
