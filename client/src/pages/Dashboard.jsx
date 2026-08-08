import React from 'react';
import { Calendar, Video, Clock, CheckCircle2, ChevronRight, Activity, Flame, Target } from 'lucide-react';

const Dashboard = () => {
  // Mock Data
  const upcomingSessions = [
    { id: 1, type: 'mentoring', peer: 'Alice Chen', skill: 'React Hooks', time: 'Today, 2:00 PM', avatar: 'AC' },
    { id: 2, type: 'learning', peer: 'David Kumar', skill: 'Docker Basics', time: 'Tomorrow, 10:00 AM', avatar: 'DK' }
  ];

  const requests = [
    { id: 1, peer: 'Sarah Jones', skill: 'Tailwind CSS', status: 'Pending' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome back, Yashwant</h1>
          <p className="text-slate-400">Here's your learning overview for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            Update Schedule
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Sessions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-200">Upcoming Sessions</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">View all</button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {session.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{session.peer}</p>
                        <p className="text-xs text-slate-500">{session.type === 'mentoring' ? 'You are mentoring' : 'You are learning'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {session.skill}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{session.time}</span>
                  </div>
                  
                  <button className="w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 font-medium text-sm hover:bg-blue-500/20 transition-colors flex justify-center items-center gap-2">
                    <Video className="h-4 w-4" /> Join Collab Room
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Skill Matrix */}
          <section>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Skill Matrix</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Target className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-slate-300">Skills I Teach</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'MongoDB', 'Python'].map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-500 text-sm border border-slate-700/50 border-dashed hover:text-slate-300 hover:border-slate-500">
                    + Add
                  </button>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Activity className="h-4 w-4 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-300">Skills I Learn</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Go', 'Kubernetes', 'System Design'].map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-500 text-sm border border-slate-700/50 border-dashed hover:text-slate-300 hover:border-slate-500">
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Stats Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-slate-300">Active Streak</span>
                </div>
                <span className="font-bold text-slate-100">12 Days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-slate-300">Sessions Completed</span>
                </div>
                <span className="font-bold text-slate-100">24</span>
              </div>
            </div>

            {/* Heatmap mock */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-500 mb-2">Activity Heatmap</div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({length: 28}).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.6 ? 'bg-blue-500/80' : Math.random() > 0.3 ? 'bg-blue-500/40' : 'bg-slate-800'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mentorship Requests</h3>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            
            {requests.map(req => (
              <div key={req.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 mb-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-200 text-sm">{req.peer}</span>
                  <span className="text-xs text-slate-500">{req.status}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Wants to learn <span className="text-slate-300 font-medium">{req.skill}</span></p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors">Accept</button>
                  <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium transition-colors">Decline</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
