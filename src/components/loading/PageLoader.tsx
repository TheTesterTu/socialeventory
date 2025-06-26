
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full animate-pulse" />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-muted-foreground"
        >
          {message}
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 bg-primary/30 rounded-full w-32"
        />
      </motion.div>
    </div>
  );
};
