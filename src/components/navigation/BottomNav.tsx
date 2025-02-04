import { Home, Search, PlusCircle, MapPin, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/events" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: PlusCircle, label: "Create", path: "/create-event" },
    { icon: MapPin, label: "Near Me", path: "/nearby" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around p-2 bg-background/80 backdrop-blur-lg border-t border-border/50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-16 py-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center justify-center",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  !isActive && "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs",
                  !isActive && "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};