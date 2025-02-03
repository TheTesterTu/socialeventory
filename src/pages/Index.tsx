import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { mockEvents } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import EventMap from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { MapIcon, ListIcon, MapPin, Plus } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { fetchFacebookEvents } from "@/services/facebook";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [events, setEvents] = useState(mockEvents);
  const { toast } = useToast();

  useEffect(() => {
    const loadEvents = async () => {
      const fbEvents = await fetchFacebookEvents('Milano', 5000);
      setEvents(prev => [...prev, ...fbEvents]);
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategories = 
      selectedCategories.length === 0 ||
      event.category.some(cat => selectedCategories.includes(cat));

    return matchesSearch && matchesCategories;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8B5CF6_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#06B6D4_0%,_transparent_30%)]" />
        </div>
      </div>

      <TopBar />
      
      <div className="relative p-6 pt-20 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Discover Events
          </h1>
          <p className="text-muted-foreground">
            Find and join amazing events happening around you
          </p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Location-based search is under development.",
                  });
                }}
                className="flex-1 sm:flex-none rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Near Me
              </Button>
              
              <Link to="/create-event" className="flex-1 sm:flex-none">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-accent to-primary hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center sm:justify-end space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-full transition-all hover:scale-105 flex-1 sm:flex-none"
              >
                <ListIcon className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-full transition-all hover:scale-105 flex-1 sm:flex-none"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl overflow-hidden"
              >
                <EventMap events={filteredEvents} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default Index;