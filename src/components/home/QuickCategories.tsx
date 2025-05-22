
import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const QuickCategories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Navigate to search page with the category pre-selected
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  // Take categories to display - more on desktop, fewer on mobile
  const displayCategories = isMobile ? categories.slice(0, 6) : categories.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <h2 className="text-xl font-semibold">Explore Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
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
              className="w-full py-1.5 md:py-2 text-xs md:text-sm rounded-lg bg-gradient-to-br hover:shadow-md transition-all flex items-center justify-center gap-1"
            >
              <span className="line-clamp-1">{category}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
