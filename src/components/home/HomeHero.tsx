import { motion } from "framer-motion";
import { CalendarPlus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DynamicStats = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    thisWeekEvents: 0,
    todayEvents: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        // Total upcoming events
        const { count: totalEvents } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', now.toISOString());

        // Events this week
        const { count: thisWeekEvents } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', weekAgo.toISOString())
          .lt('start_date', now.toISOString());

        // Events today
        const { count: todayEvents } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', todayStart.toISOString())
          .lt('start_date', todayEnd.toISOString());

        setStats({
          totalEvents: totalEvents || 0,
          thisWeekEvents: thisWeekEvents || 0,
          todayEvents: todayEvents || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/70 bg-primary/30 backdrop-blur-sm shadow-lg">
        <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-sm font-medium text-white">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {stats.totalEvents > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-emerald-400/70 bg-emerald-500/30 backdrop-blur-sm shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm font-medium text-white">{stats.totalEvents} upcoming</span>
        </div>
      )}
      {stats.thisWeekEvents > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/70 bg-primary/30 backdrop-blur-sm shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-sm font-medium text-white">{stats.thisWeekEvents} this week</span>
        </div>
      )}
      {stats.todayEvents > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-400/70 bg-amber-500/30 backdrop-blur-sm shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
          <span className="text-sm font-medium text-white">{stats.todayEvents} today</span>
        </div>
      )}
    </>
  );
};

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
    <div className="relative overflow-hidden min-h-screen w-full flex items-center">
      {/* Full viewport background - properly responsive */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Abstract geometric pattern"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
          >
            {/* Badge with improved contrast */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium border-2 border-primary bg-primary/30 backdrop-blur-sm shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span>Discover epic events worldwide</span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white drop-shadow-xl">
                Find Your{" "}
                <span className="text-gradient">
                  Next Epic Experience
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Unforgettable moments await you
              </p>
            </motion.div>

            {/* Search bar with improved contrast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="p-2 sm:p-3 rounded-2xl border-2 border-primary/30 bg-white/98 backdrop-blur-sm shadow-2xl">
                <SearchBar onSearch={handleSearch} />
              </div>
            </motion.div>

            {/* Action buttons with consistent styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <Link to="/create-event" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="gradient-primary px-8 py-3 h-auto font-semibold rounded-xl w-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-primary hover:border-primary/80"
                >
                  <CalendarPlus className="mr-2 h-5 w-5" />
                  Create Event
                </Button>
              </Link>
              <Link to="/search" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-white/95 hover:bg-white text-gray-900 hover:text-black border-2 border-primary/30 hover:border-primary/50 px-8 py-3 h-auto font-semibold rounded-xl w-full shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Explore All
                </Button>
              </Link>
            </motion.div>

            {/* Dynamic Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center flex-wrap gap-3 lg:gap-4"
            >
              <DynamicStats />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};