import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { LazyEventDetails } from "@/components/LazyEventDetails";
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/lib/types';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { EventDetailsSkeleton } from '@/components/EventDetailsSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { EventChatWidget } from "@/components/chat/EventChatWidget";

const EventDetails = () => {
  const { id } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const mappedEvent = mapDatabaseEventToEvent(data);
          setEvent(mappedEvent);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout pageTitle="Loading Event">
        <EventDetailsSkeleton />
      </AppLayout>
    );
  }

  if (error || !event) {
    return (
      <AppLayout pageTitle="Error">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-muted-foreground">{error || 'Event not found'}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      pageTitle={event.title}
      pageDescription={event.description}
    >
      <SEOHead 
        title={event.title}
        description={event.description}
        type="event"
        image={event.imageUrl}
      />
      
      <StructuredData 
        type="Event" 
        data={{
          name: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: {
            name: event.location.venue_name || event.location.address,
            address: event.location.address
          },
          image: event.imageUrl,
          url: window.location.href
        }} 
      />
      
      <div className="min-h-screen bg-background">
        <LazyEventDetails event={event} />
        
        {/* Chat Widget */}
        <AnimatePresence>
          {(chatOpen || chatMinimized) && (
            <EventChatWidget
              event={event}
              isMinimized={chatMinimized}
              onMinimize={() => setChatMinimized(!chatMinimized)}
              onClose={() => {
                setChatOpen(false);
                setChatMinimized(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Floating Chat Button */}
        {!chatOpen && !chatMinimized && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <Button
              onClick={() => setChatOpen(true)}
              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default EventDetails;
