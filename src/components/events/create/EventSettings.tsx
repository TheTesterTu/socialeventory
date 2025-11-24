
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
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Event Settings</h3>
      
      <div className="space-y-4 p-4 rounded-lg border bg-card">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label>Free Event</Label>
                <p className="text-sm text-muted-foreground mt-0.5">Disable to set a ticket price</p>
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
                <FormLabel>Ticket Price ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
      
      <div className="space-y-4 p-4 rounded-lg border bg-card">
        <h4 className="text-base font-medium">Accessibility Options</h4>
        
        <FormField
          control={form.control}
          name="wheelchairAccessible"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <Label>Wheelchair Accessible</Label>
                <p className="text-sm text-muted-foreground mt-0.5">Venue has wheelchair access</p>
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
                <Label>Family Friendly</Label>
                <p className="text-sm text-muted-foreground mt-0.5">Suitable for all ages</p>
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
          <FormItem className="p-4 rounded-lg border bg-card">
            <FormLabel>Organizer Type</FormLabel>
            <FormDescription>
              Select whether you're hosting this event personally or as an organization
            </FormDescription>
            <div className="flex gap-4 mt-2">
              <label className={`flex-1 p-3 rounded-md cursor-pointer transition-colors border ${
                field.value === 'personal' 
                  ? 'bg-primary/10 border-primary' 
                  : 'border-border hover:bg-muted/50'
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
                  <h4 className="font-medium">Personal</h4>
                  <p className="text-xs text-muted-foreground mt-1">I'm hosting this event myself</p>
                </div>
              </label>
              
              <label className={`flex-1 p-3 rounded-md cursor-pointer transition-colors border ${
                field.value === 'organization' 
                  ? 'bg-primary/10 border-primary' 
                  : 'border-border hover:bg-muted/50'
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
                  <h4 className="font-medium">Organization</h4>
                  <p className="text-xs text-muted-foreground mt-1">I represent an organization</p>
                </div>
              </label>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
