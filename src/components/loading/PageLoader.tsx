
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const PageLoader = ({ message = "Loading...", size = "md" }: PageLoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto`} />
        <p className="text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  );
};
