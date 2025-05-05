
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface EventSettingsProps {
  form: UseFormReturn<any>;
}

export const EventSettings = ({ form }: EventSettingsProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Subtle background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/10 via-blue-50/5 to-indigo-50/10 -z-10 rounded-lg" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 mt-1 accent-blue-500"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">Free Event</FormLabel>
                <FormDescription className="text-blue-200/80">
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
                <FormLabel className="font-medium text-white">Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    className="bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 text-white focus:bg-white/15"
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">Wheelchair Accessible</FormLabel>
                <FormDescription className="text-blue-200/80">
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">Family Friendly</FormLabel>
                <FormDescription className="text-blue-200/80">
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
            <FormLabel className="font-medium text-white">Organizer Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-primary/20 text-white">
                  <SelectValue placeholder="Select organizer type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="personal">Personal (Your Profile)</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
