
import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { format } from "date-fns";
import { SearchPageLayout } from "@/components/search/SearchPageLayout";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";

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

  // Use unified events hook
  const { data: events = [], isLoading } = useUnifiedEvents({
    searchQuery: searchQuery || undefined,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

  // Apply additional client-side filters
  const filteredEvents = events.filter((event) => {
    // Date filter
    if (selectedDate) {
      const eventDate = format(new Date(event.startDate), 'yyyy-MM-dd');
      const filterDate = format(selectedDate, 'yyyy-MM-dd');
      if (eventDate !== filterDate) return false;
    }

    // Accessibility filters
    const matchesAccessibility =
      !filters.accessibility?.wheelchairAccessible || event.accessibility.wheelchairAccessible;

    const matchesFamilyFriendly =
      !filters.accessibility?.familyFriendly || event.accessibility.familyFriendly;

    // Pricing filters
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
