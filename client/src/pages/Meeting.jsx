import React, { useState, useRef, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import Whiteboard from '../components/Whiteboard';
import CameraPanel from '../components/CameraPanel';

const Meeting = () => {
  // left column width percent
  const [leftPct, setLeftPct] = useState(() => {
    const saved = localStorage.getItem('meeting.leftPct');
    return saved ? Number(saved) : 65;
  });
  // right pane top row percent (of right column height)
  const [rightTopPct, setRightTopPct] = useState(() => {
    const saved = localStorage.getItem('meeting.rightTopPct');
    return saved ? Number(saved) : 50;
  });

  const containerRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {};
    return () => {}; // noop - handlers attached per drag start
  }, []);

  const startVerticalDrag = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const onPointerMove = (ev) => {
      const x = ev.clientX - rect.left;
      let pct = Math.round((x / rect.width) * 100);
      if (pct < 30) pct = 30;
      if (pct > 80) pct = 80;
      setLeftPct(pct);
      lastPct = pct;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onUp);
      // snap behavior
      const snaps = [50, 65];
      for (const s of snaps) {
        if (Math.abs(lastPct - s) <= 5) {
          lastPct = s;
          setLeftPct(s);
          break;
        }
      }
      localStorage.setItem('meeting.leftPct', String(lastPct));
    };

    let lastPct = leftPct;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onUp);
  };

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
    };

    let lastPct = rightTopPct;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onUp);

    const onUpWrapped = () => {
      // snap to common breakpoint (50%)
      if (Math.abs(lastPct - 50) <= 6) lastPct = 50;
      setRightTopPct(lastPct);
      localStorage.setItem('meeting.rightTopPct', String(lastPct));
    };
    window.addEventListener('pointerup', onUpWrapped, { once: true });
  };

  return (
    <div className="h-[calc(100vh-4rem)] mt-16 p-0 bg-[var(--color-bg-primary)] overflow-hidden">
      <div ref={containerRef} className="h-full flex relative" style={{ gap: 16 }}>
        <div style={{ width: `${leftPct}%`, minWidth: '300px' }} className="h-full py-4 pl-4">
          <div className="h-full gfg-panel p-4 flex flex-col">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <div className="font-bold text-[var(--color-text-primary)]">Code Editor</div>
              <div>
                <button onClick={() => { setLeftPct(65); setRightTopPct(50); }} className="px-3 py-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-md text-xs font-semibold transition-colors">Reset Layout</button>
              </div>
            </div>
            <div className="flex-grow mt-4 transition-all duration-150">
              <CodeEditor />
            </div>
          </div>
        </div>

        <div style={{ width: `${100 - leftPct}%` }} className="h-full py-4 pr-4 flex flex-col relative" ref={rightRef}>
          <div style={{ height: `${rightTopPct}%` }} className="h-1/2 transition-all duration-150 pb-2">
            <div className="h-full gfg-panel p-4 flex flex-col">
              <div className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Whiteboard</div>
              <div className="flex-grow mt-4">
                <Whiteboard />
              </div>
            </div>
          </div>

          <div 
            onPointerDown={startHorizontalDrag} 
            className="absolute left-0 right-4 h-4 cursor-row-resize z-10 flex items-center justify-center hover:bg-[var(--color-accent-muted)] transition-colors rounded"
            style={{ top: `calc(${rightTopPct}% - 8px)` }}
          >
            <div className="w-8 h-1 bg-[var(--color-border)] rounded-full"></div>
          </div>

          <div style={{ height: `${100 - rightTopPct}%` }} className="h-1/2 transition-all duration-150 pt-2">
            <div className="h-full gfg-panel p-4 flex flex-col">
              <div className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Camera</div>
              <div className="flex-grow mt-4">
                <CameraPanel />
              </div>
            </div>
          </div>
        </div>
        
        <div 
          onPointerDown={startVerticalDrag} 
          className="absolute top-4 bottom-4 w-4 cursor-col-resize z-10 flex flex-col items-center justify-center hover:bg-[var(--color-accent-muted)] transition-colors rounded" 
          style={{ right: `${100 - leftPct}%`, transform: 'translateX(8px)' }} 
        >
          <div className="h-8 w-1 bg-[var(--color-border)] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
