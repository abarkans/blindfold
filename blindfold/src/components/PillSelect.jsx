export default function PillSelect({
  options = [],
  selected = [],
  onChange,
  multiSelect = true,
  className = ''
}) {
  const handleSelect = (optionId) => {
    if (multiSelect) {
      if (selected.includes(optionId)) {
        onChange(selected.filter(id => id !== optionId));
      } else {
        onChange([...selected, optionId]);
      }
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`
              px-5 py-2.5 rounded-full
              font-body text-sm font-semibold
              transition-all duration-200
              ${isSelected
                ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white shadow-lg shadow-[#fd297b]/30'
                : 'bg-[#1a1a1a] text-[#b0b0b0] border border-[#2a2a2a] hover:border-[#fd297b]'
              }
            `}
          >
            {option.icon && <span className="mr-1.5">{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
