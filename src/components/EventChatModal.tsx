
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventCommunity } from "./EventCommunity";
import { Event } from "@/lib/types";
import { MessageCircle } from "lucide-react";

interface EventChatModalProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventChatModal = ({ event, isOpen, onOpenChange }: EventChatModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col glass-card">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-full bg-primary/20">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gradient truncate">{event.title}</div>
              <div className="text-sm text-muted-foreground font-normal">Event Discussion</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden py-4">
          <EventCommunity eventId={event.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
