import { clearPreferences } from '../utils/storage';

export default function DevResetButton() {
  const handleReset = () => {
    clearPreferences();
    window.location.href = '/onboarding';
  };

  return (
    <button
      onClick={handleReset}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white text-xs font-body px-3 py-1.5 rounded-full shadow-lg shadow-[#fd297b]/30 hover:opacity-90 transition-opacity"
      title="Dev: Reset onboarding"
    >
      Reset
    </button>
  );
}
