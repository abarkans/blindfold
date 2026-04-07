import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/register');
        return;
      }

      setEmail(session.user.email);
      setPlan(session.user.user_metadata?.plan || 'free');
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    alert('Upgrade feature coming soon!');
  };

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
            Welcome to Your Dashboard
          </h1>
          <p className="text-[#b0b0b0] font-body">
            {email}
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading text-white mb-1">Your Plan</h2>
              <p className="text-[#b0b0b0] font-body text-sm">
                {plan === 'pro' ? 'Premium features unlocked' : 'Free plan active'}
              </p>
            </div>
            <span className={`
              px-4 py-2 rounded-full font-semibold text-sm
              ${plan === 'pro'
                ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white'
                : 'bg-[#2a2a2a] text-[#b0b0b0]'
              }
            `}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>

          {plan === 'free' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#fd297b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[#b0b0b0] font-body text-sm">
                  Up to 5 date ideas per month
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#fd297b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[#b0b0b0] font-body text-sm">
                  Basic date categories
                </p>
              </div>
            </div>
          )}

          {plan === 'pro' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#fd297b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[#b0b0b0] font-body text-sm">
                  Unlimited date ideas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#fd297b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[#b0b0b0] font-body text-sm">
                  All premium features
                </p>
              </div>
            </div>
          )}

          {plan === 'free' && (
            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade to Pro - $9/month
            </button>
          )}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center">
          <p className="text-[#6e6e6e] font-body text-sm">
            More features coming soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
