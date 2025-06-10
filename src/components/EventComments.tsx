
import { Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Send, Trash2 } from "lucide-react";
import { useEventComments } from "@/hooks/useEventComments";
// import { toast } from "sonner"; // Removed unused toast
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"; // Removed AlertDialogTrigger
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventCommentsProps {
  eventId: string;
}

export const EventComments = ({ eventId }: EventCommentsProps) => {
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  const {
    comments,
    isLoading,
    commentText,
    setCommentText,
    handleSubmitComment,
    handleDeleteComment,
    addCommentMutation
  } = useEventComments(eventId);

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = () => {
    if (commentToDelete) {
      handleDeleteComment(commentToDelete);
      setIsDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setCommentToDelete(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitComment();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to leave a comment!</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 p-4 rounded-lg bg-card/50 group"
              >
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
                  
                  {user && user.id === comment.userId && (
                    <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-destructive hover:bg-destructive/10"
                        onClick={() => confirmDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <img 
              src={user?.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${user?.email?.charAt(0).toUpperCase() || 'G'}&background=random`}
              alt={user?.email || "Guest"} 
            />
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={user ? "Add a comment..." : "Sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || addCommentMutation.isPending}
              className="resize-none"
              rows={3}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to post
              </p>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
