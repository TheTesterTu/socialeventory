
import { useState } from "react";
import { Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: Date;
}

interface EventCommentsProps {
  eventId: string;
}

export const EventComments = ({ eventId }: EventCommentsProps) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(comment => ({
        id: comment.id,
        userId: comment.user_id,
        username: comment.profiles?.username || 'Anonymous',
        avatar: comment.profiles?.avatar_url,
        content: comment.content,
        createdAt: new Date(comment.created_at)
      }));
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          event_id: eventId,
          user_id: user?.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      setCommentText("");
      toast.success("Comment posted!");
    },
    onError: () => {
      toast.error("Failed to post comment");
    }
  });

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    if (!user) {
      toast.error("Please sign in to leave a comment");
      return;
    }
    
    addCommentMutation.mutate(commentText);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to leave a comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-card/50">
              <Avatar className="h-10 w-10">
                <img 
                  src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.username?.charAt(0).toUpperCase() || 'A'}&background=random`}
                  alt={comment.username} 
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{comment.username}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(comment.createdAt, "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.email?.charAt(0).toUpperCase() || 'G'}&background=random`}
              alt={user?.email || "Guest"} 
            />
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={user ? "Add a comment..." : "Sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!user || !commentText.trim() || addCommentMutation.isPending}
                size="sm"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
