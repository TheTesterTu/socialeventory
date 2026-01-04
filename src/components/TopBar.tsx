
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "./brand/Logo";
import { TopBarNav } from "./navigation/TopBarNav";
import { TopBarActions } from "./navigation/TopBarActions";
import { cn } from "@/lib/utils";

export const TopBar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border" 
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          <Logo size="md" />
          {!isMobile && <TopBarNav />}
          <TopBarActions />
        </div>
      </div>
    </motion.header>
  );
};
