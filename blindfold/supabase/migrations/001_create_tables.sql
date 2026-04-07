-- Create user_data table for storing user preferences and date state
CREATE TABLE IF NOT EXISTS user_data (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- Create date_ideas table for storing date ideas
CREATE TABLE IF NOT EXISTS date_ideas (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  roleA_label TEXT,
  roleA_instruction TEXT,
  roleB_label TEXT,
  roleB_instruction TEXT,
  budget INTEGER DEFAULT 50,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create completed_dates table for tracking completed dates
CREATE TABLE IF NOT EXISTS completed_dates (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id BIGINT REFERENCES date_ideas(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  budget INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  memory TEXT,
  completed_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for completed_dates
CREATE INDEX IF NOT EXISTS idx_completed_dates_user_id ON completed_dates(user_id);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_dates ENABLE ROW LEVEL SECURITY;

-- Policies for user_data
CREATE POLICY "Users can read their own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for date_ideas (public read)
CREATE POLICY "Anyone can read date ideas"
  ON date_ideas FOR SELECT
  TO authenticated
  USING (true);

-- Policies for completed_dates
CREATE POLICY "Users can read their own completed dates"
  ON completed_dates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completed dates"
  ON completed_dates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert sample date ideas
INSERT INTO date_ideas (title, category, description, roleA_label, roleA_instruction, roleB_label, roleB_instruction, budget, duration) VALUES
('Blind Taste Challenge', 'Food & Drink', 'One of you picks 5 mystery snacks from a store without the other seeing. Back home, taste them blindfolded and guess what you''re eating.', 'Navigator', 'Pick the snacks solo — they must be unrecognisable.', 'Curator', 'Set up the blindfold station and scoring sheet.', 20, '2 hours'),
('Sunset Rooftop Picnic', 'Outdoors', 'Find the highest accessible rooftop or viewpoint in your area. Pack a simple spread, bring a blanket, and watch the city shift from day to night.', 'Navigator', 'Research and navigate to the spot. Keep destination secret.', 'Curator', 'Pack the food, drinks, and blanket without asking questions.', 35, '3 hours'),
('DIY Paint & Sip', 'Arts & Culture', 'Transform your living room into a studio. Pick a simple scene or abstract concept, set up canvases, and paint while sipping wine. No experience needed.', 'Navigator', 'Set up the painting station with supplies and reference image.', 'Curator', 'Choose the painting theme and prepare snacks/drinks.', 40, '2-3 hours'),
('Midnight Scavenger Hunt', 'Active & Sport', 'Create a list of 10 items or photo challenges around your city. Race together to complete them all before time runs out.', 'Navigator', 'Create the scavenger hunt list and rules.', 'Curator', 'Set the timer and judge the photo submissions.', 15, '2 hours'),
('Fortress Night', 'Cozy & Homey', 'Build the ultimate blanket fort with fairy lights, pillows, and snacks. Watch a movie or stargaze through the ''ceiling''.', 'Navigator', 'Design and build the fort structure.', 'Curator', 'Decorate with lights and prepare cozy snacks.', 25, 'Evening'),
('Cocktail Masterclass', 'Nightlife', 'Pick 3 cocktails neither of you has tried. Learn the recipes, gather ingredients, and become mixologists for the night.', 'Navigator', 'Research and select the cocktails.', 'Curator', 'Buy ingredients and set up the bar station.', 50, '2 hours');
