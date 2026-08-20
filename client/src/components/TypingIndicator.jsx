import React from'react';

const TypingIndicator = () => {
 return (
 <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
 <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
 <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse delay-75" />
 <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse delay-150" />
 <span className="ml-2">Someone is typing…</span>
 </div>
 );
};

export default TypingIndicator;
