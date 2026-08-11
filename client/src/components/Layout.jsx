import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const isMeetingPage = location.pathname.startsWith('/meeting') || location.pathname.startsWith('/session');
  const isLandingPage = location.pathname === '/';
  
  const showSidebar = !isLandingPage && !isMeetingPage;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Navbar />
      
      <div className="flex flex-1 pt-16 h-full">
        {showSidebar && <Sidebar />}
        
        <main className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-4rem)] relative">
          <Outlet />
        </main>
      </div>

      {!isMeetingPage && (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-8 mt-auto z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--color-text-muted)] text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--color-text-primary)]">GDG Peer Study Hub</span>
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

