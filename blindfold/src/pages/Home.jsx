import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryBadge, BottomNav } from '../components';
import { dateIdeas } from '../data/mockData';
import { getPreferences, saveDateState, getDateState, getRandomDateId } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [dateState, setDateState] = useState(null);
  const [isRevealed, setIsRevealed] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32 });
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [prefs, state] = await Promise.all([getPreferences(), getDateState()]);
      setPreferences(prefs);
      setDateState(state);
      setIsRevealed(state?.currentDateId || null);
    };
    loadData();
  }, []);

  // Get 1 random date idea
  const randomDateId = getRandomDateId(dateIdeas);
  const currentDrop = dateIdeas.find(d => d.id === randomDateId);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleReveal = async () => {
    setIsFlipping(true);
    setTimeout(async () => {
      setIsRevealed(currentDrop.id);
      setIsFlipping(false);
      await saveDateState({ currentDateId: currentDrop.id, accepted: false });
    }, 600);
  };

  const handleAccept = async () => {
    await saveDateState({ currentDateId: currentDrop.id, accepted: true });
  };

  const names = preferences?.names || { yourName: 'You', partnerName: 'Partner' };

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/home" className="text-white font-medium">Home</a>
            <a href="/dates" className="text-[#b0b0b0] hover:text-white transition-colors">Dates</a>
            <a href="/profile" className="text-[#b0b0b0] hover:text-white transition-colors">Profile</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Date Card */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="text-[#b0b0b0] font-body text-sm mb-2">
                Hey, {names.yourName} & {names.partnerName}
              </p>
              <h1 className="text-4xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">
                Your Next Adventure
              </h1>
            </div>

            {/* Main Drop Card */}
            <div className="relative">
              {!isRevealed ? (
                <div className={`
                  bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]
                  rounded-3xl p-8 md:p-12
                  border border-[#2a2a2a]
                  transition-all duration-500
                  ${isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                `}>
                  <div className="flex flex-col items-center text-center">
                    {/* Mystery Envelope Icon */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center mb-6 shadow-lg shadow-[#fd297b]/30">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                        <path d="M12 12v5" />
                        <path d="M9 14l3 3 3-3" />
                      </svg>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-heading text-white mb-2">
                      Your Next Drop
                    </h2>
                    <p className="text-[#b0b0b0] font-body mb-6 text-lg">
                      Unlocks in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                    </p>

                    {/* Countdown Progress */}
                    <div className="w-full max-w-md bg-[#2a2a2a] rounded-full h-3 mb-8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full transition-all duration-1000"
                        style={{ width: '65%' }}
                      />
                    </div>

                    <button
                      onClick={handleReveal}
                      className="w-full max-w-md py-4 px-8 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg shadow-lg shadow-[#fd297b]/30 hover:opacity-90 transition-opacity"
                    >
                      Both Ready? Reveal the Drop
                    </button>

                    <p className="text-[#6e6e6e] font-body text-sm mt-4">
                      Make sure you're both ready before revealing
                    </p>
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
                  <div className="space-y-6">
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

                    {/* Action Button */}
                    <button
                      onClick={handleAccept}
                      className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg shadow-lg shadow-[#fd297b]/30 hover:opacity-90 transition-opacity"
                    >
                      We're Doing This
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-heading text-white mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#b0b0b0]">Dates Completed</span>
                  <span className="text-2xl font-heading text-white">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#b0b0b0]">Week Streak</span>
                  <span className="text-2xl font-heading text-[#fd297b]">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#b0b0b0]">Rank</span>
                  <span className="text-2xl font-heading text-white">Top 12%</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-heading text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/dates" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="[#fd297b]" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-white">View Past Dates</span>
                </a>
                <a href="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="[#fd297b]" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-white">Edit Preferences</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
