import React, { useState } from 'react';
import { MessageSquare, Coins, CheckCircle, Clock, Plus, Tag } from 'lucide-react';

const Bounties = () => {
  const [filter, setFilter] = useState('All');
  
  // Mock Data
  const bounties = [
    { id: 1, title: 'Need help debugging React useEffect infinite loop', author: 'John Doe', time: '2h ago', status: 'Open', reward: 50, tags: ['React', 'Hooks'], replies: 2 },
    { id: 2, title: 'How to structure a scalable Next.js project?', author: 'Emma Smith', time: '5h ago', status: 'In Progress', reward: 100, tags: ['Next.js', 'Architecture'], replies: 5 },
    { id: 3, title: 'Python Pandas merge returning duplicate rows', author: 'Alex Wang', time: '1d ago', status: 'Solved', reward: 30, tags: ['Python', 'Pandas'], replies: 1 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Doubt Bounties</h1>
          <p className="text-slate-400">Earn GDG Coins by solving peer issues, or post your own.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" /> Post a Bounty
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-4 overflow-x-auto hide-scrollbar">
        {['All', 'Open', 'In Progress', 'Solved'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400 hover:bg-slate-900 border border-transparent'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {bounties.filter(b => filter === 'All' || b.status === filter).map(bounty => (
          <div key={bounty.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 card-hover flex flex-col sm:flex-row gap-4 sm:items-center">
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                  bounty.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  bounty.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {bounty.status}
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {bounty.time} by {bounty.author}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2 hover:text-blue-400 cursor-pointer transition-colors">{bounty.title}</h3>
              <div className="flex gap-2">
                {bounty.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold">
                <Coins className="h-4 w-4" />
                {bounty.reward}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <MessageSquare className="h-4 w-4" />
                <span>{bounty.replies} Replies</span>
              </div>
            </div>

          </div>
        ))}

        {bounties.filter(b => filter === 'All' || b.status === filter).length === 0 && (
          <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl">
            <CheckCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-300">No {filter.toLowerCase()} bounties found</h3>
            <p className="text-slate-500 mt-1">Check back later or post your own.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bounties;
