
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { EventSocialActions } from "./EventSocialActions";
import { UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EventActionButtonsProps {
  eventId: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  attendees?: number;
  isAttending?: boolean;
}

export const EventActionButtons = ({ 
  eventId, 
  likes, 
  comments, 
  isLiked,
  attendees = 0,
  isAttending = false 
}: EventActionButtonsProps) => {
  const [attending, setAttending] = useState(isAttending);
  const [attendeeCount, setAttendeeCount] = useState(attendees);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const attendMutation = useMutation({
    mutationFn: async () => {
      if (attending) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .match({ event_id: eventId, user_id: user?.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (attending) {
        setAttendeeCount(prev => Math.max(0, prev - 1));
        toast.success("You're no longer attending this event");
      } else {
        setAttendeeCount(prev => prev + 1);
        toast.success("You're now attending this event!");
      }
      setAttending(!attending);
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: () => {
      toast.error("Failed to update attendance status");
    }
  });

  const handleAttendance = () => {
    if (!user) {
      toast("Please sign in to RSVP for events");
      return;
    }
    attendMutation.mutate();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <EventSocialActions 
          eventId={eventId} 
          likes={likes} 
          comments={comments}
          isLiked={isLiked}
        />
        <Button 
          variant={attending ? "default" : "outline"} 
          size="sm"
          className="gap-1"
          onClick={handleAttendance}
          disabled={attendMutation.isPending}
        >
          {attending ? (
            <>
              <UserMinus className="h-4 w-4" />
              Attending ({attendeeCount})
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Attend ({attendeeCount})
            </>
          )}
        </Button>
      </div>
      <Link to={`/event/${eventId}`}>
        <Button variant="secondary">
          View Details
        </Button>
      </Link>
    </div>
  );
};
