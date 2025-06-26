
import { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show banner if already offline
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && !isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="h-4 w-4" />
            <span>You're currently offline. Some features may not work.</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
        </motion.div>
      )}
      
      {isOnline && showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => setShowBanner(false), 2000);
          }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-2"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Wifi className="h-4 w-4" />
            <span>Connection restored!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
