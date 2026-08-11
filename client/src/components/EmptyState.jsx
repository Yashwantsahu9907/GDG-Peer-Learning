import React from 'react';
import { Layers } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Layers, 
  title = "No data found", 
  description = "Get started by creating something new.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg-secondary)]">
      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 border border-[var(--color-border)]">
        <Icon className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-white border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
