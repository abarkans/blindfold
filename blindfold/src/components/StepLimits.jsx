import Slider from './Slider';
import Toggle from './Toggle';

export default function StepLimits({ limits, setLimits, onBack, onConfirm }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">
          Set your limits
        </h2>
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

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-full border-2 border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
