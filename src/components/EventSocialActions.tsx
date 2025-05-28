
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEventInteraction } from "@/hooks/useEvents";
import { ProtectedEventAction } from "./ProtectedEventAction";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface EventSocialActionsProps {
  eventId: string;
  likes: number;
  comments: number;
  attendees: number;
  compact?: boolean;
}

export const EventSocialActions = ({
  eventId,
  likes: initialLikes,
  comments,
  attendees: initialAttendees,
  compact = false
}: EventSocialActionsProps) => {
  const { user } = useAuth();
  const { likeEvent, attendEvent } = useEventInteraction();
  const [isLiked, setIsLiked] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [currentAttendees, setCurrentAttendees] = useState(initialAttendees);

  // Check if user has liked/is attending this event
  useEffect(() => {
    if (!user) return;

    const checkUserInteractions = async () => {
      try {
        // Check if user liked the event
        const { data: likeData } = await supabase
          .from('event_likes')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!likeData);

        // Check if user is attending the event
        const { data: attendeeData } = await supabase
          .from('event_attendees')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setIsAttending(!!attendeeData);
      } catch (error) {
        // Ignore errors (user hasn't liked/attended)
      }
    };

    checkUserInteractions();
  }, [user, eventId]);

  const handleLike = async () => {
    try {
      const result = await likeEvent.mutateAsync(eventId);
      setIsLiked(result === 'liked');
      setCurrentLikes(prev => result === 'liked' ? prev + 1 : prev - 1);
      toast(result === 'liked' ? "Added to favorites!" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleAttend = async () => {
    try {
      const result = await attendEvent.mutateAsync(eventId);
      setIsAttending(result === 'joined');
      setCurrentAttendees(prev => result === 'joined' ? prev + 1 : prev - 1);
      toast(result === 'joined' ? "You're attending!" : "No longer attending");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this event!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!");
    }
  };

  const buttonSize = compact ? "sm" : "default";
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
      <ProtectedEventAction>
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={handleLike}
          className={`gap-1 ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
          disabled={likeEvent.isPending}
        >
          <Heart className={`${iconSize} ${isLiked ? 'fill-current' : ''}`} />
          {!compact && <span>{currentLikes}</span>}
        </Button>
      </ProtectedEventAction>

      <ProtectedEventAction>
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={handleAttend}
          className={`gap-1 ${isAttending ? 'text-green-500 hover:text-green-600' : 'hover:text-green-500'}`}
          disabled={attendEvent.isPending}
        >
          <Calendar className={`${iconSize} ${isAttending ? 'fill-current' : ''}`} />
          {!compact && <span>{currentAttendees}</span>}
        </Button>
      </ProtectedEventAction>

      <Button
        variant="ghost"
        size={buttonSize}
        className="gap-1 hover:text-blue-500"
      >
        <MessageCircle className={iconSize} />
        {!compact && <span>{comments}</span>}
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        onClick={handleShare}
        className="gap-1 hover:text-purple-500"
      >
        <Share2 className={iconSize} />
        {!compact && <span>Share</span>}
      </Button>
    </div>
  );
};
