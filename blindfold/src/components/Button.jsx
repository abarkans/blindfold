export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'font-body font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#F5A623] text-[#0F0F0F] hover:bg-[#D48D1B] active:scale-[0.98]',
    secondary: 'bg-[#252525] text-[#FAFAFA] hover:bg-[#2A2A2A] border border-[#2A2A2A]',
    ghost: 'bg-transparent text-[#FAFAFA] hover:bg-[#1A1A1A]',
    outline: 'bg-transparent text-[#F5A623] border border-[#F5A623] hover:bg-[#F5A623] hover:text-[#0F0F0F]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
