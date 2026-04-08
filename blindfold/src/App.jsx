import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing, Onboarding, Home, Profile, Auth, AuthCallback, Register, Dashboard, MyDates } from './pages';
import { hasCompletedOnboarding, getPreferences } from './utils/storage';
import { onAuthStateChange } from './lib/supabase';

function LoadingScreen() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-pulse" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const result = await hasCompletedOnboarding();
        setHasOnboarded(result);
      } catch (err) {
        console.error('ProtectedRoute error:', err);
        // Fallback to localStorage check
        const localData = localStorage.getItem('blindfold_preferences');
        const prefs = localData ? JSON.parse(localData) : null;
        setHasOnboarded(!!(prefs?.names && prefs?.vibes && prefs?.limits && prefs?.frequency));
      }
      setIsChecking(false);
    };
    check();
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function OnboardingRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await hasCompletedOnboarding();
      setHasOnboarded(result);
      setIsChecking(false);
    };
    check();
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  // If already onboarded, redirect to dashboard
  if (hasOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(() => {
      setIsLoading(false);
    });

    // Initial load
    const init = async () => {
      await getPreferences(); // Pre-load user data
      setIsLoading(false);
    };
    init();

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-dates" element={<ProtectedRoute><MyDates /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
