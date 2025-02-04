import { motion } from "framer-motion";

const Search = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h1 className="text-2xl font-bold">Search Events</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </motion.div>
  );
};

export default Search;