
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Code, Coffee, Palette, Trophy, Briefcase } from "lucide-react";
import { UnifiedButton } from "@/components/ui/unified-button";
import { useNavigate } from "react-router-dom";
import { getCategoryBgColor, getCategoryTextColor } from "@/lib/utils/categoryColors";
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
          .gte('start_date', new Date().toISOString()); // Only upcoming events

        if (error) {
          console.error('Error fetching events:', error);
          return;
        }

        // Count events by category
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
      className="text-center space-y-8"
    >
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Explore Categories
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find events that match your interests
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const count = categoryCounts[category.name] || 0;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UnifiedButton
                variant="outline"
                size="lg"
                onClick={() => handleCategoryClick(category.name)}
                className={`
                  h-auto flex-col gap-2 p-4 md:p-6 min-w-[120px] md:min-w-[140px]
                  transition-all duration-300 group glass-card
                `}
              >
                <div className={`
                  p-2 md:p-3 rounded-full transition-all duration-300
                  ${getCategoryBgColor(category.name)}/20 group-hover:${getCategoryBgColor(category.name)}/30
                `}>
                  <Icon className={`
                    h-5 w-5 md:h-6 md:w-6 transition-colors duration-300
                    ${getCategoryTextColor(category.name)} group-hover:text-white
                  `} />
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-sm md:text-base text-foreground">
                    {category.name}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {loading ? '...' : `${count} events`}
                  </div>
                </div>
              </UnifiedButton>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
