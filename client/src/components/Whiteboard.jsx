import React, { useRef, useEffect, useState } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#111827');
  const [size, setSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const resize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.lineCap = 'round';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let last = { x: 0, y: 0 };

    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) };
    };

    const pointerDown = (e) => {
      drawing = true;
      last = toLocal(e);
      if (tool === 'text') {
        const txt = prompt('Enter text:');
        if (txt) {
          ctx.fillStyle = color;
          ctx.font = `${14}px sans-serif`;
          ctx.fillText(txt, last.x, last.y + 6);
        }
        drawing = false;
      }
    };

    const pointerMove = (e) => {
      if (!drawing || tool === 'text') return;
      const p = toLocal(e);
      ctx.beginPath();
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = size * 4;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
      }
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    };

    const pointerUp = () => { drawing = false; };

    canvas.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
    };
  }, [tool, color, size]);

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setTool('pen')} className={`px-2 py-1 rounded ${tool==='pen'?'bg-slate-200':''}`}>Pen</button>
          <button onClick={() => setTool('eraser')} className={`px-2 py-1 rounded ${tool==='eraser'?'bg-slate-200':''}`}>Eraser</button>
          <button onClick={() => setTool('text')} className={`px-2 py-1 rounded ${tool==='text'?'bg-slate-200':''}`}>Text</button>
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-8 h-8 p-0 border rounded" />
          <input type="range" min="1" max="10" value={size} onChange={(e)=>setSize(Number(e.target.value))} />
          <button onClick={clearBoard} className="px-3 py-1 border rounded">Clear</button>
        </div>
      </div>

      <div className="flex-1 border rounded overflow-hidden">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} />
      </div>
    </div>
  );
};

export default Whiteboard;
