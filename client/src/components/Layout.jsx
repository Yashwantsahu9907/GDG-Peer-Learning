import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200 selection:bg-[var(--color-accent)] selection:text-white">
      <Navbar />
      <main className="flex-grow w-full pt-20">
        <Outlet />
      </main>
      {location.pathname !== '/' && (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--color-text-muted)] text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--color-text-primary)]">GDG Peer Learning</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
