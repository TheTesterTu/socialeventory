
import { useState } from "react";
import { Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Send } from "lucide-react";

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
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userId: "user-1",
      username: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=S+J&background=random",
      content: "This event looks amazing! Can't wait to attend.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "2",
      userId: "user-2",
      username: "Mike Chen",
      avatar: "https://ui-avatars.com/api/?name=M+C&background=random",
      content: "Does anyone know if there's parking nearby?",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
  ]);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    if (!user) {
      toast.error("Please sign in to leave a comment");
      return;
    }
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      username: user.email?.split('@')[0] || "Anonymous",
      avatar: `https://ui-avatars.com/api/?name=${user.email?.charAt(0).toUpperCase() || 'A'}&background=random`,
      content: commentText,
      createdAt: new Date()
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
    toast.success("Comment posted!");
    
    // In a real implementation, we would save this to the database
    console.log("Posted comment for event:", eventId, newComment);
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
                <img src={comment.avatar} alt={comment.username} />
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
                disabled={!user || !commentText.trim()}
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
