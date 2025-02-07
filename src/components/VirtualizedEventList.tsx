import { FixedSizeList as List } from 'react-window';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';
import { motion } from 'framer-motion';

interface VirtualizedEventListProps {
  events: Event[];
  className?: string;
}

export const VirtualizedEventList = ({ events, className }: VirtualizedEventListProps) => {
  const ITEM_HEIGHT = 400; // Adjust based on your EventCard height
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-3"
    >
      <EventCard {...events[index]} />
    </motion.div>
  );

  return (
    <List
      className={className}
      height={Math.min(800, events.length * ITEM_HEIGHT)} // Max height of 800px
      itemCount={events.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
    >
      {Row}
    </List>
  );
};