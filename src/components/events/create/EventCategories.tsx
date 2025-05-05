
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface EventCategoriesProps {
  form: UseFormReturn<any>;
  categoryOptions: string[];
}

export const EventCategoriesSelect = ({ form, categoryOptions }: EventCategoriesProps) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="relative">
          {/* Subtle background gradient for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/10 via-blue-50/5 to-purple-50/10 -z-10 rounded-lg" />
          
          <FormLabel className="font-medium text-white">Categories</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            {categoryOptions.map(category => (
              <Button
                key={category}
                type="button"
                variant={field.value.includes(category) ? "default" : "outline"}
                size="sm"
                className={field.value.includes(category) 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  : "border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"}
                onClick={() => {
                  const newValue = field.value.includes(category)
                    ? field.value.filter((c: string) => c !== category)
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
  );
};
