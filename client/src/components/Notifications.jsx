import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-error)]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {notifications.map(notif => (
                  <li 
                    key={notif._id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors flex gap-3 ${!notif.isRead ? 'bg-[var(--color-bg-secondary)]' : ''}`}
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text-secondary)] font-bold overflow-hidden">
                      {notif.sender?.avatar ? (
                        <img src={notif.sender.avatar} alt={notif.sender.name} className="h-full w-full object-cover" />
                      ) : (
                        notif.sender?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)]">
                        <span className="font-bold">{notif.sender?.name}</span> {notif.message}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex-shrink-0 flex items-center">
                        <div className="h-2 w-2 bg-[var(--color-accent)] rounded-full"></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
              <button 
                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                className="w-full text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-1"
              >
                View all notifications &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
