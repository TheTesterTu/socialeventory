
import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const QuickCategories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Navigate to search page with the category pre-selected
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  // Take the first 6 categories to display
  const displayCategories = categories.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Explore Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
              className="w-full h-full py-6 rounded-xl bg-gradient-to-br hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
            >
              <span>{category}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
