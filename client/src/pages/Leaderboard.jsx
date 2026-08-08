import React from 'react';
import { Trophy, Medal, Award, CalendarDays, ExternalLink, Flame } from 'lucide-react';

const Leaderboard = () => {
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
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-slate-300" />;
      case 3: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <span className="font-bold text-slate-500 w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Main Leaderboard */}
      <div className="lg:w-2/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Campus Leaderboard</h1>
          <p className="text-slate-400">Top contributors and peer mentors for this month.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-7 sm:col-span-5">Peer</div>
            <div className="col-span-3 sm:col-span-2 text-center">Streak</div>
            <div className="hidden sm:block col-span-3">Badges</div>
            <div className="col-span-3 sm:col-span-1 text-right">Score</div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {topMentors.map((mentor, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${mentor.name === 'Yashwant Sahu' ? 'bg-blue-900/10 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/30'}`}
              >
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  {getRankIcon(mentor.rank)}
                </div>
                
                <div className="col-span-7 sm:col-span-5 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${mentor.rank === 1 ? 'bg-gradient-to-tr from-yellow-500 to-amber-600' : 'bg-slate-700'}`}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{mentor.name}</div>
                    {mentor.name === 'Yashwant Sahu' && <div className="text-xs text-blue-400">You</div>}
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-1 text-slate-300">
                  <Flame className={`h-4 w-4 ${mentor.streak > 10 ? 'text-orange-500' : 'text-slate-500'}`} />
                  <span className="font-medium">{mentor.streak}</span>
                </div>

                <div className="hidden sm:flex col-span-3 flex-wrap gap-1">
                  {mentor.badges.map((badge, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs flex items-center gap-1 whitespace-nowrap">
                      <Award className="h-3 w-3" /> {badge}
                    </span>
                  ))}
                </div>

                <div className="col-span-3 sm:col-span-1 text-right font-bold text-emerald-400">
                  {mentor.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - GDG Events */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          
          <h2 className="text-xl font-semibold text-slate-200 mb-5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" /> GDG Events
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="group p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {event.type}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-200 mb-1">{event.title}</h3>
                <p className="text-sm text-slate-500">{event.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium border border-blue-500/20 hover:border-blue-500/40 rounded-lg transition-colors bg-blue-500/5">
            View All Events
          </button>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
