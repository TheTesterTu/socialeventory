
import { motion } from "framer-motion";
import { ArrowRight, CalendarPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="section-spacing">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-secondary p-8 md:p-16"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              Join the community
            </motion.div>

            <h2 className="text-headline text-3xl md:text-4xl lg:text-5xl text-white">
              Ready to share your
              <br />
              <span className="text-primary-light">next event?</span>
            </h2>

            <p className="text-lg text-white/70 max-w-lg mx-auto">
              Create and promote your events to thousands of people looking for their next experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/create-event">
                <Button 
                  size="lg" 
                  className="bg-white text-secondary hover:bg-white/90 font-semibold rounded-xl px-8 h-12 shadow-large"
                >
                  <CalendarPlus className="mr-2 h-5 w-5" />
                  Create an event
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 font-medium rounded-xl px-8 h-12"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
