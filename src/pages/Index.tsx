import { EventCard } from "@/components/EventCard";
import { mockEvents, categories } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and join amazing events happening around you
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;