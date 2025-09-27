
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Sample events data for various locations
const sampleEvents = [
  // Sicily Events
  {
    title: "Sicilian Wine Festival",
    description: "Experience the finest wines from all across Sicily, paired with local delicacies and traditional music.",
    location: "Taormina, Sicily, Italy",
    venue_name: "Piazza IX Aprile",
    coordinates: { x: 15.2966, y: 37.8516 }, // Taormina
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural", "Entertainment"],
    tags: ["wine", "food", "music", "culture"],
    pricing: { isFree: false, priceRange: [15, 40], currency: "EUR" },
    accessibility: { languages: ["Italian", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1506377247377-2c4bdfb953fd",
  },
  {
    title: "Etna Hiking Adventure",
    description: "Join our expert guides for an unforgettable hike on Europe's most active volcano.",
    location: "Mount Etna, Sicily, Italy",
    venue_name: "Etna National Park",
    coordinates: { x: 15.0042, y: 37.7510 }, // Mt Etna
    start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    category: ["Sports", "Outdoor", "Adventure"],
    tags: ["hiking", "volcano", "nature", "adventure"],
    pricing: { isFree: false, priceRange: [50, 80], currency: "EUR" },
    accessibility: { languages: ["Italian", "English", "German"], wheelchairAccessible: false, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1548578130-56f876a57b1e",
  },
  {
    title: "Palermo Street Food Tour",
    description: "Discover the vibrant flavors of Sicilian street food with our guided walking tour through the historic markets of Palermo.",
    location: "Palermo, Sicily, Italy",
    venue_name: "Ballarò Market",
    coordinates: { x: 13.3613, y: 38.1157 }, // Palermo
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural", "Entertainment"],
    tags: ["street food", "culinary", "walking tour", "local cuisine"],
    pricing: { isFree: false, priceRange: [35, 50], currency: "EUR" },
    accessibility: { languages: ["Italian", "English", "French"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
  },
  
  // Luxembourg Events
  {
    title: "Luxembourg Jazz Festival",
    description: "Enjoy three days of world-class jazz performances in the heart of Luxembourg City.",
    location: "Luxembourg City, Luxembourg",
    venue_name: "Philharmonie Luxembourg",
    coordinates: { x: 6.1432, y: 49.6117 }, // Luxembourg City
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Entertainment", "Cultural"],
    tags: ["jazz", "live music", "festival", "international"],
    pricing: { isFree: false, priceRange: [30, 120], currency: "EUR" },
    accessibility: { languages: ["English", "French", "German", "Luxembourgish"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
  },
  {
    title: "Medieval Festival at Vianden Castle",
    description: "Step back in time at one of Europe's most impressive medieval castles with knights, jesters, and craftspeople.",
    location: "Vianden, Luxembourg",
    venue_name: "Vianden Castle",
    coordinates: { x: 6.2086, y: 49.9356 }, // Vianden
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    category: ["Entertainment", "Cultural", "Family"],
    tags: ["medieval", "history", "castle", "festival"],
    pricing: { isFree: false, priceRange: [12, 18], currency: "EUR" },
    accessibility: { languages: ["English", "French", "German", "Luxembourgish"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1618987628725-50733eb2ebb7",
  },
  
  // Amsterdam Events
  {
    title: "Amsterdam Canal Festival",
    description: "Classical music concerts performed on boats traveling through Amsterdam's historic canals.",
    location: "Amsterdam, Netherlands",
    venue_name: "Amsterdam Canals",
    coordinates: { x: 4.9041, y: 52.3676 }, // Amsterdam
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Cultural", "Entertainment"],
    tags: ["classical music", "canals", "boats", "outdoor concert"],
    pricing: { isFree: false, priceRange: [25, 75], currency: "EUR" },
    accessibility: { languages: ["English", "Dutch"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1512470876302-972fce5c6fac",
  },
  {
    title: "Amsterdam Light Festival",
    description: "Annual winter light exhibition with illuminated artworks along Amsterdam's canals and streets.",
    location: "Amsterdam, Netherlands",
    venue_name: "Amsterdam City Center",
    coordinates: { x: 4.8952, y: 52.3702 }, // Amsterdam City Center
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Arts", "Cultural", "Entertainment"],
    tags: ["light festival", "art", "night", "exhibition"],
    pricing: { isFree: true, priceRange: [0, 0], currency: "EUR" },
    accessibility: { languages: ["English", "Dutch"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc",
  },
  {
    title: "Amsterdam Dance Event",
    description: "The world's largest electronic music festival featuring over 2,500 artists in venues across the city.",
    location: "Amsterdam, Netherlands",
    venue_name: "Multiple Venues",
    coordinates: { x: 4.8952, y: 52.3675 }, // Amsterdam
    start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Nightlife", "Entertainment"],
    tags: ["electronic music", "festival", "DJs", "clubbing"],
    pricing: { isFree: false, priceRange: [40, 250], currency: "EUR" },
    accessibility: { languages: ["English"], wheelchairAccessible: true, familyFriendly: false },
    image_url: "https://images.unsplash.com/photo-1571266028242-539c817de094",
  },
  
  // Nice, France Events
  {
    title: "Nice Carnival",
    description: "One of the world's major carnival events featuring parades, floats, and flower battles along the Mediterranean coast.",
    location: "Nice, France",
    venue_name: "Place Masséna",
    coordinates: { x: 7.2620, y: 43.6962 }, // Nice
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Entertainment", "Cultural", "Family"],
    tags: ["carnival", "parade", "festival", "costume"],
    pricing: { isFree: false, priceRange: [10, 26], currency: "EUR" },
    accessibility: { languages: ["French", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1551410224-699683e15636",
  },
  {
    title: "French Riviera Wine Tasting",
    description: "Experience the unique flavors of wines from the French Riviera region with expert sommeliers.",
    location: "Nice, France",
    venue_name: "Le Château de Crémat",
    coordinates: { x: 7.2295, y: 43.7223 }, // Wine Château in Nice
    start_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural"],
    tags: ["wine", "tasting", "french", "riviera"],
    pricing: { isFree: false, priceRange: [45, 80], currency: "EUR" },
    accessibility: { languages: ["French", "English"], wheelchairAccessible: true, familyFriendly: false },
    image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea",
  },
  {
    title: "Jazz à Juan Festival",
    description: "Legendary jazz festival in the beautiful setting of Antibes Juan-les-Pins, near Nice.",
    location: "Antibes Juan-les-Pins, France",
    venue_name: "La Pinède Gould",
    coordinates: { x: 7.1276, y: 43.5665 }, // Juan-les-Pins
    start_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Entertainment", "Cultural"],
    tags: ["jazz", "festival", "live music", "outdoor"],
    pricing: { isFree: false, priceRange: [35, 100], currency: "EUR" },
    accessibility: { languages: ["French", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  }
];

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert events
    const { data, error } = await supabase.from("events").insert(sampleEvents);
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Sample events added successfully", 
        count: sampleEvents.length 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Error inserting events",
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
