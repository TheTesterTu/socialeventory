
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedEvents } from '@/hooks/useSavedEvents';
import { cn } from '@/lib/utils';

interface SaveEventButtonProps {
  eventId: string;
  variant?: 'default' | 'icon' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SaveEventButton = ({ 
  eventId, 
  variant = 'ghost', 
  size = 'sm',
  showText = false,
  className 
}: SaveEventButtonProps) => {
  const { isEventSaved, toggleSaveEvent, isLoading } = useSavedEvents();
  const isSaved = isEventSaved(eventId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSaveEvent(eventId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2",
        isSaved && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isSaved && "fill-current"
        )}
      />
      {showText && (
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
};
