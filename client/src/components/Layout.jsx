import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const landingTheme = isLanding ? {
    '--color-bg-primary': 'rgba(255, 255, 255, 0.52)',
    '--color-bg-secondary': 'rgba(248, 249, 252, 0.44)',
    '--color-bg-tertiary': 'rgba(242, 243, 245, 0.40)',
    '--color-border': 'rgba(221, 222, 228, 0.82)',
    '--color-text-primary': '#111114',
    '--color-text-secondary': '#595a63',
    '--color-text-muted': '#888994',
    '--color-accent': '#2f8d46',
    '--color-accent-hover': '#217336',
    '--color-accent-light': '#eaf7ed',
  } : undefined;
  return (
    <div style={{ ...landingTheme, ...(isLanding ? { backgroundColor: '#ffffff' } : {}) }} className={`min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200 selection:bg-[var(--color-accent)] selection:text-white ${isLanding ? 'landing-shell' : ''}`}>
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
