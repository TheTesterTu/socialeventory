
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Minus, Plus } from 'lucide-react';

interface RadiusControlProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  eventsCount: number;
  selectedDate?: Date;
}

export const RadiusControl = ({ radius, onRadiusChange, eventsCount, selectedDate }: RadiusControlProps) => {
  const increaseRadius = () => {
    onRadiusChange(Math.min(radius + 1, 50));
  };

  const decreaseRadius = () => {
    onRadiusChange(Math.max(radius - 1, 1));
  };

  return (
    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
      <span className="text-sm">
        Found {eventsCount} event{eventsCount !== 1 ? 's' : ''} within {radius} km
        {selectedDate && ` on ${selectedDate.toLocaleDateString()}`}
      </span>
      
      <div className="flex items-center gap-3 w-64">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 rounded-full"
          onClick={decreaseRadius}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <Slider
          value={[radius]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => onRadiusChange(value[0])}
          className="w-full"
        />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 rounded-full"
          onClick={increaseRadius}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
