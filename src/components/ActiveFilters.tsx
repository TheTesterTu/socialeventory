
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

interface ActiveFiltersProps {
  selectedCategories: string[];
  onClearCategory: (category: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({ 
  selectedCategories, 
  onClearCategory,
  onClearAll
}: ActiveFiltersProps) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex flex-wrap gap-2"
    >
      {selectedCategories.map(category => (
        <Badge 
          key={category} 
          variant="secondary"
          className="px-3 py-1"
        >
          {category}
          <button 
            className="ml-2 hover:text-destructive" 
            onClick={() => onClearCategory(category)}
          >
            ×
          </button>
        </Badge>
      ))}
      {selectedCategories.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="h-7 text-xs"
        >
          Clear all
        </Button>
      )}
    </motion.div>
  );
};
