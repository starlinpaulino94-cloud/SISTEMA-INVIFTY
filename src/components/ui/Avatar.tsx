import React from 'react';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  }[size];

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles} rounded-full object-cover border border-[#E5E7EB] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles} rounded-full bg-[#FFF8DC] border border-[#F1DC91] text-[#8A6510] font-semibold flex items-center justify-center shrink-0 tracking-wider shadow-xs ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
