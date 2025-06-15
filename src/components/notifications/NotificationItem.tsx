
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { ExternalLink, CheckCircle } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
        !notification.is_read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h5 className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
              {notification.title}
            </h5>
            {!notification.is_read && (
              <Badge variant="secondary" className="text-xs">
                New
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            
            <div className="flex items-center gap-1">
              {notification.action_url && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
              {notification.is_read && (
                <CheckCircle className="h-3 w-3 text-green-600" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
