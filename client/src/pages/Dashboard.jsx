import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Link as LinkIcon, Settings, Clock, Video, Share2, Flame, Target, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Dummy data for the heatmap
  const getHeatmapColor = (val) => {
    if (val === 0) return 'bg-[var(--color-bg-tertiary)]';
    if (val === 1) return 'bg-[#c6e48b] dark:bg-emerald-900/40';
    if (val === 2) return 'bg-[#7bc96f] dark:bg-emerald-700/60';
    if (val === 3) return 'bg-[#239a3b] dark:bg-emerald-600';
    return 'bg-[#196127] dark:bg-emerald-500';
  };

  const heatmap = Array.from({ length: 52 * 7 }, () => Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start relative pt-8">
        <button className="absolute top-8 right-0 p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex-shrink-0">
          <div className="h-32 w-32 rounded-full border border-[var(--color-border)] shadow-sm bg-[var(--color-bg-primary)] flex items-center justify-center text-5xl font-bold text-[var(--color-text-primary)]">
            {user?.name?.[0]?.toUpperCase() || 'Y'}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{user?.name || 'Yashwant Sahu'}</h1>
            <p className="text-lg text-[var(--color-text-secondary)]">@{user?.email?.split('@')[0] || 'yashwantsahu9907'}</p>
          </div>
          
          <p className="text-[var(--color-text-primary)] max-w-2xl leading-relaxed text-[15px]">
            Full-stack developer passionate about open source and systems design. Learning Rust <br className="hidden sm:block" />
            and Kubernetes. Always happy to pair program!
          </p>

          <div className="flex flex-wrap gap-5 text-sm text-[var(--color-text-secondary)] pt-2">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> India</div>
            <div className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="hover:text-[var(--color-accent)] font-medium">yashwant.dev</a></div>
            
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <a href="#" className="hover:text-[var(--color-accent)] font-medium">GitHub</a>
            </div>

            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              <a href="#" className="hover:text-[var(--color-accent)] font-medium">Twitter</a>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Learning Activity) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="gfg-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">Learning Activity</h2>
              <span className="text-sm text-[var(--color-text-secondary)]">841 contributions in the last year</span>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar">
              <div className="min-w-[750px]">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {heatmap.map((val, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(val)}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-1.5 text-xs text-[var(--color-text-secondary)] font-medium">
              <span className="mr-1">LESS</span>
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--color-bg-tertiary)]" />
              <div className="w-3.5 h-3.5 rounded-sm bg-[#c6e48b] dark:bg-emerald-900/40" />
              <div className="w-3.5 h-3.5 rounded-sm bg-[#7bc96f] dark:bg-emerald-700/60" />
              <div className="w-3.5 h-3.5 rounded-sm bg-[#239a3b] dark:bg-emerald-600" />
              <div className="w-3.5 h-3.5 rounded-sm bg-[#196127] dark:bg-emerald-500" />
              <span className="ml-1">MORE</span>
            </div>
          </div>

          {/* Skills Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="gfg-panel p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-[var(--color-accent)]" />
                <h3 className="font-bold text-[var(--color-text-primary)]">I Can Teach</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {['React', 'JavaScript', 'Node.js'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-sm font-semibold text-[var(--color-text-primary)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="gfg-panel p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-[var(--color-text-primary)]">I Want To Learn</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {['Rust', 'Go', 'Kubernetes', 'Web3'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-sm font-semibold text-[var(--color-text-primary)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content (Career Stats) */}
        <div className="space-y-8">
          <div className="gfg-panel p-6">
            <h2 className="text-[17px] font-bold text-[var(--color-text-primary)] mb-8">Career Stats</h2>
            
            <div className="space-y-7">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl">
                  <Clock className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight">1,248</div>
                  <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">Hours Learned</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl">
                  <Video className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight">142</div>
                  <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">Sessions Hosted</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl">
                  <Share2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight">312</div>
                  <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">Peers Helped</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-xl flex-shrink-0">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[var(--color-text-primary)] leading-tight">14 Day</div>
                  <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">Current Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
