
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/navigation/BackButton";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, ImagePlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";

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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a clear and descriptive title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A great title is short, descriptive and eye-catching.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What is your event about? What can attendees expect?" 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Event Image</h3>
                <div className="flex items-center gap-4">
                  <div 
                    className={`relative flex justify-center items-center border-2 border-dashed rounded-lg w-full h-40 ${imagePreview ? 'border-primary/50' : 'border-muted-foreground/25'} hover:border-primary/50 transition-colors`}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Event preview" 
                        className="h-full w-full object-cover rounded-lg" 
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground/50" />
                        <p className="mt-2 text-sm text-muted-foreground">Click to upload event image</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          className="pl-10" 
                        />
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          className="pl-10" 
                        />
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LocationSearch 
                        value={field.value}
                        onChange={field.onChange}
                        onLocationSelect={handleLocationSelect}
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Search for an address or venue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter venue name" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a specific venue name if applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categoryOptions.map(category => (
                      <Button
                        key={category}
                        type="button"
                        variant={field.value.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newValue = field.value.includes(category)
                            ? field.value.filter(c => c !== category)
                            : [...field.value, category];
                          field.onChange(newValue);
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Free Event</FormLabel>
                      <FormDescription>
                        This event is free to attend
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("isFree") && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="wheelchairAccessible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Wheelchair Accessible</FormLabel>
                      <FormDescription>
                        This venue is accessible to wheelchair users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyFriendly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Family Friendly</FormLabel>
                      <FormDescription>
                        This event is suitable for all ages
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="organizerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organizer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal (Your Profile)</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === "organization" ? (
                      <>
                        Select an organization to host this event or{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto" 
                          onClick={() => navigate("/organizers")}
                        >
                          create a new one
                        </Button>
                      </>
                    ) : (
                      "The event will be associated with your personal profile"
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("organizerType") === "organization" && (
              <FormField
                control={form.control}
                name="organizerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="org1">EventMasters Group</SelectItem>
                        <SelectItem value="org2">Community Events Collective</SelectItem>
                        <SelectItem value="org3">Tech Meetup Organizers</SelectItem>
                        <SelectItem value="new">+ Create New Organization</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
