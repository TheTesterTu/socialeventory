
import { BlogPost } from "@/lib/types/blog";
import { BlogCard } from "./BlogCard";
import { motion } from "framer-motion";

interface BlogListProps {
  posts: BlogPost[];
  featured?: boolean;
}

export const BlogList = ({ posts, featured = false }: BlogListProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
          <BlogCard post={post} featured={featured} />
        </motion.div>
      ))}
    </motion.div>
  );
};
