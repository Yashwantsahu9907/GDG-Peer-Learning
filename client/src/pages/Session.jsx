import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { socketService } from '../utils/socket';
import { getStoredUser } from '../utils/userClient';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Users, 
  MessageSquare, Monitor, FileText, Code2, PenTool, Circle,
  Square, MousePointer2, Type, Eraser, Send, ChevronDown
} from 'lucide-react';

const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  // Header State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  // Main Workspace State
  const [activeMainTab, setActiveMainTab] = useState('editor');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Welcome to the Collaboration Room\n// Start coding with your peer!\n\nfunction helloWorld() {\n  console.log("Hello, GDG Peer!");\n}\n\nhelloWorld();');
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);
  const isUpdatingCode = useRef(false);

  // Right Panel State
  const [activePanelTab, setActivePanelTab] = useState('video');
  const [chatMessage, setChatMessage] = useState('');
  const [notes, setNotes] = useState('# Session Notes\n\n- Discussed React component lifecycle\n- Debugged the infinite loop issue in useEffect\n- Next steps: implement custom hooks for data fetching');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Connecting to session...', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: true }
  ]);

  // WebRTC Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // Initialize Socket and WebRTC
  useEffect(() => {
    const initSession = async () => {
      try {
        const token = localStorage.getItem('token') || 'demo-token';
        socketService.connect(token, user?.userId);

        socketService.on('connect', () => {
          socketService.emit('join_session', { roomId: id });
          setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: 'Connected to session room.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: true }]);
        });

        socketService.on('peer_joined', async ({ peerId }) => {
          setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: 'A peer joined the session.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: true }]);
          initiateCall(peerId);
        });

        socketService.on('code_update', ({ code, cursorPosition }) => {
          isUpdatingCode.current = true;
          setCode(code);
          // Optional: handle cursorPosition to show peer's cursor
        });

        // WebRTC Signaling Handlers
        socketService.on('webrtc_offer', async ({ offer, sender }) => {
          await handleReceiveOffer(offer, sender);
        });
        socketService.on('webrtc_answer', async ({ answer }) => {
          await handleReceiveAnswer(answer);
        });
        socketService.on('webrtc_ice_candidate', async ({ candidate }) => {
          await handleReceiveCandidate(candidate);
        });

        // Setup local media stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

      } catch (err) {
        console.error('[Session Error]', err);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: 'Failed to access camera/mic.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: true }]);
      }
    };

    initSession();

    return () => {
      socketService.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [id]);

  // Timer
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

  // WebRTC Helper Functions
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emit('webrtc_ice_candidate', { roomId: id, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  const initiateCall = async (peerId) => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketService.emit('webrtc_offer', { roomId: id, offer, target: peerId });
  };

  const handleReceiveOffer = async (offer, sender) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketService.emit('webrtc_answer', { roomId: id, answer, target: sender });
  };

  const handleReceiveAnswer = async (answer) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleReceiveCandidate = async (candidate) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // UI Handlers
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!localStreamRef.current.getAudioTracks()[0].enabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOn(localStreamRef.current.getVideoTracks()[0].enabled);
    }
  };

  const handleEditorChange = (value) => {
    if (isUpdatingCode.current) {
      isUpdatingCode.current = false;
      return;
    }
    setCode(value);
    const position = editorRef.current?.getPosition();
    socketService.emit('code_change', { roomId: id, code_diff: value, cursorPosition: position });
  };

  const handleEndSession = async () => {
    // API call to end session could go here
    navigate('/profile');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false
    };
    setMessages([...messages, newMsg]);
    // Would normally emit chat_message via socket here
    setChatMessage('');
  };

  return (
    <div className="fixed inset-0 pt-16 z-40 bg-slate-950 flex flex-col overflow-hidden">
      
      {/* 1. Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="font-semibold text-slate-200">React Hooks Debugging Session</h1>
          </div>
          <div className="hidden sm:block px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
            ID: {id || '1a2b3c'}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-slate-300 font-mono font-medium bg-slate-950 px-3 py-1 rounded-md border border-slate-800 shadow-inner">
            {elapsedTime}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className={`p-2.5 rounded-full transition-colors ${isMuted ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleVideo}
              className={`p-2.5 rounded-full transition-colors ${!isVideoOn ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {!isVideoOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>
            <button className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>
            <button onClick={handleEndSession} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-600/20">
              <PhoneOff className="h-4 w-4" /> End Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Split Pane */}
      <div className="flex-grow flex w-full overflow-hidden">
        
        {/* LEFT SIDE: Workspace (70%) */}
        <div className="w-[70%] border-r border-slate-800 flex flex-col bg-[#1e1e1e]">
          {/* Workspace Tabs */}
          <div className="flex items-center justify-between px-4 h-12 bg-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveMainTab('editor')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeMainTab === 'editor' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}`}
              >
                <Code2 className="h-4 w-4" /> Code Editor
              </button>
              <button 
                onClick={() => setActiveMainTab('whiteboard')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeMainTab === 'whiteboard' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}`}
              >
                <PenTool className="h-4 w-4" /> Whiteboard
              </button>
            </div>
            
            {activeMainTab === 'editor' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Language</span>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-md pl-3 pr-8 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Font</span>
                  <input 
                    type="number" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-14 bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-blue-500" 
                    min="10" 
                    max="24"
                  />
                </div>
              </div>
            )}
            
            {activeMainTab === 'whiteboard' && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400"><MousePointer2 className="h-4 w-4" /></button>
                <button className="p-1.5 rounded bg-blue-500/20 text-blue-400"><PenTool className="h-4 w-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400"><Type className="h-4 w-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400"><Circle className="h-4 w-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400"><Square className="h-4 w-4" /></button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400"><Eraser className="h-4 w-4" /></button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <div className="flex gap-1 items-center px-1">
                  {['#ffffff', '#ef4444', '#3b82f6', '#10b981'].map(color => (
                    <button key={color} className="w-4 h-4 rounded-full border border-slate-600" style={{backgroundColor: color}}></button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Workspace Content */}
          <div className="flex-grow relative bg-[#1e1e1e]">
            {activeMainTab === 'editor' && (
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                onMount={(editor) => editorRef.current = editor}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            )}
            
            {activeMainTab === 'whiteboard' && (
              <div className="w-full h-full bg-[#121212] overflow-hidden relative" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <svg className="w-full h-full pointer-events-none">
                  <path d="M 100 100 Q 150 50 200 100 T 300 100" stroke="#3b82f6" strokeWidth="3" fill="none" />
                  <rect x="350" y="80" width="100" height="60" stroke="#ef4444" strokeWidth="2" fill="none" rx="4" />
                  <circle cx="550" cy="110" r="30" stroke="#10b981" strokeWidth="2" fill="none" />
                  <text x="360" y="115" fill="#e2e8f0" fontFamily="sans-serif" fontSize="14">Frontend</text>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Collaboration Panel (30%) */}
        <div className="w-[30%] flex flex-col bg-slate-950">
          
          {/* WebRTC Video Box */}
          {activePanelTab === 'video' && (
            <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
              {/* Remote Peer Video */}
              <div className="relative w-full aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg group">
                <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover bg-slate-800"></video>
                {!remoteVideoRef.current?.srcObject && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Users className="h-12 w-12 text-slate-600" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700/50 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-200">Alice Chen (Peer)</span>
                </div>
              </div>

              {/* Local User Video */}
              <div className="relative w-full aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg group">
                <video ref={localVideoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover bg-slate-800 ${!isVideoOn ? 'hidden' : ''}`}></video>
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <VideoOff className="h-10 w-10 text-slate-600" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700/50 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-200">You</span>
                  {isMuted ? <MicOff className="h-3 w-3 text-red-500" /> : <Mic className="h-3 w-3 text-emerald-400" />}
                </div>
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {activePanelTab === 'chat' && (
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center' : msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    {msg.isSystem ? (
                      <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {msg.text}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2 mb-1 mx-1">
                          <span className="text-xs font-medium text-slate-300">{msg.sender}</span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] ${
                          msg.sender === 'You' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}>
                          {msg.text}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Notes Panel */}
          {activePanelTab === 'notes' && (
            <div className="flex-grow flex flex-col bg-slate-950 p-4">
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-grow w-full bg-transparent resize-none outline-none text-sm text-slate-300 font-mono leading-relaxed"
                placeholder="Start typing markdown notes here..."
              />
            </div>
          )}

          {/* Right Panel Tabs Container (Bottom) */}
          <div className="h-14 border-t border-slate-800 bg-slate-900 flex items-center justify-around shrink-0 px-2">
            <button 
              onClick={() => setActivePanelTab('video')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activePanelTab === 'video' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Monitor className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Video</span>
            </button>
            <div className="w-px h-6 bg-slate-800"></div>
            <button 
              onClick={() => setActivePanelTab('chat')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${activePanelTab === 'chat' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Chat</span>
              <span className="absolute top-2 right-6 h-2 w-2 rounded-full bg-blue-500"></span>
            </button>
            <div className="w-px h-6 bg-slate-800"></div>
            <button 
              onClick={() => setActivePanelTab('notes')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activePanelTab === 'notes' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Notes</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Session;
