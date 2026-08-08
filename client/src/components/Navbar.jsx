import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Flame, Coins, Search, Menu, User, Bell } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const Navbar = () => {
  const location = useLocation();
  const user = getStoredUser();
  // Using a mock logged in state for demo purposes if user is not present
  const isLoggedIn = true; 
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Discover', path: '/discover' },
    { name: 'Bounties', path: '/bounties' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Collab Room', path: '/meeting' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800/60 bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Code className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-100">
                GDG<span className="text-blue-500">Peer</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-800/50 text-slate-100 border border-slate-700/50' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search (Mock) */}
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search mentors, skills..." 
                className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-48 focus:w-64"
              />
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Stats Badges */}
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-semibold text-slate-300">12</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-semibold text-slate-300">450</span>
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 border-2 border-slate-950"></span>
                </button>
                
                <Link to="/profile" className="flex items-center gap-2 ml-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5">
                    <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-slate-400 hover:text-slate-200">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
