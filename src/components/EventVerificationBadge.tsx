import { Check } from "lucide-react";
import { Badge } from "./ui/badge";

interface EventVerificationBadgeProps {
  status: 'pending' | 'verified' | 'featured';
}

export const EventVerificationBadge = ({ status }: EventVerificationBadgeProps) => {
  if (status === 'pending') return null;
  
  return (
    <Badge 
      variant={status === 'featured' ? 'default' : 'secondary'} 
      className="gap-1"
    >
      <Check className="h-3 w-3" />
      {status === 'featured' ? 'Featured' : 'Verified'}
    </Badge>
  );
};