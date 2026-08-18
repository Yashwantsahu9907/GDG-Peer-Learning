import React from 'react';

const CurrentStreak = () => {
  return (
    <div className="p-5 gfg-panel">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
        Current Streak
      </h2>

      <div>
        <p className="text-3xl font-bold text-[var(--color-text-primary)]">
          12 Days
        </p>

        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Keep learning every day!
        </p>
      </div>
    </div>
  );
};

export default CurrentStreak;