
import { FixedSizeList as List } from 'react-window';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';
import { EventQuickView } from './EventQuickView';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

interface VirtualizedEventListProps {
  events: Event[];
  className?: string;
  emptyMessage?: string;
}

export const VirtualizedEventList = ({ 
  events, 
  className = "",
  emptyMessage = "No events found"
}: VirtualizedEventListProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const ITEM_HEIGHT = 400; // Adjust based on EventCard height

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const event = events[index];
    
    const handleEventClick = () => {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    };

    return (
      <motion.div
        style={{
          ...style,
          height: ITEM_HEIGHT,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="p-3"
        onClick={handleEventClick}
      >
        <EventCard {...event} />
      </motion.div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-60">
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-60 text-muted-foreground"
      >
        <Filter className="h-10 w-10 mb-4 text-muted-foreground/40" />
        <p className="text-lg font-medium">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          <List
            height={Math.min(800, events.length * (ITEM_HEIGHT / 1.5))} // More adaptive height
            itemCount={events.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
            className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
          >
            {Row}
          </List>
        </motion.div>
      </AnimatePresence>

      <EventQuickView 
        event={selectedEvent} 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};
