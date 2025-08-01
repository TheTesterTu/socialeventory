
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { ActiveFilters } from "@/components/ActiveFilters";
import { SearchResults } from "@/components/SearchResults";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { format } from "date-fns";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  // Use real data from Supabase
  const { data: events = [], isLoading } = useUnifiedEvents({
    searchQuery: searchQuery || undefined,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

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

  // Filter events based on additional criteria (date, accessibility, pricing)
  const filteredEvents = events.filter((event) => {
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

    return matchesAccessibility && 
           matchesFamilyFriendly && 
           matchesPricing &&
           matchesDate;
  });

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
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} found`}
            </div>
          </div>
          
          <ActiveFilters 
            selectedCategories={selectedCategories}
            onClearCategory={toggleCategory}
            onClearAll={() => setSelectedCategories([])}
          />
        </div>

        <SearchResults 
          events={filteredEvents} 
          searchQuery={searchQuery}
          viewMode={viewMode}
        />
      </motion.div>
    </AppLayout>
  );
};

export default SearchPage;
