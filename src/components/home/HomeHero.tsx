
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
    <div className="relative overflow-hidden">
      {/* Modern background with subtle gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-primary text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            <span>Discover the best events in your area</span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Find Your{" "}
              <span className="text-gradient">
                Next Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Concerts, workshops, meetups and more. Discover events that match your interests and connect with your community.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-panel p-2 rounded-2xl">
              <SearchBar onSearch={handleSearch} />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link to="/create-event">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 h-auto font-medium rounded-xl w-full sm:w-auto modern-shadow"
              >
                <CalendarPlus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg"
                className="glass-card hover:bg-accent/50 px-8 py-3 h-auto font-medium rounded-xl w-full sm:w-auto"
              >
                <Search className="mr-2 h-5 w-5" />
                Advanced Search
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center flex-wrap gap-6 lg:gap-8 pt-8"
          >
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-medium text-foreground">10+ live events now</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-medium text-foreground">1000+ events this week</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="text-sm font-medium text-foreground">100+ new today</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
