import React, { useState } from 'react';
import { Calendar, Video, Clock, CheckCircle2, ChevronRight, Activity, Flame, Target, Users, Search, Plus } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Topics');

  // Real data structure for sessions
  const liveSessions = [
    { 
      id: 1, 
      title: 'Mastering Graph Algorithms', 
      description: 'BFS, DFS & Shortest Path', 
      tags: ['#DSA', '#Algorithms'],
      host: 'Aryan Sharma', 
      rating: '4.8 ★', 
      participants: 12, 
      capacity: 20,
      duration: '45 min',
      level: 'Intermediate'
    },
    { 
      id: 2, 
      title: 'React System Design', 
      description: 'Component architecture and state management', 
      tags: ['#WebDev', '#React'],
      host: 'Riya Patel', 
      rating: '4.9 ★', 
      participants: 8, 
      capacity: 15,
      duration: '60 min',
      level: 'Advanced'
    },
    { 
      id: 3, 
      title: 'MongoDB Aggregations', 
      description: 'Deep dive into complex pipelines', 
      tags: ['#MERN', '#Database'],
      host: 'Kunal Verma', 
      rating: '4.7 ★', 
      participants: 15, 
      capacity: 30,
      duration: '90 min',
      level: 'Intermediate'
    }
  ];

  const filters = ['All Topics', '#DSA', '#WebDev', '#MERN', '#AI_ML', '#SystemDesign', '#Cloud', '#DevOps', '#OpenSource'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Section */}
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Learn together. Build together.</h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            Join live study rooms, pair with peers, solve problems, and level up your developer skills.
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => navigate('/discover')} className="px-5 py-2.5 bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Explore Sessions
          </button>
          <button onClick={() => navigate('/meeting')} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Create Study Room
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-success)]"></span>
          </span>
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-text-primary)]">42</strong> peers are learning right now
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeFilter === filter 
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent-light)]' 
                : 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Live Study Sessions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Live Study Sessions</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveSessions.map((session) => (
            <div key={session.id} className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col justify-between card-hover shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-green-50 text-green-700 rounded-md border border-green-100">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase">Live</span>
                  </div>
                  <div className="flex gap-1">
                    {session.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight mb-1">{session.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{session.description}</p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-primary)] font-bold text-[10px]">
                      {session.host.charAt(0)}
                    </div>
                    <span className="font-medium text-[var(--color-text-primary)]">{session.host}</span>
                  </div>
                  <span className="text-[var(--color-warning)] font-medium text-xs bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">{session.rating}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] mb-4 bg-[var(--color-bg-secondary)] px-3 py-2 rounded-lg">
                  <span>{session.duration}</span>
                  <span>·</span>
                  <span>{session.level}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{session.participants}/{session.capacity}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(`/session/${session.id}`)} className="flex-1 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                    Join Session <ChevronRight className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-[var(--color-border)]">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;

