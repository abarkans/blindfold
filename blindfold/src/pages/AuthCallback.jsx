import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUserData } from '../utils/storage';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1));

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session from the URL params
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            navigate('/auth?error=auth_failed');
            return;
          }

          // Check if user is new (needs onboarding)
          const { data: authData, error: userError } = await supabase.auth.getUser();
          if (userError || !authData?.user) {
            console.error('Error getting user:', userError);
            navigate('/auth');
            return;
          }

          const user = authData.user;
          console.log('User authenticated:', user.id);

          // Check if user has completed onboarding by checking their data
          try {
            const userData = await getUserData(user.id);
            console.log('User data:', userData);

            const hasOnboarded = userData?.preferences?.names &&
                                  userData?.preferences?.vibes &&
                                  userData?.preferences?.limits &&
                                  userData?.preferences?.frequency;

            if (!hasOnboarded) {
              console.log('New user - redirecting to onboarding');
              // New user - redirect to onboarding
              navigate('/onboarding');
            } else {
              console.log('Existing user - redirecting to home');
              // Existing user - redirect to home
              navigate('/');
            }
          } catch (err) {
            console.log('Error checking user data, assuming new user:', err);
            navigate('/onboarding');
          }
        } else {
          // No tokens, just redirect to auth
          navigate('/auth');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] animate-spin mx-auto mb-4" />
        <p className="text-white font-body">Completing sign in...</p>
      </div>
    </div>
  );
}
