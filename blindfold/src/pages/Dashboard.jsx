'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/register');
        return;
      }

      setEmail(session.user.email);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-pulse" />
          <p className="text-[#b0b0b0] font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
          <button
            onClick={handleSignOut}
            className="text-[#b0b0b0] hover:text-white transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading text-white mb-2">
            Welcome to Blindfold
          </h1>
          <p className="text-[#b0b0b0] font-body">
            {email}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate('/my-dates')}
            className="w-full py-4 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
          >
            View My Dates
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-8">
          <p className="text-[#6e6e6e] font-body text-sm">
            More features coming soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
