
import { useState, useEffect } from "react";
import { Heart, Share2, MessageSquare, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface EventSocialActionsProps {
  eventId: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  attendees?: number;
}

export const EventSocialActions = ({ 
  eventId, 
  likes, 
  comments, 
  isLiked: initialIsLiked = false,
  attendees = 0
}: EventSocialActionsProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isAttending, setIsAttending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if the user has liked this event
  const { data: likeStatus } = useQuery({
    queryKey: ['event-like', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });

  // Check if the user is attending this event
  const { data: attendingStatus } = useQuery({
    queryKey: ['event-attending', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking attending status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });
  
  // Update like state when likeStatus changes
  useEffect(() => {
    if (likeStatus !== undefined) {
      setIsLiked(likeStatus);
    }
  }, [likeStatus]);

  // Update attending state when attendingStatus changes
  useEffect(() => {
    if (attendingStatus !== undefined) {
      setIsAttending(attendingStatus);
    }
  }, [attendingStatus]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like events");
      navigate("/auth");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('event_likes')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('event_likes')
          .insert({ event_id: eventId, user_id: user.id });
        setLikesCount(prev => prev + 1);
        
        // Create a notification for the event creator (in a real app)
        toast.success("Event liked! The creator will be notified.");
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error("Please sign in to attend events");
      navigate("/auth");
      return;
    }

    try {
      if (isAttending) {
        await supabase
          .from('event_attendees')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
        toast.info("You are no longer attending this event");
      } else {
        await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: user.id, status: 'going' });
        toast.success("You are now attending this event!");
      }
      setIsAttending(!isAttending);
    } catch (error) {
      toast.error("Failed to update attendance status");
    }
  };

  const handleShare = async () => {
    try {
      // Get event details for share message
      const { data: eventData } = await supabase
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single();
      
      const eventTitle = eventData?.title || "Check out this event!";
      const shareUrl = `${window.location.origin}/event/${eventId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: eventTitle,
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
      toast.error("Sharing failed");
    }
  };

  const handleComment = () => {
    // Navigate to event details page focused on comment section
    navigate(`/event/${eventId}#comments`);
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
        <span>{comments}</span>
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
        <span>{attendees + (isAttending ? 1 : 0)}</span>
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
