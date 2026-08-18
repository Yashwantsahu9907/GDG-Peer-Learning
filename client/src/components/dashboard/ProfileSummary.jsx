import React from 'react';

const ProfileSummary = () => {
  return (
    <div className="p-5 gfg-panel">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
        Profile Summary
      </h2>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Skills
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            React, JavaScript, Tailwind CSS
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Learning Goal
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            Full Stack Development
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Sessions Completed
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            24
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;