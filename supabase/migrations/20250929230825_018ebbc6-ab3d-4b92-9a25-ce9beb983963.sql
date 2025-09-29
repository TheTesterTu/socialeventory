-- Insert some test likes and attendees to verify functionality
INSERT INTO event_likes (event_id, user_id) VALUES 
  ('bea6d9bb-c0a3-4ec2-9ec3-77d87d09c363', '634a890e-df73-45ed-9f60-956a6c45a75c'),
  ('27bf1d2d-0acb-4ad1-a48c-d1cf044adc4e', '634a890e-df73-45ed-9f60-956a6c45a75c');

INSERT INTO event_attendees (event_id, user_id, status) VALUES 
  ('c7adcf8a-d408-4e8c-82b0-e4f9ccb99751', '634a890e-df73-45ed-9f60-956a6c45a75c', 'going'),
  ('629dedd8-531c-4391-b72c-9fd173f1de62', '634a890e-df73-45ed-9f60-956a6c45a75c', 'going');

-- Update the events table to reflect the new counts (triggers should handle this, but let's ensure consistency)
UPDATE events SET likes = 1 WHERE id = 'bea6d9bb-c0a3-4ec2-9ec3-77d87d09c363';
UPDATE events SET likes = 1 WHERE id = '27bf1d2d-0acb-4ad1-a48c-d1cf044adc4e';
UPDATE events SET attendees = 1 WHERE id = 'c7adcf8a-d408-4e8c-82b0-e4f9ccb99751';
UPDATE events SET attendees = 1 WHERE id = '629dedd8-531c-4391-b72c-9fd173f1de62';