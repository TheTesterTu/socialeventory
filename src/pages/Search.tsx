import { useState, useEffect } from "react";
import { mockEvents } from "@/lib/mock-data";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { format } from "date-fns";
import { SearchPageLayout } from "@/components/search/SearchPageLayout";

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
