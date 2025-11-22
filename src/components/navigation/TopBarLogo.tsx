
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const TopBarLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <motion.img
        src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
        alt="SocialEventory"
        className="h-8 w-8"
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 500, damping: 10 }}
      />
      <span className="font-bold text-lg text-gradient">
        SocialEventory
      </span>
    </Link>
  );
};
