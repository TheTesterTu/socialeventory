import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const EventCardSkeleton = () => {
  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 rounded" /> {/* Title */}

          <div className="space-y-1">
            <Skeleton className="h-4 w-full rounded" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-5/6 rounded" /> {/* Description line 2 */}
          </div>

          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded" /> {/* Category Badge */}
            <Skeleton className="h-5 w-20 rounded" /> {/* Category Badge */}
          </div>

          <div className="space-y-2 pt-2"> {/* Added pt-2 for spacing similar to EventCard */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" /> {/* Icon */}
              <Skeleton className="h-4 w-1/2 rounded" /> {/* Date */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" /> {/* Icon */}
              <Skeleton className="h-4 w-3/4 rounded" /> {/* Location */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" /> {/* Icon */}
              <Skeleton className="h-4 w-1/3 rounded" /> {/* Attendees */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
