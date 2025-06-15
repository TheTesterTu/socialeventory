
import { Heart, MessageCircle, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProtectedEventAction } from "./ProtectedEventAction";
import { trackEvent } from "@/services/analytics";
import { useEventInteractions } from "@/hooks/useEventInteractions";

interface EventSocialActionsProps {
  eventId: string;
  comments: number;
  compact?: boolean;
}

export const EventSocialActions = ({
  eventId,
  comments,
  compact = false
}: EventSocialActionsProps) => {
  const {
    isLiked,
    likesCount,
    isAttending,
    attendeesCount,
    handleLike,
    handleAttendance,
    likeMutation,
    attendMutation
  } = useEventInteractions(eventId);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this event!',
        url: `${window.location.origin}/event/${eventId}`,
      });
      trackEvent('event_shared', { event_id: eventId, method: 'native' });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}`);
      toast("Link copied to clipboard!");
      trackEvent('event_shared', { event_id: eventId, method: 'clipboard' });
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
          className={`gap-1 ${isLiked ? 'text-interaction-like hover:text-interaction-like/90' : 'hover:text-interaction-like'}`}
          disabled={likeMutation.isPending}
        >
          <Heart className={`${iconSize} ${isLiked ? 'fill-current' : ''}`} />
          {!compact && <span>{likesCount}</span>}
        </Button>
      </ProtectedEventAction>

      <ProtectedEventAction>
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={handleAttendance}
          className={`gap-1 ${isAttending ? 'text-interaction-attend hover:text-interaction-attend/90' : 'hover:text-interaction-attend'}`}
          disabled={attendMutation.isPending}
        >
          <Calendar className={`${iconSize} ${isAttending ? 'fill-current' : ''}`} />
          {!compact && <span>{attendeesCount}</span>}
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
