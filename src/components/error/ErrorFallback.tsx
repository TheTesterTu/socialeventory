
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  minimal?: boolean;
}

export const ErrorFallback = ({ error, resetError, minimal = false }: ErrorFallbackProps) => {
  const navigate = useNavigate();

  if (minimal) {
    return (
      <div className="p-4 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-3">Something went wrong</p>
        <Button onClick={resetError} size="sm" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <CardTitle>Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto whitespace-pre-wrap">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2 justify-center">
            <Button onClick={resetError} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
