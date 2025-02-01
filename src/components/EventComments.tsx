import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface EventCommentsProps {
  eventId: string;
}

export const EventComments = ({ eventId }: EventCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [eventId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load comments");
    } else {
      setComments(data);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `event_id=eq.${eventId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          event_id: eventId,
          user_id: user.id,
          content: newComment
        });

      if (error) throw error;
      
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={!user}
        />
        <Button type="submit" disabled={!user || !newComment.trim()}>
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-card">
            <Avatar src={comment.profiles.avatar_url} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-medium">{comment.profiles.username}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.created_at), "PPp")}
                </span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};