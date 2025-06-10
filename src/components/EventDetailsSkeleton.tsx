
// import { motion } from "framer-motion"; // Removed unused motion

export const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-48 bg-muted rounded"></div>
      </div>
    </div>
  );
};
