
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Calendar, Heart, MessageSquare, User, Users, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNotifications, Notification } from "@/hooks/useNotifications";

type NotificationType = "like" | "comment" | "event" | "follow" | "mention" | "all";

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<NotificationType>("all");

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.eventId) {
      navigate(`/event/${notification.eventId}`);
    } else if (notification.userId) {
      navigate(`/profile/${notification.userId}`);
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

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
    <AppLayout pageTitle="Notifications" showTopBar={true}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchNotifications} 
                disabled={isLoading}
              >
                <RefreshCcw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as NotificationType)}>
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="like">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="event">Events</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <ScrollArea className="h-[600px] rounded-lg border bg-card">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <RefreshCcw className="h-8 w-8 text-muted-foreground animate-spin" />
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(notification.timestamp, 'PPpp')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
