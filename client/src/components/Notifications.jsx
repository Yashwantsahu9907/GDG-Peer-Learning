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
        className={`p-2 transition-colors relative rounded-full ${isOpen ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-zinc-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <h4 className="text-sm font-bold text-zinc-900">Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {notifications.map(notif => (
                  <li 
                    key={notif._id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 cursor-pointer hover:bg-zinc-50 transition-colors flex gap-3 ${!notif.isRead ? 'bg-zinc-50/80' : ''}`}
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 font-bold overflow-hidden">
                      {notif.sender?.avatar ? (
                        <img src={notif.sender.avatar} alt={notif.sender.name} className="h-full w-full object-cover" />
                      ) : (
                        notif.sender?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900">
                        <span className="font-bold">{notif.sender?.name}</span> {notif.message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex-shrink-0 flex items-center">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
              <button 
                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                className="w-full text-center text-sm font-medium text-zinc-600 hover:text-black py-1 transition-colors"
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
