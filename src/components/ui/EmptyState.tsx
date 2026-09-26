import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white ${className}`}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#D6AE36] mb-4 shadow-xs">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 font-heading">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="gold" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
