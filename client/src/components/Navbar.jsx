import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, Menu } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';
import Notifications from './Notifications';

const Navbar = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const user = getStoredUser();
  const isLoggedIn = Boolean(user?.userId);

  return (
    <nav className="leetcode-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-500" />
              </div>
              <span className="nav-brand text-xl">GDG <span className="nav-accent">Peer</span> Learning</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Courses
            </Link>
            <Link to="/community" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Community
            </Link>
            <Link to="/conversations" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Messages
            </Link>
            <Link to="/users" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              People
            </Link>
            <Link to="/meeting" className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Meeting
            </Link>
            {isHomeRoute && (
              <Link to="/login" className="leetcode-btn">
                Login
              </Link>
            )}
            <div className="flex items-center gap-2 ml-4">
              <Notifications />
              {isLoggedIn && (
                <Link
                  to="/profile"
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
