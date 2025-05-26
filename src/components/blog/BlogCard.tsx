
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden rounded-xl flex flex-col h-full hover:shadow-xl group"
    >
      <Link to={`/blog/${post.slug}`} className="group">
        <div className="relative overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            {post.category.slice(0, 2).map((cat) => (
              <Badge 
                key={cat} 
                variant="secondary" 
                className="glass-card text-primary font-medium"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20" 
            />
            <div className="flex flex-col">
              <span className="text-primary font-medium text-sm">{post.author.name}</span>
              <div className="flex items-center gap-2 text-xs">
                <span>{timeAgo}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min read
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="font-display font-semibold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-primary text-sm font-medium mt-auto">
            Read more
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
