import React, { useState, useEffect, useRef } from'react';
import { socketService } from'../../utils/socket';
import { X, Send, Globe, User as UserIcon, MessageSquare, ArrowLeft, Users, Sparkles, MessageCircle, Pencil, Trash2, CornerDownRight } from'lucide-react';
import { SERVER_URL } from '../../config';

const ChatWidget = ({ user, onClose }) => {
 const currentUserId = user?._id || user?.userId ||'guest';
 const currentUserName = user?.name ||'Guest User';
 const serverUrl = SERVER_URL;
 const [activeTab, setActiveTab] = useState('global'); //'global','contacts','personal'
 const [globalMessages, setGlobalMessages] = useState([]);
 const [contacts, setContacts] = useState([]);
 const [personalMessages, setPersonalMessages] = useState([]);
 const [selectedContact, setSelectedContact] = useState(null);
 const [inputMessage, setInputMessage] = useState('');
 const [editingMessage, setEditingMessage] = useState(null);
 const [replyingTo, setReplyingTo] = useState(null);
 const [activeMessageId, setActiveMessageId] = useState(null);
 
 const messagesEndRef = useRef(null);
 const selectedContactRef = useRef(null);

 useEffect(() => {
 selectedContactRef.current = selectedContact;
 }, [selectedContact]);

 // 1. Initialize Socket Connection & Listeners
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
 // If we're currently chatting with the person this message is from/to
 setPersonalMessages((prev) => {
 return [...prev, msg];
 });
 
 setContacts((prev) => {
 const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
 const exists = prev.find(c => c.userId === otherId);
 const isMine = msg.senderId === currentUserId;
 
 if (exists) {
 return prev.map(c => c.userId === otherId ? { ...c, lastMessage: msg.text, lastMessageIsMine: isMine, timestamp: msg.timestamp } : c);
 } else {
 // Try to get name from current selected contact if we are the sender
 let newName = isMine ?'User' : msg.senderName;
 if (isMine && selectedContactRef.current?.userId === otherId) {
 newName = selectedContactRef.current.name;
 }
 
 return [{
 userId: otherId,
 name: newName,
 lastMessage: msg.text,
 lastMessageIsMine: isMine,
 timestamp: msg.timestamp
 }, ...prev];
 }
 });
 };

 const handleMessageEdited = (editedMsg) => {
 if (editedMsg.chatType ==='global') {
 setGlobalMessages(prev => prev.map(m => m._id === editedMsg._id ? editedMsg : m));
 } else {
 setPersonalMessages(prev => prev.map(m => m._id === editedMsg._id ? editedMsg : m));
 }
 };

 const handleMessageDeleted = ({ messageId, chatType }) => {
 if (chatType ==='global') {
 setGlobalMessages(prev => prev.filter(m => m._id !== messageId));
 } else {
 setPersonalMessages(prev => prev.filter(m => m._id !== messageId));
 }
 };

 socketService.on('receive_global_message', handleReceiveGlobal);
 socketService.on('message_edited', handleMessageEdited);
 socketService.on('message_deleted', handleMessageDeleted);
 socketService.on('receive_personal_message', handleReceivePersonal);

 return () => {
 socketService.off('connect', onConnect);
 socketService.off('receive_global_message', handleReceiveGlobal);
 socketService.off('message_edited', handleMessageEdited);
 socketService.off('message_deleted', handleMessageDeleted);
 socketService.off('receive_personal_message', handleReceivePersonal);
 };
 }, [currentUserId]);

 // 2. Fetch Initial Chat History
 useEffect(() => {
 // Fetch Global Chat History
 fetch(`${serverUrl}/api/chat/global?_t=${Date.now()}`)
 .then(res => res.json())
 .then(data => {
 if (data.success && Array.isArray(data.messages)) {
 setGlobalMessages(data.messages);
 }
 })
 .catch(err => console.error('Global Chat fetch error:', err));

 // Fetch Contacts if user is logged in
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

 // 3. Fetch Personal Messages when a contact is opened
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

 // Scroll to bottom on new messages
 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
 }, [globalMessages, personalMessages, activeTab]);

 const handleSendMessage = (e) => {
 e.preventDefault();
 if (!inputMessage.trim()) return;

 if (editingMessage) {
 socketService.emit('edit_message', {
 messageId: editingMessage._id,
 senderId: currentUserId,
 text: inputMessage.trim()
 });
 setEditingMessage(null);
 setInputMessage('');
 return;
 }

 if (activeTab ==='global') {
 socketService.emit('send_global_message', {
 senderId: currentUserId,
 senderName: currentUserName,
 text: inputMessage.trim(),
 replyTo: replyingTo ? { messageId: replyingTo._id, senderName: replyingTo.senderName, text: replyingTo.text } : null
 });
 setReplyingTo(null);
 } else if (activeTab ==='personal' && selectedContact) {
 socketService.emit('send_personal_message', {
 senderId: currentUserId,
 senderName: currentUserName,
 receiverId: selectedContact.userId,
 text: inputMessage.trim(),
 replyTo: replyingTo ? { messageId: replyingTo._id, senderName: replyingTo.senderName, text: replyingTo.text } : null
 });
 setReplyingTo(null);
 }
 
 setInputMessage('');
 };

 const handleContactClick = (contact) => {
 setSelectedContact(contact);
 setActiveTab('personal');
 };

 const formatTime = (isoString) => {
 if (!isoString) return'';
 const d = new Date(isoString);
 return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
 };

 // Filter messages for active personal conversation
 const currentPersonalMsgs = personalMessages.filter(msg => 
 selectedContact && 
 ((msg.senderId === currentUserId && msg.receiverId === selectedContact.userId) || 
 (msg.senderId === selectedContact.userId && msg.receiverId === currentUserId))
 );

  return (
    <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 w-full sm:w-96 h-[100dvh] sm:h-[500px] sm:max-h-[85vh] bg-white sm:border border-zinc-200 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50 shrink-0">
        {activeTab === 'personal' ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('contacts')} className="p-1 hover:bg-zinc-200 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 text-zinc-600" />
            </button>
            <div>
              <span className="font-bold text-sm text-zinc-900 block leading-tight">{selectedContact?.name || 'Direct Chat'}</span>
              <span className="text-[10px] text-zinc-500 font-medium">● Online</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-zinc-900 block leading-tight">Global Peer Chat</span>
              <span className="text-[10px] text-zinc-500">Live developer lounge</span>
            </div>
          </div>
        )}
        <button onClick={onClose} className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500 hover:text-black">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      {activeTab !== 'personal' && (
        <div className="flex border-b border-zinc-200 bg-white shrink-0">
          <button 
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'global' ? 'text-black border-b-2 border-black bg-zinc-100/70' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}`}
            onClick={() => setActiveTab('global')}
          >
            <Globe className="w-3.5 h-3.5" /> Community Lounge
          </button>
          <button 
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'contacts' ? 'text-black border-b-2 border-black bg-zinc-100/70' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}`}
            onClick={() => setActiveTab('contacts')}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Direct Messages
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 bg-white space-y-3 custom-scrollbar">
        
        {/* GLOBAL CHAT TAB */}
        {activeTab === 'global' && (
          <div className="flex flex-col gap-3">
            {globalMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-16 opacity-70">
                <Globe className="h-10 w-10 mb-2 text-zinc-400" />
                <p className="text-xs font-medium text-zinc-800">Welcome to the Global Chat!</p>
                <p className="text-[11px] text-zinc-500 mt-1">Say hi to developers around the world.</p>
              </div>
            ) : (
              globalMessages.map((msg, idx) => (
                <div 
                  key={msg._id || idx} 
                  className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'} group`}
                  onClick={() => setActiveMessageId(activeMessageId === (msg._id || idx) ? null : (msg._id || idx))}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-zinc-500 ml-1">{msg.senderName} • {formatTime(msg.timestamp)}{msg.isEdited && ' (edited)'}</span>
                    {msg.senderId !== currentUserId && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleContactClick({ userId: msg.senderId, name: msg.senderName }); }}
                        className={`transition-opacity text-zinc-700 hover:text-black hover:underline text-[10px] flex items-center gap-1 ${activeMessageId === (msg._id || idx) ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}
                        title="Reply Privately"
                      >
                        <MessageSquare className="w-3 h-3" /> Reply Privately
                      </button>
                    )}
                    {msg.senderId === currentUserId && (
                      <div className={`transition-opacity flex items-center gap-2 ${activeMessageId === (msg._id || idx) ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}>
                        <button onClick={(e) => { e.stopPropagation(); setEditingMessage(msg); setInputMessage(msg.text); }} className="text-blue-500 hover:text-blue-600 text-[10px] flex items-center gap-1" title="Edit">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); socketService.emit('delete_message', { messageId: msg._id, senderId: currentUserId }); }} className="text-red-500 hover:text-red-600 text-[10px] flex items-center gap-1" title="Delete">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }} className={`transition-opacity text-zinc-500 hover:text-black flex items-center gap-1 ${activeMessageId === (msg._id || idx) ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`} title="Reply">
                      <CornerDownRight className="w-3 h-3" /> Reply
                    </button>
                  </div>
                  <div className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-sm cursor-pointer flex flex-col gap-1 shadow-xs ${msg.senderId === currentUserId ? 'bg-black text-white rounded-tr-sm' : 'bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-tl-sm'}`}>
                    {msg.replyTo && (
                      <div className={`px-2 py-1 text-[10px] rounded border-l-2 opacity-85 ${msg.senderId === currentUserId ? 'bg-white/20 border-white text-white' : 'bg-zinc-200/70 border-black text-zinc-800'}`}>
                        <div className="font-bold">{msg.replyTo.senderName}</div>
                        <div className="truncate">{msg.replyTo.text}</div>
                      </div>
                    )}
                    <span>{msg.text}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* DIRECT MESSAGES (CONTACTS) TAB */}
        {activeTab === 'contacts' && (
          <div className="flex flex-col gap-2">
            {contacts.length === 0 ? (
              <div className="text-center text-zinc-500 text-xs py-16">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                <p className="font-semibold text-zinc-700">No direct conversations yet.</p>
                <p className="text-[11px] mt-1 text-zinc-500">Discover peers and send them a direct message to start chatting.</p>
              </div>
            ) : (
              contacts.map((contact, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleContactClick(contact)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-100 cursor-pointer transition-colors border border-transparent hover:border-zinc-200"
                >
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {contact.name ? contact.name[0].toUpperCase() : <UserIcon className="w-4 h-4"/>}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-xs text-zinc-900 truncate">{contact.name}</span>
                      <span className="text-[9px] text-zinc-500 shrink-0">{formatTime(contact.timestamp)}</span>
                    </div>
                    <p className="text-xs text-zinc-600 truncate">
                      {contact.lastMessageIsMine && <span className="font-semibold text-zinc-900 opacity-75">You: </span>}
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PERSONAL CHAT CONVERSATION TAB */}
        {activeTab === 'personal' && (
          <div className="flex flex-col gap-3">
             {currentPersonalMsgs.length === 0 ? (
               <div className="text-center text-zinc-500 text-xs py-16">
                 <Sparkles className="h-8 w-8 mx-auto mb-2 text-zinc-400" />
                 <p className="font-semibold text-zinc-800">Start of conversation with {selectedContact?.name}</p>
                 <p className="text-[11px] text-zinc-500 mt-1">Send a message to initiate collaboration!</p>
               </div>
             ) : (
               currentPersonalMsgs.map((msg, idx) => {
                const isSelf = msg.senderId === currentUserId;
                return (
                  <div 
                    key={msg._id || idx} 
                    className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} group`}
                    onClick={() => setActiveMessageId(activeMessageId === (msg._id || idx) ? null : (msg._id || idx))}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-zinc-500 mx-1">{formatTime(msg.timestamp)}{msg.isEdited && ' (edited)'}</span>
                      <div className={`transition-opacity flex items-center gap-2 ${activeMessageId === (msg._id || idx) ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}>
                        {isSelf && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setEditingMessage(msg); setInputMessage(msg.text); }} className="text-blue-500 hover:text-blue-600" title="Edit">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); socketService.emit('delete_message', { messageId: msg._id, senderId: currentUserId }); }} className="text-red-500 hover:text-red-600" title="Delete">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }} className="text-zinc-500 hover:text-black" title="Reply">
                          <CornerDownRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-xs break-words flex flex-col gap-1 ${
                      isSelf 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-tl-none'
                    }`}>
                      {msg.replyTo && (
                        <div className={`px-2 py-1 text-[10px] rounded border-l-2 opacity-85 ${isSelf ? 'bg-white/20 border-white text-white' : 'bg-zinc-200/70 border-black text-zinc-800'}`}>
                          <div className="font-bold">{msg.replyTo.senderName}</div>
                          <div className="truncate">{msg.replyTo.text}</div>
                        </div>
                      )}
                      <span>{msg.text}</span>
                    </div>
                  </div>
                );
              })
             )}
             <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {activeTab !== 'contacts' && (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 bg-zinc-50 shrink-0">
          {replyingTo && (
            <div className="mb-2 bg-white border-l-2 border-black px-2.5 py-1.5 flex justify-between items-start rounded-r-md shadow-xs border border-zinc-200">
              <div className="flex flex-col truncate pr-2">
                <span className="text-[10px] font-bold text-black">Replying to {replyingTo.senderName}</span>
                <span className="text-xs text-zinc-600 truncate">{replyingTo.text}</span>
              </div>
              <button type="button" onClick={() => setReplyingTo(null)} className="text-zinc-400 hover:text-red-500 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={editingMessage ? "Edit message..." : (activeTab === 'global' ? "Chat with community..." : `Message ${selectedContact?.name || 'peer'}...`)}
              className="flex-1 bg-white border border-zinc-300 rounded-full px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim()}
              className="p-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow"
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
