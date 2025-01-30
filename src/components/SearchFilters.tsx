import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, MapPin, Calendar } from "lucide-react";
import { categories } from "@/lib/mock-data";

interface SearchFiltersProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export const SearchFilters = ({
  selectedCategories,
  onCategoryToggle,
}: SearchFiltersProps) => {
  return (
    <div className="flex gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
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
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Button variant="outline" className="gap-2">
        <MapPin className="h-4 w-4" />
        Near Me
      </Button>
      <Button variant="outline" className="gap-2">
        <Calendar className="h-4 w-4" />
        Date
      </Button>
    </div>
  );
};