
import { useState } from "react";
import { AppLayoutWithBoundary } from "@/components/layout/AppLayoutWithBoundary";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { EventsGrid } from "@/components/events/EventsGrid";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: events = [], isLoading, error } = useUnifiedEvents({
    searchQuery: searchQuery || undefined,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  return (
    <AppLayoutWithBoundary pageTitle="Events" pageDescription="Discover events in your area">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gradient">All Events</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover amazing events happening around you
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <SearchBar 
                  onSearch={setSearchQuery} 
                  initialValue={searchQuery}
                  placeholder="Search events..."
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 rounded-xl"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border/50 pt-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Categories</h3>
                    {selectedCategories.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(category)}
                        className="rounded-full"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isLoading ? 'Loading...' : `${events.length} events found`}
              </span>
              {(searchQuery || selectedCategories.length > 0) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="glass-panel p-6 rounded-2xl text-center">
              <p className="text-destructive">Error loading events: {error.message}</p>
            </div>
          )}

          <EventsGrid 
            events={events}
            isLoading={isLoading}
            emptyMessage={
              searchQuery || selectedCategories.length > 0
                ? "Try adjusting your search or filters"
                : "No events available at the moment"
            }
          />
        </motion.div>
      </div>
    </AppLayoutWithBoundary>
  );
};

export default Events;
