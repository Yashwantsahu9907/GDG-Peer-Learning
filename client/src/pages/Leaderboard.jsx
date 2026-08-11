import React, { useState } from 'react';
import { Trophy, Medal, Award, CalendarDays, ExternalLink, Flame, Search } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Campus'); // Global, Campus, Monthly

  // Mock Data
  const topMentors = [
    { rank: 1, name: 'Alice Chen', score: 2450, streak: 45, badges: ['Top Mentor', 'React Pro'], avatar: 'AC' },
    { rank: 2, name: 'David Kumar', score: 2100, streak: 30, badges: ['Algorithm Expert'], avatar: 'DK' },
    { rank: 3, name: 'Michael Lee', score: 1850, streak: 12, badges: ['Backend Ninja'], avatar: 'ML' },
    { rank: 4, name: 'Sarah Jones', score: 1600, streak: 8, badges: ['UI Designer'], avatar: 'SJ' },
    { rank: 5, name: 'Yashwant Sahu', score: 1450, streak: 12, badges: ['Rising Star'], avatar: 'YS' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'GDG Web Dev Bootcamp', date: 'Aug 15, 2026', type: 'Workshop' },
    { id: 2, title: 'Hackathon 2026 Kickoff', date: 'Sep 01, 2026', type: 'Event' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center"><Trophy className="h-4 w-4 text-yellow-600" /></div>;
      case 2: return <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><Medal className="h-4 w-4 text-slate-600" /></div>;
      case 3: return <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center"><Medal className="h-4 w-4 text-orange-700" /></div>;
      default: return <span className="font-bold text-[var(--color-text-secondary)] w-8 text-center block">{rank}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Main Leaderboard */}
      <div className="lg:w-2/3 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Leaderboard</h1>
            <p className="text-[var(--color-text-secondary)]">Top contributors and peer mentors.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-[var(--color-bg-secondary)] p-1 rounded-lg border border-[var(--color-border)] self-start sm:self-auto">
            {['Global', 'Campus', 'Monthly'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
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

        <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
          
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
                <tr className="bg-[var(--color-bg-secondary)] text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border)]">
                  <th className="px-6 py-3 font-semibold text-center w-24">Rank</th>
                  <th className="px-6 py-3 font-semibold">Peer</th>
                  <th className="px-6 py-3 font-semibold text-center">Streak</th>
                  <th className="px-6 py-3 font-semibold hidden sm:table-cell">Badges</th>
                  <th className="px-6 py-3 font-semibold text-right">Score</th>
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
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${mentor.rank === 1 ? 'bg-gradient-to-tr from-yellow-500 to-amber-600' : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)]'}`}>
                          {mentor.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            {mentor.name}
                            {mentor.name === 'Yashwant Sahu' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)] uppercase tracking-wider">You</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[var(--color-text-secondary)]">
                        <Flame className={`h-4 w-4 ${mentor.streak > 10 ? 'text-orange-500' : 'text-[var(--color-text-muted)]'}`} />
                        <span className="font-bold">{mentor.streak}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.badges.map((badge, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] text-[11px] font-semibold flex items-center gap-1.5">
                            <Award className="h-3 w-3 text-[var(--color-accent)]" /> {badge}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-[var(--color-success)] text-lg">
                        {mentor.score.toLocaleString()}
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
        <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 relative overflow-hidden">
          
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[var(--color-accent)]" /> GDG Events
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="group p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-white transition-colors cursor-pointer shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-muted)] uppercase tracking-wider">
                    {event.type}
                  </span>
                  <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1 leading-tight">{event.title}</h3>
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">{event.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 text-sm text-[var(--color-accent)] hover:text-white font-bold border border-[var(--color-accent)] hover:bg-[var(--color-accent)] rounded-lg transition-colors bg-[var(--color-accent-light)]">
            View All Events
          </button>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
