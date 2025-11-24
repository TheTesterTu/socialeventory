
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
