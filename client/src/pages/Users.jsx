import React from'react';

const usersMock = [
 { id: 1, name:'Alice', bio:'Frontend engineer' },
 { id: 2, name:'Bob', bio:'Backend enthusiast' },
];

const Users = () => {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {usersMock.map(u => (
 <div key={u.id} className="leetcode-card p-4">
 <div className="flex justify-between items-center">
 <div>
 <div className="font-medium">{u.name}</div>
 <div className="text-sm text-slate-500">{u.bio}</div>
 </div>
 <div className="flex items-center gap-2">
 <button className="px-3 py-1 bg-indigo-600 text-white rounded">Follow</button>
 </div>
 </div>
 </div>
 ))}
 </div>
 );
};

export default Users;
