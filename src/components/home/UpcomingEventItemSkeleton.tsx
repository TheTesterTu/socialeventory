import { Skeleton } from "@/components/ui/skeleton";

export const UpcomingEventItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4 p-2"> {/* p-2 to mimic potential item padding */}
      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" /> {/* For Date Icon/Box */}
      <div className="flex-1 space-y-2 pt-1"> {/* pt-1 to align text better with icon box */}
        <Skeleton className="h-4 w-3/4 rounded" /> {/* Event Title */}
        <Skeleton className="h-3 w-1/2 rounded" /> {/* Subtitle/Details (e.g., location or time) */}
        <div className="flex gap-1 pt-1"> {/* Optional: For category badges or similar small tags */}
            <Skeleton className="h-3 w-10 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};
