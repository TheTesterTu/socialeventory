
import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock creators data
const mockCreators = [
  {
    id: "1",
    name: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    events: 12,
    role: "Event Organizer",
    type: "Featured"
  },
  {
    id: "2",
    name: "Sam Wilson",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    events: 8,
    role: "Venue Manager",
    type: "Popular"
  },
  {
    id: "3",
    name: "Jamie Lee",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    events: 15,
    role: "Community Leader",
    type: "Featured"
  },
  {
    id: "4",
    name: "Taylor Reed",
    avatar: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5",
    events: 6,
    role: "Music Artist",
    type: "Rising"
  }
];

export const FeaturedCreators = () => {
  const [creators] = useState(mockCreators);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Top Organizers</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/organizers")}>
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {creators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
            }}
            className="glass-panel p-3 md:p-4 rounded-xl flex flex-col items-center text-center cursor-pointer"
            onClick={() => navigate(`/organizers/${creator.id}`)}
          >
            <div className="relative">
              <Avatar className="h-14 w-14 md:h-16 md:w-16 mb-2 md:mb-3">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] md:text-xs px-1.5 py-0.5 rounded-full">
                {creator.type}
              </span>
            </div>
            <h3 className="font-medium text-sm md:text-base">{creator.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{creator.role}</p>
            <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-primary font-medium">
              {creator.events} events
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
