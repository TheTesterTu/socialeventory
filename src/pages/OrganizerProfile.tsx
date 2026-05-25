import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Users, Award, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";
import { Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { toast } from "sonner";

interface OrganizerProfileData {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

const OrganizerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OrganizerProfileData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await (supabase as any)
          .from("public_profiles")
          .select("id, username, full_name, avatar_url")
          .eq("id", id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profileData) {
          setNotFound(true);
          return;
        }

        setProfile({
          id: profileData.id,
          name: profileData.full_name || profileData.username || "Organizer",
          username: profileData.username,
          avatar: profileData.avatar_url,
        });

        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("created_by", id)
          .order("start_date", { ascending: false });

        if (eventsError) throw eventsError;
        setEvents((eventsData || []).map(mapDatabaseEventToEvent));
      } catch (err) {
        console.error(err);
        toast.error("Couldn't load this organizer");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const upcoming = events.filter((e) => new Date(e.startDate) >= new Date());
  const past = events.filter((e) => new Date(e.startDate) < new Date());
  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);

  if (loading) {
    return (
      <AppLayout pageTitle="Loading organizer">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !profile) {
    return (
      <AppLayout pageTitle="Organizer not found">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-2xl font-semibold mb-2">Organizer not found</h2>
          <p className="text-muted-foreground mb-6">This profile doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/organizers")}>Browse organizers</Button>
        </div>
      </AppLayout>
    );
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <AppLayout pageTitle={profile.name}>
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-6">
        <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-border">
              <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
              {profile.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}
              <div className="flex gap-6 pt-2">
                <div>
                  <div className="text-xl font-semibold text-foreground">{events.length}</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{upcoming.length}</div>
                  <div className="text-xs text-muted-foreground">Upcoming</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{totalAttendees}</div>
                  <div className="text-xs text-muted-foreground">Attendees</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied");
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No upcoming events yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcoming.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {past.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                Past events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {past.slice(0, 6).map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default OrganizerProfile;
