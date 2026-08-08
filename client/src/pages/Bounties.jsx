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
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Doubt Bounties</h1>
          <p className="text-[var(--color-text-secondary)]">Earn GDG Coins by solving peer issues, or post your own.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" /> Post a Bounty
        </button>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border)] pb-4 overflow-x-auto hide-scrollbar">
        {['All', 'Open', 'In Progress', 'Solved'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${filter === f ? 'bg-[var(--color-bg-secondary)] text-[var(--color-accent)] border border-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] border border-transparent'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {bounties.filter(b => filter === 'All' || b.status === filter).map(bounty => (
          <div key={bounty.id} className="p-5 gfg-panel card-hover flex flex-col sm:flex-row gap-4 sm:items-center">
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                  bounty.status === 'Open' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                  bounty.status === 'In Progress' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' : 
                  'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                }`}>
                  {bounty.status}
                </span>
                <span className="text-[var(--color-text-muted)] text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {bounty.time} by {bounty.author}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 hover:text-[var(--color-accent)] cursor-pointer transition-colors">{bounty.title}</h3>
              <div className="flex gap-2">
                {bounty.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center gap-1 font-medium">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-[var(--color-border)] pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 font-bold">
                <Coins className="h-4 w-4" />
                {bounty.reward}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] font-semibold">
                <MessageSquare className="h-4 w-4" />
                <span>{bounty.replies} Replies</span>
              </div>
            </div>

          </div>
        ))}

        {bounties.filter(b => filter === 'All' || b.status === filter).length === 0 && (
          <div className="py-12 text-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg-secondary)]">
            <CheckCircle className="h-10 w-10 text-[var(--color-text-muted)] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No {filter.toLowerCase()} bounties found</h3>
            <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Check back later or post your own.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bounties;
