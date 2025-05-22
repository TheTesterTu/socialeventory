
import { useState } from "react";
import { Heart, Share2, MessageSquare, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEventInteractions } from "@/hooks/useEventInteractions";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { motion } from "framer-motion";

interface EventSocialActionsProps {
  eventId: string;
  likes?: number;
  comments?: number;
  attendees?: number;
  className?: string;
  compact?: boolean;
}

export const EventSocialActions = ({ 
  eventId, 
  likes = 0, 
  comments = 0,
  attendees = 0,
  className = "",
  compact = false
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

  // Animation variants
  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };
  
  const renderButtons = () => {
    if (compact) {
      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full p-2 h-9 w-9",
                    isLiked && "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  )}
                  onClick={handleLike}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isLiked ? "Unlike" : "Like"} ({likesCount})</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 h-9 w-9"
                  onClick={handleComment}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Comments ({commentsCount})</p>
            </TooltipContent>
          </Tooltip>
        </>
      );
    }
    
    return (
      <>
        <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full transition-colors gap-1.5",
              isLiked && "text-red-500 hover:text-red-600 hover:bg-red-500/10"
            )}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
          </Button>
        </motion.div>
        
        <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5"
            onClick={handleComment}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{commentsCount}</span>
          </Button>
        </motion.div>
        
        <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full transition-colors gap-1.5",
              isAttending && "text-primary hover:text-primary/80"
            )}
            onClick={handleAttendance}
          >
            <Users className="h-4 w-4" />
            <span>{attendeesCount}</span>
          </Button>
        </motion.div>
      </>
    );
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {renderButtons()}
      
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants} className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                compact ? "rounded-full p-2 h-9 w-9" : "rounded-full gap-1.5"
              )}
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              {!compact && <span>Share</span>}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Share event</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
