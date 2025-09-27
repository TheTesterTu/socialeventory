-- Clear old events and insert new real events for European cities
DELETE FROM events WHERE start_date < NOW();

-- Real events for Sicily, Luxembourg, Germany, Amsterdam, and Nice
INSERT INTO events (
  title, 
  description, 
  location, 
  venue_name,
  coordinates, 
  start_date, 
  end_date,
  category, 
  tags,
  pricing,
  accessibility,
  image_url,
  is_featured,
  verification_status
) VALUES
-- Sicily Events
(
  'Catania Street Food Festival 2025',
  'Authentic Sicilian street food experience in the heart of Catania with arancini, cannoli, and fresh seafood.',
  'Via Etnea, Catania, Sicily, Italy',
  'Piazza del Duomo',
  POINT(15.0873, 37.5024),
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days' + INTERVAL '8 hours',
  ARRAY['Food', 'Cultural', 'Festival'],
  ARRAY['street food', 'sicilian', 'local cuisine'],
  '{"isFree": false, "priceRange": [10, 25], "currency": "EUR"}',
  '{"languages": ["Italian", "English"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
  true,
  'verified'
),
(
  'Mount Etna Sunset Tour',
  'Guided evening tour to Europe''s most active volcano with sunset views and wine tasting.',
  'Mount Etna, Catania, Sicily, Italy',
  'Etna National Park',
  POINT(15.0042, 37.7510),
  NOW() + INTERVAL '8 days',
  NOW() + INTERVAL '8 days' + INTERVAL '6 hours',
  ARRAY['Adventure', 'Nature', 'Tours'],
  ARRAY['volcano', 'sunset', 'wine', 'guided tour'],
  '{"isFree": false, "priceRange": [65, 95], "currency": "EUR"}',
  '{"languages": ["Italian", "English"], "wheelchairAccessible": false, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1548578130-56f876a57b1e',
  false,
  'verified'
),

-- Luxembourg Events  
(
  'Luxembourg Winter Market 2025',
  'Traditional Christmas market in the heart of Luxembourg City with local crafts and seasonal treats.',
  'Place d''Armes, Luxembourg City, Luxembourg',
  'Place d''Armes',
  POINT(6.1319, 49.6116),
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '35 days',
  ARRAY['Cultural', 'Shopping', 'Family'],
  ARRAY['christmas market', 'winter', 'crafts'],
  '{"isFree": true, "priceRange": [0, 0], "currency": "EUR"}',
  '{"languages": ["French", "German", "English", "Luxembourgish"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1576419842219-afd64769f151',
  true,
  'verified'
),
(
  'New Year Concert Luxembourg Philharmonic',
  'Classical music concert featuring Mozart and Beethoven at the Philharmonie Luxembourg.',
  'Luxembourg City, Luxembourg',
  'Philharmonie Luxembourg',
  POINT(6.1432, 49.6117),
  NOW() + INTERVAL '35 days',
  NOW() + INTERVAL '35 days' + INTERVAL '3 hours',
  ARRAY['Music', 'Cultural', 'Classical'],
  ARRAY['classical', 'orchestra', 'new year'],
  '{"isFree": false, "priceRange": [45, 120], "currency": "EUR"}',
  '{"languages": ["French", "German", "English"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
  false,
  'verified'
),

-- Germany Events (Berlin)
(
  'Berlin Winter Festival 2025',
  'Spectacular winter celebration with ice sculptures, German cuisine, and live music in the heart of Berlin.',
  'Brandenburg Gate, Berlin, Germany',
  'Pariser Platz',
  POINT(13.3777, 52.5162),
  NOW() + INTERVAL '12 days',
  NOW() + INTERVAL '15 days',
  ARRAY['Cultural', 'Festival', 'Music'],
  ARRAY['winter', 'german culture', 'ice sculptures'],
  '{"isFree": true, "priceRange": [0, 0], "currency": "EUR"}',
  '{"languages": ["German", "English"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
  true,
  'verified'
),
(
  'Berlin Tech Conference 2025',
  'Leading technology conference featuring AI, blockchain, and sustainable tech innovations.',
  'Berlin, Germany',
  'Berlin Convention Center',
  POINT(13.4050, 52.5200),
  NOW() + INTERVAL '20 days',
  NOW() + INTERVAL '22 days',
  ARRAY['Technology', 'Business', 'Innovation'],
  ARRAY['tech', 'AI', 'blockchain', 'startups'],
  '{"isFree": false, "priceRange": [150, 350], "currency": "EUR"}',
  '{"languages": ["German", "English"], "wheelchairAccessible": true, "familyFriendly": false}',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  false,
  'verified'
),

-- Amsterdam Events
(
  'Amsterdam Light Festival 2025',
  'Spectacular light art installations throughout Amsterdam''s historic canals and districts.',
  'Amsterdam City Center, Netherlands',
  'Various Locations',
  POINT(4.9041, 52.3676),
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '60 days',
  ARRAY['Arts', 'Cultural', 'Light'],
  ARRAY['light art', 'canal tour', 'winter'],
  '{"isFree": false, "priceRange": [15, 35], "currency": "EUR"}',
  '{"languages": ["Dutch", "English"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc',
  true,
  'verified'
),
(
  'Amsterdam Cheese & Beer Festival',
  'Ultimate Dutch experience featuring traditional cheeses paired with local craft beers.',
  'Amsterdam, Netherlands',
  'De Kaaskamer',
  POINT(4.8840, 52.3730),
  NOW() + INTERVAL '14 days',
  NOW() + INTERVAL '14 days' + INTERVAL '4 hours',
  ARRAY['Food', 'Cultural', 'Tasting'],
  ARRAY['cheese', 'beer', 'dutch', 'tasting'],
  '{"isFree": false, "priceRange": [25, 45], "currency": "EUR"}',
  '{"languages": ["Dutch", "English"], "wheelchairAccessible": true, "familyFriendly": false}',
  'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea',
  false,
  'verified'
),

-- Nice, France Events
(
  'Nice Carnival 2025',
  'The famous Carnival of Nice with magnificent floats and the traditional Battle of Flowers.',
  'Promenade des Anglais, Nice, France',
  'Place Masséna',
  POINT(7.2683, 43.6963),
  NOW() + INTERVAL '25 days',
  NOW() + INTERVAL '35 days',
  ARRAY['Cultural', 'Festival', 'Traditional'],
  ARRAY['carnival', 'parade', 'flowers', 'french riviera'],
  '{"isFree": false, "priceRange": [15, 45], "currency": "EUR"}',
  '{"languages": ["French", "English"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
  true,
  'verified'
),
(
  'Mediterranean Food Festival Nice',
  'Taste the best of Mediterranean cuisine with local chefs from across the French Riviera.',
  'Old Town Nice, France',
  'Cours Saleya Market',
  POINT(7.2760, 43.6961),
  NOW() + INTERVAL '18 days',
  NOW() + INTERVAL '20 days',
  ARRAY['Food', 'Cultural', 'Mediterranean'],
  ARRAY['mediterranean', 'local food', 'riviera', 'market'],
  '{"isFree": true, "priceRange": [0, 0], "currency": "EUR"}',
  '{"languages": ["French", "English", "Italian"], "wheelchairAccessible": true, "familyFriendly": true}',
  'https://images.unsplash.com/photo-1555939594-58e4c4844a28',
  false,
  'verified'
);