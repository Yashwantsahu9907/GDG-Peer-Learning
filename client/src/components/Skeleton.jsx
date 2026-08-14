import React from 'react';

const Skeleton = ({ className = '', type = 'block' }) => {
  const baseClasses = 'bg-slate-200 animate-pulse relative overflow-hidden';
  
  // Shimmer effect
  const shimmer = <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>;

  if (type === 'text') {
    return (
      <div className={`h-4 rounded ${baseClasses} ${className}`}>
        {shimmer}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`rounded-full ${baseClasses} ${className}`}>
        {shimmer}
      </div>
    );
  }

  return (
    <div className={`rounded-lg ${baseClasses} ${className}`}>
      {shimmer}
    </div>
  );
};

export default Skeleton;
