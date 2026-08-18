import React from 'react';
import { Calendar, Video, Clock, CheckCircle2, ChevronRight, Activity, Flame, Target } from 'lucide-react';
import StudentDetails from '../components/dashboard/StudentDetails';
import ProfileSummary from '../components/dashboard/ProfileSummary';
import CurrentStreak from "../components/dashboard/CurrentStreak";

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
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome back, Yashwant</h1>
          <p className="text-[var(--color-text-secondary)]">Here's your learning overview for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors">
            Update Schedule
          </button>
        </div>
      </div>
      <StudentDetails />
      <ProfileSummary />
      <CurrentStreak />
    

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Sessions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Upcoming Sessions</h2>
              <button className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">View all</button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-5 gfg-panel card-hover flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                        {session.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{session.peer}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{session.type === 'mentoring' ? 'You are mentoring' : 'You are learning'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)]">
                      {session.skill}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
                    <Clock className="h-4 w-4 text-[var(--color-accent)]" />
                    <span>{session.time}</span>
                  </div>
                  
                  <button className="w-full py-2 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent)] font-semibold text-sm hover:bg-[var(--color-accent)] hover:text-white transition-colors flex justify-center items-center gap-2">
                    <Video className="h-4 w-4" /> Join Collab Room
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Skill Matrix */}
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Skill Matrix</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 gfg-panel card-hover">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Target className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-[var(--color-text-primary)]">Skills I Teach</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'MongoDB', 'Python'].map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border)]">
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1 rounded-full bg-transparent text-[var(--color-text-muted)] text-sm border border-[var(--color-border)] border-dashed hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors">
                    + Add
                  </button>
                </div>
              </div>
              
              <div className="p-5 gfg-panel card-hover">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center border border-[var(--color-border)]">
                    <Activity className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-[var(--color-text-primary)]">Skills I Learn</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Go', 'Kubernetes', 'System Design'].map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border)]">
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1 rounded-full bg-transparent text-[var(--color-text-muted)] text-sm border border-[var(--color-border)] border-dashed hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors">
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
          <div className="p-5 gfg-panel">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Your Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-[var(--color-text-primary)] font-medium">Active Streak</span>
                </div>
                <span className="font-bold text-orange-500">12 Days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text-primary)] font-medium">Sessions Completed</span>
                </div>
                <span className="font-bold text-[var(--color-text-primary)]">24</span>
              </div>
            </div>

            {/* Heatmap mock */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <div className="text-xs text-[var(--color-text-secondary)] mb-2 font-semibold">Activity Heatmap</div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({length: 28}).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.6 ? 'bg-[var(--color-accent)]' : Math.random() > 0.3 ? 'bg-[var(--color-accent-light)] border border-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)]'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="p-5 gfg-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Mentorship Requests</h3>
              <span className="bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            
            {requests.map(req => (
              <div key={req.id} className="p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] mb-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[var(--color-text-primary)] text-sm">{req.peer}</span>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">{req.status}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">Wants to learn <span className="text-[var(--color-text-primary)] font-bold">{req.skill}</span></p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md text-xs font-semibold transition-colors">Accept</button>
                  <button className="flex-1 py-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-md text-xs font-semibold transition-colors">Decline</button>
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
