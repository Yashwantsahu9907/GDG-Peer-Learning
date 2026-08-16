import React from 'react';
import { getStoredUser } from '../utils/userClient';

const Profile = () => {
  const user = getStoredUser() || { name: 'Guest', email: '' };

  return (
    <div className="leetcode-card p-6">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
          {user.name?.[0] || 'G'}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{user.name || 'Guest'}</h2>
          <p className="text-sm text-slate-500">{user.email || 'Not provided'}</p>
          <div className="mt-4 flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">Edit Profile</button>
            <button className="px-3 py-2 border rounded-md">Followers 0</button>
            <button className="px-3 py-2 border rounded-md">Following 0</button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-medium text-slate-800">About</h3>
        <p className="mt-2 text-sm text-slate-600">This is a placeholder profile UI. Add editable fields and connections here.</p>
      </section>
    </div>
  );
};

export default Profile;
