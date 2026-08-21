import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { socketService } from '../utils/socket';
import { getStoredUser } from '../utils/userClient';
import Whiteboard from '../components/Whiteboard';
import { API_URL } from '../config';
import { 
 Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Users, 
 MessageSquare, Monitor, FileText, Code2, PenTool, Send, 
 Play, Loader2, Terminal, Copy, Check, Share2, Sparkles,
 Volume2, Trash2, Maximize2
} from'lucide-react';
import toast from'react-hot-toast';

const BOILERPLATES = {
 javascript:'// JavaScript Collaborative Session\nfunction solve(input) {\n console.log("Processing input:", input);\n return input * 2;\n}\n\nconsole.log("Result:", solve(21));\n',
 python:'# Python 3 Collaborative Session\ndef solve(x):\n print(f"Running calculation with {x}")\n return x ** 2\n\nprint("Result:", solve(9))\n',
 cpp:'// C++ Collaborative Session\n#include <iostream>\n\nint main() {\n std::cout <<"Hello from GDG Peer Collaboration Room!" << std::endl;\n return 0;\n}\n',
 java:'// Java Collaborative Session\npublic class Main {\n public static void main(String[] args) {\n System.out.println("Hello from GDG Peer Java Runner!");\n }\n}\n'
};

const Session = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const user = getStoredUser();

 // Header & Media State
 const [isMuted, setIsMuted] = useState(false);
 const [isVideoOn, setIsVideoOn] = useState(true);
 const [isScreenSharing, setIsScreenSharing] = useState(false);
 const [elapsedTime, setElapsedTime] = useState('00:00');
 const [peerCount, setPeerCount] = useState(1);
 const [copiedLink, setCopiedLink] = useState(false);

 // Main Workspace State
 const [activeMainTab, setActiveMainTab] = useState('editor'); //'editor' |'whiteboard'
 const [language, setLanguage] = useState('javascript');
 const [code, setCode] = useState(BOILERPLATES.javascript);
 const [fontSize, setFontSize] = useState(14);
 const [isExecuting, setIsExecuting] = useState(false);
 const [executionOutput, setExecutionOutput] = useState('');
 const [showConsole, setShowConsole] = useState(false);
 const [isConsoleError, setIsConsoleError] = useState(false);

 // Collaboration Refs
 const editorRef = useRef(null);
 const isRemoteCodeUpdate = useRef(false);
 const isRemoteNotesUpdate = useRef(false);
 const messagesEndRef = useRef(null);
 const typingTimeoutRef = useRef(null);

 // Right Panel State
 const [activePanelTab, setActivePanelTab] = useState('chat'); //'chat' |'video' |'notes'
 const [unreadChatCount, setUnreadChatCount] = useState(0);
 const [chatMessage, setChatMessage] = useState('');
 const [peerTypingInfo, setPeerTypingInfo] = useState(null);
 const [notes, setNotes] = useState('# GDG Peer Session Notes\n\n- Collaborative notes shared between peers\n- Real-time synced markdown\n- Key takeaways and action items');
 const [messages, setMessages] = useState([
 { 
 id: 1, 
 sender:'System', 
 senderName:'System',
 text:`Welcome to Peer Session ${id ||'Room'}! Your code, chat, and notes are synced in real-time.`, 
 time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
 isSystem: true 
 }
 ]);

 // WebRTC Media Refs
 const localVideoRef = useRef(null);
 const remoteVideoRef = useRef(null);
 const peerConnectionRef = useRef(null);
 const localStreamRef = useRef(null);
 const screenStreamRef = useRef(null);

 // 1. Initialize Socket & Room Sync
 useEffect(() => {
 const token = localStorage.getItem('token') ||'demo-token';
 const currentUser = {
 name: user?.name ||'Developer',
 userId: user?.userId ||'guest-' + Math.floor(Math.random() * 1000)
 };

 socketService.connect(token, currentUser.userId);

 const onConnect = () => {
 socketService.emit('join_session', { roomId: id, user: currentUser });
 };

 // If socket is already connected
 if (socketService.socket?.connected) {
 onConnect();
 } else {
 socketService.on('connect', onConnect);
 }

 // Room user updates
 socketService.on('room_users', ({ users, occupantCount }) => {
 setPeerCount(occupantCount || users?.length || 1);
 });

 socketService.on('peer_joined', ({ user: peerUser, occupantCount }) => {
 setPeerCount(occupantCount || 2);
 setMessages(prev => [
 ...prev,
 {
 id: Date.now(),
 sender:'System',
 senderName:'System',
 text:`${peerUser?.name ||'A peer'} has joined the session.`,
 time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 isSystem: true
 }
 ]);
 toast.success(`${peerUser?.name ||'A peer'} joined the room!`);
 });

 socketService.on('peer_left', ({ occupantCount }) => {
 setPeerCount(occupantCount || 1);
 setMessages(prev => [
 ...prev,
 {
 id: Date.now(),
 sender:'System',
 senderName:'System',
 text:'A peer has left the session.',
 time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 isSystem: true
 }
 ]);
 });

 // Real-time Collaborative Code Sync
 socketService.on('code_update', ({ code: incomingCode, language: incomingLang }) => {
 isRemoteCodeUpdate.current = true;
 if (incomingCode !== undefined) {
 setCode(incomingCode);
 }
 if (incomingLang && incomingLang !== language) {
 setLanguage(incomingLang);
 }
 });

 // Real-time Chat Sync
 socketService.on('session_chat_message', (msg) => {
 setMessages(prev => [...prev, msg]);
 setActivePanelTab(currentTab => {
 if (currentTab !=='chat') {
 setUnreadChatCount(prevCount => prevCount + 1);
 }
 return currentTab;
 });
 });

 // Real-time Notes Sync
 socketService.on('notes_update', ({ notes: incomingNotes }) => {
 isRemoteNotesUpdate.current = true;
 setNotes(incomingNotes);
 });

 // Peer Typing Indicator
 socketService.on('peer_typing', ({ userName, isTyping }) => {
 if (isTyping) {
 setPeerTypingInfo(`${userName} is typing...`);
 } else {
 setPeerTypingInfo(null);
 }
 });

 // Initialize local media
 const startMedia = async () => {
 try {
 const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
 localStreamRef.current = stream;
 if (localVideoRef.current) {
 localVideoRef.current.srcObject = stream;
 }
 } catch (err) {
 console.warn('Camera / Audio device access declined or unavailable:', err);
 }
 };
 startMedia();

 return () => {
 socketService.emit('leave_session', { roomId: id });
 socketService.off('room_users');
 socketService.off('peer_joined');
 socketService.off('peer_left');
 socketService.off('code_update');
 socketService.off('session_chat_message');
 socketService.off('notes_update');
 socketService.off('peer_typing');

 if (localStreamRef.current) {
 localStreamRef.current.getTracks().forEach(track => track.stop());
 }
 if (screenStreamRef.current) {
 screenStreamRef.current.getTracks().forEach(track => track.stop());
 }
 if (peerConnectionRef.current) {
 peerConnectionRef.current.close();
 }
 };
 }, [id]);

 // Timer counter
 useEffect(() => {
 let seconds = 0;
 const interval = setInterval(() => {
 seconds++;
 const mins = Math.floor(seconds / 60).toString().padStart(2,'0');
 const secs = (seconds % 60).toString().padStart(2,'0');
 setElapsedTime(`${mins}:${secs}`);
 }, 1000);
 return () => clearInterval(interval);
 }, []);

 // Auto-scroll chat to bottom
 useEffect(() => {
 if (activePanelTab ==='chat') {
 messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
 setUnreadChatCount(0);
 }
 }, [messages, activePanelTab]);

 // Code Editor Handlers
 const handleEditorChange = (value) => {
 if (isRemoteCodeUpdate.current) {
 isRemoteCodeUpdate.current = false;
 return;
 }
 setCode(value);
 const position = editorRef.current?.getPosition();
 socketService.emit('code_change', {
 roomId: id,
 code_diff: value,
 cursorPosition: position,
 language
 });
 };

 const handleLanguageChange = (newLang) => {
 setLanguage(newLang);
 const newBoilerplate = BOILERPLATES[newLang] ||'';
 setCode(newBoilerplate);
 socketService.emit('code_change', {
 roomId: id,
 code_diff: newBoilerplate,
 language: newLang
 });
 };

 // Run Code via backend execution API
 const handleRunCode = async () => {
 if (!code.trim() || isExecuting) return;
 setIsExecuting(true);
 setShowConsole(true);
 setExecutionOutput('Executing code on server...');
 setIsConsoleError(false);

 try {
 const response = await fetch(`${API_URL}/execute`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({ language, code })
 });
 const data = await response.json();

 if (data.stderr) {
 setExecutionOutput(data.stderr);
 setIsConsoleError(true);
 } else if (data.stdout) {
 setExecutionOutput(data.stdout);
 setIsConsoleError(false);
 } else if (data.error) {
 setExecutionOutput(data.error);
 setIsConsoleError(true);
 } else {
 setExecutionOutput('✓ Execution finished with no output.');
 setIsConsoleError(false);
 }
 } catch (err) {
 setExecutionOutput('Failed to execute code:' + err.message);
 setIsConsoleError(true);
 } finally {
 setIsExecuting(false);
 }
 };

 // Chat Handlers
 const handleSendMessage = (e) => {
 e.preventDefault();
 if (!chatMessage.trim()) return;

 const newMsg = {
 id: Date.now(),
 senderId: user?.userId ||'guest',
 senderName: user?.name ||'You',
 text: chatMessage.trim(),
 time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 isSystem: false
 };

 socketService.emit('session_chat_message', { roomId: id, message: newMsg });
 socketService.emit('peer_typing', { roomId: id, isTyping: false });
 setChatMessage('');
 };

 const handleChatInputChange = (e) => {
 setChatMessage(e.target.value);
 socketService.emit('peer_typing', { roomId: id, isTyping: true });

 if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
 typingTimeoutRef.current = setTimeout(() => {
 socketService.emit('peer_typing', { roomId: id, isTyping: false });
 }, 1500);
 };

 // Notes Handler
 const handleNotesChange = (e) => {
 if (isRemoteNotesUpdate.current) {
 isRemoteNotesUpdate.current = false;
 return;
 }
 const val = e.target.value;
 setNotes(val);
 socketService.emit('session_notes_change', { roomId: id, notes: val });
 };

 // Media Controls
 const toggleMute = () => {
 if (localStreamRef.current) {
 const audioTracks = localStreamRef.current.getAudioTracks();
 if (audioTracks.length > 0) {
 audioTracks[0].enabled = !audioTracks[0].enabled;
 setIsMuted(!audioTracks[0].enabled);
 }
 }
 };

 const toggleVideo = () => {
 if (localStreamRef.current) {
 const videoTracks = localStreamRef.current.getVideoTracks();
 if (videoTracks.length > 0) {
 videoTracks[0].enabled = !videoTracks[0].enabled;
 setIsVideoOn(videoTracks[0].enabled);
 }
 }
 };

 const toggleScreenShare = async () => {
 try {
 if (!isScreenSharing) {
 const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
 screenStreamRef.current = stream;
 if (localVideoRef.current) {
 localVideoRef.current.srcObject = stream;
 }
 setIsScreenSharing(true);
 stream.getVideoTracks()[0].onended = () => {
 setIsScreenSharing(false);
 if (localStreamRef.current && localVideoRef.current) {
 localVideoRef.current.srcObject = localStreamRef.current;
 }
 };
 } else {
 if (screenStreamRef.current) {
 screenStreamRef.current.getTracks().forEach(t => t.stop());
 }
 setIsScreenSharing(false);
 if (localStreamRef.current && localVideoRef.current) {
 localVideoRef.current.srcObject = localStreamRef.current;
 }
 }
 } catch (err) {
 console.warn('Screen sharing cancelled or unavailable:', err);
 }
 };

 const handleCopyLink = () => {
 navigator.clipboard.writeText(window.location.href);
 setCopiedLink(true);
 toast.success('Session invite link copied!');
 setTimeout(() => setCopiedLink(false), 2500);
 };

 const handleEndSession = () => {
 socketService.emit('leave_session', { roomId: id });
 navigate('/discover');
 };

 return (
 <div className="fixed inset-0 pt-16 z-40 bg-gray-100 flex flex-col overflow-hidden text-gray-900 font-sans">
 
 {/* 1. Header Navigation Bar */}
 <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2">
 <span className="relative flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
 </span>
 <h1 className="font-bold text-gray-900 text-sm sm:text-base hidden md:block">
 Peer Collaboration Workspace
 </h1>
 </div>

 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100/80 border border-gray-300 text-gray-700 text-xs font-mono">
 <span>Room: {id}</span>
 <button 
 onClick={handleCopyLink} 
 title="Copy session link"
 className="ml-1 p-0.5 hover:text-emerald-400 transition-colors"
 >
 {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
 </button>
 </div>

 <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
 <Users className="h-3 w-3" />
 <span>{peerCount} {peerCount === 1 ?'Peer' :'Peers'}</span>
 </div>
 </div>

 {/* Media & Session Controls */}
 <div className="flex items-center gap-3 sm:gap-4">
 <div className="text-gray-700 font-mono font-medium text-xs sm:text-sm bg-gray-100 px-3 py-1 rounded-md border border-gray-200 shadow-inner">
 {elapsedTime}
 </div>

 <div className="flex items-center gap-1.5 sm:gap-2">
 <button 
 onClick={toggleMute}
 title={isMuted ?'Unmute microphone' :'Mute microphone'}
 className={`p-2 sm:p-2.5 rounded-full transition-colors ${isMuted ?'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' :'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
 >
 {isMuted ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
 </button>

 <button 
 onClick={toggleVideo}
 title={!isVideoOn ?'Turn camera on' :'Turn camera off'}
 className={`p-2 sm:p-2.5 rounded-full transition-colors ${!isVideoOn ?'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' :'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
 >
 {!isVideoOn ? <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Video className="h-4 w-4 sm:h-5 sm:w-5" />}
 </button>

 <button 
 onClick={toggleScreenShare}
 title={isScreenSharing ?'Stop sharing screen' :'Share screen'}
 className={`p-2 sm:p-2.5 rounded-full transition-colors ${isScreenSharing ?'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' :'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
 >
 <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
 </button>

 <div className="w-px h-6 bg-gray-100 mx-1"></div>

 <button 
 onClick={handleEndSession} 
 className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
 >
 <PhoneOff className="h-4 w-4" /> 
 <span className="hidden sm:inline">Leave</span>
 </button>
 </div>
 </div>
 </header>

 {/* Main Split Layout */}
 <div className="flex-grow flex w-full overflow-hidden">
 
 {/* LEFT WORKSPACE (68%) */}
 <div className="w-[68%] border-r border-gray-200 flex flex-col bg-white overflow-hidden">
 
 {/* Workspace Tab Header */}
 <div className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200 shrink-0">
 <div className="flex items-center gap-2">
 <button 
 onClick={() => setActiveMainTab('editor')}
 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${activeMainTab ==='editor' ?'bg-gray-100 text-emerald-400 border border-gray-300' :'text-gray-600 hover:text-gray-800 hover:bg-gray-100/40'}`}
 >
 <Code2 className="h-4 w-4" /> Code Editor
 </button>
 <button 
 onClick={() => setActiveMainTab('whiteboard')}
 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${activeMainTab ==='whiteboard' ?'bg-gray-100 text-emerald-400 border border-gray-300' :'text-gray-600 hover:text-gray-800 hover:bg-gray-100/40'}`}
 >
 <PenTool className="h-4 w-4" /> Whiteboard
 </button>
 </div>

 {/* Code Controls (Language, Font, Run) */}
 {activeMainTab ==='editor' && (
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5">
 <span className="text-[11px] text-gray-600 hidden sm:inline">Language:</span>
 <select 
 value={language}
 onChange={(e) => handleLanguageChange(e.target.value)}
 className="bg-gray-100 border border-gray-200 text-gray-800 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
 >
 <option value="javascript">JavaScript (Node.js)</option>
 <option value="python">Python 3</option>
 <option value="cpp">C++ (GCC)</option>
 <option value="java">Java (OpenJDK)</option>
 </select>
 </div>

 <button
 onClick={() => setShowConsole(!showConsole)}
 className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${showConsole ?'bg-gray-100 text-gray-800 border border-gray-300' :'text-gray-600 hover:text-gray-800'}`}
 title="Toggle console output"
 >
 <Terminal className="h-3.5 w-3.5" />
 <span className="hidden md:inline">Console</span>
 </button>

 <button 
 onClick={handleRunCode}
 disabled={isExecuting}
 className={`flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow transition-all ${isExecuting ?'opacity-70 cursor-not-allowed' :'active:scale-95'}`}
 >
 {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
 <span>{isExecuting ?'Running...' :'Run'}</span>
 </button>
 </div>
 )}
 </div>

 {/* Editor / Whiteboard Content */}
 <div className="flex-grow flex flex-col relative overflow-hidden bg-white">
 {activeMainTab ==='editor' ? (
 <div className="flex-grow flex flex-col relative overflow-hidden">
 <div className="flex-grow relative">
 <Editor
 height="100%"
 language={language}
 theme="light"
 value={code}
 onChange={handleEditorChange}
 onMount={(editor) => { editorRef.current = editor; }}
 options={{
 fontSize: fontSize,
 minimap: { enabled: false },
 fontFamily:"'JetBrains Mono','Fira Code', monospace",
 padding: { top: 12 },
 scrollBeyondLastLine: false,
 automaticLayout: true,
 smoothScrolling: true,
 }}
 />
 </div>

 {/* Integrated Interactive Console Output Drawer */}
 {showConsole && (
 <div className="h-44 border-t border-gray-200 bg-gray-50 flex flex-col shrink-0 animate-in slide-in-from-bottom duration-150">
 <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Terminal className="h-3.5 w-3.5 text-gray-600" />
 <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Execution Output</span>
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => setExecutionOutput('')} className="text-gray-600 hover:text-gray-800 text-xs flex items-center gap-1">
 <Trash2 className="h-3 w-3" /> Clear
 </button>
 <button onClick={() => setShowConsole(false)} className="text-gray-600 hover:text-gray-800 text-xs ml-2">
 ✕
 </button>
 </div>
 </div>
 <div className="flex-grow p-3 overflow-y-auto font-mono text-xs">
 {executionOutput ? (
 <pre className={`whitespace-pre-wrap break-words ${isConsoleError ?'text-red-400' :'text-emerald-400'}`}>
 {executionOutput}
 </pre>
 ) : (
 <span className="text-gray-500 italic">Click'Run' to execute code and see stdout/stderr here...</span>
 )}
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="w-full h-full p-4 bg-gray-100">
 <Whiteboard roomId={id} />
 </div>
 )}
 </div>
 </div>

 {/* RIGHT COLLABORATION PANEL (32%) */}
 <div className="w-[32%] flex flex-col bg-gray-100 border-l border-gray-200">
 
 {/* Top Panel Content (Chat, Video, Notes) */}
 <div className="flex-grow flex flex-col overflow-hidden">
 
 {/* 1. CHAT PANEL */}
 {activePanelTab ==='chat' && (
 <div className="flex-grow flex flex-col overflow-hidden">
 <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
 <div className="flex items-center gap-2">
 <MessageSquare className="h-4 w-4 text-emerald-400" />
 <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Session Chat</span>
 </div>
 <span className="text-[11px] text-gray-600">{messages.length} messages</span>
 </div>

 <div className="flex-grow p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
 {messages.map((msg) => {
 const isCurrentUser = msg.senderId === user?.userId || msg.sender ==='You';
 return (
 <div key={msg.id} className={`flex flex-col ${msg.isSystem ?'items-center my-1' : isCurrentUser ?'items-end' :'items-start'}`}>
 {msg.isSystem ? (
 <span className="text-[11px] text-gray-600 bg-white/90 px-3 py-1 rounded-full border border-gray-200 text-center">
 {msg.text}
 </span>
 ) : (
 <>
 <div className="flex items-center gap-1.5 mb-1 mx-1">
 <span className="text-[11px] font-semibold text-gray-700">{msg.senderName || msg.sender}</span>
 <span className="text-[10px] text-gray-500">{msg.time}</span>
 </div>
 <div className={`px-3 py-2 rounded-2xl text-xs sm:text-sm max-w-[85%] break-words leading-relaxed shadow-sm ${
 isCurrentUser 
 ?'bg-emerald-600 text-white rounded-tr-none' 
 :'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-300'
 }`}>
 {msg.text}
 </div>
 </>
 )}
 </div>
 );
 })}
 <div ref={messagesEndRef} />
 </div>

 {/* Typing Indicator */}
 {peerTypingInfo && (
 <div className="px-4 py-1 text-[11px] text-emerald-400 italic bg-white/50">
 {peerTypingInfo}
 </div>
 )}

 {/* Chat Input Form */}
 <div className="p-3 border-t border-gray-200 bg-white/80">
 <form onSubmit={handleSendMessage} className="relative flex items-center">
 <input 
 type="text" 
 value={chatMessage}
 onChange={handleChatInputChange}
 placeholder="Type a message or code hint..." 
 className="w-full bg-gray-100 border border-gray-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
 />
 <button 
 type="submit" 
 disabled={!chatMessage.trim()}
 className="absolute right-1.5 p-2 text-emerald-400 hover:text-emerald-300 disabled:text-gray-400 disabled:hover:text-gray-400 transition-colors"
 >
 <Send className="h-4 w-4" />
 </button>
 </form>
 </div>
 </div>
 )}

 {/* 2. VIDEO STREAM PANEL */}
 {activePanelTab ==='video' && (
 <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
 <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Live Video Stream</div>
 
 {/* Remote Peer Video */}
 <div className="relative w-full aspect-video rounded-xl bg-white border border-gray-200 overflow-hidden shadow-lg group">
 <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover bg-gray-100"></video>
 {!remoteVideoRef.current?.srcObject && (
 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-gray-500 gap-2">
 <Users className="h-10 w-10 text-gray-400 animate-pulse" />
 <span className="text-xs">Waiting for peer video stream...</span>
 </div>
 )}
 <div className="absolute bottom-2.5 left-2.5 bg-white/80 backdrop-blur px-2 py-0.5 rounded border border-gray-300/50 flex items-center gap-1.5">
 <span className="text-xs font-medium text-gray-800">Peer Camera</span>
 </div>
 </div>

 {/* Local User Video */}
 <div className="relative w-full aspect-video rounded-xl bg-white border border-gray-200 overflow-hidden shadow-lg group">
 <video ref={localVideoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover bg-gray-100 ${!isVideoOn && !isScreenSharing ?'hidden' :''}`}></video>
 {!isVideoOn && !isScreenSharing && (
 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-gray-500 gap-2">
 <VideoOff className="h-10 w-10 text-gray-400" />
 <span className="text-xs">Your camera is off</span>
 </div>
 )}
 <div className="absolute bottom-2.5 left-2.5 bg-white/80 backdrop-blur px-2 py-0.5 rounded border border-gray-300/50 flex items-center gap-2">
 <span className="text-xs font-medium text-gray-800">You ({user?.name ||'Developer'})</span>
 {isMuted ? <MicOff className="h-3 w-3 text-red-400" /> : <Mic className="h-3 w-3 text-emerald-400" />}
 </div>
 </div>
 </div>
 )}

 {/* 3. COLLABORATIVE NOTES PANEL */}
 {activePanelTab ==='notes' && (
 <div className="flex-grow flex flex-col overflow-hidden bg-gray-100">
 <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
 <div className="flex items-center gap-2">
 <FileText className="h-4 w-4 text-emerald-400" />
 <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Shared Session Notes</span>
 </div>
 <span className="text-[11px] text-emerald-400 font-medium">⚡ Real-time Synced</span>
 </div>
 <div className="flex-grow p-4 flex flex-col">
 <textarea 
 value={notes}
 onChange={handleNotesChange}
 placeholder="Write collaborative markdown notes here..."
 className="flex-grow w-full bg-white/50 border border-gray-200 rounded-xl p-3 resize-none outline-none text-xs sm:text-sm text-gray-800 font-mono leading-relaxed focus:border-emerald-500/50 transition-colors"
 />
 </div>
 </div>
 )}
 </div>

 {/* Bottom Panel Navigation Bar */}
 <div className="h-14 border-t border-gray-200 bg-white flex items-center justify-around shrink-0 px-2">
 <button 
 onClick={() => setActivePanelTab('chat')}
 className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${activePanelTab ==='chat' ?'text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 >
 <MessageSquare className="h-4 w-4" />
 <span className="text-[10px] uppercase tracking-wider">Chat</span>
 {unreadChatCount > 0 && (
 <span className="absolute top-2 right-6 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
 {unreadChatCount}
 </span>
 )}
 </button>

 <div className="w-px h-6 bg-gray-100"></div>

 <button 
 onClick={() => setActivePanelTab('video')}
 className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activePanelTab ==='video' ?'text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 >
 <Video className="h-4 w-4" />
 <span className="text-[10px] uppercase tracking-wider">Video</span>
 </button>

 <div className="w-px h-6 bg-gray-100"></div>

 <button 
 onClick={() => setActivePanelTab('notes')}
 className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activePanelTab ==='notes' ?'text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 >
 <FileText className="h-4 w-4" />
 <span className="text-[10px] uppercase tracking-wider">Notes</span>
 </button>
 </div>

 </div>
 </div>
 </div>
 );
};

export default Session;
