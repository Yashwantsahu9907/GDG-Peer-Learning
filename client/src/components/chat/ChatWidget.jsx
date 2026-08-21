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
 <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 w-full sm:w-96 h-[100dvh] sm:h-[500px] sm:max-h-[85vh] bg-white sm:border border-[var(--color-border)] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150">
 {/* Header */}
 <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
 {activeTab ==='personal' ? (
 <div className="flex items-center gap-2">
 <button onClick={() => setActiveTab('contacts')} className="p-1 hover:bg-[var(--color-border)] rounded-lg transition-colors">
 <ArrowLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
 </button>
 <div>
 <span className="font-bold text-sm text-[var(--color-text-primary)] block leading-tight">{selectedContact?.name ||'Direct Chat'}</span>
 <span className="text-[10px] text-emerald-500 font-medium">● Online</span>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
 <Globe className="w-4 h-4" />
 </div>
 <div>
 <span className="font-bold text-sm text-[var(--color-text-primary)] block leading-tight">Global Peer Chat</span>
 <span className="text-[10px] text-[var(--color-text-muted)]">Live developer lounge</span>
 </div>
 </div>
 )}
 <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-border)] rounded-lg transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Tabs */}
 {activeTab !=='personal' && (
 <div className="flex border-b border-[var(--color-border)] bg-white shrink-0">
 <button 
 className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab ==='global' ?'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] bg-[var(--color-accent-light)]/20' :'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
 onClick={() => setActiveTab('global')}
 >
 <Globe className="w-3.5 h-3.5" /> Community Lounge
 </button>
 <button 
 className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab ==='contacts' ?'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] bg-[var(--color-accent-light)]/20' :'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
 onClick={() => setActiveTab('contacts')}
 >
 <MessageSquare className="w-3.5 h-3.5" /> Direct Messages
 </button>
 </div>
 )}

 {/* Content Area */}
 <div className="flex-1 overflow-y-auto p-3.5 bg-white space-y-3 custom-scrollbar">
 
 {/* GLOBAL CHAT TAB */}
 {activeTab ==='global' && (
 <div className="flex flex-col gap-3">
 {globalMessages.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)] py-16 opacity-60">
 <Globe className="h-10 w-10 mb-2 text-[var(--color-accent)]" />
 <p className="text-xs font-medium">Welcome to the Global Chat!</p>
 <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Say hi to developers around the world.</p>
 </div>
 ) : (
 globalMessages.map((msg, idx) => (
 <div 
 key={msg._id || idx} 
 className={`flex flex-col ${msg.senderId === currentUserId ?'items-end' :'items-start'} group`}
 onClick={() => setActiveMessageId(activeMessageId === (msg._id || idx) ? null : (msg._id || idx))}
 >
 <div className="flex items-center gap-2 mb-1">
 <span className="text-[10px] text-[var(--color-text-muted)] ml-1">{msg.senderName} • {formatTime(msg.timestamp)}{msg.isEdited &&' (edited)'}</span>
 {msg.senderId !== currentUserId && (
 <button
 onClick={(e) => { e.stopPropagation(); handleContactClick({ userId: msg.senderId, name: msg.senderName }); }}
 className={`transition-opacity text-[var(--color-accent)] hover:underline text-[10px] flex items-center gap-1 ${activeMessageId === (msg._id || idx) ?'opacity-100' :'opacity-0 sm:group-hover:opacity-100'}`}
 title="Reply Privately"
 >
 <MessageSquare className="w-3 h-3" /> Reply Privately
 </button>
 )}
 {msg.senderId === currentUserId && (
 <div className={`transition-opacity flex items-center gap-2 ${activeMessageId === (msg._id || idx) ?'opacity-100' :'opacity-0 sm:group-hover:opacity-100'}`}>
 <button onClick={(e) => { e.stopPropagation(); setEditingMessage(msg); setInputMessage(msg.text); }} className="text-blue-400 hover:text-blue-500 text-[10px] flex items-center gap-1" title="Edit">
 <Pencil className="w-3 h-3" /> Edit
 </button>
 <button onClick={(e) => { e.stopPropagation(); socketService.emit('delete_message', { messageId: msg._id, senderId: currentUserId }); }} className="text-red-400 hover:text-red-500 text-[10px] flex items-center gap-1" title="Delete">
 <Trash2 className="w-3 h-3" /> Delete
 </button>
 </div>
 )}
 <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }} className={`transition-opacity text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] flex items-center gap-1 ${activeMessageId === (msg._id || idx) ?'opacity-100' :'opacity-0 sm:group-hover:opacity-100'}`} title="Reply">
 <CornerDownRight className="w-3 h-3" /> Reply
 </button>
 </div>
 <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm cursor-pointer flex flex-col gap-1 ${msg.senderId === currentUserId ?'bg-[var(--color-accent)] text-white rounded-tr-sm' :'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-sm'}`}>
 {msg.replyTo && (
 <div className={`px-2 py-1 text-[10px] rounded border-l-2 opacity-80 ${msg.senderId === currentUserId ?'bg-white/20 border-white text-white' :'bg-black/5 border-[var(--color-accent)] text-[var(--color-text-secondary)]'}`}>
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
 {activeTab ==='contacts' && (
 <div className="flex flex-col gap-2">
 {contacts.length === 0 ? (
 <div className="text-center text-[var(--color-text-muted)] text-xs py-16">
 <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
 <p className="font-semibold text-slate-300">No direct conversations yet.</p>
 <p className="text-[11px] mt-1 text-slate-400">Discover peers and send them a direct message to start chatting.</p>
 </div>
 ) : (
 contacts.map((contact, idx) => (
 <div 
 key={idx} 
 onClick={() => handleContactClick(contact)}
 className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--color-border)]"
 >
 <div className="w-9 h-9 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm shrink-0">
 {contact.name ? contact.name[0].toUpperCase() : <UserIcon className="w-4 h-4"/>}
 </div>
 <div className="flex-1 overflow-hidden">
 <div className="flex justify-between items-center mb-0.5">
 <span className="font-bold text-xs text-[var(--color-text-primary)] truncate">{contact.name}</span>
 <span className="text-[9px] text-[var(--color-text-muted)] shrink-0">{formatTime(contact.timestamp)}</span>
 </div>
 <p className="text-xs text-[var(--color-text-secondary)] truncate">
 {contact.lastMessageIsMine && <span className="font-semibold text-[var(--color-text-primary)] opacity-75">You: </span>}
 {contact.lastMessage}
 </p>
 </div>
 </div>
 ))
 )}
 </div>
 )}

 {/* PERSONAL CHAT CONVERSATION TAB */}
 {activeTab ==='personal' && (
 <div className="flex flex-col gap-3">
 {currentPersonalMsgs.length === 0 ? (
 <div className="text-center text-[var(--color-text-muted)] text-xs py-16">
 <Sparkles className="h-8 w-8 mx-auto mb-2 text-blue-400" />
 <p className="font-semibold text-slate-200">Start of conversation with {selectedContact?.name}</p>
 <p className="text-[11px] text-slate-400 mt-1">Send a message to initiate collaboration!</p>
 </div>
 ) : (
 currentPersonalMsgs.map((msg, idx) => {
 const isSelf = msg.senderId === currentUserId;
 return (
 <div 
 key={msg._id || idx} 
 className={`flex flex-col ${isSelf ?'items-end' :'items-start'} group`}
 onClick={() => setActiveMessageId(activeMessageId === (msg._id || idx) ? null : (msg._id || idx))}
 >
 <div className="flex items-center gap-2 mb-1">
 <span className="text-[9px] text-[var(--color-text-muted)] mx-1">{formatTime(msg.timestamp)}{msg.isEdited &&' (edited)'}</span>
 <div className={`transition-opacity flex items-center gap-2 ${activeMessageId === (msg._id || idx) ?'opacity-100' :'opacity-0 sm:group-hover:opacity-100'}`}>
 {isSelf && (
 <>
 <button onClick={(e) => { e.stopPropagation(); setEditingMessage(msg); setInputMessage(msg.text); }} className="text-blue-400 hover:text-blue-500" title="Edit">
 <Pencil className="w-3 h-3" />
 </button>
 <button onClick={(e) => { e.stopPropagation(); socketService.emit('delete_message', { messageId: msg._id, senderId: currentUserId }); }} className="text-red-400 hover:text-red-500" title="Delete">
 <Trash2 className="w-3 h-3" />
 </button>
 </>
 )}
 <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]" title="Reply">
 <CornerDownRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-sm break-words flex flex-col gap-1 ${
 isSelf 
 ?'bg-[var(--color-accent)] text-white rounded-tr-none' 
 :'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-none'
 }`}>
 {msg.replyTo && (
 <div className={`px-2 py-1 text-[10px] rounded border-l-2 opacity-80 ${isSelf ?'bg-white/20 border-white text-white' :'bg-black/5 border-[var(--color-accent)] text-[var(--color-text-secondary)]'}`}>
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
 {activeTab !=='contacts' && (
 <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
 {replyingTo && (
 <div className="mb-2 bg-[var(--color-bg-primary)] border-l-2 border-[var(--color-accent)] px-2 py-1.5 flex justify-between items-start rounded-r-md">
 <div className="flex flex-col truncate pr-2">
 <span className="text-[10px] font-bold text-[var(--color-accent)]">Replying to {replyingTo.senderName}</span>
 <span className="text-xs text-[var(--color-text-secondary)] truncate">{replyingTo.text}</span>
 </div>
 <button type="button" onClick={() => setReplyingTo(null)} className="text-[var(--color-text-muted)] hover:text-red-500 p-0.5">
 <X className="w-3 h-3" />
 </button>
 </div>
 )}
 <div className="flex items-center gap-2">
 <input 
 type="text" 
 value={inputMessage}
 onChange={(e) => setInputMessage(e.target.value)}
 placeholder={editingMessage ?"Edit message..." : (activeTab ==='global' ?"Chat with community..." :`Message ${selectedContact?.name ||'peer'}...`)}
 className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-full px-3.5 py-2 text-xs sm:text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-slate-500"
 />
 <button 
 type="submit" 
 disabled={!inputMessage.trim()}
 className="p-2 bg-[var(--color-accent)] text-white rounded-full hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow"
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

