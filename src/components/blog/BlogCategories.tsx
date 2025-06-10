
// import { useState } from "react"; // Removed unused useState
// import { motion } from "framer-motion"; // Removed unused motion
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogCategoriesProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

export const BlogCategories = ({ 
  categories, 
  onCategorySelect,
  selectedCategory 
}: BlogCategoriesProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect('')}
          className="rounded-full"
        >
          All
          <Badge className="ml-2 bg-primary-foreground text-primary">
            {categories.length}
          </Badge>
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};
