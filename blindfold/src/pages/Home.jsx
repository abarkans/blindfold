'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryBadge, BottomNav } from '../components';
import { getPreferences, saveDateState, getDateState } from '../utils/storage';
import { supabase } from '../lib/supabase';

// Sample date ideas for new users (fallback if no database ideas)
const SAMPLE_DATE_IDEAS = [
  {
    id: 'sample-1',
    title: "Blind Taste Challenge",
    category: "food",
    description: "One of you picks 5 mystery snacks from a store without the other seeing. Back home, taste them blindfolded and guess what you're eating.",
    roleA: { label: "Navigator", instruction: "Pick the snacks solo — they must be unrecognisable." },
    roleB: { label: "Curator", instruction: "Set up the blindfold station and scoring sheet." },
    budget: 20,
    duration: "2 hours"
  },
  {
    id: 'sample-2',
    title: "Sunset Rooftop Picnic",
    category: "outdoors",
    description: "Find the highest accessible rooftop or viewpoint in your area. Pack a simple spread, bring a blanket, and watch the city shift from day to night.",
    roleA: { label: "Navigator", instruction: "Research and navigate to the spot. Keep destination secret." },
    roleB: { label: "Curator", instruction: "Pack the food, drinks, and blanket without asking questions." },
    budget: 35,
    duration: "3 hours"
  }
];

