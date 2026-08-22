import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import Whiteboard from '../components/Whiteboard';
import CameraPanel from '../components/CameraPanel';
import { socketService } from '../utils/socket';
import { getStoredUser } from '../utils/userClient';
import { 
  Columns, LayoutGrid, Maximize2, Minimize2, PhoneOff, 
  Sparkles, RotateCcw, MonitorPlay, Users, Layers,
  Copy, Check, Share2, MessageSquare, FileText, Send,
  PenTool, Code2, Video, ArrowRight, Plus, LogIn, ExternalLink,
  Shield, CheckCircle2, Globe, Clock, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

// -------------------------------------------------------------
// 1. Collab Room Lobby (when navigating to /meeting without an ID)
// -------------------------------------------------------------
const MeetingLobby = () => {
  const navigate = useNavigate();
  const [customRoomId, setCustomRoomId] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [createdRoomLink, setCreatedRoomLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateRoomId = () => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    return `collab-${randomHex}`;
  };

  const handleCreateInstantRoom = () => {
    const roomId = customRoomId.trim() ? customRoomId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-') : generateRoomId();
    const fullLink = `${window.location.origin}/meeting/${roomId}`;
    navigator.clipboard.writeText(fullLink);
    toast.success('Room created! Shareable invite link copied to clipboard.');
    navigate(`/meeting/${roomId}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinInput.trim()) return;

    let targetId = joinInput.trim();
    // If a full URL was pasted, extract room ID
    if (targetId.includes('/meeting/')) {
      targetId = targetId.split('/meeting/')[1].split(/[?#]/)[0];
    } else if (targetId.includes('/session/')) {
      targetId = targetId.split('/session/')[1].split(/[?#]/)[0];
    }

    if (targetId) {
      navigate(`/meeting/${targetId}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Multi-User Collaboration
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Peer Collab Rooms
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create an instant collaborative workspace. Share the generated link with teammates or mentors to code, draw, and chat together live.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Create Room */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
                <Plus className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Room</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Start a private room with synchronized code editor, live whiteboard, chat, and camera. You can invite multiple users via a shareable link.
              </p>
              
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Optional Custom Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. algo-session-team"
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleCreateInstantRoom}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Create & Copy Invite Link</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Join Existing Room */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                <LogIn className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Join a Room</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Have a room link or code from a peer or mentor? Paste it below to jump straight into the session.
              </p>
              
              <form onSubmit={handleJoinRoom} className="pt-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Room ID or Invite Link
                </label>
                <input
                  type="text"
                  placeholder="Paste URL or enter room ID..."
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!joinInput.trim()}
                    className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Join Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Feature Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[
            { icon: Code2, title: 'Multi-Language Code', desc: 'JS, Python, C++, Java runner with real-time sync' },
            { icon: PenTool, title: 'Live Whiteboard', desc: 'Draw diagrams & system design together in real-time' },
            { icon: MessageSquare, title: 'Instant Room Chat', desc: 'Communicate and share snippets with peers' },
            { icon: FileText, title: 'Synced Notes', desc: 'Collaborative markdown scratchpad for takeaways' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-2">
              <div className="p-2 w-fit rounded-lg bg-gray-100 text-emerald-600">
                <item.icon className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Active Collaborative Room Component (with Room ID)
// -------------------------------------------------------------
const MeetingRoom = ({ roomId }) => {
  const navigate = useNavigate();
  const user = getStoredUser();

  // Layout states
  const [leftPct, setLeftPct] = useState(() => {
    const saved = localStorage.getItem('meeting.leftPct');
    return saved ? Number(saved) : 62;
  });

  const [activeRightTab, setActiveRightTab] = useState('whiteboard'); // 'whiteboard' | 'camera' | 'chat' | 'notes'
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Multi-user room state
  const [occupants, setOccupants] = useState([]);
  const [peerCount, setPeerCount] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'System',
      senderName: 'System',
      text: `Welcome to Collab Room ${roomId}! Share your invite link to collaborate with multiple users in real-time.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    }
  ]);
  const [chatMessage, setChatMessage] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [peerTypingInfo, setPeerTypingInfo] = useState(null);
  const [notes, setNotes] = useState('# GDG Peer Session Notes\n\n- Collaborative notes shared between peers in this room\n- Real-time synced markdown\n- Key takeaways and action items\n');

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isRemoteNotesUpdate = useRef(false);
  const typingTimeoutRef = useRef(null);

  // 1. Initialize Socket Connection for Room
  useEffect(() => {
    const token = localStorage.getItem('token') || 'demo-token';
    const currentUser = {
      name: user?.name || 'Developer',
      userId: user?.userId || 'guest-' + Math.floor(Math.random() * 1000)
    };

    socketService.connect(token, currentUser.userId);

    const onConnect = () => {
      socketService.emit('join_session', { roomId, user: currentUser });
    };

    if (socketService.socket?.connected) {
      onConnect();
    } else {
      socketService.on('connect', onConnect);
    }

    // Room Occupants Updates
    socketService.on('room_users', ({ users, occupantCount }) => {
      if (users) setOccupants(users);
      setPeerCount(occupantCount || users?.length || 1);
    });

    socketService.on('peer_joined', ({ user: peerUser, occupantCount }) => {
      setPeerCount(occupantCount || 2);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'System',
          senderName: 'System',
          text: `${peerUser?.name || 'A peer'} joined the room.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]);
      toast.success(`${peerUser?.name || 'A peer'} joined the room!`);
    });

    socketService.on('peer_left', ({ occupantCount }) => {
      setPeerCount(occupantCount || 1);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'System',
          senderName: 'System',
          text: 'A peer left the room.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]);
    });

    // Chat Updates
    socketService.on('session_chat_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      setActiveRightTab(curr => {
        if (curr !== 'chat') {
          setUnreadChatCount(c => c + 1);
        }
        return curr;
      });
    });

    // Notes Updates
    socketService.on('notes_update', ({ notes: incomingNotes }) => {
      isRemoteNotesUpdate.current = true;
      setNotes(incomingNotes);
    });

    socketService.on('room_state', (state) => {
      if (state?.notes) {
        isRemoteNotesUpdate.current = true;
        setNotes(state.notes);
      }
      if (state?.users) {
        setOccupants(state.users);
      }
      if (state?.occupantCount) {
        setPeerCount(state.occupantCount);
      }
    });

    // Peer Typing
    socketService.on('peer_typing', ({ userName, isTyping }) => {
      if (isTyping) {
        setPeerTypingInfo(`${userName} is typing...`);
      } else {
        setPeerTypingInfo(null);
      }
    });

    return () => {
      socketService.emit('leave_session', { roomId });
      socketService.off('room_users');
      socketService.off('peer_joined');
      socketService.off('peer_left');
      socketService.off('session_chat_message');
      socketService.off('notes_update');
      socketService.off('room_state');
      socketService.off('peer_typing');
    };
  }, [roomId]);

  // Timer counter
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setElapsedTime(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (activeRightTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadChatCount(0);
    }
  }, [messages, activeRightTab]);

  const applyLayout = (left) => {
    setLeftPct(left);
    localStorage.setItem('meeting.leftPct', String(left));
    toast.success('Layout updated', { duration: 1200 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Invite Link Sharing
  const inviteLink = `${window.location.origin}/meeting/${roomId}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Chat Handlers
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: user?.userId || 'guest',
      senderName: user?.name || 'You',
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false
    };

    socketService.emit('session_chat_message', { roomId, message: newMsg });
    socketService.emit('peer_typing', { roomId, isTyping: false });
    setChatMessage('');
  };

  const handleChatInputChange = (e) => {
    setChatMessage(e.target.value);
    socketService.emit('peer_typing', { roomId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('peer_typing', { roomId, isTyping: false });
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
    socketService.emit('session_notes_change', { roomId, notes: val });
  };

  // Vertical Divider Drag (Left vs Right)
  const startVerticalDrag = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    let lastPct = leftPct;
    const onPointerMove = (ev) => {
      const x = ev.clientX - rect.left;
      let pct = Math.round((x / rect.width) * 100);
      if (pct < 25) pct = 25;
      if (pct > 80) pct = 80;
      setLeftPct(pct);
      lastPct = pct;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onUp);
      localStorage.setItem('meeting.leftPct', String(lastPct));
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="fixed inset-0 pt-16 z-40 bg-gray-100 flex flex-col overflow-hidden text-gray-900 font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="h-14 border-b border-gray-200 bg-white/95 backdrop-blur flex items-center justify-between px-3 sm:px-6 shrink-0 z-20 shadow-sm">
        
        {/* Left: Room Status & Share Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-gray-900 text-xs sm:text-sm hidden md:inline">Collab Room:</span>
          </div>

          {/* Room ID Badge with Quick Copy */}
          <div 
            onClick={copyInviteLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-mono cursor-pointer transition-colors"
            title="Click to copy invite link"
          >
            <span className="font-semibold">{roomId}</span>
            {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-gray-500" />}
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Generate & share invite link for multiple users"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Invite Peers</span>
          </button>

          {/* Active Participants Button */}
          <button
            onClick={() => setIsParticipantsModalOpen(!isParticipantsModalOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-medium transition-colors"
            title="View participants"
          >
            <Users className="h-3.5 w-3.5 text-emerald-600" />
            <span>{peerCount} {peerCount === 1 ? 'Peer' : 'Peers'}</span>
          </button>
        </div>

        {/* Center: Timer */}
        <div className="hidden lg:block text-gray-700 font-mono text-xs bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
          {elapsedTime}
        </div>

        {/* Right: Layout Presets, Fullscreen & Leave */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <button
              onClick={() => applyLayout(62)}
              className={`px-2 py-0.5 rounded transition-colors ${leftPct === 62 ? 'bg-white text-emerald-600 font-semibold shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              title="Standard Layout"
            >
              Default
            </button>
            <button
              onClick={() => applyLayout(50)}
              className={`px-2 py-0.5 rounded transition-colors ${leftPct === 50 ? 'bg-white text-emerald-600 font-semibold shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              title="Split 50/50"
            >
              50/50
            </button>
            <button
              onClick={() => applyLayout(78)}
              className={`px-2 py-0.5 rounded transition-colors ${leftPct === 78 ? 'bg-white text-emerald-600 font-semibold shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              title="Code Focus"
            >
              Code Focus
            </button>
            <button
              onClick={() => applyLayout(35)}
              className={`px-2 py-0.5 rounded transition-colors ${leftPct === 35 ? 'bg-white text-emerald-600 font-semibold shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              title="Board Focus"
            >
              Board Focus
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => navigate('/meeting')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* 2. Interactive Workspace Split Grid */}
      <div className="flex-grow p-3 bg-gray-100 overflow-hidden relative">
        <div ref={containerRef} className="h-full w-full flex relative select-none">
          
          {/* LEFT PANE: Synchronized Collaborative Code Editor */}
          <div style={{ width: `${leftPct}%`, minWidth: '280px' }} className="h-full flex flex-col pr-1.5">
            <CodeEditor roomId={roomId} />
          </div>

          {/* VERTICAL DIVIDER RESIZER */}
          <div 
            onPointerDown={startVerticalDrag} 
            className="w-3 cursor-col-resize z-30 flex flex-col items-center justify-center group hover:bg-emerald-500/10 transition-colors rounded shrink-0"
            title="Drag to resize code & collaboration panes"
          >
            <div className="h-8 w-1 bg-gray-300 group-hover:bg-emerald-400 group-hover:scale-y-125 rounded-full transition-all"></div>
          </div>

          {/* RIGHT PANE: Tabbed Multi-Tool Collaboration Panel */}
          <div style={{ width: `${100 - leftPct}%`, minWidth: '280px' }} className="h-full flex flex-col pl-1.5 relative bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
            
            {/* Right Pane Tabs */}
            <div className="h-11 border-b border-gray-200 bg-gray-50 flex items-center justify-between px-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveRightTab('whiteboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRightTab === 'whiteboard' 
                      ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Whiteboard</span>
                </button>

                <button
                  onClick={() => setActiveRightTab('camera')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRightTab === 'camera' 
                      ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <Video className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Video & Voice</span>
                </button>

                <button
                  onClick={() => setActiveRightTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    activeRightTab === 'chat' 
                      ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Chat</span>
                  {unreadChatCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveRightTab('notes')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRightTab === 'notes' 
                      ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Notes</span>
                </button>
              </div>
            </div>

            {/* Right Pane Tab Content */}
            <div className="flex-grow flex flex-col overflow-hidden relative">
              
              {/* 1. Whiteboard Tab */}
              {activeRightTab === 'whiteboard' && (
                <div className="w-full h-full p-2 bg-gray-50">
                  <Whiteboard roomId={roomId} />
                </div>
              )}

              {/* 2. Video & Voice Tab */}
              {activeRightTab === 'camera' && (
                <div className="w-full h-full p-2 bg-gray-50 flex flex-col gap-2">
                  <div className="flex-grow">
                    <CameraPanel roomId={roomId} peers={occupants} occupantCount={peerCount} />
                  </div>
                </div>
              )}

              {/* 3. Real-time Chat Tab */}
              {activeRightTab === 'chat' && (
                <div className="flex-grow flex flex-col h-full bg-white overflow-hidden">
                  <div className="flex-grow p-3 overflow-y-auto space-y-3">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.senderId === user?.userId || msg.sender === 'You';
                      return (
                        <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center my-1' : isCurrentUser ? 'items-end' : 'items-start'}`}>
                          {msg.isSystem ? (
                            <span className="text-[11px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 text-center">
                              {msg.text}
                            </span>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 mb-0.5 mx-1">
                                <span className="text-[11px] font-semibold text-gray-700">{msg.senderName || msg.sender}</span>
                                <span className="text-[10px] text-gray-400">{msg.time}</span>
                              </div>
                              <div className={`px-3 py-2 rounded-2xl text-xs sm:text-sm max-w-[85%] break-words leading-relaxed shadow-sm ${
                                isCurrentUser 
                                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200'
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

                  {peerTypingInfo && (
                    <div className="px-3 py-1 text-[11px] text-emerald-600 italic bg-gray-50 border-t border-gray-100">
                      {peerTypingInfo}
                    </div>
                  )}

                  <div className="p-2.5 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={handleChatInputChange}
                        placeholder="Type message to room peers..." 
                        className="w-full bg-white border border-gray-300 rounded-xl pl-3.5 pr-10 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button 
                        type="submit" 
                        disabled={!chatMessage.trim()}
                        className="absolute right-1.5 p-1.5 text-emerald-600 hover:text-emerald-500 disabled:text-gray-300 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* 4. Synced Notes Tab */}
              {activeRightTab === 'notes' && (
                <div className="flex-grow flex flex-col h-full bg-white p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Shared Scratchpad</span>
                    <span className="text-[11px] text-emerald-600 font-medium">⚡ Real-time Synced</span>
                  </div>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Write collaborative markdown notes..."
                    className="flex-grow w-full bg-gray-50 border border-gray-200 rounded-xl p-3 resize-none outline-none text-xs sm:text-sm text-gray-800 font-mono leading-relaxed focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Share Invite Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Share2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Invite Peers to Room</h3>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Anyone with this link can join this room instantly and collaborate on the code, whiteboard, notes, and chat in real-time.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 text-xs font-mono select-all focus:outline-none"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-md active:scale-95"
                >
                  {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No extra configuration needed. Multiple users opening this link will be automatically connected together.</span>
            </div>

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Participants Popover/Modal */}
      {isParticipantsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">Room Participants ({peerCount})</h3>
              </div>
              <button 
                onClick={() => setIsParticipantsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{user?.name || 'You'} (You)</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Active Host</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {occupants.filter(o => o.id !== user?.userId && o.userId !== user?.userId).map((peer, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-bold">
                      {peer.name ? peer.name[0].toUpperCase() : 'P'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{peer.name || 'Connected Peer'}</p>
                      <p className="text-[10px] text-gray-500 font-mono">ID: {peer.id || peer.peerId || 'member'}</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsParticipantsModalOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Invite More Peers</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// -------------------------------------------------------------
// 3. Main Export: Routes between Lobby & Active Room
// -------------------------------------------------------------
const Meeting = () => {
 const navigate = useNavigate();

 // Left column width percent (30% to 80%)
 const [leftPct, setLeftPct] = useState(() => {
 const saved = localStorage.getItem('meeting.leftPct');
 return saved ? Number(saved) : 62;
 });

 // Right pane top row percent (20% to 80%)
 const [rightTopPct, setRightTopPct] = useState(() => {
 const saved = localStorage.getItem('meeting.rightTopPct');
 return saved ? Number(saved) : 50;
 });

 const [elapsedTime, setElapsedTime] = useState('00:00');
 const [isFullscreen, setIsFullscreen] = useState(false);

 const containerRef = useRef(null);
 const rightRef = useRef(null);

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

 const applyLayout = (left, rightTop) => {
 setLeftPct(left);
 setRightTopPct(rightTop);
 localStorage.setItem('meeting.leftPct', String(left));
 localStorage.setItem('meeting.rightTopPct', String(rightTop));
 toast.success('Layout updated', { duration: 1500 });
 };

 const toggleFullscreen = () => {
 if (!document.fullscreenElement) {
 document.documentElement.requestFullscreen().catch(() => {});
 setIsFullscreen(true);
 } else {
 document.exitFullscreen().catch(() => {});
 setIsFullscreen(false);
 }
 };

 // Vertical Divider Drag (Left vs Right)
 const startVerticalDrag = (e) => {
 e.preventDefault();
 const container = containerRef.current;
 if (!container) return;
 const rect = container.getBoundingClientRect();

 const onPointerMove = (ev) => {
 const x = ev.clientX - rect.left;
 let pct = Math.round((x / rect.width) * 100);
 if (pct < 28) pct = 28;
 if (pct > 78) pct = 78;
 setLeftPct(pct);
 lastPct = pct;
 };

 const onUp = () => {
 window.removeEventListener('pointermove', onPointerMove);
 window.removeEventListener('pointerup', onUp);
 localStorage.setItem('meeting.leftPct', String(lastPct));
 };

 let lastPct = leftPct;
 window.addEventListener('pointermove', onPointerMove);
 window.addEventListener('pointerup', onUp);
 };

 // Horizontal Divider Drag (Whiteboard vs Camera on the Right)
 const startHorizontalDrag = (e) => {
 e.preventDefault();
 const right = rightRef.current;
 if (!right) return;
 const rect = right.getBoundingClientRect();

 const onPointerMove = (ev) => {
 const y = ev.clientY - rect.top;
 let pct = Math.round((y / rect.height) * 100);
 if (pct < 20) pct = 20;
 if (pct > 80) pct = 80;
 setRightTopPct(pct);
 lastPct = pct;
 };

 const onUp = () => {
 window.removeEventListener('pointermove', onPointerMove);
 window.removeEventListener('pointerup', onUp);
 localStorage.setItem('meeting.rightTopPct', String(lastPct));
 };

 let lastPct = rightTopPct;
 window.addEventListener('pointermove', onPointerMove);
 window.addEventListener('pointerup', onUp);
 };

 return (
 <div className="fixed inset-0 pt-16 z-40 bg-gray-100 flex flex-col overflow-hidden text-gray-900 font-sans">
 
 {/* 1. Header Toolbar */}
 <header className="h-14 border-b border-gray-200 bg-white/90 backdrop-blur flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2">
 <span className="relative flex h-2.5 w-2.5">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
 </span>
 <span className="font-bold text-gray-900 text-sm">Collab Room</span>
 </div>

 <div className="text-gray-700 font-mono text-xs bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
 {elapsedTime}
 </div>
 </div>

 {/* Layout Presets & Actions */}
 <div className="flex items-center gap-2 sm:gap-3">
 <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
 <button
 onClick={() => applyLayout(62, 50)}
 className={`px-2.5 py-1 rounded transition-colors ${leftPct === 62 ?'bg-gray-200 text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 title="Standard Layout (60/40)"
 >
 Default
 </button>
 <button
 onClick={() => applyLayout(50, 50)}
 className={`px-2.5 py-1 rounded transition-colors ${leftPct === 50 ?'bg-gray-200 text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 title="Split 50/50"
 >
 50 / 50
 </button>
 <button
 onClick={() => applyLayout(75, 40)}
 className={`px-2.5 py-1 rounded transition-colors ${leftPct === 75 ?'bg-gray-200 text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 title="Code Focus Layout"
 >
 Code Focus
 </button>
 <button
 onClick={() => applyLayout(35, 70)}
 className={`px-2.5 py-1 rounded transition-colors ${leftPct === 35 ?'bg-gray-200 text-emerald-400 font-semibold' :'text-gray-600 hover:text-gray-800'}`}
 title="Board Focus Layout"
 >
 Board Focus
 </button>
 </div>

 <button
 onClick={toggleFullscreen}
 className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
 title={isFullscreen ?'Exit Fullscreen' :'Enter Fullscreen'}
 >
 {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
 </button>

 <button
 onClick={() => navigate('/discover')}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-600/20 transition-all active:scale-95"
 >
 <PhoneOff className="h-3.5 w-3.5" />
 <span className="hidden sm:inline">Leave</span>
 </button>
 </div>
 </header>

 {/* 2. Interactive Resizable Split Grid */}
 <div className="grow p-3 bg-gray-100 overflow-hidden relative">
 <div ref={containerRef} className="h-full w-full flex relative select-none">
 
 {/* LEFT PANE: Code Editor */}
 <div style={{ width:`${leftPct}%`, minWidth:'280px' }} className="h-full flex flex-col pr-1.5">
 <CodeEditor />
 </div>

 {/* VERTICAL DIVIDER RESIZER */}
 <div 
 onPointerDown={startVerticalDrag} 
 className="w-3 cursor-col-resize z-30 flex flex-col items-center justify-center group hover:bg-emerald-500/10 transition-colors rounded"
 title="Drag to resize panes"
 >
 <div className="h-8 w-1 bg-gray-300 group-hover:bg-emerald-400 group-hover:scale-y-125 rounded-full transition-all"></div>
 </div>

 {/* RIGHT PANE: Whiteboard (Top) + Camera (Bottom) */}
 <div style={{ width:`${100 - leftPct}%`, minWidth:'280px' }} className="h-full flex flex-col pl-1.5 relative" ref={rightRef}>
 
 {/* Whiteboard Subpane */}
 <div style={{ height:`${rightTopPct}%` }} className="w-full pb-1.5">
 <Whiteboard roomId="meeting-collab-room" />
 </div>

 {/* HORIZONTAL DIVIDER RESIZER */}
 <div 
 onPointerDown={startHorizontalDrag} 
 className="h-3 w-full cursor-row-resize z-30 flex items-center justify-center group hover:bg-emerald-500/10 transition-colors rounded shrink-0"
 title="Drag to resize whiteboard and camera"
 >
 <div className="w-8 h-1 bg-gray-300 group-hover:bg-emerald-400 group-hover:scale-x-125 rounded-full transition-all"></div>
 </div>

 {/* Camera Subpane */}
 <div style={{ height:`${100 - rightTopPct}%` }} className="w-full pt-1.5">
 <CameraPanel />
 </div>

 </div>

 </div>
 </div>
 </div>
 );
};

export default Meeting;
