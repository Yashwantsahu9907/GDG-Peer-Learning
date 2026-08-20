import React, { useRef, useEffect, useState, useCallback } from'react';
import { Pen, Eraser, Type, Trash2, Square, Circle, Minus } from'lucide-react';
import { socketService } from'../utils/socket';

const COLORS = ['#ffffff', // White'#3b82f6', // Blue'#10b981', // Emerald'#f59e0b', // Amber'#ef4444', // Red'#a855f7', // Purple
];

const Whiteboard = ({ roomId ='default-room' }) => {
 const canvasRef = useRef(null);
 const containerRef = useRef(null);
 const [tool, setTool] = useState('pen'); //'pen' |'eraser' |'rect' |'circle' |'line' |'text'
 const [color, setColor] = useState('#3b82f6');
 const [size, setSize] = useState(3);

 // Resize canvas handler
 useEffect(() => {
 const canvas = canvasRef.current;
 const container = containerRef.current;
 if (!canvas || !container) return;

 const resize = () => {
 const rect = container.getBoundingClientRect();
 if (rect.width === 0 || rect.height === 0) return;
 
 const tempCanvas = document.createElement('canvas');
 tempCanvas.width = canvas.width;
 tempCanvas.height = canvas.height;
 const tempCtx = tempCanvas.getContext('2d');
 tempCtx.drawImage(canvas, 0, 0);

 canvas.width = rect.width * (window.devicePixelRatio || 1);
 canvas.height = rect.height * (window.devicePixelRatio || 1);
 canvas.style.width =`${rect.width}px`;
 canvas.style.height =`${rect.height}px`;

 const ctx = canvas.getContext('2d');
 ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
 ctx.lineCap ='round';
 ctx.lineJoin ='round';
 ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
 };

 resize();
 const ro = new ResizeObserver(() => resize());
 ro.observe(container);

 return () => ro.disconnect();
 }, []);

 // Remote drawing event listener
 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;

 const handleRemoteDraw = ({ drawData }) => {
 if (!drawData) return;
 const ctx = canvas.getContext('2d');
 const rect = canvas.getBoundingClientRect();
 const { type, from, to, color: strokeColor, size: strokeSize, tool: strokeTool, text } = drawData;

 const scaleX = rect.width;
 const scaleY = rect.height;

 const fromX = from.x * scaleX;
 const fromY = from.y * scaleY;
 const toX = to ? to.x * scaleX : fromX;
 const toY = to ? to.y * scaleY : fromY;

 if (type ==='stroke') {
 if (strokeTool ==='eraser') {
 ctx.globalCompositeOperation ='destination-out';
 ctx.lineWidth = strokeSize * 5;
 } else {
 ctx.globalCompositeOperation ='source-over';
 ctx.strokeStyle = strokeColor;
 ctx.lineWidth = strokeSize;
 }
 ctx.beginPath();
 ctx.moveTo(fromX, fromY);
 ctx.lineTo(toX, toY);
 ctx.stroke();
 } else if (type ==='shape') {
 ctx.globalCompositeOperation ='source-over';
 ctx.strokeStyle = strokeColor;
 ctx.lineWidth = strokeSize;
 ctx.beginPath();

 if (strokeTool ==='line') {
 ctx.moveTo(fromX, fromY);
 ctx.lineTo(toX, toY);
 } else if (strokeTool ==='rect') {
 ctx.strokeRect(fromX, fromY, toX - fromX, toY - fromY);
 } else if (strokeTool ==='circle') {
 const radius = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
 ctx.arc(fromX, fromY, radius, 0, 2 * Math.PI);
 } else if (strokeTool ==='text' && text) {
 ctx.fillStyle = strokeColor;
 ctx.font =`${strokeSize * 4 + 10}px sans-serif`;
 ctx.fillText(text, fromX, fromY);
 }
 ctx.stroke();
 }
 };

 const handleRemoteClear = () => {
 const ctx = canvas.getContext('2d');
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 };

 socketService.on('whiteboard_draw', handleRemoteDraw);
 socketService.on('whiteboard_clear', handleRemoteClear);

 return () => {
 socketService.off('whiteboard_draw', handleRemoteDraw);
 socketService.off('whiteboard_clear', handleRemoteClear);
 };
 }, []);

 // Local drawing handlers
 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 let drawing = false;
 let startPos = { x: 0, y: 0 };
 let snapshot = null;

 const toLocal = (e) => {
 const rect = canvas.getBoundingClientRect();
 return { 
 x: e.clientX - rect.left, 
 y: e.clientY - rect.top,
 normX: (e.clientX - rect.left) / rect.width,
 normY: (e.clientY - rect.top) / rect.height
 };
 };

 const pointerDown = (e) => {
 drawing = true;
 startPos = toLocal(e);
 snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

 if (tool ==='text') {
 const txt = prompt('Enter text for whiteboard:');
 if (txt) {
 ctx.fillStyle = color;
 ctx.font =`${size * 4 + 10}px sans-serif`;
 ctx.fillText(txt, startPos.x, startPos.y);

 socketService.emit('whiteboard_draw', {
 roomId,
 drawData: {
 type:'shape',
 tool:'text',
 from: { x: startPos.normX, y: startPos.normY },
 color,
 size,
 text: txt
 }
 });
 }
 drawing = false;
 }
 };

 const pointerMove = (e) => {
 if (!drawing || tool ==='text') return;
 const p = toLocal(e);

 if (tool ==='pen' || tool ==='eraser') {
 if (tool ==='eraser') {
 ctx.globalCompositeOperation ='destination-out';
 ctx.lineWidth = size * 5;
 } else {
 ctx.globalCompositeOperation ='source-over';
 ctx.strokeStyle = color;
 ctx.lineWidth = size;
 }
 ctx.beginPath();
 ctx.moveTo(startPos.x, startPos.y);
 ctx.lineTo(p.x, p.y);
 ctx.stroke();

 // Broadcast continuous stroke
 socketService.emit('whiteboard_draw', {
 roomId,
 drawData: {
 type:'stroke',
 tool,
 from: { x: startPos.normX, y: startPos.normY },
 to: { x: p.normX, y: p.normY },
 color,
 size
 }
 });

 startPos = p;
 } else if (['rect','circle','line'].includes(tool)) {
 ctx.putImageData(snapshot, 0, 0);
 ctx.globalCompositeOperation ='source-over';
 ctx.strokeStyle = color;
 ctx.lineWidth = size;
 ctx.beginPath();

 if (tool ==='line') {
 ctx.moveTo(startPos.x, startPos.y);
 ctx.lineTo(p.x, p.y);
 } else if (tool ==='rect') {
 ctx.strokeRect(startPos.x, startPos.y, p.x - startPos.x, p.y - startPos.y);
 } else if (tool ==='circle') {
 const radius = Math.sqrt(Math.pow(p.x - startPos.x, 2) + Math.pow(p.y - startPos.y, 2));
 ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
 }
 ctx.stroke();
 }
 };

 const pointerUp = (e) => {
 if (!drawing) return;
 drawing = false;
 const endPos = toLocal(e);

 if (['rect','circle','line'].includes(tool)) {
 socketService.emit('whiteboard_draw', {
 roomId,
 drawData: {
 type:'shape',
 tool,
 from: { x: startPos.normX, y: startPos.normY },
 to: { x: endPos.normX, y: endPos.normY },
 color,
 size
 }
 });
 }
 };

 canvas.addEventListener('pointerdown', pointerDown);
 window.addEventListener('pointermove', pointerMove);
 window.addEventListener('pointerup', pointerUp);

 return () => {
 canvas.removeEventListener('pointerdown', pointerDown);
 window.removeEventListener('pointermove', pointerMove);
 window.removeEventListener('pointerup', pointerUp);
 };
 }, [tool, color, size, roomId]);

 const clearBoard = () => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 socketService.emit('whiteboard_clear', { roomId });
 };

 return (
 <div className="h-full w-full flex flex-col rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-xl font-sans">
 {/* Toolbar */}
 <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white border-b border-gray-200 shrink-0">
 <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
 <button 
 onClick={() => setTool('pen')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='pen' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Pen"
 >
 <Pen className="h-3.5 w-3.5" />
 </button>
 <button 
 onClick={() => setTool('line')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='line' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Line"
 >
 <Minus className="h-3.5 w-3.5" />
 </button>
 <button 
 onClick={() => setTool('rect')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='rect' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Rectangle"
 >
 <Square className="h-3.5 w-3.5" />
 </button>
 <button 
 onClick={() => setTool('circle')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='circle' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Circle"
 >
 <Circle className="h-3.5 w-3.5" />
 </button>
 <button 
 onClick={() => setTool('text')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='text' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Text"
 >
 <Type className="h-3.5 w-3.5" />
 </button>
 <button 
 onClick={() => setTool('eraser')} 
 className={`p-1.5 rounded-md transition-colors ${tool ==='eraser' ?'bg-emerald-600 text-white' :'text-gray-600 hover:text-gray-900'}`}
 title="Eraser"
 >
 <Eraser className="h-3.5 w-3.5" />
 </button>
 </div>

 {/* Color Palette Chips */}
 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
 {COLORS.map((c) => (
 <button
 key={c}
 onClick={() => setColor(c)}
 className={`w-4 h-4 rounded-full transition-transform ${color === c ?'scale-125 ring-2 ring-emerald-400' :'hover:scale-110 opacity-80'}`}
 style={{ backgroundColor: c }}
 />
 ))}
 <input 
 type="color" 
 value={color} 
 onChange={(e) => setColor(e.target.value)} 
 className="w-4 h-4 p-0 rounded cursor-pointer border-0 bg-transparent opacity-60 hover:opacity-100"
 title="Custom color"
 />
 </div>

 {/* Stroke Size Slider & Clear */}
 <div className="flex items-center gap-2">
 <div className="flex items-center gap-1 text-gray-600 text-xs bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
 <span className="text-[10px]">Size</span>
 <input 
 type="range" 
 min="1" 
 max="12" 
 value={size} 
 onChange={(e) => setSize(Number(e.target.value))} 
 className="w-14 accent-emerald-500 cursor-pointer h-1.5 bg-gray-200 rounded"
 />
 </div>

 <button 
 onClick={clearBoard} 
 className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-red-400 bg-gray-50 hover:bg-red-100 border border-gray-200 rounded-lg transition-colors"
 title="Clear whiteboard"
 >
 <Trash2 className="h-3 w-3" />
 <span className="hidden sm:inline">Clear</span>
 </button>
 </div>
 </div>

 {/* Canvas Area with subtle grid pattern */}
 <div 
 ref={containerRef} 
 className="flex-grow w-full h-full relative overflow-hidden bg-white"
 style={{ 
 backgroundImage:'radial-gradient(#e5e7eb 1px, transparent 1px)', 
 backgroundSize:'24px 24px' 
 }}
 >
 <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none cursor-crosshair" />
 </div>
 </div>
 );
};

export default Whiteboard;


