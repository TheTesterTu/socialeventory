
import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Code, Coffee, Palette, Trophy, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCategoryBgColor, getCategoryTextColor } from "@/lib/utils/categoryColors";

const categories = [
  { name: "Music", icon: Music, count: 234 },
  { name: "Technology", icon: Code, count: 156 },
  { name: "Food & Drink", icon: Coffee, count: 189 },
  { name: "Art & Culture", icon: Palette, count: 142 },
  { name: "Sports", icon: Trophy, count: 98 },
  { name: "Business", icon: Briefcase, count: 87 },
];

export const QuickCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center space-y-8"
    >
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Explore Categories
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find events that match your interests
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
        {categories.map((category, index) => {
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleCategoryClick(category.name)}
                className={`
                  h-auto flex-col gap-2 p-4 md:p-6 min-w-[120px] md:min-w-[140px]
                  border-2 border-primary/20 hover:border-primary/40
                  bg-card/40 hover:bg-primary/10 backdrop-blur-sm
                  transition-all duration-300 group
                `}
              >
                <div className={`
                  p-2 md:p-3 rounded-full transition-all duration-300
                  ${getCategoryBgColor(category.name)}/20 group-hover:${getCategoryBgColor(category.name)}/30
                `}>
                  <Icon className={`
                    h-5 w-5 md:h-6 md:w-6 transition-colors duration-300
                    ${getCategoryTextColor(category.name)} group-hover:text-white
                  `} />
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-sm md:text-base text-foreground">
                    {category.name}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {category.count} events
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
