
import { FixedSizeList as List } from 'react-window';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VirtualizedEventListProps {
  events: Event[];
  className?: string;
}

export const VirtualizedEventList = ({ events, className }: VirtualizedEventListProps) => {
  const [mounted, setMounted] = useState(false);
  const ITEM_HEIGHT = 400; // Adjust based on your EventCard height

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <motion.div
      style={{
        ...style,
        height: ITEM_HEIGHT,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-3"
    >
      <EventCard {...events[index]} />
    </motion.div>
  );

  if (!mounted || events.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 text-muted-foreground">
        No events found
      </div>
    );
  }

  return (
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
  );
};
