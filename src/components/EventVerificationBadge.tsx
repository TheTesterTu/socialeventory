
import { Check, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useSecureAdmin } from '@/hooks/useSecureAdmin';

interface EventVerificationBadgeProps {
  status: 'pending' | 'verified' | 'featured';
  size?: 'sm' | 'default';
  showForAdmin?: boolean;
}

export const EventVerificationBadge = ({ 
  status, 
  size = 'default', 
  showForAdmin = true 
}: EventVerificationBadgeProps) => {
  const { isAdmin } = useSecureAdmin();
  const shouldShowAdmin = showForAdmin && isAdmin;
  
  // Only show pending status for admins
  if (status === 'pending') {
    if (!shouldShowAdmin) return null;
    
    return (
      <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
        <Clock className="w-3 h-3 mr-1" />
        Pending Review
      </Badge>
    );
  }
  
  // Show verified/featured for everyone
  if (status === 'verified' || status === 'featured') {
    return (
      <Badge 
        variant={status === 'featured' ? 'default' : 'secondary'} 
        className={`gap-1 ${size === 'sm' ? 'text-xs py-0 px-2' : ''}`}
      >
        <Check className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
        {status === 'featured' ? 'Featured' : 'Verified'}
      </Badge>
    );
  }
  
  return null;
};
