
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export const SearchBar = ({ 
  onSearch, 
  initialValue = "", 
  placeholder = "Search events, venues, or cities..."
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center rounded-full bg-white border-2 transition-all ${isFocused ? 'ring-2 ring-primary/30 border-primary' : 'border-gray-200'}`}>
        <Search className="absolute left-4 h-5 w-5 text-gray-500 pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className="pl-12 pr-12 rounded-full border-none bg-transparent focus-visible:ring-0 h-12 text-base text-gray-900 placeholder:text-gray-500"
          onChange={handleChange}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
