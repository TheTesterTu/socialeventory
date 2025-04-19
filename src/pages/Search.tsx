import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { mockEvents } from "@/lib/mock-data";
import { Event } from "@/lib/types";
import { Filter, MapPin, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventFilters } from "@/lib/types/filters";
import { VirtualizedEventList } from "@/components/VirtualizedEventList";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import EventMap from "@/components/EventMap";

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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    const categoryParam = params.get('category');

    if (queryParam) {
      setSearchQuery(queryParam);
    }
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  useEffect(() => {
    const filtered = mockEvents.filter((event) => {
      const matchesSearch = 
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategories = 
        selectedCategories.length === 0 ||
        event.category.some(cat => selectedCategories.includes(cat));
      
      const matchesDate = !selectedDate || 
        format(new Date(event.startDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      
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
             matchesPricing &&
             matchesDate;
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategories, filters, selectedDate]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <AppLayout 
      pageTitle="Search Events" 
      pageDescription="Find events that match your interests and preferences"
      showTopBar={true}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-panel p-4 rounded-xl">
          <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
          
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <SearchFilters
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                filters={filters}
                onFilterChange={setFilters}
                onDateChange={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>List</span>
                <Switch
                  checked={viewMode === 'map'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'map' : 'list')}
                  className="data-[state=checked]:bg-primary"
                />
                <span>Map</span>
              </div>
            </div>
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <Badge 
                  key={category} 
                  variant="secondary"
                  className="px-3 py-1"
                >
                  {category}
                  <button 
                    className="ml-2 hover:text-destructive" 
                    onClick={() => toggleCategory(category)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedCategories.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategories([])}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>

        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-2"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[500px]"
          >
            {viewMode === 'list' ? (
              <VirtualizedEventList events={filteredEvents} className="mx-auto" />
            ) : (
              <div className="rounded-xl overflow-hidden h-[600px]">
                <EventMap events={filteredEvents} />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Search;
