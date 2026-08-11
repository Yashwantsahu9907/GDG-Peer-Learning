import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, ChevronRight, Video, Flame, BookOpen, Clock, MoreHorizontal, Layers } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const Dashboard = () => {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPeersOnlineOpen, setIsPeersOnlineOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network request
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data
  const liveSessions = [
    { 
      id: 1, 
      title: 'Mastering Graph Algorithms', 
      tags: ['#DSA', '#Algorithms'],
      host: 'Aryan Sharma', 
      participants: 12, 
      duration: '45 min',
      level: 'Intermediate'
    },
    { 
      id: 2, 
      title: 'React System Design', 
      tags: ['#WebDev', '#React'],
      host: 'Riya Patel', 
      participants: 8, 
      duration: '60 min',
      level: 'Advanced'
    }
  ];

  const recommendedSessions = [
    {
      id: 3, 
      title: 'React Performance Deep Dive', 
      tags: ['#React', '#Frontend'],
      host: 'Kunal Verma', 
      participants: 15, 
      duration: '90 min',
      level: 'Advanced',
      reason: 'Because you follow #React'
    }
  ];

  const activities = [
    { id: 1, text: 'Aryan helped Kunal solve BFS', time: '2 minutes ago', type: 'help' },
    { id: 2, text: 'Riya joined React Performance', time: '5 minutes ago', type: 'join' },
    { id: 3, text: 'Meera completed 10 DSA problems', time: '8 minutes ago', type: 'milestone' },
  ];

  const topics = ['All', 'DSA', 'Web', 'AI/ML', 'MERN', 'System Design'];

  const filteredSessions = activeFilter === 'All' ? liveSessions : []; // Just mock filtering out if not 'All'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. Greeting / Context & Live Community Status */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 divider-y">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-3">
            Learn together. Build together.
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">
            Find developers who are learning the same things as you.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate('/discover')} className="px-5 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
              Explore Live Sessions
            </button>
            <button onClick={() => navigate('/meeting')} className="px-5 py-2 bg-white border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-semibold rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Study Room
            </button>
          </div>
        </div>

        {/* Live Community Visualization */}
        <div className="md:text-right flex flex-col md:items-end">
          <div className="relative">
            <button 
              onClick={() => setIsPeersOnlineOpen(!isPeersOnlineOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors text-sm font-medium text-[var(--color-text-secondary)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
              </span>
              <strong className="text-[var(--color-text-primary)]">42</strong> peers online
            </button>
            
            {/* Peers Online Popover */}
            {isPeersOnlineOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-4 text-left">
                <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Developers learning now</h4>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-success)]"></div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Aryan</span>
                    <span className="text-[var(--color-text-secondary)]">— DSA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-success)]"></div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Riya</span>
                    <span className="text-[var(--color-text-secondary)]">— React</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-success)]"></div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Kunal</span>
                    <span className="text-[var(--color-text-secondary)]">— AI/ML</span>
                  </div>
                </div>
                <button className="text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1">
                  View all peers <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-3 text-sm text-[var(--color-text-secondary)] px-3">
            <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 18 rooms</span>
            <span>·</span>
            <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> 126 today</span>
          </div>
        </div>
      </section>

      {/* 2. Topic Discovery (Filters + Sort + Search) */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mr-2 hidden sm:block">Topics</span>
          {topics.map(topic => (
            <button 
              key={topic}
              onClick={() => { setActiveFilter(topic); setIsLoading(true); setTimeout(() => setIsLoading(false), 800) }}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                activeFilter === topic 
                  ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select className="text-sm border border-[var(--color-border)] rounded-md px-3 py-1.5 bg-white text-[var(--color-text-primary)] font-medium focus:outline-none focus:border-[var(--color-accent)] cursor-pointer">
            <option>Most Active</option>
            <option>Newest</option>
            <option>Beginner Friendly</option>
          </select>

          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-accent)] w-48 bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] font-medium"
            />
          </div>
        </div>
      </section>

      {/* 3. Live Sessions */}
      <section>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live Sessions
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="panel-flat p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <Skeleton type="text" className="w-3/4 mb-4 h-6" />
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton type="circle" className="h-6 w-6" />
                    <Skeleton type="text" className="w-24" />
                  </div>
                </div>
                <div>
                  <Skeleton type="text" className="w-full mb-4" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div key={session.id} className="panel-flat p-5 flex flex-col justify-between card-hover relative group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1.5">
                      {session.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-bold text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                  
                  <h3 className="text-base font-bold text-[var(--color-text-primary)] leading-snug mb-3 pr-4">{session.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-6 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-primary)] font-bold text-[10px]">
                      {session.host.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{session.host}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[var(--color-success)]"><Users className="h-3.5 w-3.5" /> {session.participants} learning</span>
                    <span>·</span>
                    <span>{session.level}</span>
                    <span>·</span>
                    <span>{session.duration}</span>
                  </div>
                  
                  <button onClick={() => navigate(`/session/${session.id}`)} className="w-full py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-text-primary)] text-[var(--color-text-primary)] hover:text-white rounded-md text-sm font-semibold transition-colors flex justify-center items-center gap-1">
                    Join Session <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState 
                icon={Video}
                title="No live sessions found" 
                description={`No one is hosting a session for ${activeFilter} right now.`}
                actionLabel="Create Study Room"
                onAction={() => navigate('/meeting')}
              />
            </div>
          )}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 4. Recommended For You */}
        <section className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Recommended for you</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="panel-flat p-5 flex flex-col justify-between">
                  <Skeleton type="text" className="w-1/2 mb-3 h-3" />
                  <Skeleton type="text" className="w-3/4 mb-3 h-5" />
                  <Skeleton type="text" className="w-1/3 mb-4 h-4" />
                  <Skeleton type="text" className="w-full mb-4 h-3" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ))
            ) : (
              recommendedSessions.map((session) => (
                <div key={session.id} className="panel-flat p-5 flex flex-col justify-between card-hover">
                  <div>
                    <div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3">{session.reason}</div>
                    <h3 className="text-base font-bold text-[var(--color-text-primary)] leading-snug mb-2">{session.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{session.host}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                      <span>{session.participants} joined</span>
                      <span>·</span>
                      <span>{session.level}</span>
                    </div>
                    <button onClick={() => navigate(`/session/${session.id}`)} className="w-full py-1.5 bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] rounded-md text-sm font-semibold transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 5. Community Activity */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Community Activity</h2>
          <div className="space-y-4">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <Skeleton type="circle" className="h-2 w-2 mt-1 shrink-0" />
                    <div className="flex-1">
                      <Skeleton type="text" className="w-full mb-1 h-3" />
                      <Skeleton type="text" className="w-1/3 h-2" />
                    </div>
                 </div>
               ))
            ) : (
              activities.map(activity => (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div className="mt-0.5">
                    {activity.type === 'help' && <div className="h-2 w-2 rounded-full bg-[var(--color-accent)]"></div>}
                    {activity.type === 'join' && <div className="h-2 w-2 rounded-full bg-[var(--color-success)]"></div>}
                    {activity.type === 'milestone' && <div className="h-2 w-2 rounded-full bg-[var(--color-warning)]"></div>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">{activity.text}</p>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono">{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Dashboard;

