'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '../components';
import { getPreferences, clearPreferences } from '../utils/storage';
import { signOut, supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    yourName: '',
    partnerName: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load preferences
      const prefs = await getPreferences();
      setPreferences(prefs);

      if (prefs?.names) {
        setFormData({
          yourName: prefs.names.yourName || '',
          partnerName: prefs.names.partnerName || '',
          email: ''
        });
      }

      // Load user email
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update preferences in localStorage and sync to Supabase
      const updatedPreferences = {
        ...preferences,
        names: {
          yourName: formData.yourName,
          partnerName: formData.partnerName
        }
      };

      localStorage.setItem('blindfold_preferences', JSON.stringify(updatedPreferences));
      await getPreferences(); // Sync to Supabase via storage.js
      setPreferences(updatedPreferences);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

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

  if (!preferences) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-pulse" />
      </div>
    );
  }

  const vibes = preferences.vibes || [];
  const limits = preferences.limits || { budget: 50, hasCar: false, walkingDistance: false };
  const frequency = preferences.frequency || '-';

  const frequencyLabels = {
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly'
  };

  const vibeLabels = {
    outdoors: 'Outdoors',
    food: 'Food & Drink',
    arts: 'Arts & Culture',
    active: 'Active & Sport',
    cozy: 'Cozy & Homey',
    nightlife: 'Nightlife'
  };

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
            <a href="/home" className="text-[#b0b0b0] hover:text-white transition-colors cursor-pointer">Home</a>
            <a href="/my-dates" className="text-[#b0b0b0] hover:text-white transition-colors cursor-pointer">My Dates</a>
            <a href="/profile" className="text-white font-medium cursor-pointer">Profile</a>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center shadow-lg shadow-[#fd297b]/30">
                    <span className="text-2xl font-heading text-white">
                      {formData.yourName[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-heading text-white">
                      {formData.yourName && formData.partnerName
                        ? `${formData.yourName} & ${formData.partnerName}`
                        : 'Your Profile'
                      }
                    </h2>
                    <p className="text-[#b0b0b0] font-body">
                      Adventure Partners
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.yourName}
                        onChange={(e) => setFormData(prev => ({ ...prev, yourName: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:border-[#fd297b] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                        Partner's Name
                      </label>
                      <input
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:border-[#fd297b] transition-colors"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 rounded-full bg-[#2a2a2a] text-white font-semibold hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    {saveError && (
                      <p className="text-sm text-red-400">{saveError}</p>
                    )}
                  </>
                ) : (
                  <>
                    <ProfileRow
                      label="Your Name"
                      value={formData.yourName || 'Not set'}
                    />
                    <ProfileRow
                      label="Partner's Name"
                      value={formData.partnerName || 'Not set'}
                    />
                    <ProfileRow
                      label="Email"
                      value={formData.email || 'Not set'}
                    />
                    <ProfileRow
                      label="Vibes"
                      value={vibes.length > 0
                        ? vibes.map(v => vibeLabels[v] || v).join(', ')
                        : 'Not set'
                      }
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] sticky top-6">
              <h3 className="text-lg font-heading text-white mb-4">Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                  <span className="font-body text-white">Notifications</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                  <span className="font-body text-white">Privacy</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <span className="font-body text-[#f44336]">Reset App</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
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
