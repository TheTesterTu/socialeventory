
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LocationSearch } from "@/components/LocationSearch";
import { ImagePlus } from "lucide-react";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
  imageFile: File | null;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationSelect: (address: string, coordinates: [number, number], venue?: string) => void;
}

export const EventBasicInfo = ({ 
  form, 
  imageFile, 
  imagePreview, 
  handleImageChange,
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
