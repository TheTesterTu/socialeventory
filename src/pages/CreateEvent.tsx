
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/navigation/BackButton";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateEvent } from "@/hooks/useEvents";
import { Loader2 } from "lucide-react";
import { EventBasicInfo } from "@/components/events/create/EventBasicInfo";
import { EventDateTime } from "@/components/events/create/EventDateTime";
import { EventCategoriesSelect } from "@/components/events/create/EventCategories";
import { EventSettings } from "@/components/events/create/EventSettings";

// Example category options
const categoryOptions = [
  "Conference", "Workshop", "Meetup", "Cultural", 
  "Music", "Art", "Food", "Sports", "Tech", "Business", 
  "Community", "Charity", "Education", "Entertainment"
];

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location is required"),
  venue_name: z.string().optional(),
  category: z.array(z.string()).min(1, "Please select at least one category"),
  organizerType: z.enum(["personal", "organization"]),
  organizerId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isFree: z.boolean().default(true),
  price: z.number().min(0).optional(),
  wheelchairAccessible: z.boolean().default(false),
  familyFriendly: z.boolean().default(true),
  coordinates: z.array(z.number()).length(2).optional(),
  imageUrl: z.string().optional(),
});

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEventMutation = useCreateEvent();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      venue_name: "",
      category: [],
      organizerType: "personal",
      organizerId: "",
      startDate: "",
      endDate: "",
      isFree: true,
      price: 0,
      wheelchairAccessible: false,
      familyFriendly: true,
      coordinates: undefined,
      imageUrl: "",
    },
  });

  const handleLocationSelect = (
    address: string, 
    coordinates: [number, number],
    venue?: string
  ) => {
    form.setValue("location", address);
    form.setValue("coordinates", coordinates);
    if (venue) {
      form.setValue("venue_name", venue);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create an event.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Prepare event data according to Event interface
      const eventData = {
        title: values.title,
        description: values.description,
        location: {
          address: values.location,
          venue_name: values.venue_name || "",
          coordinates: values.coordinates ? 
            [values.coordinates[0], values.coordinates[1]] as [number, number] : 
            [0, 0] as [number, number],
        },
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        category: values.category,
        tags: [], // Default empty tags
        imageUrl: values.imageUrl || "",
        accessibility: {
          wheelchairAccessible: values.wheelchairAccessible,
          familyFriendly: values.familyFriendly,
          languages: ["en"]
        },
        pricing: {
          isFree: values.isFree,
          priceRange: values.isFree ? [0, 0] as [number, number] : [values.price || 0, values.price || 0] as [number, number],
          currency: "USD"
        }
      };
      
      await createEventMutation.mutateAsync(eventData);
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is pending review.",
      });
      
      // Navigate to events page
      navigate("/events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      // Error is already handled by the mutation
    }
  };

  return (
    <AppLayout>
      <div className="relative">
        <BackButton />
        
        <motion.div 
          className="max-w-3xl mx-auto pt-24 pb-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create New Event
            </h1>
            <p className="text-muted-foreground">
              Share your event with the community by filling out the details below.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <EventBasicInfo 
                form={form}
                handleLocationSelect={handleLocationSelect}
              />
              
              <EventDateTime form={form} />
              
              <EventCategoriesSelect 
                form={form}
                categoryOptions={categoryOptions}
              />
              
              <EventSettings form={form} />
              
              <div className="pt-4 flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/events")}
                  className="border-border hover:bg-accent"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createEventMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white relative"
                >
                  {createEventMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;
