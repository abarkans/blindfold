export default function PlanBadge({ plan, size = 'md' }) {
  const isPro = plan === 'pro';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${sizeClasses[size]}
        ${isPro
          ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white'
          : 'bg-[#2a2a2a] text-[#b0b0b0]'
        }
      `}
    >
      {isPro && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
      {isPro ? 'Pro' : 'Free'}
    </span>
  );
}
