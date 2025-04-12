
import { motion } from "framer-motion";
import { CalendarPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomeHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-6 mb-8"
    >
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8B5CF6_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#06B6D4_0%,_transparent_30%)]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-2 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Discover Amazing Events
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Find and join incredible events happening around you. Connect with your community and make memories.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
      >
        <Link to="/create-event">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 transition-all"
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </Link>
        <Link to="/search">
          <Button 
            variant="outline" 
            size="lg"
            className="border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Search className="mr-2 h-5 w-5" />
            Advanced Search
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};
