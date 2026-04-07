import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Slider, PillSelect, OptionCard, ProgressBar, Toggle } from '../components';
import { vibeOptions, frequencyOptions } from '../data/mockData';
import { savePreferences } from '../utils/storage';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [names, setNames] = useState({ yourName: '', partnerName: '' });
  const [vibes, setVibes] = useState([]);
  const [limits, setLimits] = useState({
    budget: 50,
    hasCar: false,
    walkingDistance: false
  });
  const [frequency, setFrequency] = useState('');

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const preferences = {
        names,
        vibes,
        limits,
        frequency
      };
      // Save to localStorage first
      await savePreferences(preferences);
      // Also save to Supabase
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData && authData.user) {
          const { error } = await supabase
            .from('user_data')
            .upsert({
              user_id: authData.user.id,
              data: { preferences },
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
          if (error) console.error('Error saving to Supabase:', error);
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
      // Navigate to home/dashboard
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return names.yourName.trim() && names.partnerName.trim();
      case 2:
        return vibes.length > 0;
      case 3:
        return true;
      case 4:
        return frequency !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8 pb-24">
      <div className="max-w-[430px] mx-auto">
      {/* Logo/Header - Top Left (matches home/login pages) */}
      <div className="fixed top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
        </div>
      </div>

      <div className="pt-16">
      <ProgressBar current={step} total={4} className="mb-8" />

      <div className="mt-8">
        {step === 1 && <Step1 names={names} setNames={setNames} />}
        {step === 2 && <Step2 vibes={vibes} setVibes={setVibes} />}
        {step === 3 && <Step3 limits={limits} setLimits={setLimits} />}
        {step === 4 && <Step4 frequency={frequency} setFrequency={setFrequency} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#2a2a2a] px-6 py-4">
        <div className="max-w-[430px] mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-full border-2 border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-3 px-8 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {step === 4 ? "Start Our Adventure" : "Next"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function Step1({ names, setNames }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading text-white mb-2">
          Who are you doing this with?
        </h1>
        <p className="text-[#b0b0b0] font-body">
          Let's set up your duo
        </p>
      </div>

      <div className="space-y-4 pt-8">
        <div className="relative">
          <input
            type="text"
            value={names.yourName}
            onChange={(e) => setNames({ ...names, yourName: e.target.value })}
            placeholder="Your name"
            className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors text-lg"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={names.partnerName}
            onChange={(e) => setNames({ ...names, partnerName: e.target.value })}
            placeholder="Partner's name"
            className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors text-lg"
          />
        </div>
      </div>
    </div>
  );
}

function Step2({ vibes, setVibes }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading text-white mb-2">
          What's your vibe?
        </h1>
        <p className="text-[#b0b0b0] font-body">
          Select all that resonate with you both
        </p>
      </div>

      <div className="pt-8">
        <PillSelect
          options={vibeOptions}
          selected={vibes}
          onChange={setVibes}
          multiSelect
        />
      </div>
    </div>
  );
}

function Step3({ limits, setLimits }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading text-white mb-2">
          Set your limits
        </h1>
        <p className="text-[#b0b0b0] font-body">
          Keep things comfortable and realistic
        </p>
      </div>

      <div className="space-y-6 pt-8">
        <Slider
          label="Budget per date"
          value={limits.budget}
          onChange={(value) => setLimits({ ...limits, budget: value })}
          min={10}
          max={200}
          step={5}
          valuePrefix="$"
        />

        <div className="space-y-3">
          <Toggle
            label="We have a car"
            checked={limits.hasCar}
            onChange={(value) => setLimits({ ...limits, hasCar: value, walkingDistance: false })}
          />
          <Toggle
            label="We prefer walking distance"
            checked={limits.walkingDistance}
            onChange={(value) => setLimits({ ...limits, walkingDistance: value, hasCar: false })}
          />
        </div>
      </div>
    </div>
  );
}

function Step4({ frequency, setFrequency }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading text-white mb-2">
          How often do you want a new drop?
        </h1>
        <p className="text-[#b0b0b0] font-body">
          Set the rhythm for your adventures
        </p>
      </div>

      <div className="space-y-3 pt-8">
        {frequencyOptions.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={frequency === option.id}
            onClick={() => setFrequency(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
