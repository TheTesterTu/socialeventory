import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/navigation/BackButton";
import { motion } from "framer-motion";

const CreateEvent = () => {
  return (
    <motion.div 
      className="min-h-screen p-6 pt-20 md:pt-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <BackButton />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground mb-8">Share your event with the community</p>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Title</label>
            <Input placeholder="Enter event title" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe your event" className="min-h-[120px]" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="Enter venue or address" />
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            Create Event
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateEvent;