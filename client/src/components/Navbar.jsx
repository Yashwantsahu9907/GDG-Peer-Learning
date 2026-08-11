import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Search, Menu, User, Bell, Users } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const Navbar = () => {
  const user = getStoredUser();
  // Using a mock logged in state for demo purposes if user is not present
  const isLoggedIn = true; 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
                <Code className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
                GDG Peer Study Hub
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-lg px-8 hidden lg:flex">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search rooms, topics, peers..." 
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full pl-9 pr-12 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded px-1.5 py-0.5">⌘ K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 mr-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-medium">42 Peers Online</span>
                </div>

                <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-error)] border-2 border-[var(--color-bg-primary)]"></span>
                </button>
                
                <Link to="/profile" className="flex items-center gap-2 ml-1">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-accent)] p-0.5">
                    <div className="h-full w-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
                      <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 text-[var(--color-text-secondary)]">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

