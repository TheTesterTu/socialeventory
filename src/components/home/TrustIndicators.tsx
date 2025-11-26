import { motion } from "framer-motion";
import { Users, MapPin, Calendar, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TrustIndicators = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    avgRating: 4.8,
    citiesCovered: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsResult, profilesResult] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true })
        ]);

        // Count unique cities from events
        const { data: events } = await supabase
          .from('events')
          .select('location');
        
        const uniqueCities = new Set(
          events?.map(e => e.location?.split(',')[0]?.trim()).filter(Boolean)
        );

        setStats({
          totalUsers: profilesResult.count || 0,
          totalEvents: eventsResult.count || 0,
          avgRating: 4.8,
          citiesCovered: uniqueCities.size || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const indicators = [
    {
      icon: Users,
      value: stats.loading ? "..." : `${Math.floor(stats.totalUsers / 100) * 100}+`,
      label: "Active Users",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      value: stats.loading ? "..." : `${stats.totalEvents}+`,
      label: "Events Hosted",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      value: stats.loading ? "..." : `${stats.citiesCovered}+`,
      label: "Cities Covered",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      value: stats.avgRating.toFixed(1),
      label: "Average Rating",
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-16 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trusted by <span className="text-gradient">Thousands</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground"
          >
            Join our growing community of event enthusiasts
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 rounded-2xl text-center group hover:border-primary/40 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${indicator.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                  {indicator.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {indicator.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
