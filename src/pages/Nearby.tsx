import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import EventMap from "@/components/EventMap";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { useState } from "react";
import { Event } from "@/lib/types";

const Nearby = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // This will be populated with real data

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 pt-20 pb-24 md:pt-24"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Events Near You</h1>
        <p className="text-muted-foreground">Discover events happening around your location</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <SearchBar onSearch={handleSearch} />
        <SearchFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <EventMap events={events} />
      </div>
    </motion.div>
  );
};

export default Nearby;