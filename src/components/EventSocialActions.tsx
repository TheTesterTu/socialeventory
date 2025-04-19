
import { useState, useEffect } from "react";
import { Heart, Share2, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface EventSocialActionsProps {
  eventId: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const EventSocialActions = ({ 
  eventId, 
  likes, 
  comments, 
  isLiked: initialIsLiked = false 
}: EventSocialActionsProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const { user } = useAuth();
  
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
  
  // Update like state when likeStatus changes
  useEffect(() => {
    if (likeStatus !== undefined) {
      setIsLiked(likeStatus);
    }
  }, [likeStatus]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like events");
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
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this event!",
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
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
        <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        <span>{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
      >
        <MessageSquare className="h-4 w-4" />
        <span>{comments}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
