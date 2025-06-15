
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { observePerformance } from "@/utils/performance";

interface ProductionLayoutProps {
  children: React.ReactNode;
}

export const ProductionLayout = ({ children }: ProductionLayoutProps) => {
  useEffect(() => {
    // Start performance monitoring in production
    const cleanup = observePerformance();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">Loading SocialEventory...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
