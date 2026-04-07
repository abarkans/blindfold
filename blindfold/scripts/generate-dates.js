import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categories from onboarding vibes
const categories = [
  { id: 'outdoors', name: 'Outdoors', icon: '🌲' },
  { id: 'food', name: 'Food & Drink', icon: '🍷' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨' },
  { id: 'active', name: 'Active & Sport', icon: '⚽' },
  { id: 'cozy', name: 'Cozy & Homey', icon: '🏠' },
  { id: 'nightlife', name: 'Nightlife', icon: '🌙' }
];

// Date ideas to generate per category
const IDEAS_PER_CATEGORY = 3;

async function generateDateIdeas() {
  console.log('🎲 Generating weekly date ideas...\n');

  const allIdeas = [];

  for (const category of categories) {
    console.log(`Generating ${IDEAS_PER_CATEGORY} ideas for ${category.name}...`);

    const ideas = await generateCategoryIdeas(category);
    allIdeas.push(...ideas);
  }

  return allIdeas;
}

async function generateCategoryIdeas(category) {
  const ideas = [];

  for (let i = 0; i < IDEAS_PER_CATEGORY; i++) {
    const idea = createIdeaForCategory(category);
    ideas.push(idea);
  }

  return ideas;
}

function createIdeaForCategory(category) {
  const ideaTemplates = {
    outdoors: [
      {
        title: "Secret Picnic Hunt",
        description: "Follow a series of clues to find hidden picnic spots around your city. Each clue leads to a new location with a small treat until you reach the final destination for a romantic sunset picnic.",
        roleA: { label: "Cartographer", instruction: "Create 3-5 clues leading to different outdoor locations. Hide small treats at each spot." },
        roleB: { label: "Explorer", instruction: "Follow the clues and discover each location. Bring a camera to capture the journey." },
        budget: 35,
        duration: "3 hours"
      },
      {
        title: "Stargazing Adventure",
        description: "Find a dark spot away from city lights. Bring blankets, hot drinks, and use a stargazing app to identify constellations together.",
        roleA: { label: "Navigator", instruction: "Research the best stargazing spot within 30 min drive. Pack blankets and thermos." },
        roleB: { label: "Astronomer", instruction: "Download stargazing apps and learn 3-5 constellations to find together." },
        budget: 20,
        duration: "2 hours"
      },
      {
        title: "Waterfall Quest",
        description: "Hike to a nearby waterfall or scenic water feature. Pack a light snack and enjoy the natural surroundings together.",
        roleA: { label: "Trail Guide", instruction: "Research an easy-moderate hike to a waterfall. Check trail conditions." },
        roleB: { label: "Provisioner", instruction: "Pack water, snacks, and a small first aid kit. Bring a waterproof phone case." },
        budget: 15,
        duration: "4 hours"
      }
    ],
    food: [
      {
        title: "Blind Taste Challenge",
        description: "One partner picks mystery snacks without the other seeing. Back home, taste them blindfolded and guess what you're eating while rating each one.",
        roleA: { label: "Curator", instruction: "Pick 5-7 mystery snacks and drinks. Keep them secret until the tasting begins." },
        roleB: { label: "Critic", instruction: "Create scorecards for rating each item. Bring a blindfold for the tasting." },
        budget: 25,
        duration: "2 hours"
      },
      {
        title: "Cook-Off Challenge",
        description: "Each partner gets the same mystery ingredient and must create a dish. Judge each other's creations on taste, presentation, and creativity.",
        roleA: { label: "Challenger", instruction: "Pick the mystery ingredient and set up cooking stations with basic supplies." },
        roleB: { label: "Chef", instruction: "Create judging criteria cards. Prepare side dishes to complement whatever is made." },
        budget: 40,
        duration: "3 hours"
      },
      {
        title: "Dessert Crawl",
        description: "Visit 3-4 different dessert spots in one evening. Share small portions at each place and rate your favorites.",
        roleA: { label: "Route Planner", instruction: "Map out 3-4 dessert places within walking distance. Make any needed reservations." },
        roleB: { label: "Scout", instruction: "Research signature desserts at each location. Bring a notebook for ratings." },
        budget: 50,
        duration: "3 hours"
      }
    ],
    arts: [
      {
        title: "Museum Mystery",
        description: "Visit a local museum or gallery. Each partner picks 3 favorite pieces and explains why they chose them to the other.",
        roleA: { label: "Curator", instruction: "Research museum hours and current exhibitions. Plan your route through the galleries." },
        roleB: { label: "Critic", instruction: "Bring a small notebook to sketch or note favorite pieces. Prepare questions to ask." },
        budget: 30,
        duration: "3 hours"
      },
      {
        title: "Paint & Sip at Home",
        description: "Set up easels at home with wine or favorite drinks. Follow an online tutorial together or paint each other's portraits.",
        roleA: { label: "Art Director", instruction: "Set up the painting area with drop cloths, easels, and good lighting. Choose a tutorial." },
        roleB: { label: "Sommelier", instruction: "Get paints, brushes, canvas. Pick beverages and prepare small snacks for during painting." },
        budget: 45,
        duration: "3 hours"
      },
      {
        title: "Street Art Safari",
        description: "Explore your city's street art scene. Photograph your favorite murals and learn about the artists behind them.",
        roleA: { label: "Guide", instruction: "Research street art locations and murals in your area. Create a walking route." },
        roleB: { label: "Photographer", instruction: "Charge camera/phone batteries. Research street art photography tips." },
        budget: 10,
        duration: "3 hours"
      }
    ],
    active: [
      {
        title: "Partner Workout Challenge",
        description: "Create a fun workout routine together. Take turns leading exercises and motivate each other through the challenge.",
        roleA: { label: "Trainer", instruction: "Design a 30-minute partner workout. Find a suitable location (park, living room, gym)." },
        roleB: { label: "Motivator", instruction: "Create a playlist for the workout. Bring water, towels, and small rewards for completion." },
        budget: 0,
        duration: "1 hour"
      },
      {
        title: "Dance Lesson Night",
        description: "Learn a new dance style together through online tutorials or a local class. Practice and perform for each other.",
        roleA: { label: "Choreographer", instruction: "Find a beginner dance tutorial or local class. Clear space for practice." },
        roleB: { label: "DJ", instruction: "Create a playlist of songs in the dance style. Bring water and comfortable clothes." },
        budget: 25,
        duration: "2 hours"
      },
      {
        title: "Rock Climbing Adventure",
        description: "Try indoor rock climbing at a local gym. Belay each other and celebrate every summit.",
        roleA: { label: "Route Setter", instruction: "Research climbing gyms and book a beginner session if needed." },
        roleB: { label: "Gear Master", instruction: "Arrange rental equipment. Bring grip chalk and comfortable athletic wear." },
        budget: 60,
        duration: "2 hours"
      }
    ],
    cozy: [
      {
        title: "Fort Building Night",
        description: "Build an epic blanket fort in your living room. Fill it with pillows, fairy lights, and enjoy movies or games inside.",
        roleA: { label: "Architect", instruction: "Gather blankets, pillows, chairs, and clips. Design the fort structure." },
        roleB: { label: "Interior Designer", instruction: "Add fairy lights, comfortable seating, and set up entertainment inside the fort." },
        budget: 15,
        duration: "4 hours"
      },
      {
        title: "Bookstore & Coffee Date",
        description: "Browse a local bookstore together, pick books for each other, then discuss over coffee.",
        roleA: { label: "Bookseller", instruction: "Research bookstores in the area. Check their cafe situation." },
        roleB: { label: "Sommelier", instruction: "Think of book recommendations for your partner. Bring a book journal." },
        budget: 30,
        duration: "2 hours"
      },
      {
        title: "Spa Night at Home",
        description: "Transform your bathroom into a spa. Give each other massages, face masks, and relax in a bubble bath.",
        roleA: { label: "Spa Director", instruction: "Set up the space with candles, towels, and calming music. Prepare bath." },
        roleB: { label: "Therapist", instruction: "Get massage oil, face masks, bath bombs. Learn basic massage techniques." },
        budget: 40,
        duration: "3 hours"
      }
    ],
    nightlife: [
      {
        title: "Cocktail Creation Contest",
        description: "Each partner creates an original cocktail for the other to try. Rate on creativity, taste, and presentation.",
        roleA: { label: "Mixologist", instruction: "Gather various spirits, mixers, and garnishes. Set up a bar area." },
        roleB: { label: "Judge", instruction: "Create scorecards. Research cocktail techniques and garnish ideas." },
        budget: 50,
        duration: "3 hours"
      },
      {
        title: "Late Night Food Tour",
        description: "Hit up 2-3 late-night food spots. Try something new at each location and share.",
        roleA: { label: "Scout", instruction: "Find late-night restaurants open past 9pm. Map an efficient route." },
        roleB: { label: "Food Critic", instruction: "Bring antacids and an adventurous appetite. Take photos at each spot." },
        budget: 45,
        duration: "3 hours"
      },
      {
        title: "Rooftop Sunset to Stars",
        description: "Find a rooftop bar or high viewpoint. Arrive for sunset, stay for drinks and city lights.",
        roleA: { label: "Navigator", instruction: "Research rooftop bars or accessible high viewpoints. Check sunset time." },
        roleB: { label: "Ambassador", instruction: "Check dress codes and reservation requirements. Bring a light jacket." },
        budget: 55,
        duration: "3 hours"
      }
    ]
  };

  const templates = ideaTemplates[category.id] || ideaTemplates.outdoors;
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    title: template.title,
    category: category.id,
    description: template.description,
    rolea_label: template.roleA.label,
    rolea_instruction: template.roleA.instruction,
    roleb_label: template.roleB.label,
    roleb_instruction: template.roleB.instruction,
    budget: template.budget,
    duration: template.duration
  };
}

async function insertDateIdeas(ideas) {
  console.log('\n📝 Inserting date ideas into Supabase...\n');

  const { data, error } = await supabase
    .from('date_ideas')
    .insert(ideas)
    .select();

  if (error) {
    console.error('❌ Error inserting date ideas:', error);
    return null;
  }

  return data;
}

async function main() {
  try {
    // Generate new date ideas
    const newIdeas = await generateDateIdeas();

    // Insert into Supabase
    const inserted = await insertDateIdeas(newIdeas);

    if (inserted) {
      console.log(`\n✅ Successfully added ${inserted.length} date ideas!`);
      console.log('\nCategories covered:');
      categories.forEach(cat => {
        console.log(`  ${cat.icon} ${cat.name}: ${IDEAS_PER_CATEGORY} ideas`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
