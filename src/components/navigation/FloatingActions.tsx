
import { Home, Search, PlusCircle, MapPin, Settings, Plus, Calendar, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const FloatingActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const quickActions = [
    { icon: Calendar, label: "New Event", path: "/create-event", color: "bg-gradient-to-r from-violet-500 to-purple-500" },
    { icon: MapPin, label: "Near Me", path: "/nearby", color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { icon: Search, label: "Search", path: "/search", color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { icon: Bell, label: "Notifications", path: "/settings", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
  ];

  return (
    <motion.div 
      className="fixed bottom-8 right-8 hidden md:flex flex-col gap-4 items-end z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={action.path}>
                  <div className="flex items-center gap-2 group">
                    <motion.span 
                      className="text-sm font-medium opacity-0 group-hover:opacity-100 text-foreground px-2 py-1 rounded bg-background/80 backdrop-blur-sm"
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {action.label}
                    </motion.span>
                    <Button
                      variant="default"
                      size="icon"
                      className={`w-10 h-10 rounded-full shadow-lg hover:shadow-primary/25 ${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="default"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-primary/25 bg-primary hover:bg-primary/90"
          onClick={toggleExpanded}
        >
          <Plus className="w-5 h-5" style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
        </Button>
      </motion.div>
    </motion.div>
  );
};
