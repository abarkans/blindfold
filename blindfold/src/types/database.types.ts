/**
 * Database Schema Types
 * Generated from Supabase - keep in sync with your schema
 *
 * To regenerate: run `npx supabase gen types typescript --local > src/types/database.types.ts`
 * Or for linked project: `npx supabase gen types typescript --linked > src/types/database.types.ts`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      couples: {
        Row: {
          id: string;
          navigator_id: string;
          curator_id: string;
          couple_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          navigator_id: string;
          curator_id: string;
          couple_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          navigator_id?: string;
          curator_id?: string;
          couple_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      preferences: {
        Row: {
          id: string;
          couple_id: string;
          budget_min: number | null;
          budget_max: number | null;
          city: string;
          state: string | null;
          country: string | null;
          max_distance_miles: number | null;
          vibes: string | null;
          activity_types: string | null;
          dietary_restrictions: string | null;
          indoor_outdoor: string | null;
          time_of_day: string | null;
          preferred_days: string | null;
          min_duration_hours: number | null;
          max_duration_hours: number | null;
          special_occasions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          budget_min?: number | null;
          budget_max?: number | null;
          city: string;
          state?: string | null;
          country?: string | null;
          max_distance_miles?: number | null;
          vibes?: string | null;
          activity_types?: string | null;
          dietary_restrictions?: string | null;
          indoor_outdoor?: string | null;
          time_of_day?: string | null;
          preferred_days?: string | null;
          min_duration_hours?: number | null;
          max_duration_hours?: number | null;
          special_occasions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          budget_min?: number | null;
          budget_max?: number | null;
          city?: string;
          state?: string | null;
          country?: string | null;
          max_distance_miles?: number | null;
          vibes?: string | null;
          activity_types?: string | null;
          dietary_restrictions?: string | null;
          indoor_outdoor?: string | null;
          time_of_day?: string | null;
          preferred_days?: string | null;
          min_duration_hours?: number | null;
          max_duration_hours?: number | null;
          special_occasions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      date_ideas: {
        Row: {
          id: string;
          couple_id: string;
          planned_by: string;
          status: 'draft' | 'revealed' | 'completed' | 'rejected';
          title: string;
          description: string;
          location_name: string | null;
          location_address: string | null;
          location_type: string | null;
          estimated_cost_min: number | null;
          estimated_cost_max: number | null;
          estimated_duration_minutes: number | null;
          generation_prompt: string | null;
          llm_raw_output: string | null;
          llm_model: string | null;
          llm_tokens_used: number | null;
          revealed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          planned_by: string;
          status?: 'draft' | 'revealed' | 'completed' | 'rejected';
          title: string;
          description: string;
          location_name?: string | null;
          location_address?: string | null;
          location_type?: string | null;
          estimated_cost_min?: number | null;
          estimated_cost_max?: number | null;
          estimated_duration_minutes?: number | null;
          generation_prompt?: string | null;
          llm_raw_output?: string | null;
          llm_model?: string | null;
          llm_tokens_used?: number | null;
          revealed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          planned_by?: string;
          status?: 'draft' | 'revealed' | 'completed' | 'rejected';
          title?: string;
          description?: string;
          location_name?: string | null;
          location_address?: string | null;
          location_type?: string | null;
          estimated_cost_min?: number | null;
          estimated_cost_max?: number | null;
          estimated_duration_minutes?: number | null;
          generation_prompt?: string | null;
          llm_raw_output?: string | null;
          llm_model?: string | null;
          llm_tokens_used?: number | null;
          revealed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      date_history: {
        Row: {
          id: string;
          couple_id: string;
          date_idea_id: string | null;
          planned_by: string;
          title: string;
          description: string | null;
          location_name: string | null;
          location_address: string | null;
          date_occurred_at: string;
          overall_rating: number;
          fun_rating: number | null;
          value_rating: number | null;
          curator_notes: string | null;
          planner_notes: string | null;
          would_repeat: boolean | null;
          photo_urls: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          date_idea_id?: string | null;
          planned_by: string;
          title: string;
          description?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          date_occurred_at: string;
          overall_rating: number;
          fun_rating?: number | null;
          value_rating?: number | null;
          curator_notes?: string | null;
          planner_notes?: string | null;
          would_repeat?: boolean | null;
          photo_urls?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          date_idea_id?: string | null;
          planned_by?: string;
          title?: string;
          description?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          date_occurred_at?: string;
          overall_rating?: number;
          fun_rating?: number | null;
          value_rating?: number | null;
          curator_notes?: string | null;
          planner_notes?: string | null;
          would_repeat?: boolean | null;
          photo_urls?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
