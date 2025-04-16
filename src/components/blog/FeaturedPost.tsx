
import { BlogPost } from "@/lib/types/blog";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface FeaturedPostProps {
  post: BlogPost;
}

export const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const publishedDate = new Date(post.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden rounded-xl mb-10"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/3 relative overflow-hidden">
          <div className="aspect-[16/9] w-full lg:aspect-auto lg:h-full">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute top-4 left-4 flex gap-1">
            {post.category.map((cat) => (
              <Badge 
                key={cat} 
                variant="secondary" 
                className="bg-background/70 backdrop-blur-sm hover:bg-background/80"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3 p-6 flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full" />
            <div>
              <div className="font-medium text-foreground">{post.author.name}</div>
              <div className="text-xs">{timeAgo}</div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          
          <p className="text-muted-foreground mb-6 flex-grow">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            
            <Button asChild>
              <Link to={`/blog/${post.slug}`}>
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
