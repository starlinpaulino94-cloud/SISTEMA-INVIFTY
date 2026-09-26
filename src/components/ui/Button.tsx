import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'gold-outline' | 'secondary' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
  }[size];

  const variantStyles = {
    gold: 'bg-[#D6AE36] text-[#111827] font-semibold hover:bg-[#C99B18] shadow-xs border border-[#C99B18]/30 active:bg-[#B88A12]',
    'gold-outline': 'bg-transparent text-[#8A6510] border border-[#D6AE36] hover:bg-[#FFF8DC]',
    secondary: 'bg-white text-slate-700 border border-[#E5E7EB] hover:bg-[#F6F7F9] hover:text-slate-900 shadow-xs',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-[#F1F3F5]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
    dark: 'bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 shadow-xs',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
