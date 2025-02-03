import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { mockEvents } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import EventMap from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, Calendar, Search, Filter } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { fetchFacebookEvents } from "@/services/facebook";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [events, setEvents] = useState(mockEvents);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const MobileLayout = () => (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 pt-16 space-y-4 bg-gradient-to-b from-background to-background/95">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Discover Events
          </h1>
        </motion.div>

        <div className="relative glass-panel p-3">
          <SearchBar onSearch={setSearchQuery} />
          <div className="mt-3 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Calendar view is under development.",
                });
              }}
              className="flex-1 bg-secondary/20 hover:bg-secondary/30"
            >
              <Calendar className="h-4 w-4" />
              <span className="ml-2">Date</span>
            </Button>
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
            <span>View Mode</span>
            <div className="flex items-center gap-2">
              <span>List</span>
              <Switch
                checked={viewMode === 'map'}
                onCheckedChange={(checked) => setViewMode(checked ? 'map' : 'list')}
                className="data-[state=checked]:bg-primary"
              />
              <span>Map</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Location-based search is under development.",
                });
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Near Me
            </Button>
            
            <Link to="/create-event" className="w-full">
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard {...event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-280px)] rounded-xl overflow-hidden"
            >
              <EventMap events={filteredEvents} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const DesktopLayout = () => (
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
        <div className="glass-panel p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <div className="flex-1 w-full">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Calendar view is under development.",
                  });
                }}
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <SearchFilters
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Location-based search is under development.",
                  });
                }}
                className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Near Me
              </Button>
              
              <Link to="/create-event" className="flex-1 sm:flex-none">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
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
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8B5CF6_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#06B6D4_0%,_transparent_30%)]" />
        </div>
      </div>

      <TopBar />
      
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};

export default Index;