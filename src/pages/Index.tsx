import { EventCard } from "@/components/EventCard";
import { mockEvents, categories } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Event } from "@/lib/types";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    <div className="min-h-screen p-6 space-y-8">
      <header className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and join amazing events happening around you
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, venues, or locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Near Me
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;