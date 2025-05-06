
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, MapPin, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
      // Wait a moment before showing the modal
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleGetStarted = (path: string) => {
    handleClose();
    navigate(path);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-4"
          >
            <div className="mb-6 flex justify-center">
              <Calendar className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-4">Welcome to SocialEventory!</DialogTitle>
            <DialogDescription className="mb-6">
              Discover, create, and join amazing events in your community. Let us show you how to get started.
            </DialogDescription>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-4"
          >
            <div className="mb-6 flex justify-center">
              <Search className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-4">Find Events</DialogTitle>
            <DialogDescription className="mb-6">
              Use our powerful search and filtering tools to discover events that match your interests, location, and schedule.
            </DialogDescription>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-4"
          >
            <div className="mb-6 flex justify-center">
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-4">Events Near You</DialogTitle>
            <DialogDescription className="mb-6">
              Discover events happening around you with our interactive map view. Never miss out on local experiences again.
            </DialogDescription>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-4"
          >
            <div className="mb-6 flex justify-center">
              <Bell className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-4">Ready to Get Started?</DialogTitle>
            <DialogDescription className="mb-6">
              Create an account to get personalized event recommendations, save your favorite events, and get notified about upcoming events.
            </DialogDescription>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
              <Button onClick={() => handleGetStarted('/events')}>
                Browse Events
              </Button>
              <Button variant="outline" onClick={() => handleGetStarted('/auth')}>
                Sign Up
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        {renderStepContent()}
        
        {step < totalSteps && (
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i + 1 === step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <Button onClick={handleNext}>
                Next
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
