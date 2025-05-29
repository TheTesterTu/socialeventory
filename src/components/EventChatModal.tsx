
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventCommunity } from "./EventCommunity";
import { Event } from "@/lib/types";

interface EventChatModalProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventChatModal = ({ event, isOpen, onOpenChange }: EventChatModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{event.title}</span>
            <span className="text-sm text-muted-foreground">- Community Chat</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <EventCommunity eventId={event.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
