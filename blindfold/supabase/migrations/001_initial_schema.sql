-- Blindfold: Initial Schema
-- Migration 001: Core tables for couples date planning app
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase Auth users with app-specific profile data
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================================
-- COUPLES TABLE
-- Links two profiles as a couple with assigned roles
-- ============================================================================
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  navigator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  curator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  couple_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure navigator and curator are different people
  CONSTRAINT different_people CHECK (navigator_id != curator_id),
  -- Ensure a user can only be in one couple at a time
  CONSTRAINT unique_navigator UNIQUE (navigator_id),
  CONSTRAINT unique_curator UNIQUE (curator_id)
);

-- Index for quick lookups by either partner
CREATE INDEX idx_couples_navigator ON couples(navigator_id);
CREATE INDEX idx_couples_curator ON couples(curator_id);

-- ============================================================================
-- PREFERENCES TABLE
-- Per-couple preferences for LLM date generation
-- ============================================================================
CREATE TABLE preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL UNIQUE REFERENCES couples(id) ON DELETE CASCADE,

  -- Budget: 0-4 scale ($, $$, $$$, $$$$)
  budget_min INTEGER DEFAULT 0 CHECK (budget_min >= 0 AND budget_min <= 4),
  budget_max INTEGER DEFAULT 4 CHECK (budget_max >= 0 AND budget_max <= 4),

  -- Location
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'USA',
  max_distance_miles INTEGER DEFAULT 25 CHECK (max_distance_miles > 0),

  -- Vibe/Activity preferences (stored as comma-separated tags)
  vibes TEXT, -- e.g., "romantic,adventurous,chill"
  activity_types TEXT, -- e.g., "dinner,museum,walk"

  -- Dietary restrictions (for restaurant suggestions)
  dietary_restrictions TEXT, -- e.g., "vegetarian,gluten-free"

  -- Environment preferences
  indoor_outdoor TEXT, -- "indoor", "outdoor", "either"
  time_of_day TEXT, -- "morning", "afternoon", "evening", "any"
  preferred_days TEXT, -- e.g., "weekend,friday"

  -- Duration preference in hours
  min_duration_hours DECIMAL(3,1) DEFAULT 1.0,
  max_duration_hours DECIMAL(3,1) DEFAULT 4.0,

  -- Special occasions to consider
  special_occasions TEXT, -- e.g., "anniversary,birthday"

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_preferences_couple ON preferences(couple_id);

-- ============================================================================
-- DATE IDEAS TABLE
-- LLM-generated date ideas with structured and raw data
-- ============================================================================
CREATE TYPE date_idea_status AS ENUM ('draft', 'revealed', 'completed', 'rejected');

CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  planned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Status tracking
  status date_idea_status NOT NULL DEFAULT 'draft',

  -- Structured fields (extracted from LLM output)
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_name TEXT, -- Specific venue name if applicable
  location_address TEXT, -- Full address for maps
  location_type TEXT, -- "restaurant", "activity", "experience", "mixed"

  -- Cost and time estimates
  estimated_cost_min INTEGER, -- in dollars
  estimated_cost_max INTEGER,
  estimated_duration_minutes INTEGER,

  -- LLM metadata
  generation_prompt TEXT, -- The prompt used to generate this idea
  llm_raw_output TEXT, -- Raw LLM response for reference
  llm_model TEXT, -- Which model generated it
  llm_tokens_used INTEGER,

  -- Timestamps
  revealed_at TIMESTAMPTZ, -- When curator saw the idea
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_date_ideas_couple ON date_ideas(couple_id);
CREATE INDEX idx_date_ideas_status ON date_ideas(status);
CREATE INDEX idx_date_ideas_planned_by ON date_ideas(planned_by);

-- ============================================================================
-- DATE HISTORY TABLE
-- Completed dates with feedback
-- ============================================================================
CREATE TABLE date_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  date_idea_id UUID REFERENCES date_ideas(id) ON DELETE SET NULL, -- NULL if custom date
  planned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- The actual date details (may differ from original idea)
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT,
  location_address TEXT,
  date_occurred_at TIMESTAMPTZ NOT NULL,

  -- Ratings (1-5 scale)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  fun_rating INTEGER CHECK (fun_rating >= 1 AND fun_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),

  -- Feedback
  curator_notes TEXT, -- Curator's thoughts
  planner_notes TEXT, -- Planner's reflections
  would_repeat BOOLEAN,

  -- Photos (stored as JSON array of Supabase Storage URLs)
  photo_urls TEXT, -- JSON array: ["url1", "url2"]

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_date_history_couple ON date_history(couple_id);
CREATE INDEX idx_date_history_date ON date_history(date_occurred_at);
CREATE INDEX idx_date_history_planned_by ON date_history(planned_by);

-- ============================================================================
-- TRIGGERS: Updated timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_date_ideas_updated_at BEFORE UPDATE ON date_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_date_history_updated_at BEFORE UPDATE ON date_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS: Auto-create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_history ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Profiles: Users can only see their own profile
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Couples: Both partners can access their couple record
-- ----------------------------------------------------------------------------
CREATE POLICY "Partners can view their couple" ON couples
  FOR SELECT USING (
    auth.uid() = navigator_id OR auth.uid() = curator_id
  );

CREATE POLICY "Partners can update their couple" ON couples
  FOR UPDATE USING (
    auth.uid() = navigator_id OR auth.uid() = curator_id
  );

-- ----------------------------------------------------------------------------
-- Preferences: Both partners can read/write their couple's preferences
-- ----------------------------------------------------------------------------
CREATE POLICY "Partners can view preferences" ON preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = preferences.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

CREATE POLICY "Partners can update preferences" ON preferences
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = preferences.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

CREATE POLICY "Partners can insert preferences" ON preferences
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = preferences.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

-- ----------------------------------------------------------------------------
-- Date Ideas: Both partners can access, but different write permissions
-- ----------------------------------------------------------------------------
CREATE POLICY "Partners can view date ideas" ON date_ideas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_ideas.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

-- Navigator can create date ideas
CREATE POLICY "Navigator can create date ideas" ON date_ideas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_ideas.couple_id
        AND auth.uid() = couples.navigator_id
    )
  );

-- Navigator can update any date idea
CREATE POLICY "Navigator can update date ideas" ON date_ideas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_ideas.couple_id
        AND auth.uid() = couples.navigator_id
    )
  );

-- Curator can reveal draft ideas (change status to 'revealed')
CREATE POLICY "Curator can reveal date ideas" ON date_ideas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_ideas.couple_id
        AND auth.uid() = couples.curator_id
    )
    AND status = 'draft'
  )
  WITH CHECK (
    status = 'revealed'
  );

-- ----------------------------------------------------------------------------
-- Date History: Both partners can read/write
-- ----------------------------------------------------------------------------
CREATE POLICY "Partners can view date history" ON date_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_history.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

CREATE POLICY "Partners can create date history" ON date_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_history.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

CREATE POLICY "Partners can update date history" ON date_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = date_history.couple_id
        AND (auth.uid() = couples.navigator_id OR auth.uid() = couples.curator_id)
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current user's couple ID
CREATE OR REPLACE FUNCTION get_current_couple_id()
RETURNS UUID AS $$
DECLARE
  couple_id UUID;
BEGIN
  SELECT id INTO couple_id
  FROM couples
  WHERE navigator_id = auth.uid() OR curator_id = auth.uid();
  RETURN couple_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is navigator
CREATE OR REPLACE FUNCTION is_navigator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM couples WHERE navigator_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is curator
CREATE OR REPLACE FUNCTION is_curator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM couples WHERE curator_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

