import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import EventMap from "@/components/EventMap";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { BackButton } from "@/components/navigation/BackButton";
import { useState } from "react";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";

const Nearby = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // This will be populated with real data
  const [filters, setFilters] = useState<EventFilters>({
    accessibility: {
      wheelchairAccessible: false,
      familyFriendly: false,
    },
    pricing: {
      isFree: false,
      maxPrice: 100,
    }
  });

  const handleSearch = (query: string) => {
    console.log("Searching nearby:", query);
    // TODO: Implement nearby search
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    // TODO: Implement filter logic
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 pt-20 pb-24 md:pt-6 relative"
    >
      <BackButton />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Events Near You</h1>
        <p className="text-muted-foreground">Discover events happening around your location</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <SearchBar onSearch={handleSearch} />
        <SearchFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="rounded-xl overflow-hidden h-[calc(100vh-280px)]">
        <EventMap events={events} />
      </div>
    </motion.div>
  );
};

export default Nearby;