
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, session, loading, refreshSession } = useAuth();
  const location = useLocation();
  
  // Attempt to refresh the session if we have a user but no session
  useEffect(() => {
    if (user && !session && !loading) {
      refreshSession();
    }
  }, [user, session, loading, refreshSession]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium">Loading...</span>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we verify your authentication</p>
      </div>
    );
  }

  if (!user || !session) {
    // Save the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If this route requires admin access, check the user's role
  if (adminOnly && user.user_metadata?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to view this page</p>
        <Navigate to="/events" replace />
      </div>
    );
  }

  return <>{children}</>;
};
