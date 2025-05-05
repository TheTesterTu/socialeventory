
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface EventDateTimeProps {
  form: UseFormReturn<any>;
}

export const EventDateTime = ({ form }: EventDateTimeProps) => {
  return (
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
  );
};
