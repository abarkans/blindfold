// Empty arrays - data should come from Supabase
export const dateIdeas = [];
export const completedDates = [];

export const vibeOptions = [
  { id: 'outdoors', label: 'Outdoors', icon: '🌲' },
  { id: 'food', label: 'Food & Drink', icon: '🍷' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { id: 'active', label: 'Active & Sport', icon: '⚽' },
  { id: 'cozy', label: 'Cozy & Homey', icon: '🏠' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' }
];

export const frequencyOptions = [
  { id: 'weekly', label: 'Weekly', description: 'Every week, new adventure' },
  { id: 'biweekly', label: 'Bi-weekly', description: 'Twice a month' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month, extra special' }
];

export const categoryColors = {
  'Outdoors': 'from-green-600 to-emerald-700',
  'Food & Drink': 'from-orange-500 to-amber-600',
  'Arts & Culture': 'from-purple-500 to-violet-600',
  'Active & Sport': 'from-red-500 to-rose-600',
  'Cozy & Homey': 'from-amber-600 to-yellow-700',
  'Nightlife': 'from-indigo-500 to-purple-600'
};
