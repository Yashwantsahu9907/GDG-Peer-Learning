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
        className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full transition-colors relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-black border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-50 transform origin-top-right transition-all text-zinc-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
            <h4 className="text-sm font-bold text-zinc-900">Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                <Bell className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {notifications.map(notif => (
                  <li 
                    key={notif._id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 cursor-pointer hover:bg-zinc-50 transition-colors flex gap-3 ${!notif.isRead ? 'bg-zinc-50/50' : ''}`}
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                      {notif.sender?.avatar ? (
                        <img src={notif.sender.avatar} alt={notif.sender.name} className="h-full w-full object-cover" />
                      ) : (
                        notif.sender?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-800 leading-tight">
                        <span className="font-bold text-black">{notif.sender?.name}</span> {notif.message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex-shrink-0 flex items-center">
                        <div className="h-2 w-2 bg-black rounded-full shadow-sm"></div>
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
                className="w-full text-center text-xs font-bold text-zinc-500 hover:text-black py-2 rounded-xl hover:bg-zinc-100 transition-colors"
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
