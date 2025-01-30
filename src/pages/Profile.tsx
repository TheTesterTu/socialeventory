import React from 'react';
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20" />
          <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">Member since 2024</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Saved Events</h2>
            <div className="text-muted-foreground">No saved events yet</div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">My Events</h2>
            <div className="text-muted-foreground">No events created yet</div>
            <Button className="mt-4">Create Event</Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;