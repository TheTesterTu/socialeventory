
// Temporary mock service until Supabase types are regenerated
export const savedEventsService = {
  async saveEvent(eventId: string): Promise<void> {
    // Mock implementation - will be replaced with real Supabase queries
    console.log('Saving event:', eventId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  },

  async unsaveEvent(eventId: string): Promise<void> {
    // Mock implementation - will be replaced with real Supabase queries  
    console.log('Unsaving event:', eventId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  },

  async isSaved(eventId: string): Promise<boolean> {
    // Mock implementation - will be replaced with real Supabase queries
    console.log('Checking if saved:', eventId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(false), 100);
    });
  },

  async getSavedEvents(): Promise<string[]> {
    // Mock implementation - will be replaced with real Supabase queries
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 100);
    });
  }
};
