'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/supabase';
import { getUserData } from '../utils/storage';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      // Check if user has completed onboarding
      if (data && data.user) {
        try {
          const userData = await getUserData(data.user.id);
          const hasOnboarded = userData?.preferences?.names &&
                                userData?.preferences?.vibes &&
                                userData?.preferences?.limits &&
                                userData?.preferences?.frequency;
          navigate(hasOnboarded ? '/home' : '/onboarding');
        } catch (err) {
          console.error('Error checking onboarding status:', err);
          const localData = localStorage.getItem('blindfold_preferences');
          const prefs = localData ? JSON.parse(localData) : null;
          const hasOnboardedLocal = !!(prefs?.names && prefs?.vibes && prefs?.limits && prefs?.frequency);
          navigate(hasOnboardedLocal ? '/home' : '/onboarding');
        }
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo - Top Left */}
        <div className="fixed top-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span className="font-heading text-xl font-semibold text-white">blindfold</span>
            </button>
          </div>
        </div>

        <div className="mt-20">
        <h1 className="text-3xl font-heading text-white text-center mb-2">
          Welcome Back
        </h1>
        <div className="mb-10">
          <p className="text-[#b0b0b0] font-body text-center">
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-900/30 border border-red-800 text-red-300 text-sm">
            <p className="mb-2">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => navigate('/register')}
          className="w-full mt-6 py-3 text-[#b0b0b0] hover:text-white transition-colors cursor-pointer"
        >
          Don't have an account? Sign Up
        </button>
        </div>
      </div>
    </div>
  );
}
