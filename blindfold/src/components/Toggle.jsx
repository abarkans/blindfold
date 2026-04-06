export default function Toggle({
  label,
  checked,
  onChange,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-full flex items-center justify-between
        p-4 rounded-2xl
        bg-[#1a1a1a] border border-[#2a2a2a]
        hover:border-[#fd297b]
        transition-all duration-200
        ${className}
      `}
    >
      <span className="font-body text-white">{label}</span>
      <div className={`
        w-14 h-8 rounded-full
        transition-colors duration-200
        ${checked ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b]' : 'bg-[#2a2a2a]'}
      `}>
        <div className={`
          w-6 h-6 bg-white rounded-full shadow-md
          transform transition-transform duration-200
          ${checked ? 'translate-x-7' : 'translate-x-1'}
          mt-1
        `} />
      </div>
    </button>
  );
}
