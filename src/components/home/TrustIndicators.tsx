
import { motion } from "framer-motion";
import { Users, Calendar, MapPin, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TrustIndicators = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    cities: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total events
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        // Fetch total users (profiles)
        const { count: usersCount } = await (supabase as any)
          .from('public_profiles')
          .select('*', { count: 'exact', head: true });

        // Estimate cities from unique locations
        const { data: locations } = await supabase
          .from('events')
          .select('location')
          .limit(1000);

        const uniqueCities = new Set(
          locations?.map(e => e.location?.split(',')[0]?.trim()).filter(Boolean) || []
        );

        setStats({
          totalEvents: eventsCount || 0,
          totalUsers: usersCount || 0,
          cities: Math.max(uniqueCities.size, 1),
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
      icon: Calendar,
      value: stats.loading ? "..." : stats.totalEvents.toLocaleString(),
      label: "Events hosted",
    },
    {
      icon: Users,
      value: stats.loading ? "..." : stats.totalUsers.toLocaleString(),
      label: "Community members",
    },
    {
      icon: MapPin,
      value: stats.loading ? "..." : `${stats.cities}+`,
      label: "Cities worldwide",
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfaction rate",
    },
  ];

  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-8 border-y border-border"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center space-y-2"
            >
              <item.icon className="h-6 w-6 text-primary mx-auto" />
              <p className="text-2xl md:text-3xl font-bold text-foreground font-display">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
