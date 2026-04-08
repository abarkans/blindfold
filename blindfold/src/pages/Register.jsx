'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { savePreferences } from '../utils/storage';
import StepCredentials from '../components/StepCredentials';
import StepNames from '../components/StepNames';
import StepVibes from '../components/StepVibes';
import StepLimits from '../components/StepLimits';
import StepFrequency from '../components/StepFrequency';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Onboarding state
  const [names, setNames] = useState({ yourName: '', partnerName: '' });
  const [vibes, setVibes] = useState([]);
  const [limits, setLimits] = useState({
    budget: 50,
    hasCar: false,
    walkingDistance: false
  });
  const [frequency, setFrequency] = useState('');

  const handleCredentialsSubmit = () => {
    setStep(2);
  };

  const handleNamesSubmit = () => {
    setStep(3);
  };

  const handleVibesConfirm = () => {
    setStep(4);
  };

  const handleLimitsConfirm = () => {
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create auth user ONLY (no metadata to avoid trigger issues)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      const user = authData.user;
      console.log('User created:', user.id);

      // Step 2: Create profile manually (trigger is disabled/broken)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: email,
          full_name: names.yourName
        });

      if (profileError) {
        console.error('Profile error:', profileError);
      } else {
        console.log('Profile created');
      }

      // Step 3: Save preferences locally
      const preferences = {
        names,
        vibes,
        limits,
        frequency
      };
      await savePreferences(preferences);

      // Verify localStorage was written
      const verifyPrefs = localStorage.getItem('blindfold_preferences');
      console.log('localStorage verification:', verifyPrefs ? JSON.parse(verifyPrefs) : 'NOT FOUND');

      // Step 4: Create couple record
      const { data: couple, error: coupleError } = await supabase
        .from('couples')
        .insert({
          navigator_id: user.id,
          couple_name: `${names.yourName} & ${names.partnerName}`
        })
        .select()
        .single();

      if (coupleError) {
        console.error('Couple error:', coupleError);
      } else {
        console.log('Couple created:', couple.id);
      }

      // Step 5: Create preferences record
      if (couple) {
        const { error: prefError } = await supabase
          .from('preferences')
          .insert({
            couple_id: couple.id,
            city: '',
            vibes: vibes.join(','),
            budget_min: Math.floor(limits.budget / 25),
            budget_max: Math.ceil(limits.budget / 25),
            max_distance_miles: limits.hasCar ? 50 : 10,
            indoor_outdoor: limits.walkingDistance ? 'indoor' : 'either',
            time_of_day: 'evening',
            preferred_days: frequency === 'weekly' ? 'weekend' : 'weekend'
          });

        if (prefError) console.error('Preferences error:', prefError);
        else console.log('Preferences saved to DB');
      }

      // Mark onboarding complete
      localStorage.setItem('blindfold_onboarding_complete', 'true');

      console.log('Registration complete, navigating to dashboard...');

      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to home
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getTotalSteps = () => {
    return 5; // Credentials, Names, Vibes, Limits, Frequency
  };

  const getStepLabel = () => {
    const labels = {
      1: 'Credentials',
      2: 'Names',
      3: 'Vibes',
      4: 'Limits',
      5: 'Frequency'
    };
    return labels[step] || '';
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-[420px] md:max-w-2xl">
        {/* Logo */}
        <div className="fixed top-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
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
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#b0b0b0]">
                Step {step} of {getTotalSteps()}
              </span>
              <span className="text-sm text-[#b0b0b0]">
                {getStepLabel()}
              </span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full transition-all duration-300"
                style={{ width: `${(step / getTotalSteps()) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-[#1a1a1a]">
            {step === 1 && (
              <StepCredentials
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleCredentialsSubmit}
                loading={loading}
                error={error}
              />
            )}

            {step === 2 && (
              <StepNames
                names={names}
                setNames={setNames}
                onSubmit={handleNamesSubmit}
                loading={loading}
              />
            )}

            {step === 3 && (
              <StepVibes
                vibes={vibes}
                setVibes={setVibes}
                onBack={handleBack}
                onConfirm={handleVibesConfirm}
              />
            )}

            {step === 4 && (
              <StepLimits
                limits={limits}
                setLimits={setLimits}
                onBack={handleBack}
                onConfirm={handleLimitsConfirm}
              />
            )}

            {step === 5 && (
              <StepFrequency
                frequency={frequency}
                setFrequency={setFrequency}
                onBack={handleBack}
                onConfirm={handleFinalSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
