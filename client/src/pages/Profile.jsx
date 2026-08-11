import React from 'react';
import { getStoredUser } from '../utils/userClient';
import { Settings, MapPin, Link as LinkIcon, Code, MessageCircle, Clock, Video, Target, Flame, Activity } from 'lucide-react';

const Profile = () => {
  const user = getStoredUser() || { name: 'Yashwant Sahu', email: 'yashwant@example.com' };

  // Generate heatmap data
  const heatmapData = Array.from({ length: 52 * 7 }).map(() => {
    const r = Math.random();
    if (r > 0.8) return 4;
    if (r > 0.6) return 3;
    if (r > 0.4) return 2;
    if (r > 0.2) return 1;
    return 0;
  });

  const getColorClass = (level) => {
    switch(level) {
      case 4: return 'bg-[var(--color-success)]';
      case 3: return 'bg-green-500';
      case 2: return 'bg-green-300';
      case 1: return 'bg-green-100';
      default: return 'bg-[var(--color-bg-secondary)]';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Profile Header */}
      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-start relative shadow-sm">
        <button className="absolute top-6 right-6 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors border border-[var(--color-border)]">
          <Settings className="h-4 w-4" />
        </button>

        <div className="h-28 w-28 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] font-bold text-4xl shrink-0 border-2 border-white shadow-md">
          {user.name?.[0] || 'Y'}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{user.name || 'Yashwant Sahu'}</h1>
          <p className="text-[var(--color-text-secondary)] font-mono text-sm mb-4">@yashwantsahu9907</p>
          
          <p className="text-[var(--color-text-primary)] max-w-2xl mb-4 text-sm leading-relaxed">
            Full-stack developer passionate about open source and systems design. Learning Rust and Kubernetes. Always happy to pair program!
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> India</div>
            <div className="flex items-center gap-1 hover:text-[var(--color-accent)] cursor-pointer"><LinkIcon className="h-3.5 w-3.5" /> yashwant.dev</div>
            <div className="flex items-center gap-1 hover:text-[var(--color-text-primary)] cursor-pointer"><Code className="h-3.5 w-3.5" /> yashwantsahu9907</div>
            <div className="flex items-center gap-1 hover:text-[#1DA1F2] cursor-pointer"><MessageCircle className="h-3.5 w-3.5" /> @yashwant_codes</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Heatmap */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Learning Activity</h2>
              <span className="text-xs text-[var(--color-text-secondary)] font-medium">841 contributions in the last year</span>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar pb-2">
              <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px]">
                {heatmapData.map((level, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-sm ${getColorClass(level)}`} title={`${level} contributions on this day`}></div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-bg-secondary)]"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-100"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-300"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-success)]"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Skills */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-[var(--color-success)]" />
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider">I Can Teach</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind'].map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-[var(--color-accent)]" />
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider">I Want To Learn</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Rust', 'Go', 'Kubernetes', 'Web3', 'System Design'].map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)] border-dashed">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Stats) */}
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-6">Career Stats</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">1,248</div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Hours Learned</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Video className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">142</div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Sessions Hosted</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Target className="h-5 w-5 text-[var(--color-success)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">28</div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Bounties Claimed</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">14 Day</div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Current Streak</div>
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

