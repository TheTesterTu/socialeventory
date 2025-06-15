
import { Search, Bell, Plus, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { motion } from "framer-motion";

export const TopBarActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/search')}
        className="hover:bg-accent/50 transition-colors"
      >
        <Search className="h-5 w-5" />
      </Button>

      {user && (
        <>
          <NotificationBell />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/create-event')}
            className="hover:bg-accent/50 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="hover:bg-accent/50 transition-colors"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="hover:bg-accent/50 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </>
      )}
    </motion.div>
  );
};
