
import { Check, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

interface EventVerificationBadgeProps {
  status: 'pending' | 'verified' | 'featured';
  size?: 'sm' | 'default';
}

export const EventVerificationBadge = ({ status, size = 'default' }: EventVerificationBadgeProps) => {
  if (status === 'pending') {
    return (
      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending Review
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant={status === 'featured' ? 'default' : 'secondary'} 
      className={`gap-1 ${size === 'sm' ? 'text-xs py-0 px-2' : ''}`}
    >
      <Check className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {status === 'featured' ? 'Featured' : 'Verified'}
    </Badge>
  );
};
