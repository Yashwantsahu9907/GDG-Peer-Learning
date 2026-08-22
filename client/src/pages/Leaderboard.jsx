import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, CalendarDays, ExternalLink, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

const Leaderboard = () => {
  const [topMentors, setTopMentors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard`);
        const data = await res.json();
        if (data.success) {
          const formatted = data.leaderboard.map((m, i) => ({
            rank: i + 1,
            name: m.name,
            score: m.gdgCoins,
            streak: m.streak || 1,
            badges: [m.role === 'Mentor' ? 'Top Mentor' : 'Contributor'],
            avatar: m.name.substring(0, 2).toUpperCase(),
          }));
          setTopMentors(formatted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaderboard();
  }, []);

  const upcomingEvents = [
    { id: 1, title: 'GDG Web Dev Bootcamp', date: 'Aug 15, 2026', type: 'Workshop' },
    { id: 2, title: 'Hackathon 2026 Kickoff', date: 'Sep 01, 2026', type: 'Event' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-[var(--color-text-primary)]" />;
      case 3: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <span className="font-bold text-[var(--color-text-muted)] w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8">
      
      {/* Main Leaderboard */}
      <div className="lg:w-2/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Campus Leaderboard</h1>
          <p className="text-[var(--color-text-secondary)]">Top contributors and peer mentors for this month.</p>
        </div>

        <div className="gfg-panel overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-7 sm:col-span-5">Peer</div>
            <div className="col-span-3 sm:col-span-2 text-center">Streak</div>
            <div className="hidden sm:block col-span-3">Badges</div>
            <div className="col-span-3 sm:col-span-1 text-right">Coins</div>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {topMentors.map((mentor, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${user?.name === mentor.name ? 'bg-[var(--color-accent-light)] border-l-4 border-l-[var(--color-accent)]' : 'hover:bg-[var(--color-bg-tertiary)]'}`}
              >
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  {getRankIcon(mentor.rank)}
                </div>
                
                <div className="col-span-7 sm:col-span-5 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${mentor.rank === 1 ? 'bg-gradient-to-tr from-yellow-500 to-amber-600' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)]'}`}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-text-primary)]">{mentor.name}</div>
                    {user?.name === mentor.name && <div className="text-xs font-semibold text-[var(--color-accent)]">You</div>}
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-1 text-[var(--color-text-secondary)]">
                  <Flame className={`h-4 w-4 ${mentor.streak > 10 ? 'text-orange-500' : 'text-[var(--color-text-muted)]'}`} />
                  <span className="font-bold">{mentor.streak}</span>
                </div>

                <div className="hidden sm:flex col-span-3 flex-wrap gap-1">
                  {mentor.badges.map((badge, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                      <Award className="h-3 w-3" /> {badge}
                    </span>
                  ))}
                </div>

                <div className="col-span-3 sm:col-span-1 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {mentor.score}
                </div>
              </div>
            ))}
            {topMentors.length === 0 && (
              <div className="p-8 text-center text-[var(--color-text-muted)]">
                Loading leaderboard...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - GDG Events */}
      <div className="lg:w-1/3 space-y-6">
        <div className="gfg-panel p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[var(--color-accent)]" /> GDG Events
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="group p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-muted)]">
                    {event.type}
                  </span>
                  <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{event.title}</h3>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">{event.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[var(--color-accent)] hover:text-white font-bold border border-[var(--color-accent)] hover:bg-[var(--color-accent)] rounded-lg transition-colors bg-[var(--color-accent-light)]">
            View All Events
          </button>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
