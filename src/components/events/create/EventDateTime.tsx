
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface EventDateTimeProps {
  form: UseFormReturn<any>;
}

export const EventDateTime = ({ form }: EventDateTimeProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
      {/* Subtle background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 via-pink-50/5 to-purple-50/10 -z-10 rounded-lg" />
      
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-white">Start Date & Time</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="datetime-local" 
                  {...field} 
                  className="pl-10 bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 text-white focus:bg-white/15" 
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
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
            <FormLabel className="font-medium text-white">End Date & Time</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="datetime-local" 
                  {...field} 
                  className="pl-10 bg-white/10 backdrop-blur-sm border-primary/20 focus:border-primary/60 text-white focus:bg-white/15" 
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
