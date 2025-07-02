
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReactNode } from "react";

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

export const SafeComponent = ({ children, fallback, name }: SafeComponentProps) => {
  return (
    <ErrorBoundary
      fallback={fallback || (
        <div className="p-4 text-center text-muted-foreground" data-error-boundary="true">
          <p>Something went wrong {name ? `in ${name}` : ''}.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      )}
    >
      <div data-error-boundary="true">
        {children}
      </div>
    </ErrorBoundary>
  );
};
