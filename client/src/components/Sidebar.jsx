import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  BookOpen, 
  PlusSquare, 
  Users, 
  Trophy, 
  Award, 
  User, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore Sessions', path: '/discover', icon: Compass },
        { name: 'Collab Room', path: '/meeting', icon: BookOpen },
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { name: 'Peer Network', path: '/bounties', icon: Users },
        { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { name: 'Profile', path: '/profile', icon: User },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hide-scrollbar shrink-0">
      <div className="flex-1 py-6 px-4 space-y-8">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
