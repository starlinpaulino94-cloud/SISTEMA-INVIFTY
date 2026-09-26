import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'amber' | 'rose' | 'slate' | 'blue' | 'purple';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-[#FFF8DC] text-[#8A6510] border-[#F1DC91]',
    emerald: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    amber: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
    rose: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    slate: 'bg-[#F1F3F5] text-slate-700 border-[#E5E7EB]',
    blue: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  }[variant];

  const dotColor = {
    gold: 'bg-[#D6AE36]',
    emerald: 'bg-[#16A34A]',
    amber: 'bg-[#EA580C]',
    rose: 'bg-[#DC2626]',
    slate: 'bg-slate-400',
    blue: 'bg-[#2563EB]',
    purple: 'bg-[#7C3AED]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{children}</span>
    </span>
  );
};
