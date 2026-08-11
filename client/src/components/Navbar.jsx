import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Search, Menu, User, Bell, ChevronDown, Monitor, Moon, Circle } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const Navbar = () => {
  const user = getStoredUser();
  const isLoggedIn = true; 
  const [presenceOpen, setPresenceOpen] = useState(false);
  const [status, setStatus] = useState('online');

  const getStatusColor = (s) => {
    switch (s) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded bg-[var(--color-text-primary)] flex items-center justify-center shadow-sm">
                <Code className="h-4 w-4 text-[var(--color-bg-primary)]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--color-text-primary)]">
                PeerStudy
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg px-8 hidden lg:flex">
            <div className="relative w-full group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search rooms, topics, peers..." 
                className="w-full bg-[var(--color-bg-secondary)] border border-transparent hover:border-[var(--color-border)] rounded-md pl-9 pr-12 py-1 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all shadow-sm"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-1.5 py-0.5 shadow-sm">⌘K</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-50/50 text-green-700 rounded-md border border-green-200/50 mr-2 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">42 Online</span>
                </div>

                <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-error)]"></span>
                </button>
                
                {/* Profile & Presence Dropdown */}
                <div className="relative ml-1">
                  <button 
                    onClick={() => setPresenceOpen(!presenceOpen)}
                    className="flex items-center gap-2 hover:bg-[var(--color-bg-secondary)] p-1 rounded-md transition-colors"
                  >
                    <div className="relative">
                      <div className="h-7 w-7 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)]">
                        {user?.name?.[0] || 'Y'}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg-primary)] ${getStatusColor(status)}`}></div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-[var(--color-text-muted)] hidden sm:block" />
                  </button>

                  {presenceOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-50">
                      <div className="px-3 py-2 border-b border-[var(--color-border)] mb-1">
                        <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{user?.name || 'Yashwant Sahu'}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">{user?.email || 'yashwant@example.com'}</p>
                      </div>
                      
                      <div className="px-3 py-1.5">
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Set Status</p>
                        <button onClick={() => {setStatus('online'); setPresenceOpen(false)}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div> Online
                        </button>
                        <button onClick={() => {setStatus('busy'); setPresenceOpen(false)}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div> Do Not Disturb
                        </button>
                        <button onClick={() => {setStatus('away'); setPresenceOpen(false)}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors">
                          <Monitor className="h-3 w-3 text-[var(--color-text-muted)]" /> Away
                        </button>
                      </div>

                      <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                        <Link to="/profile" onClick={() => setPresenceOpen(false)} className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors">
                          Your Profile
                        </Link>
                        <button className="w-full flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] text-[var(--color-error)] transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-[var(--color-text-primary)] hover:bg-black text-[var(--color-bg-primary)] text-sm font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}

            <button className="md:hidden p-1.5 text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-secondary)]">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

