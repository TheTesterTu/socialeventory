
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

interface ProductionLayoutProps {
  children: React.ReactNode;
}

export const ProductionLayout = ({ children }: ProductionLayoutProps) => {
  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
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
