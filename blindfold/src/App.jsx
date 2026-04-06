import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing, Onboarding, Home, Dates, Profile, Auth, AuthCallback } from './pages';
import { hasCompletedOnboarding, getPreferences } from './utils/storage';
import { onAuthStateChange } from './lib/supabase';
import DevResetButton from './components/DevResetButton';

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
      const result = await hasCompletedOnboarding();
      setHasOnboarded(result);
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

  // If already onboarded, redirect to home
  if (hasOnboarded) {
    return <Navigate to="/" replace />;
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
      <DevResetButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dates" element={<ProtectedRoute><Dates /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
