export default function CategoryBadge({ category, size = 'md' }) {
  const categoryStyles = {
    'Outdoors': 'from-green-500 to-emerald-600',
    'Food & Drink': 'from-orange-500 to-amber-600',
    'Arts & Culture': 'from-purple-500 to-violet-600',
    'Active & Sport': 'from-red-500 to-rose-600',
    'Cozy & Homey': 'from-amber-600 to-yellow-700',
    'Nightlife': 'from-indigo-500 to-purple-600'
  };

  const gradient = categoryStyles[category] || 'from-gray-600 to-gray-700';

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center
      bg-gradient-to-r ${gradient}
      text-white
      font-body font-semibold
      rounded-full
      ${sizes[size]}
    `}>
      {category}
    </span>
  );
}
