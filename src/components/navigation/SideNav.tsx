
import { Home, Search, PlusCircle, MapPin, Settings, Users, Calendar, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: Home, label: "Home", path: "/events" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusCircle, label: "Create Event", path: "/create-event" },
  { icon: MapPin, label: "Near Me", path: "/nearby" },
  { icon: Calendar, label: "My Events", path: "/profile" },
  { icon: Users, label: "Organizers", path: "/organizers" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" }
];

export const SideNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <motion.nav
      className="hidden md:flex flex-col w-64 border-r border-border/50 h-screen sticky top-0"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="font-semibold text-lg">SocialEventory</span>
        </Link>
      </div>
      
      {user && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata?.avatar || "https://i.pravatar.cc/100?img=1"} />
              <AvatarFallback>{user.user_metadata?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.user_metadata?.name || 'User'}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2 p-4 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          // Skip "Create Event" for non-authenticated users
          if (item.path === "/create-event" && !user) {
            return null;
          }

          // Only show profile-related items for authenticated users
          if ((item.path === "/profile" || item.path === "/notifications") && !user) {
            return null;
          }
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div whileHover={{ x: 4 }}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </motion.div>
            </Link>
          );
        })}
      </div>
      
      {user ? (
        <div className="p-4 border-t border-border/50">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => window.location.href = "/auth/signout"}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="p-4 border-t border-border/50 space-y-2">
          <Link to="/auth">
            <Button variant="default" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      )}
    </motion.nav>
  );
};
