
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Mail, Share2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizerHeaderProps {
  organizer: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    description: string;
    website?: string;
    email: string;
    phone?: string;
    rating: number;
    eventCount: number;
    featured: boolean;
    location: string;
    categories: string[];
    verified: boolean;
    foundedYear: number;
    teamSize: string;
    social: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  isLoading?: boolean;
}

export const OrganizerHeader = ({ organizer, isLoading = false }: OrganizerHeaderProps) => {
  if (isLoading) {
    return (
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl" />
        <div className="absolute -bottom-12 left-6 flex items-end">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        
        <div className="pt-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative mb-8">
      <div className="h-48 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl" />
      <div className="absolute -bottom-12 left-6 flex items-end">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={organizer.avatar} alt={organizer.name} />
          <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{organizer.name}</h1>
              {organizer.verified && (
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              )}
              {organizer.featured && (
                <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{organizer.location}</span>
              <span className="mx-2">•</span>
              <span>Since {organizer.foundedYear}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {organizer.website && (
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Website
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
