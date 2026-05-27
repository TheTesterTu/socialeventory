
import { motion } from "framer-motion";
import { ModernEventCard } from "./ModernEventCard";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const FeaturedEvents = () => {
  const { data: events = [], isLoading, error } = useUnifiedEvents({
    featured: true,
    limit: 6,
    sortBy: 'start_date',
    sortOrder: 'asc'
  });

  if (isLoading) {
    return (
      <section className="section-spacing bg-muted/30">
        <div className="section-container space-y-8">
          <div className="space-y-2">
            <h2 className="text-headline text-3xl md:text-4xl">Featured events</h2>
            <p className="text-muted-foreground text-lg">Handpicked experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-card rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-spacing bg-muted/30">
        <div className="section-container">
          <div className="card-modern p-12 text-center">
            <p className="text-destructive font-medium">Error loading events</p>
            <p className="text-muted-foreground text-sm mt-1">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="section-spacing bg-muted/30">
        <div className="section-container">
          <div className="card-modern p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No featured events yet</p>
            <p className="text-muted-foreground text-sm mt-1">Check back soon for exciting events!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium text-sm">Curated</span>
              </div>
              <h2 className="text-headline text-3xl md:text-4xl">
                Featured events
              </h2>
              <p className="text-muted-foreground text-lg">
                Handpicked experiences just for you
              </p>
            </div>
            <Link to="/events">
              <Button variant="ghost" className="hidden sm:flex btn-ghost gap-2 hover:gap-3 transition-all">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <ModernEventCard 
                key={event.id} 
                event={event} 
                index={index}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>

          {/* Mobile CTA */}
          <Link to="/events" className="sm:hidden block">
            <Button variant="outline" className="w-full btn-outline gap-2">
              View all events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
