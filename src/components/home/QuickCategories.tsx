
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export const QuickCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 mx-auto" />
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
          Explore Categories
        </h2>
        <p className="text-muted-foreground">
          Find events that match your interests
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {categories.slice(0, 6).map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant="secondary"
              className="glass-card cursor-pointer px-6 py-3 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-full modern-shadow"
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="mr-2 text-base">{category.icon}</span>
              {category.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
