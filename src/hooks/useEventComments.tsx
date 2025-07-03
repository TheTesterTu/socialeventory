
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (content: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', eventId] });
      
      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        userId: user?.id || '',
        username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'You',
        avatar: user?.user_metadata?.avatar_url,
        content: content,
        createdAt: new Date()
      };
      
      // Optimistically update the cache
      queryClient.setQueryData(['comments', eventId], (old: Comment[] = []) => [
        optimisticComment,
        ...old
      ]);
      
      return { optimisticComment };
    },
    onSuccess: (data, content, context) => {
      // Replace optimistic comment with real one
      queryClient.setQueryData(['comments', eventId], (old: Comment[] = []) => {
        const filtered = old.filter(c => c.id !== context?.optimisticComment.id);
        const newComment: Comment = {
          id: data.id,
          userId: data.user_id,
          username: data.profiles?.username || data.profiles?.full_name || 'Anonymous',
          avatar: data.profiles?.avatar_url,
          content: data.content,
          createdAt: new Date(data.created_at)
        };
        return [newComment, ...filtered];
      });
      
      setCommentText('');
      toast.success('Comment posted!');
    },
    onError: (error, content, context) => {
      // Remove optimistic comment on error
      if (context?.optimisticComment) {
        queryClient.setQueryData(['comments', eventId], (old: Comment[] = []) =>
          old.filter(c => c.id !== context.optimisticComment.id)
        );
      }
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
    onMutate: async (commentId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', eventId] });
      
      // Optimistically remove comment
      const previousComments = queryClient.getQueryData<Comment[]>(['comments', eventId]) || [];
      queryClient.setQueryData(['comments', eventId], 
        previousComments.filter(c => c.id !== commentId)
      );
      
      return { previousComments, commentId };
    },
    onSuccess: () => {
      toast.success('Comment deleted');
    },
    onError: (error, commentId, context) => {
      // Restore previous comments on error
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', eventId], context.previousComments);
      }
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
