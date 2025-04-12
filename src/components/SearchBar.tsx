
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search events, venues, or cities..."
        className="pl-10 pr-10 rounded-full bg-card/30 backdrop-blur-sm border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
        onChange={handleChange}
        value={value}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-primary/10"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};
