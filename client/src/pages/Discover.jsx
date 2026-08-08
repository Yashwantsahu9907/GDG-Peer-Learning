import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Video, Grid, List } from 'lucide-react';

const Discover = () => {
  const [view, setView] = useState('grid');
  
  // Mock Data
  const mentors = [
    { id: 1, name: 'Alice Chen', role: 'Senior CS Student', skills: ['React', 'Node.js', 'System Design'], rating: 4.9, match: 95, availability: ['Today 2-4PM', 'Tomorrow 10AM-12PM'], avatar: 'AC' },
    { id: 2, name: 'David Kumar', role: 'GDG Lead', skills: ['Python', 'Machine Learning', 'Data Structures'], rating: 4.8, match: 88, availability: ['Wed 3-5PM'], avatar: 'DK' },
    { id: 3, name: 'Sarah Jones', role: 'Frontend Specialist', skills: ['Vue', 'Tailwind CSS', 'Figma'], rating: 4.7, match: 82, availability: ['Thu 1-3PM', 'Fri 10AM-12PM'], avatar: 'SJ' },
    { id: 4, name: 'Michael Lee', role: 'Backend Dev', skills: ['Go', 'Docker', 'Kubernetes'], rating: 4.9, match: 91, availability: ['Mon 9-11AM'], avatar: 'ML' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Find a Peer Mentor</h1>
          <p className="text-slate-400">Discover students who can help you master your next skill.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
              <Grid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by skills, names, or roles..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg hover:border-slate-600 transition-colors">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Grid View */}
      <div className={`grid gap-6 ${view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {mentors.map(mentor => (
          <div key={mentor.id} className={`bg-slate-900 border border-slate-800 rounded-xl p-5 flex ${view === 'grid' ? 'flex-col' : 'flex-col sm:flex-row gap-6 items-start'} card-hover`}>
            
            <div className={`flex items-start gap-4 ${view === 'grid' ? 'mb-4' : 'w-1/3'}`}>
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {mentor.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-lg">{mentor.name}</h3>
                <p className="text-sm text-slate-400">{mentor.role}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    {mentor.rating}
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {mentor.match}% Match
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex flex-col flex-grow ${view === 'grid' ? '' : 'w-2/3'}`}>
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Skills Taught</div>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>{mentor.availability[0]}</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Request Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
