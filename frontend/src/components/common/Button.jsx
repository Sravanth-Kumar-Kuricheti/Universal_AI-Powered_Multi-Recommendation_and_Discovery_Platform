import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-[13px] px-4 py-2 rounded-xl gap-2',
    lg: 'text-sm px-6 py-2.5 rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white hover:opacity-95 shadow-sm hover:shadow-purple-glow-sm active:scale-[0.98]',
    secondary: 'bg-[#17102F] text-white hover:bg-[#211040] border border-purple-900/40',
    outline: 'border border-[#DCE0EE] text-[#11152B] bg-white hover:bg-slate-50 hover:border-[#7C22F5] active:scale-[0.98]',
    ghost: 'text-[#667085] hover:text-[#11152B] hover:bg-slate-100/70',
    subtle: 'bg-purple-50 text-[#7C22F5] hover:bg-purple-100',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
