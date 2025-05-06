
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface EventSettingsProps {
  form: UseFormReturn<any>;
}

export const EventSettings = ({ form }: EventSettingsProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Subtle background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/10 via-teal-50/5 to-blue-50/10 -z-10 rounded-lg" />
      
      <h3 className="text-lg font-medium mb-4 text-white">Event Settings</h3>
      
      <div className="space-y-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Free Event</Label>
                <p className="text-sm text-blue-200/80 mt-0.5">Disable to set a ticket price</p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
        
        {!form.watch("isFree") && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Ticket Price ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="pl-8 bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 text-white"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
      
      <div className="space-y-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <h4 className="text-base font-medium text-white">Accessibility Options</h4>
        
        <FormField
          control={form.control}
          name="wheelchairAccessible"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Wheelchair Accessible</Label>
                <p className="text-sm text-blue-200/80 mt-0.5">Venue has wheelchair access</p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
        
        <FormField
          control={form.control}
          name="familyFriendly"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Family Friendly</Label>
                <p className="text-sm text-blue-200/80 mt-0.5">Suitable for all ages</p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="organizerType"
        render={({ field }) => (
          <FormItem className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <FormLabel className="text-white font-medium">Organizer Type</FormLabel>
            <FormDescription className="text-blue-200/80">
              Select whether you're hosting this event personally or as an organization
            </FormDescription>
            <div className="flex gap-4 mt-2">
              <label className={`flex-1 p-3 rounded-md cursor-pointer transition-colors border ${
                field.value === 'personal' 
                  ? 'bg-primary/20 border-primary' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <input
                  type="radio"
                  name="organizerType"
                  value="personal"
                  checked={field.value === 'personal'}
                  onChange={() => field.onChange('personal')}
                  className="sr-only"
                />
                <div className="text-center">
                  <h4 className="font-medium text-white">Personal</h4>
                  <p className="text-xs text-blue-200/80 mt-1">I'm hosting this event myself</p>
                </div>
              </label>
              
              <label className={`flex-1 p-3 rounded-md cursor-pointer transition-colors border ${
                field.value === 'organization' 
                  ? 'bg-primary/20 border-primary' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <input
                  type="radio"
                  name="organizerType"
                  value="organization"
                  checked={field.value === 'organization'}
                  onChange={() => field.onChange('organization')}
                  className="sr-only"
                />
                <div className="text-center">
                  <h4 className="font-medium text-white">Organization</h4>
                  <p className="text-xs text-blue-200/80 mt-1">I represent an organization</p>
                </div>
              </label>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
