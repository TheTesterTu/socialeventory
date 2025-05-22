
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Map, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  requireAuth?: boolean;
}

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    { path: "/events", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/nearby", icon: Map, label: "Nearby" },
    { path: "/notifications", icon: Bell, label: "Alerts", requireAuth: true },
    { path: user ? "/profile" : "/auth", icon: User, label: user ? "Profile" : "Sign In" }
  ];
  
  // Filter items based on authentication status
  const visibleItems = navItems.filter(item => !item.requireAuth || (item.requireAuth && user));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t border-border/50 py-1 px-2">
      <nav className="flex justify-around items-center">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center pt-1 pb-0.5 px-1",
                "transition-colors duration-200 ease-in-out",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[9px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
