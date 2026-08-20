import React from'react';
import { Link } from'react-router-dom';

const conversationsMock = [
 { id:'1', title:'General Study Group', lastMessage:'Let\'s meet tomorrow', unread: 2 },
 { id:'2', title:'React Help', lastMessage:'Check the hooks docs', unread: 0 },
];

const Conversations = () => {
 return (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="md:col-span-1 leetcode-card p-4">
 <div className="flex justify-between items-center mb-4">
 <h3 className="font-semibold">Conversations</h3>
 <button className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">New</button>
 </div>
 <ul className="space-y-3">
 {conversationsMock.map(c => (
 <li key={c.id} className="p-3 rounded hover:bg-slate-50">
 <Link to={`/conversations/${c.id}`} className="flex justify-between items-center">
 <div>
 <div className="font-medium">{c.title}</div>
 <div className="text-sm text-slate-500">{c.lastMessage}</div>
 </div>
 {c.unread > 0 && <div className="text-xs bg-red-500 text-white rounded-full px-2">{c.unread}</div>}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div className="md:col-span-2 leetcode-card p-6">
 <h3 className="font-semibold mb-4">Select a conversation to view messages</h3>
 <p className="text-sm text-slate-500">Or create a new conversation to start chatting.</p>
 </div>
 </div>
 );
};

export default Conversations;
