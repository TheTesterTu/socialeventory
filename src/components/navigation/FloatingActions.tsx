import { Home, Search, PlusCircle, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const FloatingActions = () => {
  return (
    <motion.div 
      className="fixed bottom-8 right-8 hidden md:flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="default"
        size="icon"
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-primary/25"
        asChild
      >
        <Link to="/create-event">
          <PlusCircle className="w-5 h-5" />
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-accent/25"
        asChild
      >
        <Link to="/nearby">
          <MapPin className="w-5 h-5" />
        </Link>
      </Button>
    </motion.div>
  );
};