
import { motion } from "framer-motion";
import { CalendarPlus, Search, Sparkles } from "lucide-react";
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
      className="relative space-y-6 mb-10 w-full overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8B5CF6_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#06B6D4_0%,_transparent_30%)]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Discover the best events in your area</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Find Your Next Experience
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Concerts, workshops, meetups and more. Discover events that match your interests and connect with your community.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto w-full"
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
      >
        <Link to="/create-event">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 transition-all w-full sm:w-auto"
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </Link>
        <Link to="/search">
          <Button 
            variant="outline" 
            size="lg"
            className="border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all w-full sm:w-auto"
          >
            <Search className="mr-2 h-5 w-5" />
            Advanced Search
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex items-center justify-center flex-wrap gap-6 pt-4"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-sm text-muted-foreground">10+ live events now</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-sm text-muted-foreground">1000+ events this week</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-400"></span>
          <span className="text-sm text-muted-foreground">100+ new today</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
