// import { Button } from "@/components/ui/button"; // Removed unused Button
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { EventFilters } from "@/lib/types/filters";
import { motion } from "framer-motion";

interface EventAdvancedFiltersProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
}

export const EventAdvancedFilters = ({ filters, onFilterChange }: EventAdvancedFiltersProps) => {
  const handleAccessibilityChange = (key: keyof typeof filters.accessibility, value: boolean) => {
    onFilterChange({
      ...filters,
      accessibility: {
        ...filters.accessibility,
        [key]: value
      }
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      pricing: {
        ...filters.pricing,
        maxPrice: value[0]
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-6 py-4"
    >
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="wheelchair">Wheelchair Accessible</Label>
            <Switch
              id="wheelchair"
              checked={filters.accessibility?.wheelchairAccessible}
              onCheckedChange={(checked) => handleAccessibilityChange('wheelchairAccessible', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="family">Family Friendly</Label>
            <Switch
              id="family"
              checked={filters.accessibility?.familyFriendly}
              onCheckedChange={(checked) => handleAccessibilityChange('familyFriendly', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="free">Free Events Only</Label>
            <Switch
              id="free"
              checked={filters.pricing?.isFree}
              onCheckedChange={(checked) => 
                onFilterChange({
                  ...filters,
                  pricing: { ...filters.pricing, isFree: checked }
                })
              }
            />
          </div>
          {!filters.pricing?.isFree && (
            <div className="space-y-2">
              <Label>Maximum Price</Label>
              <Slider
                defaultValue={[filters.pricing?.maxPrice || 100]}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
              />
              <div className="text-sm text-muted-foreground">
                Up to ${filters.pricing?.maxPrice || 100}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};