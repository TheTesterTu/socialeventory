import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackEvent } from '@/services/analytics';

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: Date;
}

export const useEventComments = (eventId: string) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['comments', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(comment => ({
        id: comment.id,
        userId: comment.user_id,
        username: comment.profiles?.username || comment.profiles?.full_name || 'Anonymous',
        avatar: comment.profiles?.avatar_url,
        content: comment.content,
        createdAt: new Date(comment.created_at)
      }));
    },
    enabled: !!eventId
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('User must be logged in to comment');
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          event_id: eventId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      setCommentText('');
      toast.success('Comment posted!');
      trackEvent('comment_posted', { event_id: eventId });
    },
    onError: (error) => {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment. Please try again.');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error('User must be logged in to delete a comment');
      
      const { error } = await supabase
        .from('comments')
        .delete()
        .match({ id: commentId, user_id: user.id });

      if (error) throw error;
      return commentId;
    },
    onSuccess: (commentId) => {
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      toast.success('Comment deleted');
      trackEvent('comment_deleted', { event_id: eventId, comment_id: commentId });
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  });

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    if (!user) {
      toast.error('Please sign in to leave a comment');
      return;
    }
    
    addCommentMutation.mutate(commentText);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return {
    comments,
    isLoading,
    error,
    commentText,
    setCommentText,
    handleSubmitComment,
    handleDeleteComment,
    addCommentMutation,
    deleteCommentMutation,
    refetch
  };
};
