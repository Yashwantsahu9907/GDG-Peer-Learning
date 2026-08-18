import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Flame, Coins, Search, Menu, User, Bell, Sun, Moon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const navLinks = [
    ...(isLoggedIn ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'Discover', path: '/discover' },
    { name: 'Bounties', path: '/bounties' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Collab Room', path: '/meeting' },
  ];

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
                GDG<span className="text-[var(--color-accent)]">Peer</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' 
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search mentors, skills..." 
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full pl-9 pr-4 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all w-48 focus:w-64"
              />
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Stats Badges */}
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <div className="flex items-center gap-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-3 py-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">12</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-3 py-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{user.gdgCoins || 100}</span>
                  </div>
                </div>

                <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg-primary)]"></span>
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-[var(--color-accent)] p-0.5 hover:scale-105 transition-transform cursor-pointer">
                      <div className="h-full w-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
                        <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)] hidden sm:block" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{user.email || ''}</p>
                        <div className="flex items-center gap-1.5 mt-2 bg-[var(--color-bg-secondary)] rounded-lg px-2 py-1.5 w-fit">
                          <Coins className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="text-xs font-semibold text-[var(--color-text-primary)]">{user.gdgCoins || 100} Coins</span>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                          My Dashboard
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-[var(--color-border)]">
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-bg-secondary)] hover:text-red-400 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
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
