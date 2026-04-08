/**
 * Blindfold - Supabase Client Queries
 * Core database operations for the Blindfold couples date app
 */

import { supabase } from './client';
import type { Database } from '@/types/database.types';

type DateIdea = Database['public']['Tables']['date_ideas']['Row'];
type DateIdeaInsert = Database['public']['Tables']['date_ideas']['Insert'];
type Preferences = Database['public']['Tables']['preferences']['Row'];
type DateHistoryInsert = Database['public']['Tables']['date_history']['Insert'];

// ============================================================================
// DATE IDEAS
// ============================================================================

/**
 * Save a newly LLM-generated date idea to the database
 * Only the Navigator can create date ideas
 */
export async function saveGeneratedDateIdea(
  ideaData: Omit<DateIdeaInsert, 'planned_by' | 'couple_id'>
): Promise<{ data: DateIdea | null; error: string | null }> {
  // Get current user's couple ID
  const { data: couple } = await supabase
    .from('couples')
    .select('id, navigator_id')
    .eq('navigator_id', (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!couple) {
    return { data: null, error: 'User is not linked to a couple as Navigator' };
  }

  const { data, error } = await supabase
    .from('date_ideas')
    .insert({
      ...ideaData,
      couple_id: couple.id,
      planned_by: couple.navigator_id,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Reveal a draft date idea to the Curator
 * Changes status from 'draft' to 'revealed'
 */
export async function revealDateIdea(ideaId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('date_ideas')
    .update({ status: 'revealed', revealed_at: new Date().toISOString() })
    .eq('id', ideaId)
    .eq('status', 'draft'); // Only reveal if still draft

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Fetch all date ideas for the current couple
 * Optionally filter by status
 */
export async function fetchDateIdeas(status?: DateIdea['status']) {
  let query = supabase
    .from('date_ideas')
    .select('*, planned_by:profiles(full_name, avatar_url)')
    .eq('couple_id', await getCurrentCoupleId());

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ============================================================================
// PREFERENCES
// ============================================================================

/**
 * Fetch the current couple's preferences
 * Returns null if no preferences set yet
 */
export async function fetchCouplePreferences(): Promise<{
  data: Preferences | null;
  error: string | null;
}> {
  const coupleId = await getCurrentCoupleId();

  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('couple_id', coupleId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    return { data: null, error: error.message };
  }

  return { data: data || null, error: null };
}

/**
 * Upsert (insert or update) couple preferences
 */
export async function upsertPreferences(
  prefs: Omit<Preferences, 'id' | 'couple_id' | 'created_at' | 'updated_at'>
): Promise<{ data: Preferences | null; error: string | null }> {
  const coupleId = await getCurrentCoupleId();

  const { data, error } = await supabase
    .from('preferences')
    .upsert({
      ...prefs,
      couple_id: coupleId,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ============================================================================
// DATE HISTORY
// ============================================================================

/**
 * Log a completed date with ratings
 * Creates a record in date_history
 */
export async function logCompletedDate(
  completedDate: Omit<
    DateHistoryInsert,
    'couple_id' | 'planned_by' | 'created_at' | 'updated_at'
  >
): Promise<{ data: typeof completedDate | null; error: string | null }> {
  const user = (await supabase.auth.getUser()).data.user;
  const coupleId = await getCurrentCoupleId();

  const { data, error } = await supabase
    .from('date_history')
    .insert({
      ...completedDate,
      couple_id: coupleId,
      planned_by: user!.id,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  // If this was linked to a date idea, update its status to 'completed'
  if (completedDate.date_idea_id) {
    await supabase
      .from('date_ideas')
      .update({ status: 'completed' })
      .eq('id', completedDate.date_idea_id);
  }

  return { data, error: null };
}

/**
 * Fetch date history for the current couple
 */
export async function fetchDateHistory(limit = 10) {
  const { data, error } = await supabase
    .from('date_history')
    .select(
      `*,
        planned_by:profiles(full_name, avatar_url),
        date_idea:date_ideas(title, description)`
    )
    .eq('couple_id', await getCurrentCoupleId())
    .order('date_occurred_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get the current user's couple ID
 */
async function getCurrentCoupleId(): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;

  const { data: couple } = await supabase
    .from('couples')
    .select('id')
    .or(`navigator_id.eq.${user?.id},curator_id.eq.${user?.id}`)
    .single();

  if (!couple) {
    throw new Error('User is not linked to a couple');
  }

  return couple.id;
}

/**
 * Check if current user is the Navigator
 */
export async function checkIsNavigator(): Promise<boolean> {
  const user = (await supabase.auth.getUser()).data.user;

  const { data } = await supabase
    .from('couples')
    .select('navigator_id')
    .eq('navigator_id', user?.id)
    .single();

  return !!data;
}

/**
 * Check if current user is the Curator
 */
export async function checkIsCurator(): Promise<boolean> {
  const user = (await supabase.auth.getUser()).data.user;

  const { data } = await supabase
    .from('couples')
    .select('curator_id')
    .eq('curator_id', user?.id)
    .single();

  return !!data;
}
