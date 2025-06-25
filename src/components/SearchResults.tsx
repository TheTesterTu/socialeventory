
import { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { VirtualizedEventList } from "./VirtualizedEventList";
import EventMap from "./EventMap";
import { EventCard } from "./EventCard";

interface SearchResultsProps {
  events: Event[];
  searchQuery?: string;
  viewMode: 'list' | 'map';
}

export const SearchResults = ({ events, searchQuery, viewMode }: SearchResultsProps) => {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <Filter className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-medium mb-2">No events found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or search terms to find events
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[500px]"
    >
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-2 mb-4"
        >
          <p className="text-muted-foreground">
            Showing results for: <span className="font-medium text-foreground">{searchQuery}</span>
          </p>
        </motion.div>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EventCard event={event} index={index} variant="compact" />
              </motion.div>
            ))}
          </div>
          
          {/* Mobile Virtualized List */}
          <div className="md:hidden">
            <VirtualizedEventList events={events} className="mx-auto" />
          </div>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden h-[600px]">
          <EventMap events={events} showFilters={true} />
        </div>
      )}
    </motion.div>
  );
};
