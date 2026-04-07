import { frequencyOptions } from '../data/mockData';
import OptionCard from './OptionCard';

export default function StepFrequency({ frequency, setFrequency, onBack, onConfirm, loading }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">
          How often do you want a new drop?
        </h2>
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

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-full border-2 border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading || !frequency}
          className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : (
            'Start Our Adventure'
          )}
        </button>
      </div>
    </div>
  );
}
