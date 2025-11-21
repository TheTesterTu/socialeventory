import { motion } from "framer-motion";
import { CalendarPlus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { VideoBackground } from "@/components/shared/VideoBackground";
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-success/60 bg-success/20 backdrop-blur-md shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-success"></span>
          <span className="text-sm font-medium text-white">{stats.totalEvents} upcoming</span>
        </div>
      )}
      {stats.thisWeekEvents > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/60 bg-primary/20 backdrop-blur-md shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-sm font-medium text-white">{stats.thisWeekEvents} this week</span>
        </div>
      )}
      {stats.todayEvents > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-warning/60 bg-warning/20 backdrop-blur-md shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-warning"></span>
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
    <VideoBackground className="min-h-screen w-full flex items-center">
      
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
          >
            {/* Modern floating badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold border-2 border-primary/60 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <Sparkles className="h-4 w-4 text-primary-light animate-pulse" />
              <span className="bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
                Discover Amazing Events Worldwide
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white drop-shadow-2xl leading-tight">
                Find Your{" "}
                <span className="bg-gradient-to-r from-primary-light via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float">
                  Next Epic Experience
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-2xl font-medium">
                Join thousands discovering unforgettable moments every day
              </p>
            </motion.div>

            {/* Modern search bar with glow effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="p-3 sm:p-4 rounded-3xl border-2 border-primary/50 bg-white/95 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-300">
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
                  className="gradient-primary px-10 py-4 h-auto font-bold rounded-2xl w-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/40 border-0 text-lg"
                >
                  <CalendarPlus className="mr-2 h-6 w-6" />
                  Create Event
                </Button>
              </Link>
              <Link to="/search" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-white/95 hover:bg-white text-gray-900 hover:text-black border-2 border-white/60 hover:border-primary/60 px-10 py-4 h-auto font-bold rounded-2xl w-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/40 backdrop-blur-xl text-lg"
                >
                  <Search className="mr-2 h-6 w-6" />
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
    </VideoBackground>
  );
};