
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { SearchResults } from "../SearchResults";
import { SearchBar } from "../SearchBar";
import { SearchFilters } from "../SearchFilters";
import { ActiveFilters } from "../ActiveFilters";

interface SearchPageLayoutProps {
  searchQuery: string;
  selectedCategories: string[];
  filteredEvents: Event[];
  viewMode: 'list' | 'map';
  onSearch: (query: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearCategories: () => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onDateChange: (date: Date | undefined) => void;
  selectedDate?: Date;
  onViewModeChange: (mode: 'list' | 'map') => void;
}

export const SearchPageLayout = ({
  searchQuery,
  selectedCategories,
  filteredEvents,
  viewMode,
  onSearch,
  onCategoryToggle,
  onClearCategories,
  filters,
  onFilterChange,
  onDateChange,
  selectedDate,
  onViewModeChange,
}: SearchPageLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="glass-panel p-4 rounded-xl">
        <SearchBar onSearch={onSearch} initialValue={searchQuery} />
        
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={onCategoryToggle}
              filters={filters}
              onFilterChange={onFilterChange}
              onDateChange={onDateChange}
              selectedDate={selectedDate}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </div>
        </div>
        
        <ActiveFilters 
          selectedCategories={selectedCategories}
          onClearCategory={onCategoryToggle}
          onClearAll={onClearCategories}
        />
      </div>

      <SearchResults 
        events={filteredEvents} 
        searchQuery={searchQuery}
        viewMode={viewMode}
      />
    </motion.div>
  );
};
