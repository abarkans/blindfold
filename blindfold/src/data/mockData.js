export const dateIdeas = [
  {
    id: 1,
    title: "Blind Taste Challenge",
    category: "Food & Drink",
    description: "One of you picks 5 mystery snacks from a store without the other seeing. Back home, taste them blindfolded and guess what you're eating. Loser does the dishes.",
    roleA: { label: "Navigator", instruction: "Pick the snacks solo — they must be unrecognisable." },
    roleB: { label: "Curator", instruction: "Set up the blindfold station and scoring sheet." },
    budget: 20,
    duration: "2 hours"
  },
  {
    id: 2,
    title: "Sunset Rooftop Picnic",
    category: "Outdoors",
    description: "Find the highest accessible rooftop or viewpoint in your area. Pack a simple spread, bring a blanket, and watch the city shift from day to night.",
    roleA: { label: "Navigator", instruction: "Research and navigate to the spot. Keep destination secret." },
    roleB: { label: "Curator", instruction: "Pack the food, drinks, and blanket without asking questions." },
    budget: 35,
    duration: "3 hours"
  },
  {
    id: 3,
    title: "One Hour, One Stranger's Recommendation",
    category: "Arts & Culture",
    description: "Ask a random stranger on the street for their favourite local spot you've never visited. You have 1 hour to get there and experience it.",
    roleA: { label: "Navigator", instruction: "You approach the stranger and ask the question." },
    roleB: { label: "Curator", instruction: "You decide if you trust the recommendation. Final say is yours." },
    budget: 15,
    duration: "2 hours"
  },
  {
    id: 4,
    title: "Midnight Gelato Crawl",
    category: "Nightlife",
    description: "Hit three different gelaterias in one night. Each person orders blind for the other. Rate each flavor on a shared scorecard.",
    roleA: { label: "Navigator", instruction: "Map the route between all three spots." },
    roleB: { label: "Curator", instruction: "Create the scorecard and bring a camera." },
    budget: 25,
    duration: "2.5 hours"
  },
  {
    id: 5,
    title: "Thrift Store Challenge",
    category: "Active & Sport",
    description: "Each person gets $15 to find an outfit for the other. 20 minutes to shop. Then wear your picks to dinner.",
    roleA: { label: "Navigator", instruction: "Find the thrift store and set the timer." },
    roleB: { label: "Curator", instruction: "Pick something that would totally surprise them." },
    budget: 30,
    duration: "3 hours"
  }
];

export const completedDates = [
  {
    id: 101,
    title: "Mystery Market Tour",
    category: "Food & Drink",
    completedDate: "2026-03-28",
    rating: 5,
    memory: "We got lost but it was perfect",
    budget: 40
  },
  {
    id: 102,
    title: "Stargazing Drive",
    category: "Outdoors",
    completedDate: "2026-03-21",
    rating: 5,
    memory: "Saw three shooting stars",
    budget: 15
  },
  {
    id: 103,
    title: "Pottery Class Surprise",
    category: "Arts & Culture",
    completedDate: "2026-03-14",
    rating: 4,
    memory: "Made matching mugs (kinda)",
    budget: 80
  },
  {
    id: 104,
    title: "Neighborhood Scavenger Hunt",
    category: "Active & Sport",
    completedDate: "2026-03-07",
    rating: 5,
    memory: "Found that hidden mural we'd been looking for",
    budget: 10
  },
  {
    id: 105,
    title: "Cocktail Masterclass",
    category: "Cozy & Homey",
    completedDate: "2026-02-28",
    rating: 4,
    memory: "My old fashioned was better than theirs",
    budget: 45
  }
];

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
