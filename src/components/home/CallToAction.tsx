import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-20 relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(232,121,249,0.15),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border-2 border-primary/40"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-semibold text-sm">Start Creating Today</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Ready to Create Your{" "}
              <span className="text-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text">
                Next Event?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of organizers who trust SocialEventory to bring their events to life
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/create-event" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="gradient-primary px-10 py-6 h-auto font-bold rounded-2xl w-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/40 border-0 text-lg"
              >
                <CalendarPlus className="mr-2 h-6 w-6" />
                Create Your Event
              </Button>
            </Link>
            <Link to="/events" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 h-auto font-bold rounded-2xl w-full border-2 hover:border-primary/60 transition-all duration-300 hover:scale-105 text-lg"
              >
                Browse Events
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
