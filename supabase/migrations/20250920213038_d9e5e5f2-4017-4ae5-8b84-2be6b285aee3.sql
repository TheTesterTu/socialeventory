-- Clean up old demo/mock events that are confusing the UI
-- Remove old mock events from 2025-02-* dates (these appear to be demo data)
DELETE FROM events 
WHERE start_date < '2025-07-01' 
AND (
  title LIKE '%Jazz%' OR 
  title LIKE '%Startup%' OR 
  title LIKE '%Gallery%' OR 
  title LIKE '%Farmers Market%' OR 
  title LIKE '%Yoga%' OR
  location LIKE '%San Francisco%'
);

-- Update events with empty image URLs to have proper fallback images based on their category
UPDATE events 
SET image_url = CASE 
  WHEN 'Music' = ANY(category) THEN 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'
  WHEN 'Technology' = ANY(category) THEN 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
  WHEN 'Food' = ANY(category) THEN 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80'
  WHEN 'Art' = ANY(category) THEN 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80'
  WHEN 'Sports' = ANY(category) THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
  WHEN 'Business' = ANY(category) THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  ELSE 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
END
WHERE image_url IS NULL OR image_url = '' OR image_url = ' ';