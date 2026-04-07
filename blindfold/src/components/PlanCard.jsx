export default function PlanCard({ name, price, features, limitations, selected, onClick, highlighted }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200
        ${selected
          ? 'border-[#fd297b] bg-[#1a1a1a]'
          : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
        }
        ${highlighted ? 'ring-2 ring-[#fd297b]/30' : ''}
      `}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-lg font-heading text-white mb-1">{name}</h3>
        {price && (
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-heading text-white">{price}</span>
            <span className="text-[#6e6e6e] text-sm">/month</span>
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#fd297b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#b0b0b0]">{feature}</span>
          </li>
        ))}
        {limitations && limitations.map((limitation, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#6e6e6e] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#6e6e6e]">{limitation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
