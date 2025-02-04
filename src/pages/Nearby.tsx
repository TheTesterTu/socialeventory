import { motion } from "framer-motion";

const Nearby = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h1 className="text-2xl font-bold">Events Near You</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </motion.div>
  );
};

export default Nearby;