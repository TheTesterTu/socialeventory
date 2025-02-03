import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search events, venues, or cities..."
        className="pl-10 pr-24 rounded-full bg-card/30 backdrop-blur-sm border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
        onChange={(e) => onSearch(e.target.value)}
      />
    </motion.div>
  );
};