import { vibeOptions } from '../data/mockData';
import PillSelect from './PillSelect';

export default function StepVibes({ vibes, setVibes, onBack, onConfirm }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">
          What's your vibe?
        </h2>
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

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-full border-2 border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={vibes.length === 0}
          className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
