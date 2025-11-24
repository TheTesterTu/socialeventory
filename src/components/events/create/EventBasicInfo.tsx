
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
    <div className="space-y-6">
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

      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Image</FormLabel>
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
            <FormDescription>
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
            <FormLabel>Location</FormLabel>
            <FormControl>
              <LocationSearch 
                value={field.value}
                onChange={field.onChange}
                onLocationSelect={handleLocationSelect}
              />
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
    </div>
  );
};
