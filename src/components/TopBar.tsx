
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBarLogo } from "./navigation/TopBarLogo";
import { TopBarNav } from "./navigation/TopBarNav";
import { TopBarActions } from "./navigation/TopBarActions";

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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-sm" 
          : "bg-background/50 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-16 items-center px-4 md:px-6 mx-auto max-w-7xl">
        <TopBarLogo />

        {/* Show navigation buttons in TopBar on desktop */}
        {!isMobile && <TopBarNav />}

        <TopBarActions />
      </div>
    </motion.div>
  );
};
