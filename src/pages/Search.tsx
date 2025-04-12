
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mock-data";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Event } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Filter, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventFilters } from "@/lib/types/filters";
import { VirtualizedEventList } from "@/components/VirtualizedEventList";
import { useIsMobile } from "@/hooks/use-mobile";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    accessibility: {
      wheelchairAccessible: false,
      familyFriendly: false,
      languages: ["en"],
    },
    pricing: {
      isFree: false,
      maxPrice: 100,
    },
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Filter events based on search query and categories
    const filtered = mockEvents.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategories = 
        selectedCategories.length === 0 ||
        event.category.some(cat => selectedCategories.includes(cat));
      
      const matchesAccessibility =
        !filters.accessibility?.wheelchairAccessible || event.accessibility.wheelchairAccessible;
  
      const matchesFamilyFriendly =
        !filters.accessibility?.familyFriendly || event.accessibility.familyFriendly;
  
      const matchesPricing =
        (!filters.pricing?.isFree || event.pricing.isFree) &&
        (!filters.pricing?.maxPrice || 
          (event.pricing.priceRange && event.pricing.priceRange[1] <= filters.pricing.maxPrice));
  
      return matchesSearch && 
             matchesCategories && 
             matchesAccessibility && 
             matchesFamilyFriendly && 
             matchesPricing;
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategories, filters]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className={`pt-16 ${isMobile ? 'pb-20' : 'pb-8'} px-4 md:px-6 max-w-7xl mx-auto`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Search Events
          </h1>
          <p className="text-muted-foreground">
            Find events that match your interests
          </p>
        </motion.div>

        <div className="glass-panel p-4 rounded-xl mb-6">
          <SearchBar onSearch={setSearchQuery} />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <SearchFilters
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                filters={filters}
                onFilterChange={setFilters}
              />
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              >
                <MapPin className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>
          </div>
        </div>

        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-2"
          >
            <p className="text-muted-foreground">
              Showing results for: <span className="font-medium text-foreground">{searchQuery}</span>
            </p>
          </motion.div>
        )}

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Filter className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your filters or search terms to find events
            </p>
          </motion.div>
        ) : (
          <>
            {isMobile ? (
              <div className="grid gap-4">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <VirtualizedEventList events={filteredEvents} className="mx-auto" />
            )}
          </>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Search;
