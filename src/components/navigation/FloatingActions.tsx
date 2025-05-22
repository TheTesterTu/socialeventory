
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const FloatingActions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Hide on profile and create event pages to avoid duplicate buttons
  const shouldHide = location.pathname === "/profile" || 
                     location.pathname === "/create-event" ||
                     location.pathname.includes("/settings");
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  if (shouldHide || !user) return null;
  
  return (
    <motion.div 
      className={cn(
        "fixed bottom-24 right-4 z-40",
        isVisible ? "translate-y-0" : "translate-y-20"
      )}
      animate={{ y: isVisible ? 0 : 80, opacity: isVisible ? 1 : 0 }}
      initial={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate("/create-event")}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary/30"
      >
        <PlusCircle className="w-7 h-7" />
      </motion.button>
    </motion.div>
  );
};
