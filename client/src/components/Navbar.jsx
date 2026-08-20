import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code, Flame, Coins, Search, Menu, User, Bell, LogOut, ChevronDown, Compass, Award, Users, Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ChatWidget from './chat/ChatWidget';
import Notifications from './Notifications';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    <nav className="fixed w-full top-0 z-50 bg-white/95 border-b border-zinc-200 backdrop-blur-md text-zinc-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-black p-1.5 rounded-lg group-hover:bg-zinc-800 transition-colors shadow-sm">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black tracking-tight">
                GDG<span className="text-zinc-500 font-semibold">Peer</span>
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
                className="text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search peers..." 
                    className="w-48 bg-zinc-100 border border-zinc-300 rounded-full pl-9 pr-4 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-all"
                  />
                </div>

                {/* Stats Badges */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1" title={`${user.streak || 1} day login streak`}>
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-bold text-zinc-900">{user.streak || 1}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1" title={`${user.gdgCoins || 100} GDG Coins`}>
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs font-bold text-zinc-900">{user.gdgCoins || 100}</span>
                  </div>
                </div>

                <Notifications />
                
                <div className="relative">
                  <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`p-2 transition-colors relative rounded-full ${isChatOpen ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'}`}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  {isChatOpen && <ChatWidget user={user} onClose={() => setIsChatOpen(false)} />}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="h-9 w-9 rounded-full bg-black p-0.5 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-sm text-black border border-zinc-200">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4 text-zinc-700" />}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-500 hidden sm:block" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-zinc-200 shadow-2xl py-2 z-50 transform origin-top-right transition-all text-zinc-900">
                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.name || 'User'}</p>
                        <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">{user.email || ''}</p>
                      </div>
                      
                      <div className="py-2">
                        <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 mt-1">Account</p>
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <User className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> My Profile
                        </Link>
                      </div>

                      <div className="py-2 border-t border-zinc-100">
                        <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 mt-1">Workspace</p>
                        <Link to="/discover" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <Compass className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Discover
                        </Link>
                        <Link to="/points" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <Coins className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Points
                        </Link>
                        <Link to="/bounties" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <Code className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Bounties
                        </Link>
                        <Link to="/leaderboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <Award className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Leaderboard
                        </Link>
                        <Link to="/meeting" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <Users className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Collab Room
                        </Link>
                      </div>
                      
                      <div className="py-2 border-t border-zinc-100">
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors group">
                          <SettingsIcon className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" /> Settings
                        </Link>
                        <button 
                          onClick={() => { setIsDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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
                <Link to="/login" className="text-sm font-bold text-zinc-700 hover:text-black transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-black hover:bg-zinc-800 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 text-zinc-600 hover:text-black transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-zinc-200 absolute w-full left-0 top-16 shadow-2xl z-50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-zinc-800 hover:bg-zinc-100 hover:text-black transition-colors"
              >
                {link.name}
              </a>
            ))}

            {!isLoggedIn && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-zinc-200">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-zinc-800 font-bold border border-zinc-300 rounded-xl hover:bg-zinc-100 hover:text-black transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl shadow-md transition-colors"
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
