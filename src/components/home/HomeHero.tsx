
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
    <div className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Epic background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Events background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-white text-sm font-medium border border-white/30 bg-black/30 backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Discover epic events worldwide</span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white drop-shadow-xl">
              Find Your{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Next Epic Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Unforgettable moments await you
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-panel p-2 rounded-2xl border border-white/30 bg-black/20 backdrop-blur-xl">
              <SearchBar onSearch={handleSearch} />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4"
          >
            <Link to="/create-event">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-auto font-medium rounded-xl w-full sm:w-auto shadow-xl shadow-primary/25 border border-primary/20"
              >
                <CalendarPlus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 bg-black/30 hover:bg-black/50 text-white backdrop-blur-xl px-8 py-3 h-auto font-medium rounded-xl w-full sm:w-auto shadow-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore All
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center flex-wrap gap-4 lg:gap-6 pt-6"
          >
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg border border-white/30 bg-black/30 backdrop-blur-xl">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-medium text-white">Live now</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg border border-white/30 bg-black/30 backdrop-blur-xl">
              <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-medium text-white">1000+ this week</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg border border-white/30 bg-black/30 backdrop-blur-xl">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="text-sm font-medium text-white">New daily</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
