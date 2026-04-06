export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  className = ''
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-body text-[#b0b0b0] mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-5 py-4
          bg-[#1a1a1a]
          border ${error ? 'border-[#f44336]' : 'border-[#2a2a2a]'}
          rounded-full
          text-white
          font-body
          placeholder-[#6e6e6e]
          focus:outline-none focus:border-[#fd297b]
          transition-colors duration-200
          text-lg
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-[#f44336]">{error}</p>
      )}
    </div>
  );
}
