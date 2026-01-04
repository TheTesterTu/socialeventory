
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

const LiveIndicator = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('start_date', new Date().toISOString());
      setCount(count || 0);
    };
    fetchCount();
  }, []);

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </span>
      {count} live events
    </motion.div>
  );
};

export const HomeHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Accent gradient orb */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="section-container relative z-10 py-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Live indicator */}
            <LiveIndicator />

            {/* Main headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-display-lg"
              >
                Discover events
                <br />
                <span className="text-primary">worth attending</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                Find concerts, workshops, exhibitions and more.
                <br className="hidden sm:block" />
                Connect with your community.
              </motion.p>
            </div>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-xl"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search events, venues, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-modern h-14 text-base pl-12"
                />
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="btn-primary h-14 px-8 text-base"
              >
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.form>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              <Link to="/search?category=Music">
                <span className="badge-muted hover:bg-muted/80 transition-colors cursor-pointer">
                  🎵 Music
                </span>
              </Link>
              <Link to="/search?category=Technology">
                <span className="badge-muted hover:bg-muted/80 transition-colors cursor-pointer">
                  💻 Tech
                </span>
              </Link>
              <Link to="/search?category=Food%20%26%20Drink">
                <span className="badge-muted hover:bg-muted/80 transition-colors cursor-pointer">
                  🍕 Food
                </span>
              </Link>
              <Link to="/search?category=Art%20%26%20Culture">
                <span className="badge-muted hover:bg-muted/80 transition-colors cursor-pointer">
                  🎨 Art
                </span>
              </Link>
              <Link to="/nearby">
                <span className="badge-primary cursor-pointer">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Near me
                </span>
              </Link>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/events">
                <Button size="lg" variant="outline" className="btn-outline h-12">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse all events
                </Button>
              </Link>
              <Link to="/create-event">
                <Button size="lg" variant="ghost" className="btn-ghost h-12 text-primary hover:text-primary">
                  Create an event
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
