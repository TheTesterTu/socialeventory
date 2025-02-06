
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, Share2, Clock, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id || "");

  if (!event) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate(-1)} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          size="lg" 
          className="mb-4 gap-2 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Button>

        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {event.category.map((cat) => (
                  <Badge key={cat} variant="secondary" className="hover:bg-primary/20">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {event.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.startDate), "PPP")}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(event.startDate), "p")} - {format(new Date(event.endDate), "p")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location.venue_name ? `${event.location.venue_name}, ${event.location.address}` : event.location.address}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-transform">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-transform">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {event.tags.map((tag) => (
              <span key={tag} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {event.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.attendees} attending
              </span>
            </div>
            <span>
              {event.pricing.isFree ? (
                <Badge variant="secondary" className="hover:bg-primary/20">Free</Badge>
              ) : (
                <Badge variant="secondary" className="hover:bg-primary/20">
                  {event.pricing.currency} {event.pricing.priceRange?.[0]}-{event.pricing.priceRange?.[1]}
                </Badge>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
