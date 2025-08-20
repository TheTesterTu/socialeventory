import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUserSync, isProductionToolsEnabled } from '@/utils/adminAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If production tools are disabled entirely, redirect
  if (!isProductionToolsEnabled()) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If not admin, show access denied
  if (!isAdminUserSync(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              You don't have permission to access this admin area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};