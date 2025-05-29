
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface EventChatButtonProps {
  eventId: string;
  participantCount?: number;
  onClick: () => void;
}

export const EventChatButton = ({ eventId, participantCount = 0, onClick }: EventChatButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        onClick={onClick}
        variant="outline"
        className="gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
        {participantCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
            {participantCount}
          </span>
        )}
      </Button>
    </motion.div>
  );
};
