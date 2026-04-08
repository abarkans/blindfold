-- Blindfold: Seed Date Ideas
-- Run this after 001_initial_schema.sql to populate sample date ideas
-- These are template ideas that can be assigned to couples

-- Sample date ideas templates
-- Note: These are templates. In production, you'd generate unique ideas per couple via LLM

-- Helper function to get a random couple
CREATE OR REPLACE FUNCTION get_random_couple_id() RETURNS UUID AS $$
  SELECT id FROM couples ORDER BY RANDOM() LIMIT 1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_random_navigator_id() RETURNS UUID AS $$
  SELECT navigator_id FROM couples ORDER BY RANDOM() LIMIT 1;
$$ LANGUAGE SQL;

-- Only seed if couples exist
DO $$
DECLARE
  couple_uuid UUID;
  navigator_uuid UUID;
BEGIN
  -- Get a random couple for seeding
  SELECT id, navigator_id INTO couple_uuid, navigator_uuid
  FROM couples
  ORDER BY RANDOM()
  LIMIT 1;

  IF couple_uuid IS NOT NULL THEN
    -- Blind Taste Challenge
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Blind Taste Challenge',
      'One of you picks 5 mystery snacks from a store without the other seeing. Back home, taste them blindfolded and guess what you''re eating.',
      'food', 'mixed',
      'Pick 5 mystery snacks from the store. Keep them secret. Prepare scoring sheets.',
      'Set up the blindfold station. Trust your partner''s selections.',
      15, 30, 90,
      'draft', couple_uuid, navigator_uuid
    );

    -- Sunset Rooftop Picnic
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Sunset Rooftop Picnic',
      'Find the highest accessible rooftop or viewpoint in your area. Pack a simple spread, bring a blanket, and watch the city shift from day to night.',
      'outdoors', 'outdoor',
      'Research and navigate to the spot. Keep destination secret.',
      'Pack the food, drinks, and blanket without asking questions.',
      20, 50, 180,
      'draft', couple_uuid, navigator_uuid
    );

    -- Mystery Museum Tour
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Mystery Museum Tour',
      'Visit a museum neither of you has been to. Take turns picking one exhibit to explore together, then share what drew you to it.',
      'arts', 'indoor',
      'Pick a museum you both haven''t visited. Plan the route.',
      'Bring a notebook. Share what each exhibit makes you feel.',
      30, 60, 120,
      'draft', couple_uuid, navigator_uuid
    );

    -- Cooking Challenge
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Cooking Challenge',
      'Pick 3 random ingredients from the pantry. Together, create a dish using all of them. No recipes allowed - improvise together!',
      'food', 'indoor',
      'Select 3 mystery ingredients. Set the cooking rules.',
      'Bring your creativity. No complaining about the ingredients!',
      10, 40, 120,
      'draft', couple_uuid, navigator_uuid
    );

    -- Night Walk Adventure
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Night Walk Adventure',
      'Take a walk through your city at night. Follow the most interesting lights and sounds. Stop wherever feels right for a warm drink.',
      'outdoors', 'outdoor',
      'Plan a safe walking route. Find interesting spots.',
      'Bring comfortable shoes. Embrace the spontaneity.',
      5, 20, 90,
      'draft', couple_uuid, navigator_uuid
    );

    -- Thrift Store Styling
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Thrift Store Styling',
      'Go to a thrift store. Each person picks an outfit for the other (under $30). Wear them out for coffee afterwards.',
      'active', 'mixed',
      'Set the budget. Pick an outfit for your partner.',
      'Trust your partner''s fashion sense. No vetoing!',
      30, 60, 180,
      'draft', couple_uuid, navigator_uuid
    );

    -- Stargazing Escape
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Stargazing Escape',
      'Drive to the darkest spot nearby. Bring blankets, hot drinks, and a stargazing app. Find constellations together.',
      'outdoors', 'outdoor',
      'Find the darkest spot. Download a stargazing app.',
      'Pack blankets and hot drinks. Bring warm clothes.',
      10, 30, 120,
      'draft', couple_uuid, navigator_uuid
    );

    -- Board Game Cafe Crawl
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Board Game Cafe Crawl',
      'Visit 2-3 board game cafes or bars. Play a different game at each location. Keep score of who wins the most.',
      'cozy', 'indoor',
      'Research nearby board game cafes. Plan the route.',
      'Bring your competitive spirit. Keep the score.',
      25, 50, 180,
      'draft', couple_uuid, navigator_uuid
    );

    -- Photo Scavenger Hunt
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Photo Scavenger Hunt',
      'Create a list of 10 things to photograph together around the city. Examples: something red, something vintage, a street performer.',
      'active', 'outdoor',
      'Create the scavenger hunt list. Plan the starting point.',
      'Bring your phone/camera. Be creative with the shots.',
      5, 25, 120,
      'draft', couple_uuid, navigator_uuid
    );

    -- Speakeasy Hunt
    INSERT INTO date_ideas (
      title, description, category, location_type,
      navigator_instruction, curator_instruction,
      estimated_cost_min, estimated_cost_max, estimated_duration_minutes,
      status, couple_id, planned_by
    ) VALUES (
      'Speakeasy Hunt',
      'Find and visit a hidden speakeasy or secret bar. The journey to find the entrance is half the adventure.',
      'nightlife', 'indoor',
      'Research hidden bars. Find the secret entrance.',
      'Dress up. Enjoy the mystery of finding the spot.',
      40, 80, 180,
      'draft', couple_uuid, navigator_uuid
    );
  END IF;
END $$;

-- Clean up helper functions
DROP FUNCTION IF EXISTS get_random_couple_id();
DROP FUNCTION IF EXISTS get_random_navigator_id();
