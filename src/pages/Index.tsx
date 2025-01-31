import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { mockEvents } from "@/lib/mock-data";
import { useState } from "react";
import EventMap from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { MapIcon, ListIcon } from "lucide-react";
import { TopBar } from "@/components/TopBar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredEvents = mockEvents.filter((event) => {
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
    <>
      <TopBar />
      <div className="min-h-screen p-6 pt-20 space-y-8">
        <header className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold">Discover Events</h1>
          <p className="text-muted-foreground">
            Find and join amazing events happening around you
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        <main className="max-w-4xl mx-auto">
          {viewMode === 'list' ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <EventMap events={filteredEvents} />
          )}
        </main>
      </div>
    </>
  );
};

export default Index;