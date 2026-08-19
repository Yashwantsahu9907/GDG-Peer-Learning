import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Send, Globe, User as UserIcon, MessageSquare, ArrowLeft } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatWidget = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('global'); // 'global', 'contacts', 'personal'
  const [socket, setSocket] = useState(null);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [personalMessages, setPersonalMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    if (!user) return;
    
    const newSocket = io(SOCKET_URL, {
      auth: { userId: user._id }
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      newSocket.emit('join_global');
    });

    newSocket.on('receive_global_message', (msg) => {
      setGlobalMessages((prev) => [...prev, msg]);
    });

    newSocket.on('receive_personal_message', (msg) => {
      // If we're currently chatting with the person this message is from/to
      setPersonalMessages((prev) => {
        // We might receive messages from multiple people, but we only want to append
        // to the current view if it belongs to the selected conversation.
        // However, standard React state update here might not have latest selectedContact in scope 
        // unless we use a ref or check the msg sender/receiver inside a functional update.
        return [...prev, msg];
      });
      
      // Also update contacts list to show latest message
      setContacts((prev) => {
        const otherId = msg.senderId === user._id ? msg.receiverId : msg.senderId;
        const exists = prev.find(c => c.userId === otherId);
        if (exists) {
          return prev.map(c => c.userId === otherId ? { ...c, lastMessage: msg.text, timestamp: msg.timestamp } : c);
        } else {
          // Add new contact
          return [{
            userId: otherId,
            name: msg.senderId === user._id ? 'Unknown' : msg.senderName,
            lastMessage: msg.text,
            timestamp: msg.timestamp
          }, ...prev];
        }
      });
    });

    return () => newSocket.close();
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    if (!user) return;

    const chatApiBase = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/chat` : 'http://localhost:5000/api/chat';

    // Fetch Global Chat
    fetch(`${chatApiBase}/global?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setGlobalMessages(data.messages);
      })
      .catch(err => console.error('Global Chat fetch error:', err));

    // Fetch Contacts
    fetch(`${chatApiBase}/contacts/${user._id}?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setContacts(data.contacts);
      })
      .catch(err => console.error('Contacts fetch error:', err));
  }, [user]);

  // Fetch Personal Messages when a contact is selected
  useEffect(() => {
    if (activeTab === 'personal' && selectedContact) {
      const chatApiBase = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/chat` : 'http://localhost:5000/api/chat';
      
      fetch(`${chatApiBase}/personal/${user._id}/${selectedContact.userId}?_t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setPersonalMessages(data.messages);
        })
        .catch(err => console.error(err));
    }
  }, [activeTab, selectedContact, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [globalMessages, personalMessages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    if (activeTab === 'global') {
      socket.emit('send_global_message', {
        senderId: user._id,
        senderName: user.name,
        text: inputMessage
      });
    } else if (activeTab === 'personal' && selectedContact) {
      socket.emit('send_personal_message', {
        senderId: user._id,
        senderName: user.name,
        receiverId: selectedContact.userId,
        text: inputMessage
      });
    }
    
    setInputMessage('');
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setActiveTab('personal');
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // To properly filter personal messages for the current view:
  const currentPersonalMsgs = personalMessages.filter(msg => 
    selectedContact && 
    ((msg.senderId === user._id && msg.receiverId === selectedContact.userId) || 
     (msg.senderId === selectedContact.userId && msg.receiverId === user._id))
  );

  return (
    <div className="absolute right-0 top-12 w-[90vw] sm:w-96 h-[500px] max-h-[85vh] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        {activeTab === 'personal' ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('contacts')} className="p-1 hover:bg-[var(--color-border)] rounded-md transition-colors">
              <ArrowLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
            <span className="font-bold text-[var(--color-text-primary)]">{selectedContact?.name || 'Chat'}</span>
          </div>
        ) : (
          <span className="font-bold text-[var(--color-text-primary)]">Community Chat</span>
        )}
        <button onClick={onClose} className="p-1 hover:bg-[var(--color-border)] rounded-md transition-colors">
          <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      {/* Tabs (only show if not in a personal chat view) */}
      {activeTab !== 'personal' && (
        <div className="flex border-b border-[var(--color-border)]">
          <button 
            className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'global' ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
            onClick={() => setActiveTab('global')}
          >
            <Globe className="w-4 h-4" /> Global
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'contacts' ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
            onClick={() => setActiveTab('contacts')}
          >
            <MessageSquare className="w-4 h-4" /> Personal
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[var(--color-bg-primary)]">
        {activeTab === 'global' && (
          <div className="flex flex-col gap-4">
            {globalMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.senderId === user._id ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[var(--color-text-muted)] ml-1 mb-1">{msg.senderName} • {formatTime(msg.timestamp)}</span>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${msg.senderId === user._id ? 'bg-[var(--color-accent)] text-white rounded-tr-sm' : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="flex flex-col gap-2">
            {contacts.length === 0 ? (
              <div className="text-center text-[var(--color-text-muted)] text-sm mt-10">
                No recent chats.<br/>Start a personal chat from a user's profile.
              </div>
            ) : (
              contacts.map((contact, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleContactClick(contact)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--color-border)]"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)] font-bold shrink-0">
                    {contact.name ? contact.name[0].toUpperCase() : <UserIcon className="w-5 h-5"/>}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-[var(--color-text-primary)] truncate">{contact.name}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">{formatTime(contact.timestamp)}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="flex flex-col gap-4">
             {currentPersonalMsgs.length === 0 ? (
               <div className="text-center text-[var(--color-text-muted)] text-sm mt-10">Say hi to {selectedContact?.name}!</div>
             ) : (
               currentPersonalMsgs.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.senderId === user._id ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-[var(--color-text-muted)] ml-1 mb-1">{formatTime(msg.timestamp)}</span>
                  <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${msg.senderId === user._id ? 'bg-[var(--color-accent)] text-white rounded-tr-sm' : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
             )}
             <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {activeTab !== 'contacts' && (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim()}
              className="p-2 bg-[var(--color-accent)] text-white rounded-full hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatWidget;
