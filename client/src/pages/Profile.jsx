import React from 'react';
import { getStoredUser } from '../utils/userClient';
import { Settings, MapPin, Link as LinkIcon, Code, MessageCircle, Clock, Video, Target, Flame, Activity, Users, GitMerge } from 'lucide-react';

const Profile = () => {
  const user = getStoredUser() || { name: 'Yashwant Sahu', email: 'yashwant@example.com' };

  // Generate heatmap data
  const heatmapData = Array.from({ length: 52 * 7 }).map(() => {
    const r = Math.random();
    if (r > 0.95) return 4;
    if (r > 0.8) return 3;
    if (r > 0.6) return 2;
    if (r > 0.3) return 1;
    return 0;
  });

  const getColorClass = (level) => {
    switch(level) {
      case 4: return 'bg-[#216e39]'; // GitHub darkest green
      case 3: return 'bg-[#30a14e]';
      case 2: return 'bg-[#40c463]';
      case 1: return 'bg-[#9be9a8]';
      default: return 'bg-[#ebedf0]'; // GitHub empty
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Profile Header (Developer Identity) */}
      <div className="flex flex-col sm:flex-row gap-8 sm:items-start relative pb-8 border-b border-[var(--color-border)]">
        <button className="absolute top-0 right-0 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors border border-[var(--color-border)] shadow-sm">
          <Settings className="h-4 w-4" />
        </button>

        <div className="h-32 w-32 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center text-[var(--color-text-primary)] font-bold text-5xl shrink-0 border border-[var(--color-border)] shadow-sm">
          {user.name?.[0] || 'Y'}
        </div>
        
        <div className="flex-1 pt-2">
          <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-1 tracking-tight">{user.name || 'Yashwant Sahu'}</h1>
          <p className="text-[var(--color-text-secondary)] text-lg mb-4">@yashwantsahu9907</p>
          
          <p className="text-[var(--color-text-primary)] max-w-2xl mb-5 text-base leading-relaxed">
            Full-stack developer passionate about open source and systems design. Learning Rust and Kubernetes. Always happy to pair program!
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> India</div>
            <a href="#" className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors"><LinkIcon className="h-4 w-4" /> yashwant.dev</a>
            <a href="#" className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors"><Code className="h-4 w-4" /> GitHub</a>
            <a href="#" className="flex items-center gap-1.5 hover:text-[#1DA1F2] transition-colors"><MessageCircle className="h-4 w-4" /> Twitter</a>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Heatmap */}
          <div className="panel-flat p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Learning Activity</h2>
              <span className="text-sm text-[var(--color-text-secondary)] font-medium">841 contributions in the last year</span>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar pb-2">
              <div className="inline-grid grid-rows-7 grid-flow-col gap-1">
                {heatmapData.map((level, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${getColorClass(level)}`} title={`${level} contributions on this day`}></div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[#ebedf0]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#9be9a8]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#40c463]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#30a14e]"></div>
                <div className="w-3 h-3 rounded-sm bg-[#216e39]"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="panel-flat p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-[var(--color-success)]" />
                <h3 className="font-bold text-[var(--color-text-primary)] text-base">I Can Teach</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-semibold border border-[var(--color-border)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="panel-flat p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-[var(--color-accent)]" />
                <h3 className="font-bold text-[var(--color-text-primary)] text-base">I Want To Learn</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Rust', 'Go', 'Kubernetes', 'Web3', 'System Design'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-semibold border border-[var(--color-border)] border-dashed">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
               <div className="panel-flat p-4 flex gap-4">
                 <div className="mt-1"><GitMerge className="h-5 w-5 text-[var(--color-accent)]" /></div>
                 <div>
                   <p className="text-sm text-[var(--color-text-primary)] font-medium">Helped <span className="font-bold">Kunal Verma</span> debug a React component rendering issue.</p>
                   <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-mono">2 days ago</p>
                 </div>
               </div>
               <div className="panel-flat p-4 flex gap-4">
                 <div className="mt-1"><Users className="h-5 w-5 text-[var(--color-success)]" /></div>
                 <div>
                   <p className="text-sm text-[var(--color-text-primary)] font-medium">Hosted session: <span className="font-bold">Mastering Graph Algorithms</span> with 12 participants.</p>
                   <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-mono">4 days ago</p>
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column (Stats) */}
        <div className="space-y-6">
          <div className="panel-flat p-6">
            <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-6">Career Stats</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[var(--color-text-primary)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">1,248</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Hours Learned</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Video className="h-5 w-5 text-[var(--color-text-primary)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">142</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Sessions Hosted</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <GitMerge className="h-5 w-5 text-[var(--color-text-primary)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">312</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Peers Helped</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">14 Day</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Current Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;

