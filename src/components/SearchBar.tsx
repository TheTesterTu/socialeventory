
import { Search, X, Mic, Camera, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  showIcons?: boolean;
}

export const SearchBar = ({ 
  onSearch, 
  initialValue = "", 
  placeholder = "Search events, venues, or cities...",
  showIcons = true 
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVoiceSearch = () => {
    toast({
      title: "Voice Search",
      description: "Voice search is coming soon!",
    });
  };

  const handleImageSearch = () => {
    toast({
      title: "Image Search",
      description: "Image search is coming soon!",
    });
  };

  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative flex items-center rounded-full bg-background/90 backdrop-blur-sm border-2 border-border/50 transition-all ${isFocused ? 'ring-2 ring-primary/30 border-primary/50' : ''}`}>
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className="pl-12 pr-20 sm:pr-24 rounded-full border-none bg-transparent focus-visible:ring-0 h-12 text-base"
          onChange={handleChange}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {showIcons && (
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
                onClick={handleVoiceSearch}
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
                onClick={handleImageSearch}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute mt-2 w-full z-10 bg-card rounded-lg shadow-lg border border-border/50 p-3"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Try searching for events, places, or categories</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-sm flex items-center">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
