
import { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";

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
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {showTopBar && <TopBar />}
      
      <div className="flex-1 pt-16 px-4">
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
      
      <BottomNav />
    </div>
  );
};
