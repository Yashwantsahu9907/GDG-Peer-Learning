import React, { useState } from 'react';
import { Trophy, Medal, Award, CalendarDays, ExternalLink, Flame, Search, Users, GitMerge, Target } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Campus'); // Global, Campus, Monthly

  // Mock Data aligned with community metrics
  const topMentors = [
    { rank: 1, name: 'Alice Chen', xp: 2450, sessions: 142, helped: 312, problems: 450, avatar: 'AC' },
    { rank: 2, name: 'David Kumar', xp: 2100, sessions: 98, helped: 245, problems: 380, avatar: 'DK' },
    { rank: 3, name: 'Michael Lee', xp: 1850, sessions: 76, helped: 180, problems: 410, avatar: 'ML' },
    { rank: 4, name: 'Sarah Jones', xp: 1600, sessions: 45, helped: 120, problems: 290, avatar: 'SJ' },
    { rank: 5, name: 'Yashwant Sahu', xp: 1450, sessions: 32, helped: 85, problems: 150, avatar: 'YS' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'GDG Web Dev Bootcamp', date: 'Aug 15, 2026', type: 'Workshop' },
    { id: 2, title: 'Hackathon 2026 Kickoff', date: 'Sep 01, 2026', type: 'Event' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-200"><Trophy className="h-4 w-4 text-yellow-600" /></div>;
      case 2: return <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200"><Medal className="h-4 w-4 text-slate-500" /></div>;
      case 3: return <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-200"><Medal className="h-4 w-4 text-orange-700" /></div>;
      default: return <span className="font-bold text-[var(--color-text-secondary)] w-8 text-center block text-sm">{rank}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Main Leaderboard */}
      <div className="lg:w-2/3 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-2 tracking-tight">Leaderboard</h1>
            <p className="text-[var(--color-text-secondary)]">Top contributors and peer mentors.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-[var(--color-bg-secondary)] p-1 rounded-lg border border-[var(--color-border)] self-start sm:self-auto shadow-sm">
            {['Global', 'Campus', 'Monthly'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-[var(--color-text-primary)] shadow-sm' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-flat overflow-hidden">
          
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search peers..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] w-64 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-secondary)] text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border)]">
                  <th className="px-6 py-3 text-center w-16">Rank</th>
                  <th className="px-6 py-3">Developer</th>
                  <th className="px-4 py-3 text-center">Sessions</th>
                  <th className="px-4 py-3 text-center">Peers Helped</th>
                  <th className="px-4 py-3 text-center">Problems</th>
                  <th className="px-6 py-3 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-white">
                {topMentors.map((mentor, index) => (
                  <tr 
                    key={index} 
                    className={`transition-colors ${mentor.name === 'Yashwant Sahu' ? 'bg-[var(--color-accent-light)]/30' : 'hover:bg-[var(--color-bg-secondary)]/50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        {getRankIcon(mentor.rank)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${mentor.rank === 1 ? 'bg-gradient-to-tr from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200' : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)]'}`}>
                          {mentor.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-2">
                            {mentor.name}
                            {mentor.name === 'Yashwant Sahu' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)] uppercase tracking-wider">You</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-sm">{mentor.sessions}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-60">Hosted</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-sm">{mentor.helped}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-60">Helped</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-sm">{mentor.problems}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-60">Solved</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-[var(--color-success)] text-base">
                        {mentor.xp.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar - GDG Events */}
      <div className="lg:w-1/3 space-y-6">
        <div className="panel-flat p-6 relative overflow-hidden">
          
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[var(--color-accent)]" /> GDG Events
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="group p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-white transition-colors cursor-pointer shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] uppercase tracking-wider">
                    {event.type}
                  </span>
                  <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1 leading-tight">{event.title}</h3>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)]">{event.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 text-xs text-[var(--color-accent)] hover:text-white font-bold border border-[var(--color-accent)] hover:bg-[var(--color-accent)] rounded-lg transition-colors bg-white uppercase tracking-wider">
            View All Events
          </button>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
