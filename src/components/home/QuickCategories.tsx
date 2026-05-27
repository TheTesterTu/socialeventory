
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Code, Coffee, Palette, Trophy, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const categories = [
  { 
    name: "Music", 
    icon: Music, 
    color: "bg-category-music",
    description: "Concerts & festivals"
  },
  { 
    name: "Technology", 
    icon: Code, 
    color: "bg-category-tech",
    description: "Meetups & conferences"
  },
  { 
    name: "Food & Drink", 
    icon: Coffee, 
    color: "bg-category-food",
    description: "Tastings & pop-ups"
  },
  { 
    name: "Art & Culture", 
    icon: Palette, 
    color: "bg-category-art",
    description: "Exhibitions & shows"
  },
  { 
    name: "Sports", 
    icon: Trophy, 
    color: "bg-category-sports",
    description: "Games & activities"
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    color: "bg-category-business",
    description: "Networking & workshops"
  },
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
    <section className="section-spacing">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-headline text-3xl md:text-4xl">
                Browse by category
              </h2>
              <p className="text-muted-foreground text-lg">
                Find exactly what you're looking for
              </p>
            </div>
            <Link 
              to="/events" 
              className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const count = categoryCounts[category.name] || 0;
              
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleCategoryClick(category.name)}
                  className="card-interactive p-5 flex flex-col items-center text-center gap-3 group"
                >
                  <div className={cn(
                    "p-3 rounded-xl transition-transform duration-200 group-hover:scale-110",
                    category.color,
                    "text-white"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground block">
                      {category.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {loading ? '...' : `${count} events`}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile view all link */}
          <Link 
            to="/events" 
            className="sm:hidden flex items-center justify-center gap-2 text-primary font-medium py-3"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
