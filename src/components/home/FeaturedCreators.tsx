
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTopOrganizers } from "@/hooks/useTopOrganizers";

export const FeaturedCreators = () => {
  const { organizers: creators, loading } = useTopOrganizers(4);
  const navigate = useNavigate();

  const getCreatorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel p-3 md:p-4 rounded-xl animate-pulse">
              <div className="h-14 w-14 md:h-16 md:w-16 bg-muted rounded-full mx-auto mb-2" />
              <div className="h-4 bg-muted rounded mb-1" />
              <div className="h-3 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No organizers found
        </div>
      ) : (
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
            <div className="relative mb-2 md:mb-3">
              <Avatar className="h-14 w-14 md:h-16 md:w-16">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-sm md:text-base">
                  {getCreatorInitials(creator.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] md:text-xs px-1.5 py-0.5 rounded-full font-medium">
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
      )}
    </motion.div>
  );
};
