
import { BlogPost } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FeaturedBlogProps {
  posts: BlogPost[];
}

export const FeaturedBlog = ({ posts }: FeaturedBlogProps) => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Latest from our Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Card 
            key={post.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <CardHeader className="relative h-48">
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="line-clamp-2 mb-2">{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-muted-foreground">{post.author.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.section>
  );
};
