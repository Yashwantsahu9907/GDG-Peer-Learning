import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const items = [
    { id: 1, text: 'Alice mentioned you in React Help' },
    { id: 2, text: 'New message in General Study Group' },
  ];

  return (
    <div className="relative">
      <button className="p-2 rounded-full text-slate-600 hover:bg-slate-100">
        <Bell className="h-5 w-5" />
      </button>
      <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-2">
        <h4 className="text-sm font-medium mb-2">Notifications</h4>
        <ul className="text-sm text-slate-600">
          {items.map(i => (
            <li key={i.id} className="px-2 py-1 hover:bg-slate-50 rounded">{i.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
