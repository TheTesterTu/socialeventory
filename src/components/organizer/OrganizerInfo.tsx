
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface OrganizerInfoProps {
  organizer: {
    teamSize: string;
    eventCount: number;
    rating: number;
    email: string;
    phone?: string;
    social: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
}

export const OrganizerInfo = ({ organizer }: OrganizerInfoProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Organization Info</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Team Size</p>
            <p className="font-medium">{organizer.teamSize}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Events Organized</p>
            <p className="font-medium">{organizer.eventCount}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Rating</p>
            <div className="flex items-center gap-1">
              <span className="font-medium">{organizer.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(organizer.rating) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Contact</p>
            <p className="font-medium">{organizer.email}</p>
            {organizer.phone && <p className="font-medium">{organizer.phone}</p>}
          </div>
          
          {Object.keys(organizer.social).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Social</p>
              <div className="flex gap-2 mt-1">
                {organizer.social.twitter && (
                  <a href={`https://twitter.com/${organizer.social.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </Button>
                  </a>
                )}
                {organizer.social.instagram && (
                  <a href={`https://instagram.com/${organizer.social.instagram}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </Button>
                  </a>
                )}
                {organizer.social.facebook && (
                  <a href={`https://facebook.com/${organizer.social.facebook}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <Button className="w-full" onClick={() => window.location.href = '/create-event'}>
            Create Event With This Organizer
          </Button>
        </div>
      </div>
    </Card>
  );
};
