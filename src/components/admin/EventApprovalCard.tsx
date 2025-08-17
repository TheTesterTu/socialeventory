import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Eye, 
  Trash2, 
  MapPin, 
  Calendar,
  Users
} from "lucide-react";
import { Event } from "@/lib/types";
import { toast } from "sonner";

interface EventApprovalCardProps {
  event: Event;
  onApprove: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  onDelete: (eventId: string) => Promise<{ success: boolean; error?: string }>;
}

export const EventApprovalCard = ({ 
  event, 
  onApprove, 
  onReject, 
  onDelete 
}: EventApprovalCardProps) => {
  const handleApprove = async () => {
    const result = await onApprove(event.id);
    if (result.success) {
      toast.success("Event approved successfully");
    } else {
      toast.error(result.error || "Failed to approve event");
    }
  };

  const handleReject = async () => {
    const result = await onReject(event.id);
    if (result.success) {
      toast.success("Event rejected");
    } else {
      toast.error(result.error || "Failed to reject event");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    
    const result = await onDelete(event.id);
    if (result.success) {
      toast.success("Event deleted");
    } else {
      toast.error(result.error || "Failed to delete event");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Event Image */}
          <div className="flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {event.title}
              </h3>
              <Badge variant="secondary" className="ml-2">
                {event.verification.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{event.location.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-4">
              {event.category.map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`/events/${event.id}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700"
            onClick={handleApprove}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-orange-600 hover:text-orange-700"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};