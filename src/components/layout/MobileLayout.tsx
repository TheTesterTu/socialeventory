
import { ReactNode, useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";

interface MobileLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  showTopBar?: boolean;
}

export const MobileLayout = ({ 
  children, 
  pageTitle, 
  showTopBar = true 
}: MobileLayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to animate the TopBar
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 20);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {showTopBar && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="fixed top-0 left-0 right-0 z-40"
          >
            <motion.div
              animate={{
                backgroundColor: isScrolled ? "rgba(10, 10, 15, 0.85)" : "rgba(10, 10, 15, 0)",
                backdropFilter: isScrolled ? "blur(8px)" : "blur(0px)",
                borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0)",
              }}
              transition={{ duration: 0.2 }}
              className="transition-all"
            >
              <TopBar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        className="flex-1 pt-16 pb-20 overflow-y-auto h-screen" 
        onScroll={handleScroll}
      >
        <div className="px-4 max-w-5xl mx-auto">
          {pageTitle && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {pageTitle}
              </h1>
            </motion.div>
          )}
          
          {children}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
