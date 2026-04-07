import { useState, useEffect } from 'react';
import { BottomNav } from '../components';
import { getPreferences, clearPreferences } from '../utils/storage';
import { signOut } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    getPreferences().then(setPreferences);
  }, []);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all preferences? This will take you back to onboarding.')) {
      await clearPreferences();
      navigate('/onboarding');
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Sign out?')) {
      await signOut();
      navigate('/auth');
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const names = preferences?.names || { yourName: '-', partnerName: '-' };
  const vibes = preferences?.vibes || [];
  const limits = preferences?.limits || { budget: 50, hasCar: false, walkingDistance: false };
  const frequency = preferences?.frequency || '-';

  const frequencyLabels = {
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly'
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a] hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
          <nav className="flex items-center gap-6">
            <a href="/home" className="text-[#b0b0b0] hover:text-white transition-colors">Home</a>
            <a href="/dates" className="text-[#b0b0b0] hover:text-white transition-colors">Dates</a>
            <a href="/profile" className="text-white font-medium">Profile</a>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center shadow-lg shadow-[#fd297b]/30">
                  <span className="text-2xl font-heading text-white">
                    {names.yourName[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-heading text-white">
                    {names.yourName} & {names.partnerName}
                  </h2>
                  <p className="text-[#b0b0b0] font-body">
                    Adventure Partners
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ProfileRow
                  label="Vibes"
                  value={vibes.length > 0
                    ? vibes.map(v => {
                        const vibe = {
                          outdoors: 'Outdoors',
                          food: 'Food & Drink',
                          arts: 'Arts & Culture',
                          active: 'Active & Sport',
                          cozy: 'Cozy & Homey',
                          nightlife: 'Nightlife'
                        }[v];
                        return vibe;
                      }).join(', ')
                    : 'Not set'}
                />
                <ProfileRow
                  label="Budget"
                  value={`$${limits.budget} per date`}
                />
                <ProfileRow
                  label="Transport"
                  value={limits.hasCar ? 'Has car' : limits.walkingDistance ? 'Walking distance' : 'Not specified'}
                />
                <ProfileRow
                  label="Frequency"
                  value={frequencyLabels[frequency] || 'Not set'}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-heading text-white mb-4">Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-body text-white">Notifications</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-body text-white">Privacy</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-body text-[#f44336]">Reset App</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-body text-[#b0b0b0]">Sign Out</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-heading text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                  <span className="text-[#b0b0b0]">Dates Done</span>
                  <span className="text-2xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">7</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                  <span className="text-[#b0b0b0]">Week Streak</span>
                  <span className="text-2xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                  <span className="text-[#b0b0b0]">Rank</span>
                  <span className="text-2xl font-heading text-white">Top 12%</span>
                </div>
              </div>
            </div>

            {/* Achievement Preview */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-heading text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b]/20 to-[#ff655b]/20 flex items-center justify-center text-[#fd297b]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Completed date</p>
                    <p className="text-[#6e6e6e] text-xs">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b]/20 to-[#ff655b]/20 flex items-center justify-center text-[#fd297b]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.12.8-2.22 1.5-3.2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Week streak</p>
                    <p className="text-[#6e6e6e] text-xs">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a] last:border-0">
      <span className="text-sm text-[#b0b0b0] font-body">{label}</span>
      <span className="text-sm text-white font-body">{value}</span>
    </div>
  );
}
