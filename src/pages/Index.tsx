import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";

// Mock data - replace with real data later
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Summer Night Festival",
    date: "Tomorrow at 8 PM",
    location: "Central Park",
    imageUrl: "/lovable-uploads/bbfe17ea-9d17-4ecd-b521-a6b69a98c062.png",
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    date: "Next Week",
    location: "Convention Center",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Art Gallery Opening",
    date: "This Weekend",
    location: "Downtown Gallery",
    imageUrl: "/placeholder.svg",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events] = useState(MOCK_EVENTS);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          Discover Amazing Events
        </h1>
        <p className="text-muted-foreground">
          Find and share the best events happening around you
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;