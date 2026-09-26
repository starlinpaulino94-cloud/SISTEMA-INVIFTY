import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#E5E7EB] shadow-xs',
    elevated: 'bg-white border border-[#E5E7EB] shadow-sm',
    glass: 'bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-xs',
    highlight: 'bg-white border border-[#F1DC91] shadow-xs ring-1 ring-[#FFF8DC]',
  }[variant];

  return (
    <div className={`rounded-2xl p-5 ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
