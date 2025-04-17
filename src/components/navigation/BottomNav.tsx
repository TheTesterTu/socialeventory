
import { Home, Search, PlusCircle, MapPin, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/events" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: PlusCircle, label: "Create", path: "/create-event" },
    { icon: MapPin, label: "Near Me", path: "/nearby" },
    { icon: Users, label: "Organizers", path: "/organizers" }
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around py-2 px-1 bg-background/80 backdrop-blur-lg border-t border-border/50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center p-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center w-16 py-1"
              >
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 10 }}
                      className="absolute -top-3 w-10 h-1 rounded-full bg-primary"
                    />
                  )}
                </AnimatePresence>
                <div 
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-background"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs mt-1 transition-colors",
                  isActive ? "font-medium text-primary" : "text-muted-foreground"
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
