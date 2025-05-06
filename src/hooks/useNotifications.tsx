
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type NotificationType = "like" | "comment" | "event" | "follow" | "mention";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
  userId?: string;
  avatarUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // In a production app, we would fetch from Supabase notification table
      // For now, we'll simulate it with a delay and mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      // Example query to a notifications table (when implemented)
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });

      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "like",
          message: "Nicolo liked your Summer Festival event",
          timestamp: new Date(),
          read: false,
          eventId: "123",
          userId: "user1",
          avatarUrl: "https://i.pravatar.cc/100?img=1"
        },
        {
          id: "2",
          type: "comment",
          message: "Sara commented on your Tech Conference",
          timestamp: new Date(Date.now() - 3600000),
          read: true,
          eventId: "456",
          userId: "user2",
          avatarUrl: "https://i.pravatar.cc/100?img=2"
        },
        {
          id: "3",
          type: "event",
          message: "Your event 'Music Festival' starts in 2 hours",
          timestamp: new Date(Date.now() - 7200000),
          read: false,
          eventId: "789",
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app, we would update in the database
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', notificationId);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    
    // In a real app, we would update in the database
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('user_id', user?.id);
    
    toast.success("All notifications marked as read");
  };

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to new notifications in real-time
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        console.log('New notification:', payload);
        // In a real app, we would add the new notification to the state
        toast.info("You have a new notification!");
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
