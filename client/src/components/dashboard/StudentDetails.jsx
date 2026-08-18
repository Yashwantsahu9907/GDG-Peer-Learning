import React from 'react';

const StudentDetails = () => {
  return (
    <div className="p-5 gfg-panel">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
        Student Details
      </h2>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Name
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            Yashwant
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Branch
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            Electronics & Telecommunication Engineering
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Year
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            2nd Year
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;