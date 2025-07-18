
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    categories?: string[];
    dateRange?: [Date | null, Date | null];
    priceRange?: [number, number];
    location?: string;
    distance?: number;
  }
}

interface SavedFiltersProps {
  onApplyFilter: (filter: any) => void;
  currentFilters: any;
}

export const SavedFilters = ({ onApplyFilter, currentFilters }: SavedFiltersProps) => {
  const { user } = useAuth();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      setSavedFilters([]);
      return;
    }
    
    const fetchSavedFilters = async () => {
      setLoading(true);
      try {
        // TODO: Implement saved filters in database when user settings are expanded
        // For now, use localStorage for saved filters
        const saved = localStorage.getItem(`savedFilters_${user.id}`);
        if (saved) {
          setSavedFilters(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error fetching saved filters:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedFilters();
  }, [user]);
  
  const handleSaveCurrentFilters = () => {
    if (!user) {
      toast.error("Please sign in to save filters");
      return;
    }
    
    // Ask for a name for the filter
    const name = prompt("Enter a name for this filter set:");
    if (!name) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name,
      filters: currentFilters
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem(`savedFilters_${user.id}`, JSON.stringify(updatedFilters));
    toast.success(`Filter "${name}" saved successfully`);
  };
  
  const handleDeleteFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== id);
    setSavedFilters(updatedFilters);
    localStorage.setItem(`savedFilters_${user.id}`, JSON.stringify(updatedFilters));
    toast.success("Filter removed");
  };
  
  if (!user || savedFilters.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Saved Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {savedFilters.map((filter) => (
            <Badge 
              key={filter.id}
              variant="outline"
              className="cursor-pointer px-3 py-1 bg-background hover:bg-accent/50 group"
              onClick={() => onApplyFilter(filter.filters)}
            >
              {filter.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFilter(filter.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs" 
            onClick={handleSaveCurrentFilters}
            disabled={!Object.keys(currentFilters || {}).length}
          >
            <Save className="h-3 w-3 mr-1" />
            Save Current
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
