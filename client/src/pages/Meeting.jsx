import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import CameraPanel from '../components/CameraPanel';
import { Users, FileText, Code2, MessageSquare, Video, PhoneOff, Mic, MicOff, VideoOff, LayoutTemplate, Share2, Settings, UserPlus, Play, Save, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {
  const [activeMainTab, setActiveMainTab] = useState('code'); // code, notes, problem
  const [activeSideTab, setActiveSideTab] = useState('chat'); // chat, participants
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)] overflow-hidden font-sans">
      
      {/* 1. Ultra-Compact Room Header */}
      <div className="h-12 border-b border-[var(--color-border)] bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Live</span>
          </div>
          <div className="h-3 w-px bg-[var(--color-border)]"></div>
          <h1 className="font-bold text-[var(--color-text-primary)] text-sm">Graph Algorithms</h1>
          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded uppercase tracking-wider">DSA</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
          <Users className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>12 participants</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded transition-colors" title="Invite">
            <UserPlus className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded transition-colors" title="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded transition-colors" title="Settings">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-[var(--color-border)] mx-1"></div>
          <button onClick={() => navigate('/dashboard')} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-bold transition-colors">
            Leave
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Workspace (70%) */}
        <div className="w-[70%] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] relative">
          
          {/* Main Tabs */}
          <div className="h-10 border-b border-[var(--color-border)] flex items-center px-2 bg-white shrink-0 gap-1">
            <button 
              onClick={() => setActiveMainTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeMainTab === 'code' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/50'}`}
            >
              <Code2 className="h-4 w-4" /> Code
            </button>
            <button 
              onClick={() => setActiveMainTab('problem')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeMainTab === 'problem' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/50'}`}
            >
              <LayoutTemplate className="h-4 w-4" /> Problem
            </button>
            <button 
              onClick={() => setActiveMainTab('notes')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeMainTab === 'notes' ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/50'}`}
            >
              <FileText className="h-4 w-4" /> Notes
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative bg-white">
            
            {/* Code Editor */}
            {activeMainTab === 'code' && (
              <div className="absolute inset-0 flex flex-col bg-[#1E1E1E]">
                {/* Editor Tabs & Status */}
                <div className="h-9 bg-[#252526] flex items-center justify-between px-2 shrink-0 border-b border-[#3C3C3C]">
                  <div className="flex items-center h-full">
                    <div className="px-4 h-full flex items-center gap-2 bg-[#1E1E1E] border-t border-t-[#007ACC] text-[#CCCCCC] text-xs font-mono border-r border-r-[#3C3C3C]">
                      <span className="text-[#E3C363]">JS</span> main.js
                    </div>
                    <div className="px-4 h-full flex items-center gap-2 text-[#787878] text-xs font-mono border-r border-r-[#3C3C3C] cursor-pointer hover:bg-[#2A2D2E]">
                      utils.js
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pr-2">
                    <span className="text-[#4EC9B0] text-xs font-mono flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[#4EC9B0]"></div> Aryan is editing line 18</span>
                    <button className="flex items-center gap-1 text-xs font-bold bg-[#007ACC] hover:bg-[#005A9E] text-white px-2 py-0.5 rounded transition-colors">
                      <Play className="h-3 w-3" /> Run
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                   <CodeEditor />
                </div>
                {/* Bottom Status Bar */}
                <div className="h-6 bg-[#007ACC] flex items-center px-3 text-white text-[10px] font-mono shrink-0 justify-between">
                  <div className="flex items-center gap-4">
                    <span>main.js</span>
                    <span>UTF-8</span>
                    <span>JavaScript React</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Save className="h-3 w-3" /> Saved
                  </div>
                </div>
              </div>
            )}
            
            {/* Problem Context */}
            {activeMainTab === 'problem' && (
              <div className="absolute inset-0 p-8 overflow-y-auto">
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Shortest Path in an Unweighted Graph</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs rounded-md border border-green-200 transition-colors">
                      <CheckCircle2 className="h-4 w-4" /> Mark as Solved
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mb-6 text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">Medium</span>
                    <span className="text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded border border-[var(--color-border)]">Graph</span>
                    <span className="text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded border border-[var(--color-border)]">BFS</span>
                    <span className="text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded border border-[var(--color-border)]">Algorithms</span>
                  </div>

                  <div className="prose prose-sm max-w-none text-[var(--color-text-primary)]">
                    <p>Given an unweighted graph, a source vertex <code>s</code>, and a destination vertex <code>d</code>, print the shortest path from <code>s</code> to <code>d</code>. If there are multiple shortest paths, print any of them.</p>
                    
                    <div className="my-6 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] font-mono text-sm shadow-sm">
                      <strong className="text-[var(--color-text-primary)] font-sans">Example 1:</strong><br /><br />
                      <span className="text-[var(--color-text-secondary)]">Input:</span> edges = [[0,1], [0,3], [1,2], [3,4], [3,7], [4,5], [4,6], [4,7], [5,6], [6,7]], src = 0, dest = 7<br />
                      <span className="text-[var(--color-text-secondary)]">Output:</span> [0, 3, 7]
                    </div>

                    <h4 className="font-bold text-[var(--color-text-primary)] mt-6 mb-2">Constraints:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      <li><code>1 &lt;= V &lt;= 10^5</code></li>
                      <li><code>0 &lt;= E &lt;= 2 * 10^5</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {activeMainTab === 'notes' && (
              <div className="absolute inset-0 p-6 overflow-y-auto">
                <textarea 
                  className="w-full h-full resize-none outline-none text-[var(--color-text-primary)] font-mono text-sm placeholder:text-[var(--color-text-muted)]"
                  placeholder="Type your notes here..."
                  defaultValue={`# Graph Traversal\n\n- [x] Understand BFS\n- [ ] Implement DFS\n- [ ] Solve shortest path\n- [ ] Practice weighted graphs\n\n## Notes\nBFS uses a queue to visit all neighbors first. Useful for shortest path in unweighted graphs.`}
                />
              </div>
            )}

          </div>
        </div>

        {/* Community Panel (30%) */}
        <div className="w-[30%] flex flex-col bg-white relative">
          
          <div className="p-3 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-bg-primary)]">
             <div className="flex gap-2">
               <div className="flex-1 rounded-lg overflow-hidden border border-[var(--color-border)] shadow-sm">
                 <CameraPanel />
               </div>
               <div className="flex flex-col gap-2 justify-center">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-2.5 rounded-lg border transition-colors shadow-sm ${isMuted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-[var(--color-text-primary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'}`}>
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-2.5 rounded-lg border transition-colors shadow-sm ${!isVideoOn ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-[var(--color-text-primary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'}`}>
                    {!isVideoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </button>
               </div>
             </div>
          </div>

          <div className="flex items-center p-2 gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
            <button 
              onClick={() => setActiveSideTab('chat')} 
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${activeSideTab === 'chat' ? 'bg-white text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
            >
              Live Chat
            </button>
            <button 
              onClick={() => setActiveSideTab('participants')} 
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${activeSideTab === 'participants' ? 'bg-white text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}
            >
              Participants
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            
            {/* Inline Compact Chat */}
            {activeSideTab === 'chat' && (
               <div className="absolute inset-0 flex flex-col bg-white">
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[var(--color-text-primary)]">Riya</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">10:02 AM</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 rounded-lg rounded-tl-none w-fit">Why BFS here?</p>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">10:05 AM</span>
                        <span className="font-bold text-sm text-[var(--color-accent)]">Aryan</span>
                      </div>
                      <p className="text-sm text-white bg-[var(--color-accent)] px-3 py-2 rounded-lg rounded-tr-none w-fit">Because every edge has equal weight.</p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[var(--color-text-primary)]">Kunal</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">10:06 AM</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 rounded-lg rounded-tl-none w-fit">Got it 👍</p>
                    </div>
                 </div>
                 <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] shrink-0">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Message the room..." 
                        className="flex-1 text-sm bg-white border border-[var(--color-border)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                 </div>
               </div>
            )}

            {/* Participants */}
            {activeSideTab === 'participants' && (
              <div className="absolute inset-0 p-4 overflow-y-auto space-y-4">
                 
                 <div className="flex items-start justify-between group">
                    <div className="flex items-start gap-3">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)] shrink-0 border border-[var(--color-border)]">AS</div>
                       <div>
                         <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                           Aryan Sharma <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
                         </p>
                         <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-0.5">Host · Speaking</p>
                       </div>
                    </div>
                    <Mic className="h-3.5 w-3.5 text-[var(--color-success)] mt-1" />
                 </div>
                 
                 <div className="flex items-start justify-between group">
                    <div className="flex items-start gap-3">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--color-accent-muted)]">RP</div>
                       <div>
                         <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                           Riya Patel <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
                         </p>
                         <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-0.5">Working on solution</p>
                       </div>
                    </div>
                    <Mic className="h-3.5 w-3.5 text-[var(--color-success)] mt-1" />
                 </div>

                 <div className="flex items-start justify-between group opacity-70">
                    <div className="flex items-start gap-3">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)] shrink-0 border border-[var(--color-border)]">KV</div>
                       <div>
                         <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                           Kunal Verma <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
                         </p>
                         <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-0.5">Listening</p>
                       </div>
                    </div>
                    <MicOff className="h-3.5 w-3.5 text-[var(--color-text-muted)] mt-1" />
                 </div>

                 <div className="flex items-start justify-between group opacity-50">
                    <div className="flex items-start gap-3">
                       <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)] shrink-0 border border-[var(--color-border)]">DS</div>
                       <div>
                         <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight flex items-center gap-1.5">
                           Dev Shah <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]"></span>
                         </p>
                         <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-0.5">Muted</p>
                       </div>
                    </div>
                    <MicOff className="h-3.5 w-3.5 text-[var(--color-text-muted)] mt-1" />
                 </div>

              </div>
            )}
          </div>

          {/* Peer Help System (Signature Feature) */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] shrink-0">
             <div className="bg-white border border-[var(--color-border)] rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-3">
                  <HelpCircle className="h-4 w-4 text-[var(--color-accent)]" />
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Need help?</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button className="text-[10px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)] py-1.5 rounded transition-colors">
                    Explain concept
                  </button>
                  <button className="text-[10px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)] py-1.5 rounded transition-colors">
                    Debug code
                  </button>
                  <button className="text-[10px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)] py-1.5 rounded transition-colors">
                    Review approach
                  </button>
                  <button className="text-[10px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)] py-1.5 rounded transition-colors">
                    Give a hint
                  </button>
                </div>
                <button className="w-full py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-xs rounded transition-colors">
                  Ask the Room
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Meeting;

