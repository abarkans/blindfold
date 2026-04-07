'use client';

import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { hasCompletedOnboarding } from '../utils/storage';

const menuItems = [
  { to: '/', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
];

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

    // Listen for toggle event from landing page button
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-burger-menu', handleToggle);
    return () => window.removeEventListener('toggle-burger-menu', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleAuthClick = () => {
    setIsOpen(false);
    navigate(isLoggedIn ? '/home' : '/auth');
  };

  return (
    <>
      {/* Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative z-[10000] flex flex-col items-center justify-center min-h-screen px-6">
          <nav className="flex flex-col items-center gap-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => handleNavClick(item.to)}
                className={`group relative text-2xl md:text-3xl font-heading font-medium transition-all duration-300 transform ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${100 + index * 80}ms` }}
              >
                <span className="text-[#b0b0b0] group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span
                  className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-[#fd297b] to-[#ff655b] transition-all duration-300 ${
                    item.to === '/' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                />
              </NavLink>
            ))}

            {/* Auth Button */}
            <button
              onClick={handleAuthClick}
              className={`mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-medium transition-all duration-300 transform hover:opacity-90 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${100 + menuItems.length * 80}ms` }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Sign In'}
            </button>
          </nav>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#fd297b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff655b]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </>
  );
}
