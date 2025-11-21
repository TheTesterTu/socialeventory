
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Code, Coffee, Palette, Trophy, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { name: "Music", icon: Music },
  { name: "Technology", icon: Code },
  { name: "Food & Drink", icon: Coffee },
  { name: "Art & Culture", icon: Palette },
  { name: "Sports", icon: Trophy },
  { name: "Business", icon: Briefcase },
];

export const QuickCategories = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { data: events, error } = await supabase
          .from('events')
          .select('category')
          .gte('start_date', new Date().toISOString());

        if (error) {
          console.error('Error fetching events:', error);
          return;
        }

        const counts: Record<string, number> = {};
        
        events?.forEach(event => {
          if (event.category && Array.isArray(event.category)) {
            event.category.forEach(cat => {
              counts[cat] = (counts[cat] || 0) + 1;
            });
          }
        });

        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center space-y-10"
    >
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gradient-subtle">
          Explore Categories
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Find events that match your interests
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const count = categoryCounts[category.name] || 0;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleCategoryClick(category.name)}
                className="w-full h-full flex flex-col items-center gap-3 p-6 rounded-3xl glass-card card-lift group hover:border-primary/40 transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all duration-300 shadow-lg">
                  <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:text-primary-dark transition-colors duration-300" />
                </div>
                <div className="space-y-1 text-center">
                  <span className="font-bold text-base md:text-lg text-foreground block">
                    {category.name}
                  </span>
                  <div className="text-sm text-muted-foreground font-medium">
                    {loading ? '...' : `${count} events`}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
