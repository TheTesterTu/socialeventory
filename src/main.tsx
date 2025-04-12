
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { motion, AnimatePresence } from 'framer-motion'

// Add a global loading transition
const AppLoader = () => (
  <AnimatePresence mode="wait">
    <motion.div
      key="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <App />
    </motion.div>
  </AnimatePresence>
);

createRoot(document.getElementById("root")!).render(<AppLoader />);
