import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import Whiteboard from '../components/Whiteboard';
import CameraPanel from '../components/CameraPanel';
import Chat from './Chat';
import { Users, FileText, Code2, PenTool, MessageSquare, Video, PhoneOff, Mic, MicOff, VideoOff, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {
  const [activeMainTab, setActiveMainTab] = useState('code'); // code, notes, problem
  const [activeSideTab, setActiveSideTab] = useState('chat'); // chat, participants, peerHelp
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Room Header */}
      <div className="h-14 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <h1 className="font-semibold text-[var(--color-text-primary)] text-sm">DSA — Graph Algorithms</h1>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]"></div>
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-sm font-medium">
            <Users className="h-4 w-4" />
            <span>12 / 20 participants</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] rounded-md transition-colors">
            Invite
          </button>
          <button className="px-3 py-1.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors border border-transparent hover:border-[var(--color-border)]">
            Share
          </button>
          <button className="px-3 py-1.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors border border-transparent hover:border-[var(--color-border)]">
            Settings
          </button>
          <div className="h-4 w-px bg-[var(--color-border)] mx-1"></div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-error)] hover:bg-red-600 text-white rounded-md text-sm font-semibold transition-colors">
            <PhoneOff className="h-3.5 w-3.5" /> Leave
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Workspace (70%) */}
        <div className="w-[70%] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-surface)]">
          {/* Main Tabs */}
          <div className="h-12 border-b border-[var(--color-border)] flex items-center px-2 bg-[var(--color-bg-secondary)] shrink-0 gap-1">
            <button 
              onClick={() => setActiveMainTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeMainTab === 'code' ? 'bg-[var(--color-bg-surface)] text-[var(--color-accent)] border-t-2 border-t-[var(--color-accent)] border-x border-x-[var(--color-border)] -mb-px' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/50 border-t-2 border-t-transparent border-x border-x-transparent'}`}
            >
              <Code2 className="h-4 w-4" /> Code
            </button>
            <button 
              onClick={() => setActiveMainTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeMainTab === 'notes' ? 'bg-[var(--color-bg-surface)] text-[var(--color-accent)] border-t-2 border-t-[var(--color-accent)] border-x border-x-[var(--color-border)] -mb-px' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/50 border-t-2 border-t-transparent border-x border-x-transparent'}`}
            >
              <FileText className="h-4 w-4" /> Notes
            </button>
            <button 
              onClick={() => setActiveMainTab('problem')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeMainTab === 'problem' ? 'bg-[var(--color-bg-surface)] text-[var(--color-accent)] border-t-2 border-t-[var(--color-accent)] border-x border-x-[var(--color-border)] -mb-px' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/50 border-t-2 border-t-transparent border-x border-x-transparent'}`}
            >
              <LayoutTemplate className="h-4 w-4" /> Problem
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeMainTab === 'code' && (
              <div className="absolute inset-0 flex flex-col">
                <div className="h-10 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">graph.js</span>
                    <span className="text-xs text-[var(--color-text-muted)] italic">Aryan is editing line 18</span>
                  </div>
                  <div className="flex gap-2">
                     <select className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs rounded px-2 py-1 outline-none">
                       <option>JavaScript</option>
                       <option>Python</option>
                     </select>
                     <button className="px-3 py-1 bg-[var(--color-success)] hover:bg-green-600 text-white text-xs font-bold rounded">Run</button>
                  </div>
                </div>
                <div className="flex-1 bg-white">
                  <CodeEditor />
                </div>
              </div>
            )}
            
            {activeMainTab === 'notes' && (
              <div className="absolute inset-0 p-6 bg-white overflow-y-auto">
                <textarea 
                  className="w-full h-full resize-none outline-none text-[var(--color-text-primary)] font-mono text-sm"
                  defaultValue={`# Graph Traversal\n\n- [x] Understand BFS\n- [ ] Implement DFS\n- [ ] Solve shortest path\n- [ ] Practice weighted graphs\n\n## Notes\nBFS uses a queue to visit all neighbors first. Useful for shortest path in unweighted graphs.`}
                />
              </div>
            )}

            {activeMainTab === 'problem' && (
              <div className="absolute inset-0 p-6 bg-white overflow-y-auto prose max-w-none">
                <h3>Problem: Shortest Path in Unweighted Graph</h3>
                <p>Given an unweighted graph, a source vertex <code>s</code>, and a destination vertex <code>d</code>, print the shortest path from <code>s</code> to <code>d</code>. If there are multiple shortest paths, print any of them.</p>
                <div className="p-4 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border)]">
                  <strong>Example:</strong><br />
                  Input: <code>edges = [[0,1], [0,3], [1,2], [3,4], [3,7], [4,5], [4,6], [4,7], [5,6], [6,7]], src = 0, dest = 7</code><br />
                  Output: <code>[0, 3, 7]</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Panel (30%) */}
        <div className="w-[30%] flex flex-col bg-[var(--color-bg-secondary)] relative">
          
          <div className="p-4 flex gap-2 border-b border-[var(--color-border)] shrink-0">
             <div className="flex-1">
               <CameraPanel />
             </div>
             <div className="flex flex-col gap-2 justify-center">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full border transition-colors ${isMuted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'}`}>
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-2 rounded-full border transition-colors ${!isVideoOn ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'}`}>
                  {!isVideoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </button>
             </div>
          </div>

          <div className="flex items-center p-2 gap-1 border-b border-[var(--color-border)] bg-white shrink-0">
            <button 
              onClick={() => setActiveSideTab('chat')} 
              className={`flex-1 py-1.5 text-xs font-semibold rounded ${activeSideTab === 'chat' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/50'}`}
            >
              Live Chat
            </button>
            <button 
              onClick={() => setActiveSideTab('participants')} 
              className={`flex-1 py-1.5 text-xs font-semibold rounded ${activeSideTab === 'participants' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/50'}`}
            >
              Participants
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative bg-white">
            {activeSideTab === 'chat' && (
               <div className="absolute inset-0">
                 <Chat />
               </div>
            )}

            {activeSideTab === 'participants' && (
              <div className="absolute inset-0 p-4 overflow-y-auto space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-bold text-xs">AS</div>
                       <div>
                         <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">Aryan Sharma</p>
                         <p className="text-[10px] font-medium text-[var(--color-text-secondary)]">Host</p>
                       </div>
                    </div>
                    <Mic className="h-3 w-3 text-[var(--color-success)]" />
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">RP</div>
                       <div>
                         <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">Riya Patel</p>
                         <p className="text-[10px] font-medium text-[var(--color-success)]">Speaking</p>
                       </div>
                    </div>
                    <Mic className="h-3 w-3 text-[var(--color-success)]" />
                 </div>

                 <div className="flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-bold text-xs">KV</div>
                       <div>
                         <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">Kunal Verma</p>
                         <p className="text-[10px] font-medium text-[var(--color-text-secondary)]">Muted</p>
                       </div>
                    </div>
                    <MicOff className="h-3 w-3 text-[var(--color-text-muted)]" />
                 </div>
              </div>
            )}
          </div>

          {/* Peer Help Button */}
          <div className="p-4 border-t border-[var(--color-border)] bg-white shrink-0">
             <button className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[var(--color-accent)] font-semibold text-sm rounded-lg border border-[var(--color-accent-light)] transition-colors flex flex-col items-center justify-center">
               <span>Request Peer Help</span>
               <span className="text-[10px] font-medium text-[var(--color-text-secondary)] opacity-80 mt-0.5">Stuck? Ask everyone in the room.</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Meeting;

