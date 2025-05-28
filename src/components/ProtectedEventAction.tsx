
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

interface ProtectedEventActionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedEventAction = ({ 
  children, 
  fallback 
}: ProtectedEventActionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return fallback || (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/auth')}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        Login to interact
      </Button>
    );
  }

  return <>{children}</>;
};
