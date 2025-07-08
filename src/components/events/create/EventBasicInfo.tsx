
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LocationSearch } from "@/components/LocationSearch";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
  handleLocationSelect: (address: string, coordinates: [number, number], venue?: string) => void;
}

export const EventBasicInfo = ({ 
  form, 
  handleLocationSelect 
}: EventBasicInfoProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Subtle background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-pink-50/5 to-purple-50/10 -z-10 rounded-lg" />
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-white">Event Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter a clear and descriptive title" 
                {...field} 
                className="bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 placeholder:text-muted-foreground/70 text-white focus:bg-white/15"
              />
            </FormControl>
            <FormDescription className="text-blue-200/80">
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
            <FormLabel className="font-medium text-white">Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What is your event about? What can attendees expect?" 
                className="min-h-[150px] bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 placeholder:text-muted-foreground/70 text-white focus:bg-white/15" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-white">Event Image</FormLabel>
            <FormControl>
              <ImageUpload
                onImageSelect={field.onChange}
                currentImage={field.value}
                placeholder="Click to upload event image"
                bucket="event-images"
                folder="images"
                aspectRatio="video"
              />
            </FormControl>
            <FormDescription className="text-blue-200/80">
              Upload a high-quality image that represents your event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-white">Location</FormLabel>
            <FormControl>
              <LocationSearch 
                value={field.value}
                onChange={field.onChange}
                onLocationSelect={handleLocationSelect}
              />
            </FormControl>
            <FormDescription className="text-blue-200/80">
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
            <FormLabel className="font-medium text-white">Venue Name (Optional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter venue name" 
                {...field} 
                value={field.value || ''}
                className="bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 placeholder:text-muted-foreground/70 text-white focus:bg-white/15"
              />
            </FormControl>
            <FormDescription className="text-blue-200/80">
              Add a specific venue name if applicable
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
