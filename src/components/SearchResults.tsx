
import { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { Filter, AlertCircle } from "lucide-react";
import { VirtualizedEventList } from "./VirtualizedEventList";
import EventMap from "./EventMap";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SearchResultsProps {
  events: Event[];
  searchQuery?: string;
  viewMode: 'list' | 'map';
  isLoading?: boolean;
  error?: Error | null;
}

export const SearchResults = ({ events, searchQuery, viewMode, isLoading, error }: SearchResultsProps) => {
  if (isLoading && viewMode === 'list') {
    return (
      <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 sm:gap-y-10 py-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // For map view, isLoading for event data might mean the map shows fewer markers or a generic loading state.
  // EventMap itself handles its internal map loading. So, we don't render skeletons for viewMode 'map' here.
  // If SearchPage wants a spinner for map loading, it should be placed there, over the map area.

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Error Loading Events</AlertTitle>
        <AlertDescription>
          {error.message || "We encountered an issue fetching events. Please try refreshing or check back later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (events.length === 0) {
    // This message is now shown only if not loading and no error, and events array is empty.
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
        <VirtualizedEventList events={events} className="mx-auto" />
      ) : (
        <div className="rounded-xl overflow-hidden h-[600px]">
          <EventMap events={events} />
        </div>
      )}
    </motion.div>
  );
};
