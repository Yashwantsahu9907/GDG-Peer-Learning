import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import Whiteboard from '../components/Whiteboard';
import CameraPanel from '../components/CameraPanel';
import { 
  Columns, LayoutGrid, Maximize2, Minimize2, PhoneOff, 
  Sparkles, RotateCcw, MonitorPlay, Users, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

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
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
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
    <div className="fixed inset-0 pt-16 z-40 bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-100 text-sm">Collab Room</span>
          </div>

          <div className="text-slate-300 font-mono text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {elapsedTime}
          </div>
        </div>

        {/* Layout Presets & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => applyLayout(62, 50)}
              className={`px-2.5 py-1 rounded transition-colors ${leftPct === 62 ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Standard Layout (60/40)"
            >
              Default
            </button>
            <button
              onClick={() => applyLayout(50, 50)}
              className={`px-2.5 py-1 rounded transition-colors ${leftPct === 50 ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Split 50/50"
            >
              50 / 50
            </button>
            <button
              onClick={() => applyLayout(75, 40)}
              className={`px-2.5 py-1 rounded transition-colors ${leftPct === 75 ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Code Focus Layout"
            >
              Code Focus
            </button>
            <button
              onClick={() => applyLayout(35, 70)}
              className={`px-2.5 py-1 rounded transition-colors ${leftPct === 35 ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Board Focus Layout"
            >
              Board Focus
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
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
      <div className="flex-grow p-3 bg-slate-950 overflow-hidden relative">
        <div ref={containerRef} className="h-full w-full flex relative select-none">
          
          {/* LEFT PANE: Code Editor */}
          <div style={{ width: `${leftPct}%`, minWidth: '280px' }} className="h-full flex flex-col pr-1.5">
            <CodeEditor />
          </div>

          {/* VERTICAL DIVIDER RESIZER */}
          <div 
            onPointerDown={startVerticalDrag} 
            className="w-3 cursor-col-resize z-30 flex flex-col items-center justify-center group hover:bg-blue-500/10 transition-colors rounded"
            title="Drag to resize panes"
          >
            <div className="h-8 w-1 bg-slate-700 group-hover:bg-blue-400 group-hover:scale-y-125 rounded-full transition-all"></div>
          </div>

          {/* RIGHT PANE: Whiteboard (Top) + Camera (Bottom) */}
          <div style={{ width: `${100 - leftPct}%`, minWidth: '280px' }} className="h-full flex flex-col pl-1.5 relative" ref={rightRef}>
            
            {/* Whiteboard Subpane */}
            <div style={{ height: `${rightTopPct}%` }} className="w-full pb-1.5">
              <Whiteboard roomId="meeting-collab-room" />
            </div>

            {/* HORIZONTAL DIVIDER RESIZER */}
            <div 
              onPointerDown={startHorizontalDrag} 
              className="h-3 w-full cursor-row-resize z-30 flex items-center justify-center group hover:bg-blue-500/10 transition-colors rounded shrink-0"
              title="Drag to resize whiteboard and camera"
            >
              <div className="w-8 h-1 bg-slate-700 group-hover:bg-blue-400 group-hover:scale-x-125 rounded-full transition-all"></div>
            </div>

            {/* Camera Subpane */}
            <div style={{ height: `${100 - rightTopPct}%` }} className="w-full pt-1.5">
              <CameraPanel />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Meeting;

