
import { BlogPost } from "@/lib/types/blog";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const publishedDate = new Date(post.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel overflow-hidden ${featured ? 'p-0' : 'p-0'} rounded-xl flex flex-col h-full`}
    >
      <Link to={`/blog/${post.slug}`} className="group">
        <div className="relative overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="absolute top-4 left-4 flex gap-1">
            {post.category.slice(0, 2).map((cat) => (
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
        
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full" />
            <span>{post.author.name}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} min read
            </span>
          </div>
          
          <h3 className={`${featured ? 'text-xl' : 'text-lg'} font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors`}>
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-primary text-sm font-medium mt-auto">
            Read more
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
