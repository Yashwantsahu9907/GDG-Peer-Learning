import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code, Flame, Coins, Search, Menu, User, Bell, Sun, Moon, LogOut, ChevronDown, Compass, Award, Users, Settings as SettingsIcon, Edit3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleNavClick = (e, path) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate(path);
      } else {
        e.preventDefault();
        const id = path.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Workspace Overview', path: '/#workspace' },
    { name: 'Hall of Fame', path: '/#hall-of-fame' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Connect', path: '/#connect' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[var(--color-accent)] p-1.5 rounded-lg group-hover:bg-[var(--color-accent-hover)] transition-colors">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                GDG<span className="text-[var(--color-accent)]">Peer</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full hover:bg-[var(--color-bg-secondary)] hidden sm:block"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search peers..." 
                    className="w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full pl-9 pr-4 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all"
                  />
                </div>

                {/* Stats Badges */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <div className="flex items-center gap-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-3 py-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">12</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-3 py-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">{user.gdgCoins || 100}</span>
                  </div>
                </div>

                <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative hidden sm:block">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg-primary)]"></span>
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="h-9 w-9 rounded-full bg-[var(--color-accent)] p-0.5 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                      <div className="h-full w-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center font-bold text-sm text-[var(--color-text-primary)]">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4 text-[var(--color-text-secondary)]" />}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)] hidden sm:block" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{user.name || 'User'}</p>
                        <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate mt-0.5">{user.email || ''}</p>
                      </div>
                      
                      <div className="py-2">
                        <p className="px-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 mt-1">Account</p>
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <User className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> My Profile
                        </Link>
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <Edit3 className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Edit Profile
                        </Link>
                      </div>

                      <div className="py-2 border-t border-[var(--color-border)]">
                        <p className="px-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 mt-1">Workspace</p>
                        <Link to="/discover" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <Compass className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Discover
                        </Link>
                        <Link to="/bounties" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <Code className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Bounties
                        </Link>
                        <Link to="/leaderboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <Award className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Leaderboard
                        </Link>
                        <Link to="/meeting" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <Users className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Collab Room
                        </Link>
                      </div>
                      
                      <div className="py-2 border-t border-[var(--color-border)]">
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors group">
                          <SettingsIcon className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" /> Settings
                        </Link>
                        <button 
                          onClick={() => { setIsDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] absolute w-full left-0 top-16 shadow-2xl z-50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center justify-between px-4 py-3 mt-4 border-t border-[var(--color-border)]">
               <span className="text-base font-bold text-[var(--color-text-primary)]">Theme</span>
               <button 
                 onClick={toggleTheme}
                 className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-xl bg-[var(--color-bg-secondary)]"
               >
                 {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
               </button>
            </div>

            {!isLoggedIn && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-[var(--color-text-primary)] font-bold border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
