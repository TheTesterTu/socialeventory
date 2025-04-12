
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Add a global loading transition
const AppLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="mb-4"
          >
            <img
              src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
              alt="SocialEventory"
              className="h-16 w-16"
            />
          </motion.div>
          <motion.h1
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            SocialEventory
          </motion.h1>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

createRoot(document.getElementById("root")!).render(<AppLoader />);
