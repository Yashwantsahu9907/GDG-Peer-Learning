import React, { useState, useEffect, useRef } from'react';
import { socketService } from'../utils/socket';
import { useAuth } from'../contexts/AuthContext';
import { Globe, MessageSquare, Send, Users, User as UserIcon, Sparkles } from'lucide-react';

const Chat = () => {
 const { user } = useAuth();
 const [activeTab, setActiveTab] = useState('global'); //'global' |'personal'
 const [globalMessages, setGlobalMessages] = useState([]);
 const [contacts, setContacts] = useState([]);
 const [personalMessages, setPersonalMessages] = useState([]);
 const [selectedContact, setSelectedContact] = useState(null);
 const [inputMessage, setInputMessage] = useState('');

 const messagesEndRef = useRef(null);
 const currentUserId = user?._id || user?.userId || user?.id ||'guest';
 const currentUserName = user?.name ||'Developer';
 const serverUrl = import.meta.env.VITE_SERVER_URL ||'http://localhost:5000';

 useEffect(() => {
 const token = localStorage.getItem('token') ||'demo-token';
 socketService.connect(token, currentUserId);

 const onConnect = () => {
 socketService.emit('join_global');
 };

 if (socketService.socket?.connected) {
 onConnect();
 } else {
 socketService.on('connect', onConnect);
 }

 const handleReceiveGlobal = (msg) => {
 setGlobalMessages((prev) => [...prev, msg]);
 };

 const handleReceivePersonal = (msg) => {
 setPersonalMessages((prev) => [...prev, msg]);
 setContacts((prev) => {
 const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
 const exists = prev.find(c => c.userId === otherId);
 const isMine = msg.senderId === currentUserId;
 
 if (exists) {
 return prev.map(c => c.userId === otherId ? { ...c, lastMessage: msg.text, lastMessageIsMine: isMine, timestamp: msg.timestamp } : c);
 } else {
 return [{
 userId: otherId,
 name: isMine ? 'User' : msg.senderName,
 lastMessage: msg.text,
 lastMessageIsMine: isMine,
 timestamp: msg.timestamp
 }, ...prev];
 }
 });
 };

 socketService.on('receive_global_message', handleReceiveGlobal);
 socketService.on('receive_personal_message', handleReceivePersonal);

 return () => {
 socketService.off('connect', onConnect);
 socketService.off('receive_global_message', handleReceiveGlobal);
 socketService.off('receive_personal_message', handleReceivePersonal);
 };
 }, [currentUserId]);

 useEffect(() => {
 fetch(`${serverUrl}/api/chat/global?_t=${Date.now()}`)
 .then(res => res.json())
 .then(data => {
 if (data.success && Array.isArray(data.messages)) {
 setGlobalMessages(data.messages);
 }
 })
 .catch(err => console.error('Global Chat fetch error:', err));

 if (currentUserId && currentUserId !=='guest') {
 fetch(`${serverUrl}/api/chat/contacts/${currentUserId}?_t=${Date.now()}`)
 .then(res => res.json())
 .then(data => {
 if (data.success && Array.isArray(data.contacts)) {
 setContacts(data.contacts);
 }
 })
 .catch(err => console.error('Contacts fetch error:', err));
 }
 }, [currentUserId, serverUrl]);

 useEffect(() => {
 if (activeTab ==='personal' && selectedContact) {
 fetch(`${serverUrl}/api/chat/personal/${currentUserId}/${selectedContact.userId}?_t=${Date.now()}`)
 .then(res => res.json())
 .then(data => {
 if (data.success && Array.isArray(data.messages)) {
 setPersonalMessages(data.messages);
 }
 })
 .catch(err => console.error(err));
 }
 }, [activeTab, selectedContact, currentUserId, serverUrl]);

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
 }, [globalMessages, personalMessages, activeTab]);

 const handleSendMessage = (e) => {
 e.preventDefault();
 if (!inputMessage.trim()) return;

 if (activeTab ==='global') {
 socketService.emit('send_global_message', {
 senderId: currentUserId,
 senderName: currentUserName,
 text: inputMessage.trim()
 });
 } else if (activeTab ==='personal' && selectedContact) {
 socketService.emit('send_personal_message', {
 senderId: currentUserId,
 senderName: currentUserName,
 receiverId: selectedContact.userId,
 text: inputMessage.trim()
 });
 }

 setInputMessage('');
 };

 const formatTime = (isoString) => {
 if (!isoString) return'';
 const d = new Date(isoString);
 return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
 };

 const currentPersonalMsgs = personalMessages.filter(msg =>
 selectedContact &&
 ((msg.senderId === currentUserId && msg.receiverId === selectedContact.userId) ||
 (msg.senderId === selectedContact.userId && msg.receiverId === currentUserId))
 );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-6rem)] font-sans">
      <div className="h-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 bg-zinc-50 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="font-bold text-lg text-zinc-900">Community Chat</h2>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => { setActiveTab('global'); setSelectedContact(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'global' ? 'bg-black text-white shadow' : 'text-zinc-600 hover:bg-white hover:text-black'}`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Developer Lounge</span>
            </button>
          </div>

          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-t border-zinc-200">
            Direct Messages
          </div>

          <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {contacts.length === 0 ? (
              <div className="text-center text-xs text-zinc-400 py-8 px-4">
                No recent conversations. Connect with peers in Discover to chat!
              </div>
            ) : (
              contacts.map((contact, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedContact(contact); setActiveTab('personal'); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${selectedContact?.userId === contact.userId && activeTab === 'personal' ? 'bg-zinc-200/80 border border-zinc-300 text-black font-bold' : 'hover:bg-white text-zinc-600'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {contact.name ? contact.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-bold text-xs text-zinc-900 truncate">{contact.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{contact.lastMessage}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {activeTab === 'global' ? <Globe className="w-5 h-5 text-black" /> : <MessageSquare className="w-5 h-5 text-black" />}
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  {activeTab === 'global' ? 'Global Community Channel' : `Chat with ${selectedContact?.name || 'Peer'}`}
                </h3>
                <p className="text-[10px] text-zinc-500">
                  {activeTab === 'global' ? 'Real-time peer chat with GDG developers' : 'Direct 1-on-1 private messaging'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow p-6 overflow-y-auto space-y-3.5 custom-scrollbar">
            {activeTab === 'global' ? (
              globalMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-zinc-400">
                  <Globe className="h-12 w-12 text-zinc-300 mb-2" />
                  <p className="font-semibold text-sm text-zinc-700">No messages yet</p>
                  <p className="text-xs mt-1">Start the conversation by sending a message below!</p>
                </div>
              ) : (
                globalMessages.map((msg, idx) => {
                  const isSelf = msg.senderId === currentUserId;
                  return (
                    <div key={msg._id || idx} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 mx-1">
                        <span className="text-xs font-semibold text-zinc-600">{msg.senderName}</span>
                        <span className="text-[10px] text-zinc-400">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl max-w-lg text-sm leading-relaxed shadow-xs break-words ${isSelf ? 'bg-black text-white rounded-tr-none' : 'bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              currentPersonalMsgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-zinc-400">
                  <Sparkles className="h-12 w-12 text-zinc-300 mb-2" />
                  <p className="font-semibold text-sm text-zinc-700">Say hello to {selectedContact?.name}</p>
                  <p className="text-xs mt-1">Direct messages between you and this peer are synced in real time.</p>
                </div>
              ) : (
                currentPersonalMsgs.map((msg, idx) => {
                  const isSelf = msg.senderId === currentUserId;
                  return (
                    <div key={msg._id || idx} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-zinc-400 mx-1 mb-1">{formatTime(msg.timestamp)}</span>
                      <div className={`px-4 py-2.5 rounded-2xl max-w-lg text-sm leading-relaxed shadow-xs break-words ${isSelf ? 'bg-black text-white rounded-tr-none' : 'bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={activeTab === 'global' ? "Message the global community..." : `Message ${selectedContact?.name || 'peer'}...`}
                className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-5 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>

        </section>

      </div>
    </div>
  );
};

export default Chat;
