import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/navigation/BackButton";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
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
});

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      setIsSubmitting(true);
      
      // Upload image if provided
      let image_url = null;
      if (imageFile) {
        setUploadingImage(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `event-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        const { data: publicURL } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
          
        image_url = publicURL.publicUrl;
        setUploadingImage(false);
      }
      
      // Prepare event data
      const eventData = {
        title: values.title,
        description: values.description,
        location: values.location,
        venue_name: values.venue_name || null,
        coordinates: values.coordinates ? 
          `(${values.coordinates[0]}, ${values.coordinates[1]})` : 
          null,
        start_date: new Date(values.startDate).toISOString(),
        end_date: new Date(values.endDate).toISOString(),
        category: values.category,
        created_by: user.id,
        image_url: image_url,
        pricing: {
          isFree: values.isFree,
          priceRange: values.isFree ? [0, 0] : [values.price || 0, values.price || 0],
          currency: "USD"
        },
        accessibility: {
          wheelchairAccessible: values.wheelchairAccessible,
          familyFriendly: values.familyFriendly,
          languages: ["en"]
        },
        verification_status: "pending"
      };
      
      // Insert event to database
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select('id')
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is pending review.",
      });
      
      // Navigate to the new event page
      navigate(`/event/${data.id}`);
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Failed to create event",
        description: error.message || "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <AppLayout>
      <motion.div 
        className="max-w-3xl mx-auto pt-10 pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-muted-foreground">
            Share your event with the community by filling out the details below.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EventBasicInfo 
              form={form}
              imageFile={imageFile}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
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
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || uploadingImage}
                className="relative"
              >
                {(isSubmitting || uploadingImage) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </AppLayout>
  );
};

export default CreateEvent;
