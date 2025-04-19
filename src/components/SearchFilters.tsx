
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Calendar as CalendarIcon } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { EventAdvancedFilters } from "./EventAdvancedFilters";
import { EventFilters } from "@/lib/types/filters";
import { format } from "date-fns";
import { useState } from "react";

interface SearchFiltersProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  onDateChange?: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export const SearchFilters = ({
  selectedCategories,
  onCategoryToggle,
  filters,
  onFilterChange,
  onDateChange,
  selectedDate,
}: SearchFiltersProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-2"
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Events</SheetTitle>
            <SheetDescription>
              Customize your event search with these filters
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <h3 className="mb-4 text-sm font-medium">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryToggle(category)}
                  className="rounded-xl transition-all hover:scale-105"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <EventAdvancedFilters 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </SheetContent>
      </Sheet>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </motion.div>
  );
};
