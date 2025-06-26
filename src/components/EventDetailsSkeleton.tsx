
import { Skeleton } from "@/components/ui/skeleton";

export const EventDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 container-padding">
      {/* Hero Image Skeleton */}
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          
          {/* Description */}
          <div className="glass-card card-padding rounded-2xl space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          {/* Tags */}
          <div className="glass-card card-padding rounded-2xl space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="glass-card card-padding rounded-2xl">
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
        
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card card-padding rounded-2xl space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          <div className="glass-card card-padding rounded-2xl space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
