
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, UserPlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  events: number;
  followers: number;
  location?: string;
  role?: string;
}

interface OrganizationsListProps {
  title?: string;
  organizations: Organization[];
}

export const OrganizationsList = ({ 
  title = "My Organizations",
  organizations 
}: OrganizationsListProps) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={() => navigate('/organizers')} className="gap-2">
          <Building2 className="h-4 w-4" />
          Create Organization
        </Button>
      </div>

      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map(org => (
            <Card key={org.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between -mt-8 mb-4">
                  <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
                    <AvatarImage src={org.imageUrl} />
                    <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className="h-fit mt-2">{org.role || "Member"}</Badge>
                </div>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {org.location || "Location not set"}
                </CardDescription>
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{org.events} events</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    <span>{org.followers} members</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/organizer/${org.id}`)}
                >
                  Manage Organization
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Create or join an organization to collaborate with others on events.
              </p>
              <Button onClick={() => navigate('/organizers')} className="gap-2">
                <Building2 className="h-4 w-4" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
