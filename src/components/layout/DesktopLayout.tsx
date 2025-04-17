
import { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

interface DesktopLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  showTopBar?: boolean;
}

export const DesktopLayout = ({ 
  children, 
  pageTitle, 
  pageDescription,
  showTopBar = true 
}: DesktopLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showTopBar && <TopBar />}
      
      <div className="p-6 pt-20 max-w-7xl mx-auto flex-grow">
        {pageTitle && (
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-muted-foreground">
                {pageDescription}
              </p>
            )}
          </motion.header>
        )}
        
        <div>
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
