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
    <div className="h-screen full-bleed p-0">
      <div ref={containerRef} className="h-full flex relative" style={{ gap: 16 }}>
        <div style={{ width: `${leftPct}%`, minWidth: '300px' }} className="h-full p-4">
          <div className="h-full leetcode-card p-4">
            <div className="panel-header">
              <div>Editor</div>
              <div className="panel-controls">
                <button onClick={() => { setLeftPct(65); setRightTopPct(50); }} className="px-2 py-1">Reset</button>
              </div>
            </div>
            <div className="h-[calc(100%-48px)] mt-2 transition-all duration-150">
              <CodeEditor />
            </div>
          </div>
        </div>

        <div style={{ width: `${100 - leftPct}%` }} className="h-full p-4 flex flex-col" ref={rightRef}>
          <div style={{ height: `${rightTopPct}%` }} className="h-1/2 transition-all duration-150">
            <div className="h-full leetcode-card p-4">
              <div className="panel-header"><div>Whiteboard</div></div>
              <div className="h-[calc(100%-28px)] mt-2">
                <Whiteboard />
              </div>
            </div>
          </div>

          <div onPointerDown={startHorizontalDrag} className="divider-horizontal" />

          <div style={{ height: `${100 - rightTopPct}%` }} className="h-1/2 transition-all duration-150">
            <div className="h-full leetcode-card p-4">
              <div className="panel-header"><div>Camera</div></div>
              <div className="h-[calc(100%-28px)] mt-2">
                <CameraPanel />
              </div>
            </div>
          </div>
        </div>
        <div onPointerDown={startVerticalDrag} className="divider-vertical" style={{ position: 'absolute', right: `${100 - leftPct}%`, top: 0, bottom: 0, transform: 'translateX( -4px )' }} />
      </div>
    </div>
  );
};

export default Meeting;
