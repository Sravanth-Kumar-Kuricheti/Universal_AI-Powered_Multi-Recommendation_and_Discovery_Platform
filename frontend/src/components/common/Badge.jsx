import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  const variantStyles = {
    default: 'bg-purple-50 text-[#7C22F5] border border-purple-100',
    primary: 'bg-[#7C22F5] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    dark: 'bg-[#17102F] text-purple-300 border border-purple-800/40',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
