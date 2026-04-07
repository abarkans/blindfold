import { supabase, saveUserData, getUserData } from '../lib/supabase';

// Re-export getUserData for use in other modules
export { getUserData };

const STORAGE_KEY = 'blindfold_preferences';
const SYNC_PENDING_KEY = 'blindfold_sync_pending';

// Save to localStorage and queue for Supabase sync
export const savePreferences = async (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    await queueSync(preferences);
    return true;
  } catch (error) {
    console.error('Failed to save preferences:', error);
    return false;
  }
};

// Queue data for background sync to Supabase
const queueSync = async (data) => {
  localStorage.setItem(SYNC_PENDING_KEY, 'true');
  // Try to sync, but don't block if offline
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      await saveUserData(authData.user.id, { preferences: data });
      localStorage.removeItem(SYNC_PENDING_KEY);
    }
  } catch (error) {
    console.log('Sync queued, will retry on next connection');
  }
};

// Load from Supabase if available, fallback to localStorage
export const getPreferences = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      const cloudData = await getUserData(authData.user.id);
      if (cloudData?.preferences) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.preferences));
        return cloudData.preferences;
      }
    }
  } catch (error) {
    console.log('Using localStorage fallback');
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearPreferences = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RANDOM_DATES_KEY);
    localStorage.removeItem(DATE_STORAGE_KEY);
    // Also clear from Supabase
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      await saveUserData(authData.user.id, { preferences: null });
    }
    return true;
  } catch (error) {
    console.error('Failed to clear preferences:', error);
    return false;
  }
};

export const hasCompletedOnboarding = async () => {
  try {
    // First check localStorage directly (more reliable than getPreferences which tries Supabase first)
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const prefs = JSON.parse(localData);
      const hasAllFields = !!(prefs && prefs.names && prefs.vibes && prefs.limits && prefs.frequency);
      if (hasAllFields) return true;
    }

    // Fallback to Supabase
    const prefs = await getPreferences();
    return !!(prefs && prefs.names && prefs.vibes && prefs.limits && prefs.frequency);
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

const DATE_STORAGE_KEY = 'blindfold_dates';
const RANDOM_DATES_KEY = 'blindfold_random_dates';

// Get 1 random date ID, persisting it until cleared
export const getRandomDateId = (dateIdeas) => {
  if (!dateIdeas || dateIdeas.length === 0) {
    return null;
  }
  try {
    const stored = localStorage.getItem(RANDOM_DATES_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      // Verify ID still exists in the dateIdeas array
      const validIds = dateIdeas.map(d => d.id);
      if (validIds.includes(parsed)) {
        return parsed;
      }
    }
    // Generate 1 new random ID
    const randomIndex = Math.floor(Math.random() * dateIdeas.length);
    const selected = dateIdeas[randomIndex].id;
    localStorage.setItem(RANDOM_DATES_KEY, JSON.stringify(selected));
    return selected;
  } catch (error) {
    console.error('Failed to get random date ID:', error);
    // Fallback to first date
    return dateIdeas[0]?.id || null;
  }
};

export const clearRandomDates = () => {
  try {
    localStorage.removeItem(RANDOM_DATES_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear random dates:', error);
    return false;
  }
};

export const saveDateState = async (state) => {
  try {
    // Save directly to localStorage with correct format
    localStorage.setItem(DATE_STORAGE_KEY, JSON.stringify({ dateState: state }));
    // Sync to Supabase
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      await saveUserData(authData.user.id, { dateState: state });
    }
    return true;
  } catch (error) {
    console.error('Failed to save date state:', error);
    return false;
  }
};

export const getDateState = async () => {
  try {
    // First try to get from Supabase
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      const cloudData = await getUserData(authData.user.id);
      if (cloudData?.dateState) {
        localStorage.setItem(DATE_STORAGE_KEY, JSON.stringify({ dateState: cloudData.dateState }));
        return cloudData.dateState;
      }
    }
  } catch (error) {
    console.log('Using localStorage fallback for date state');
  }
  const data = localStorage.getItem(DATE_STORAGE_KEY);
  return data ? JSON.parse(data).dateState : null;
};
