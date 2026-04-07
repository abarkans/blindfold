'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components';
import { supabase } from '../lib/supabase';

export default function MyDates() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('completed');
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedDates();
  }, []);

  const loadCompletedDates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('completed_dates')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (!error && data) {
        setCompletedDates(data);
      }
    } catch (error) {
      console.error('Error loading completed dates:', error);
    } finally {
      setLoading(false);
    }
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
            <a href="/my-dates" className="text-white font-medium cursor-pointer">My Dates</a>
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
        <div className="mb-8">
          <h1 className="text-4xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent mb-2">
            My Dates
          </h1>
          <p className="text-[#b0b0b0]">Track your dating journey</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="space-y-4">
            <StatCard
              value={completedDates.length}
              label="Dates Completed"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <StatCard
              value="3"
              label="Week Streak"
              accent
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.12.8-2.22 1.5-3.2" />
                </svg>
              }
            />
            <StatCard
              value="Top 12%"
              label="Of Couples"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              }
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-pulse" />
              </div>
            ) : completedDates.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-[#2a2a2a] text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#fd297b]/20 to-[#ff655b]/20 flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fd297b" strokeWidth="2">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading text-white mb-2">No dates yet</h3>
                <p className="text-[#b0b0b0] font-body mb-6">
                  Complete your first mystery date to start building your adventure history
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Your First Date
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedDates.map((date) => (
                  <DateHistoryCard key={date.id} date={date} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function StatCard({ value, label, icon, accent = false, prefix = '' }) {
  return (
    <div className={`
      bg-[#1a1a1a] rounded-2xl p-4
      border ${accent ? 'border-[#fd297b]' : 'border-[#2a2a2a]'}
      flex flex-col items-center text-center
    `}>
      <div className={`${accent ? 'text-[#fd297b]' : 'text-[#6e6e6e]'} mb-2`}>
        {icon}
      </div>
      <div className={`text-2xl font-heading ${accent ? 'text-[#fd297b]' : 'text-white'}`}>
        {prefix}{value}
      </div>
      <div className="text-xs text-[#6e6e6e] font-body mt-0.5">
        {label}
      </div>
    </div>
  );
}

function DateHistoryCard({ date }) {
  const categoryConfig = {
    outdoors: { label: 'Outdoors', color: 'from-green-500 to-emerald-600' },
    food: { label: 'Food & Drink', color: 'from-orange-500 to-amber-600' },
    arts: { label: 'Arts & Culture', color: 'from-purple-500 to-pink-600' },
    active: { label: 'Active & Sport', color: 'from-red-500 to-rose-600' },
    cozy: { label: 'Cozy & Homey', color: 'from-blue-500 to-cyan-600' },
    nightlife: { label: 'Nightlife', color: 'from-indigo-500 to-violet-600' }
  };

  const category = categoryConfig[date.category] || { label: date.category, color: 'from-[#fd297b] to-[#ff655b]' };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${category.color} text-white`}>
            {category.label}
          </span>
          <h3 className="text-lg font-heading text-white mt-2">
            {date.title}
          </h3>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={i < date.rating ? '#fd297b' : 'none'}
              stroke="#fd297b"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      {date.notes && (
        <p className="text-[#b0b0b0] font-body text-sm mb-4">
          {date.notes}
        </p>
      )}

      <div className="flex items-center justify-between text-xs font-body text-[#6e6e6e]">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(date.completed_date)}
        </span>
        <span>${date.budget} budget</span>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return 'Last week';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
