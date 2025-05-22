import { useState } from "react";
import { Heart, Share2, MessageSquare, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEventInteractions } from "@/hooks/useEventInteractions";

interface EventSocialActionsProps {
  eventId: string;
  likes?: number;
  comments?: number;
  attendees?: number;
}

export const EventSocialActions = ({ 
  eventId, 
  likes = 0, 
  comments = 0,
  attendees = 0
}: EventSocialActionsProps) => {
  const [commentsCount, setCommentsCount] = useState(comments);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLiked,
    likesCount,
    isAttending,
    attendeesCount,
    handleLike,
    handleAttendance
  } = useEventInteractions(eventId);

  const handleComment = () => {
    // Navigate to event details page focused on comment section
    navigate(`/event/${eventId}#comments`);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/event/${eventId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: "Check out this event",
          text: "I found this interesting event on SocialEventory!",
          url: shareUrl
        });
        toast.success("Event shared successfully");
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      toast.error("Sharing failed");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full transition-colors",
          isLiked && "text-red-500 hover:text-red-600"
        )}
        onClick={handleLike}
      >
        <Heart className="h-4 w-4 mr-1" fill={isLiked ? "currentColor" : "none"} />
        <span>{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={handleComment}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        <span>{commentsCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full transition-colors",
          isAttending && "text-primary hover:text-primary/80"
        )}
        onClick={handleAttendance}
      >
        <Calendar className="h-4 w-4 mr-1" fill={isAttending ? "currentColor" : "none"} />
        <span>{attendeesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full ml-auto"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
