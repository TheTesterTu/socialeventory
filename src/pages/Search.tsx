
import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { format } from "date-fns";
import { SearchPageLayout } from "@/components/search/SearchPageLayout";
import { useSearchEvents } from "@/hooks/useSearchEvents";
import { useEvents } from "@/hooks/useEvents";

const Search = () => {
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

  // Get search parameters
  const searchParams = {
    query: searchQuery || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    dateRange: selectedDate ? [
      format(selectedDate, 'yyyy-MM-dd'),
      format(selectedDate, 'yyyy-MM-dd')
    ] as [string, string] : undefined,
  };

  // Use search hook when we have search parameters, otherwise get all events
  const { data: searchResults, isLoading: searchLoading } = useSearchEvents(searchParams);
  const { data: allEvents, isLoading: allEventsLoading } = useEvents();
  
  const hasSearchCriteria = searchQuery || selectedCategories.length > 0 || selectedDate;
  const events = hasSearchCriteria ? (searchResults || []) : (allEvents || []);
  const isLoading = hasSearchCriteria ? searchLoading : allEventsLoading;

  // Apply additional client-side filters
  const filteredEvents = events.filter((event) => {
    const matchesAccessibility =
      !filters.accessibility?.wheelchairAccessible || event.accessibility.wheelchairAccessible;

    const matchesFamilyFriendly =
      !filters.accessibility?.familyFriendly || event.accessibility.familyFriendly;

    const matchesPricing =
      (!filters.pricing?.isFree || event.pricing.isFree) &&
      (!filters.pricing?.maxPrice || 
        (event.pricing.priceRange && event.pricing.priceRange[1] <= filters.pricing.maxPrice));

    return matchesAccessibility && matchesFamilyFriendly && matchesPricing;
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (isLoading) {
    return (
      <AppLayout 
        pageTitle="Search Events" 
        pageDescription="Find events that match your interests and preferences"
        showTopBar={true}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      pageTitle="Search Events" 
      pageDescription="Find events that match your interests and preferences"
      showTopBar={true}
    >
      <SearchPageLayout 
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        filteredEvents={filteredEvents}
        viewMode={viewMode}
        onSearch={setSearchQuery}
        onCategoryToggle={toggleCategory}
        onClearCategories={() => setSelectedCategories([])}
        filters={filters}
        onFilterChange={setFilters}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        onViewModeChange={setViewMode}
      />
    </AppLayout>
  );
};

export default Search;
