import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateEvent = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Title</label>
            <Input placeholder="Enter event title" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe your event" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="Enter venue or address" />
          </div>
          
          <Button type="submit">Create Event</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;