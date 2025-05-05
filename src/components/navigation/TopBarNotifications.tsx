import { Bell, Heart, MessageSquare, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type NotificationType = "like" | "comment" | "event" | "follow" | "mention";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
  userId?: string;
  avatarUrl?: string;
}

export const TopBarNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch notifications in a real app
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setNotificationCount(0);
      return;
    }

    // For demo purposes, we'll use mock notifications
    // In a real app, you would fetch from Supabase
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "like",
        message: "John liked your Summer Festival event",
        timestamp: new Date(),
        read: false,
        eventId: "123",
        userId: "user1",
        avatarUrl: "https://i.pravatar.cc/100?img=1"
      },
      {
        id: "2",
        type: "comment",
        message: "Sarah commented on your Tech Conference",
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
    setNotificationCount(mockNotifications.filter(n => !n.read).length);

    // In a real app, you would subscribe to real-time notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        console.log('New notification:', payload);
        // Handle new notification
        toast.info("You have a new notification!");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    // In a real app, update the database
    // For now, just update the state
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read in state
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Update notification count
    if (!notification.read) {
      setNotificationCount(prev => prev - 1);
    }
    
    // In a real app, also update in the database
    
    // Navigate based on notification type
    if (notification.eventId) {
      navigate(`/event/${notification.eventId}`);
    } else if (notification.userId) {
      navigate(`/profile/${notification.userId}`);
    } else {
      navigate('/notifications');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "like": return <Heart className="h-4 w-4 text-red-500" />;
      case "comment": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "event": return <Calendar className="h-4 w-4 text-green-500" />;
      case "follow": return <Users className="h-4 w-4 text-purple-500" />;
      case "mention": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-primary text-white">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={cn(
                  "p-3 cursor-pointer",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3 items-start">
                  <Avatar className="h-8 w-8">
                    {notification.avatarUrl ? (
                      <AvatarImage src={notification.avatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-primary/10">
                        {getNotificationIcon(notification.type)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.timestamp, 'Pp')}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center">
          <Link to="/notifications" className="text-sm text-primary">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
