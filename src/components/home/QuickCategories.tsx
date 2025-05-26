
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategoryNames } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

export const QuickCategories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: categories = [], isLoading } = useCategoryNames();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  // Take categories to display - more on desktop, fewer on mobile
  const displayCategories = isMobile ? categories.slice(0, 6) : categories.slice(0, 8);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <h2 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
        Explore Categories
      </h2>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-8">
        {displayCategories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              size={isMobile ? "sm" : "default"}
              className="w-full h-9 py-1 md:py-2 text-xs md:text-sm rounded-lg gradient-primary hover:shadow-md transition-all flex items-center justify-center gap-1 border-primary/20"
            >
              <span className="line-clamp-1 text-center">{category}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
