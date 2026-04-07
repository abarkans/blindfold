import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { hasCompletedOnboarding } from '../utils/storage';
import { useEffect, useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has completed onboarding
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const hasOnboarded = await hasCompletedOnboarding();
        if (hasOnboarded) {
          setIsLoggedIn(true);
        }
      }
    };
    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <path d="M12 12v5" />
          <path d="M9 14l3 3 3-3" />
        </svg>
      ),
      title: 'Mystery Dates',
      description: 'Curated surprise date ideas delivered regularly. Both partners reveal and decide together.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      title: 'Built for Couples',
      description: 'Designed for partners who want to keep the spark alive with unique shared experiences.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Timed Reveals',
      description: "Build anticipation with countdown timers. Reveal dates when you're both ready."
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: 'Personalized to You',
      description: 'Set your budget, preferences, and vibe. Get date ideas that match your style.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fd297b]/20 via-transparent to-[#ff655b]/20" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </div>
          <button
            onClick={() => isLoggedIn ? navigate('/home') : navigate('/auth?mode=signin')}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Sign In'}
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6">
                Mystery Dates for<br />
                <span className="bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent">Couples</span>
              </h1>
              <p className="text-lg md:text-xl text-[#b0b0b0] mb-10 max-w-lg mx-auto lg:mx-0">
                Keep the spark alive with curated surprise date ideas. Both partners reveal and decide together – no more "what should we do tonight?"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#fd297b]/30"
                >
                  {isLoggedIn ? 'Go to Dashboard' : 'Start Your Adventure'}
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold text-lg hover:bg-[#2a2a2a] transition-colors"
                >
                  How It Works
                </button>
              </div>
            </div>

            {/* Couple Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-[#fd297b]/20">
                <img
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop"
                  alt="Happy couple on a date"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <span className="font-heading text-sm">Mystery dates await</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-6 py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Never Run Out of Date Ideas
            </h2>
            <p className="text-[#b0b0b0] text-lg max-w-4xl mx-auto text-center">
              Blindfold takes the stress out of date planning. Get personalized mystery date ideas that you both reveal and decide on together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#fd297b]/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fd297b]/20 to-[#ff655b]/20 flex items-center justify-center text-[#fd297b] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#b0b0b0] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-[#b0b0b0] text-lg mb-8">
            Join couples who keep the spark alive with mystery dates delivered regularly.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#fd297b]/30"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1a1a1a]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="font-heading text-white">blindfold</span>
          </div>
          <p className="text-[#6e6e6e] text-sm">
            © 2026 Blindfold. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
