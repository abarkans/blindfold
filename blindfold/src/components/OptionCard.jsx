export default function OptionCard({
  label,
  description,
  selected = false,
  onClick,
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-5 rounded-2xl
        text-left
        transition-all duration-200
        ${selected
          ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white border-0 shadow-lg shadow-[#fd297b]/30'
          : 'bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:border-[#fd297b]'
        }
        ${className}
      `}
    >
      <div className="font-heading text-lg font-semibold">{label}</div>
      {description && (
        <div className={`mt-1 text-sm font-body ${selected ? 'text-white/80' : 'text-[#b0b0b0]'}`}>
          {description}
        </div>
      )}
    </button>
  );
}