// Helper to format duration in minutes to readable string
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hours`;
  return `${hours}h ${mins}m`;
}

export default function Home() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [dateState, setDateState] = useState(null);
  const [isRevealed, setIsRevealed] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 0 });
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentDrop, setCurrentDrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState('free');
  const [showRerollDialog, setShowRerollDialog] = useState(false);
  const [previousDate, setPreviousDate] = useState(null);
  const [isRerolling, setIsRerolling] = useState(false);
  const [hasRerolled, setHasRerolled] = useState(false);
  const [showingRerolledDate, setShowingRerolledDate] = useState(false);

  // Timer effect - calculates countdown to next drop date
  useEffect(() => {
    const updateTimer = () => {
      const state = JSON.parse(localStorage.getItem('blindfold_dates') || '{}');
      const nextDropDateStr = state.dateState?.nextDropDate;

      if (nextDropDateStr) {
        const nextDropDate = new Date(nextDropDateStr);
        const now = new Date();
        const diff = nextDropDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load user plan
  useEffect(() => {
    const loadPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserPlan(user.user_metadata?.plan || 'free');
      }
    };
    loadPlan();
  }, []);

  // Data loading effect
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prefs, state] = await Promise.all([getPreferences(), getDateState()]);
        console.log('Home: loaded prefs=', prefs, 'state=', state);
        setPreferences(prefs);
        setDateState(state);
        setIsRevealed(state?.currentDateId || null);

        // Get current user's couple ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No authenticated user');
          setIsLoading(false);
          return;
        }

        // Fetch couple info
        const { data: couple } = await supabase
          .from('couples')
          .select('id, navigator_id')
          .or(`navigator_id.eq.${user.id},curator_id.eq.${user.id}`)
          .single();

        if (!couple) {
          console.error('No couple found for user');
          setIsLoading(false);
          return;
        }

        // Fetch date ideas for this couple
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('date_ideas')
          .select('*')
          .eq('couple_id', couple.id)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Error fetching date ideas:', supabaseError);
        }

        let dateIdeas = [];
        if (supabaseData && supabaseData.length > 0) {
          // Transform Supabase data to match our app's format
          dateIdeas = supabaseData.map(d => ({
            id: d.id,
            title: d.title,
            category: d.category || 'general',
            description: d.description,
            roleA: { label: 'Navigator', instruction: d.navigator_instruction || 'Plan the details secretly' },
            roleB: { label: 'Curator', instruction: d.curator_instruction || 'Follow your partner\'s lead' },
            budget: d.estimated_cost_min || 50,
            duration: formatDuration(d.estimated_duration_minutes || 120)
          }));
        } else {
          // Fallback to sample ideas if no database ideas
          dateIdeas = SAMPLE_DATE_IDEAS;
        }

        console.log('Home: dateIdeas=', dateIdeas);

        // Get or create current date
        if (state?.currentDateId) {
          const targetId = state.currentDateId;
          const drop = dateIdeas.find(d => d.id === targetId);
          console.log('Home: found drop=', drop, 'for id=', targetId);

          if (drop) {
            setCurrentDrop(drop);
          } else {
            // Date idea not found, pick a new one
            const randomDrop = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
            if (randomDrop) {
              setCurrentDrop(randomDrop);
              await saveDateState({ currentDateId: randomDrop.id, accepted: false });
            }
          }
        } else {
          // New user - pick random date
          const randomDrop = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
          console.log('Home: new user, picked randomDrop=', randomDrop);
          if (randomDrop) {
            setCurrentDrop(randomDrop);
            await saveDateState({ currentDateId: randomDrop.id, accepted: false });
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading home data:', error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Show loading screen while data loads
  if (isLoading || !currentDrop) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-pulse" />
          <p className="text-[#b0b0b0] font-body">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  // Fallback if currentDrop is somehow undefined after loading
  if (!currentDrop?.roleA || !currentDrop?.roleB) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#b0b0b0] font-body">Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  const handleReveal = async () => {
    if (!currentDrop) return;
    setIsFlipping(true);

    // Update status in database
    const { error } = await supabase
      .from('date_ideas')
      .update({
        status: 'revealed',
        revealed_at: new Date().toISOString()
      })
      .eq('id', currentDrop.id);

    if (error) {
      console.error('Error updating date idea status:', error);
    }

    setTimeout(async () => {
      setIsRevealed(currentDrop.id);
      setIsFlipping(false);
      await saveDateState({ currentDateId: currentDrop.id, accepted: false });
    }, 600);
  };

  const handleAccept = async () => {
    if (!currentDrop) return;

    // Update status in database
    const { error } = await supabase
      .from('date_ideas')
      .update({ status: 'completed' })
      .eq('id', currentDrop.id);

    if (error) {
      console.error('Error updating date idea status:', error);
    }

    // Calculate next drop date based on frequency
    const frequency = preferences?.frequency || 'weekly';
    const now = new Date();
    let nextDropDate;

    switch (frequency) {
      case 'weekly':
        nextDropDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'biweekly':
        nextDropDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextDropDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        nextDropDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    await saveDateState({
      currentDateId: currentDrop.id,
      accepted: true,
      nextDropDate: nextDropDate.toISOString()
    });

    setIsAccepted(true);
  };

  const handleReroll = async () => {
    if (!currentDrop || userPlan !== 'pro') return;

    // Store current date as previous
    setPreviousDate(currentDrop);

    // Get new random date (different from current)
    let dateIdeas = SAMPLE_DATE_IDEAS;
    try {
      const { data: supabaseData } = await supabase.from('date_ideas').select('*');
      if (supabaseData && supabaseData.length > 0) {
        dateIdeas = supabaseData.map(d => ({
          id: d.id,
          title: d.title,
          category: d.category,
          description: d.description,
          roleA: { label: d.rolea_label, instruction: d.rolea_instruction },
          roleB: { label: d.roleb_label, instruction: d.roleb_instruction },
          budget: d.budget,
          duration: d.duration
        }));
      }
    } catch (error) {
      console.error('Error fetching date ideas for reroll:', error);
    }

    setIsRerolling(true);
    setIsFlipping(true);

    setTimeout(async () => {
      let newDrop;
      const attempts = 10;
      for (let i = 0; i < attempts; i++) {
        const randomDrop = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
        if (randomDrop.id !== currentDrop.id) {
          newDrop = randomDrop;
          break;
        }
      }
      if (!newDrop) newDrop = dateIdeas[0];

      setPreviousDate(currentDrop);
      setCurrentDrop(newDrop);
      setIsRevealed(null);
      setHasRerolled(true);
      setShowingRerolledDate(true);
      await saveDateState({ currentDateId: newDrop.id, accepted: false, rerolled: true });
      setIsFlipping(false);
      setIsRerolling(false);
      setShowRerollDialog(false);
    }, 600);
  };

  const handleComplete = async () => {
    if (!currentDrop) return;

    // Save to completed_dates
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('completed_dates').insert({
        user_id: user.id,
        date_idea_id: currentDrop.id,
        title: currentDrop.title,
        category: currentDrop.category,
        budget: currentDrop.budget,
        completed_date: new Date().toISOString()
      });
    }

    // Reset state for next date
    setIsAccepted(false);
    setIsRevealed(null);

    // Get new random date
    let dateIdeas = SAMPLE_DATE_IDEAS;
    try {
      const { data: supabaseData } = await supabase.from('date_ideas').select('*');
      if (supabaseData && supabaseData.length > 0) {
        dateIdeas = supabaseData.map(d => ({
          id: d.id,
          title: d.title,
          category: d.category,
          description: d.description,
          roleA: { label: d.rolea_label, instruction: d.rolea_instruction },
          roleB: { label: d.roleb_label, instruction: d.roleb_instruction },
          budget: d.budget,
          duration: d.duration
        }));
      }
    } catch (error) {
      console.error('Error fetching date ideas:', error);
    }

    let newDrop;
    const attempts = 10;
    for (let i = 0; i < attempts; i++) {
      const randomDrop = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
      if (randomDrop.id !== currentDrop.id) {
        newDrop = randomDrop;
        break;
      }
    }
    if (!newDrop) newDrop = dateIdeas[0];

    setCurrentDrop(newDrop);
    setPreviousDate(null);
    setHasRerolled(false);
    setShowingRerolledDate(false);
    await saveDateState({ currentDateId: newDrop.id, accepted: false });
  };

  const handleToggleDate = () => {
    if (!previousDate || !hasRerolled) return;

    setIsFlipping(true);

    setTimeout(async () => {
      if (showingRerolledDate) {
        // Switch back to original
        setCurrentDrop(previousDate);
        await saveDateState({ currentDateId: previousDate.id, accepted: false, rerolled: false });
        setShowingRerolledDate(false);
      } else {
        // Switch to rerolled date
        const rerolledDate = currentDrop;
        setCurrentDrop(previousDate);
        setPreviousDate(rerolledDate);
        await saveDateState({ currentDateId: previousDate.id, accepted: false, rerolled: true });
        setShowingRerolledDate(true);
      }
      setIsFlipping(false);
    }, 600);
  };

  const handleRestore = async () => {
    if (!previousDate) return;

    setIsFlipping(true);

    setTimeout(async () => {
      setCurrentDrop(previousDate);
      await saveDateState({ currentDateId: previousDate.id, accepted: false, rerolled: false });
      setPreviousDate(null);
      setIsFlipping(false);
    }, 600);
  };

  const names = preferences?.names || { yourName: 'You', partnerName: 'Partner' };

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a] hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
          <nav className="flex items-center gap-8">
            <a href="/home" className="text-white font-medium cursor-pointer">Home</a>
            <a href="/my-dates" className="text-[#b0b0b0] hover:text-white transition-colors cursor-pointer">My Dates</a>
            <a href="/profile" className="text-[#b0b0b0] hover:text-white transition-colors cursor-pointer">Profile</a>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-24 lg:pb-12">
        {/* Header - full width */}
        <div className="mb-8">
          <p className="text-[#b0b0b0] font-body text-sm mb-1">
            Hey, {names.yourName} & {names.partnerName}
          </p>
          <h1 className="text-4xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">
            {isAccepted ? 'Your Current Adventure' : 'Your Next Adventure'}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Date Card */}
          <div className="lg:col-span-2">
            {/* Main Drop Card */}
            <div className="relative">
              {!isRevealed ? (
                <div className={`
                  bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]
                  rounded-3xl p-6 md:p-8
                  border border-[#2a2a2a]
                  transition-all duration-500
                  ${isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                `}>
                  <div className="space-y-6">
                    {/* Blurred Header */}
                    <div className="text-center">
                      <div className="inline-block mb-3 blur-sm">
                        <CategoryBadge category={currentDrop.category} size="md" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-heading text-white mb-3 blur-sm">
                        {currentDrop.title}
                      </h2>
                      <p className="text-[#b0b0b0] font-body leading-relaxed text-lg blur-sm">
                        {currentDrop.description}
                      </p>
                    </div>

                    {/* Blurred Meta Info */}
                    <div className="flex gap-6 text-base font-body text-[#6e6e6e] justify-center blur-sm">
                      <span className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {currentDrop.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        ${currentDrop.budget} budget
                      </span>
                    </div>

                    {/* Blurred Roles Preview */}
                    <div className="border-t border-[#2a2a2a] pt-6">
                      <h3 className="text-base font-body text-[#b0b0b0] mb-4 blur-sm">Your Roles</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🗺️</span>
                            <span className="font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">Role A</span>
                          </div>
                          <p className="text-[#b0b0b0] font-body blur-sm">
                            Mystery instruction hidden...
                          </p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🎯</span>
                            <span className="font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">Role B</span>
                          </div>
                          <p className="text-[#b0b0b0] font-body blur-sm">
                            Mystery instruction hidden...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reveal Button */}
                    <div className="border-t border-[#2a2a2a] pt-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center shadow-lg shadow-[#fd297b]/30">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-heading text-white mb-2">
                          Ready to Reveal?
                        </h3>
                        <p className="text-[#b0b0b0] font-body mb-6">
                          Make sure you're both ready to see your mystery date
                        </p>
                        <button
                          onClick={handleReveal}
                          className="w-full max-w-md py-4 px-8 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg shadow-lg shadow-[#fd297b]/30 hover:opacity-90 transition-opacity"
                        >
                          Reveal Date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`
                  bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]
                  rounded-3xl p-6 md:p-8
                  border border-[#2a2a2a]
                  transition-all duration-500
                  ${isFlipping ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
                `}>
                  <div className={`space-y-6 ${!isAccepted ? 'blur-sm' : ''}`}>
                    {/* Category & Title */}
                    <div>
                      <CategoryBadge category={currentDrop.category} size="md" />
                      <h2 className="text-2xl md:text-3xl font-heading text-white mt-3 mb-2">
                        {currentDrop.title}
                      </h2>
                      <p className="text-[#b0b0b0] font-body leading-relaxed text-lg">
                        {currentDrop.description}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex gap-6 text-base font-body text-[#6e6e6e]">
                      <span className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {currentDrop.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        ${currentDrop.budget} budget
                      </span>
                    </div>

                    {/* Roles */}
                    <div className="border-t border-[#2a2a2a] pt-6">
                      <h3 className="text-base font-body text-[#b0b0b0] mb-4">Your Roles</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{currentDrop.roleA.label === 'Navigator' ? '🗺' : '🎯'}</span>
                            <span className="font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{currentDrop.roleA.label}</span>
                            <span className="text-[#6e6e6e] text-sm">({names.yourName})</span>
                          </div>
                          <p className="text-[#b0b0b0] font-body">
                            {currentDrop.roleA.instruction}
                          </p>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{currentDrop.roleB.label === 'Curator' ? '🎒' : '🎨'}</span>
                            <span className="font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{currentDrop.roleB.label}</span>
                            <span className="text-[#6e6e6e] text-sm">({names.partnerName})</span>
                          </div>
                          <p className="text-[#b0b0b0] font-body">
                            {currentDrop.roleB.instruction}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Accepted State */}
                    {isAccepted && (
                      <div className="border-t border-[#2a2a2a] pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-green-400 font-semibold">Adventure Accepted</span>
                          </div>
                          <button
                            onClick={handleComplete}
                            className="w-full sm:w-auto py-2 px-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            ✓ Complete Adventure
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - outside blur container so they remain clickable */}
                  {!isAccepted && (
                    <div className="border-t border-[#2a2a2a] pt-6 mt-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAccept}
                          className="flex-1 py-4 px-8 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg shadow-lg shadow-[#fd297b]/30 hover:opacity-90 transition-opacity"
                        >
                          Reveal the date
                        </button>
                        {userPlan === 'pro' && !hasRerolled && (
                          <button
                            onClick={() => setShowRerollDialog(true)}
                            disabled={isRerolling}
                            className="flex-1 py-4 px-8 rounded-full bg-[#2a2a2a] text-white font-semibold text-lg border border-[#3a3a3a] hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isRerolling ? 'Finding new date...' : '🎲 Re-roll'}
                          </button>
                        )}
                      </div>

                      {/* Toggle between original and rerolled date */}
                      {hasRerolled && previousDate && (
                        <div className="mt-4 space-y-3">
                          <button
                            onClick={handleToggleDate}
                            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#fd297b]/20 to-[#ff655b]/20 text-white font-medium border border-[#fd297b]/50 hover:border-[#fd297b] transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 4v6h-6" />
                              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Switch to {showingRerolledDate ? 'original' : 'rerolled'} date
                          </button>
                          <p className="text-xs text-[#6e6e6e] text-center">
                            Maximum of 1 re-roll possible
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Re-roll Dialog */}
              {showRerollDialog && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
                  <div className="bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full border border-[#2a2a2a]">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M23 4v6h-6" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-heading text-white mb-2">Re-roll your date?</h3>
                      <p className="text-[#b0b0b0] font-body">
                        This will replace your current mystery date with a new one. You can restore the previous date if you change your mind.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRerollDialog(false)}
                        className="flex-1 py-3 px-4 rounded-full bg-[#2a2a2a] text-white font-semibold hover:bg-[#333] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReroll}
                        className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Re-roll
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Countdown */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] sticky top-6">
              <h3 className="text-lg font-heading text-white mb-4">Next Drop In</h3>

              {/* Countdown */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <div className="text-3xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{timeLeft.days}</div>
                  <div className="text-xs text-[#6e6e6e] font-body mt-1">Days</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <div className="text-3xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{timeLeft.hours}</div>
                  <div className="text-xs text-[#6e6e6e] font-body mt-1">Hours</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <div className="text-3xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{timeLeft.minutes}</div>
                  <div className="text-xs text-[#6e6e6e] font-body mt-1">Minutes</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <div className="text-3xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">{timeLeft.seconds}</div>
                  <div className="text-xs text-[#6e6e6e] font-body mt-1">Seconds</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full transition-all duration-1000"
                  style={{ width: '65%' }}
                />
              </div>
              <p className="text-xs text-[#6e6e6e] font-body mt-3 text-center">
                Until your next mystery date
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
