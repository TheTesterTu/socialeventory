
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
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative flex items-center rounded-full bg-card/30 backdrop-blur-sm border border-border/50 transition-all ${isFocused ? 'ring-2 ring-primary/20 border-primary/50' : ''}`}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className="pl-10 pr-10 rounded-full border-none bg-transparent focus-visible:ring-0 h-11"
          onChange={handleChange}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-primary/10"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {showIcons && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary/10"
                onClick={handleVoiceSearch}
              >
                <Mic className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary/10"
                onClick={handleImageSearch}
              >
                <Camera className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute mt-2 w-full z-10 bg-card rounded-lg shadow-lg border border-border/50 p-2"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground p-2">
            <span>Try searching for events, places, or categories</span>
            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs flex items-center">
              <Filter className="h-3 w-3" />
              <span>Filters</span>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
