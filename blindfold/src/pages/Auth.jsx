import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/supabase';
import { getUserData } from '../utils/storage';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(error.message);
          }
          return;
        }
        // Store flag to redirect to onboarding after confirmation
        if (data && data.user) {
          localStorage.setItem('pending_onboarding', 'true');
        }
        alert('Check your email for the confirmation link!');
      } else {
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
            navigate('/home');
          }
        } else {
          navigate('/home');
        }
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
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-heading text-white text-center mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-[#b0b0b0] font-body text-center mb-8">
          {isSignUp ? 'Sign up to sync your dates' : 'Sign in to continue'}
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-full bg-red-900/30 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6 py-3 text-[#b0b0b0] hover:text-white transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
