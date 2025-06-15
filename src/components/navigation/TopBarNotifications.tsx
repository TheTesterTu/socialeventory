
import { Bell, Check, X, Calendar, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TopBarNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'new_follower':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'event_liked':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return 'bg-blue-50 border-blue-200';
      case 'new_follower':
        return 'bg-green-50 border-green-200';
      case 'event_liked':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200 border-2 border-transparent hover:border-gray-200"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-red-500 text-white border-2 border-white rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-white border-2 border-gray-200 shadow-xl rounded-xl p-0" 
        align="end"
      >
        <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg px-2 py-1"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 mb-1">No notifications yet</p>
              <p className="text-xs text-gray-400">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                    !notification.read 
                      ? getNotificationColor(notification.type)
                      : 'bg-white border border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight mb-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-200" />
            <div className="p-3">
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg font-medium"
                onClick={() => window.location.href = '/notifications'}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
