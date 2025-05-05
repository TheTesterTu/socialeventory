
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Calendar, Heart, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // This would typically come from a backend notification system
  const mockNotifications = [
    {
      id: 1,
      type: "like",
      message: "John Doe liked your event",
      timestamp: new Date(),
      read: false,
      icon: Heart,
    },
    {
      id: 2,
      type: "comment",
      message: "New comment on your event",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      icon: MessageSquare,
    },
    {
      id: 3,
      type: "event",
      message: "Your event starts in 1 hour",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      icon: Calendar,
    },
  ];

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <AppLayout pageTitle="Notifications" showTopBar={true}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          <ScrollArea className="h-[600px] rounded-lg border bg-card">
            {mockNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {mockNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </ScrollArea>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
