'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StepCredentials from '../components/StepCredentials';
import StepPlanSelect from '../components/StepPlanSelect';
import StepVerifyEmail from '../components/StepVerifyEmail';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCredentialsSubmit = () => {
    setStep(2);
  };

  const handlePlanConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            plan
          }
        }
      });

      if (error) throw error;

      if (data && data.user) {
        // Redirect to onboarding after successful registration
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
          {step < 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#b0b0b0]">
                  Step {step} of 2
                </span>
                <span className="text-sm text-[#b0b0b0]">
                  {step === 1 ? 'Credentials' : 'Plan'}
                </span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full transition-all duration-300"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>
          )}

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
              <StepPlanSelect
                plan={plan}
                setPlan={setPlan}
                onBack={handleBack}
                onConfirm={handlePlanConfirm}
                loading={loading}
              />
            )}

            {step === 3 && (
              <StepVerifyEmail email={email} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
