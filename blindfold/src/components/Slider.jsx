export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  className = ''
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        {label && (
          <label className="text-sm font-body text-[#b0b0b0]">
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent font-bold">
            {valuePrefix}{value}{valueSuffix}
          </span>
        )}
      </div>
      <div className="relative w-full h-4 bg-[#2a2a2a] rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            absolute w-full h-full
            opacity-0 cursor-pointer
          "
        />
        <div
          className="absolute w-7 h-7 bg-white rounded-full shadow-lg transform -translate-y-1/2 top-1/2 pointer-events-none transition-all duration-100 border-4 border-[#fd297b]"
          style={{ left: `calc(${percentage}% - 14px)` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-xs font-body text-[#6e6e6e]">
        <span>{valuePrefix}{min}{valueSuffix}</span>
        <span>{valuePrefix}{max}{valueSuffix}</span>
      </div>
    </div>
  );
}
