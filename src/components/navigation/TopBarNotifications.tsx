
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
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotifications, Notification } from "@/hooks/useNotifications";

type NotificationType = "like" | "comment" | "event" | "follow" | "mention";

export const TopBarNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
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
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-primary text-white">
              {unreadCount}
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
