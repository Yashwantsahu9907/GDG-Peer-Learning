import React, { useState } from 'react';

import TypingIndicator from '../components/TypingIndicator';

const messagesMock = [
  { id: 1, author: 'Alice', text: 'Hi, anyone free to review my PR?', time: '10:02' },
  { id: 2, author: 'You', text: 'I can take a look after standup.', time: '10:05', read: true },
];

const Chat = () => {
  const [messages] = useState(messagesMock);
  const [text, setText] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 leetcode-card p-4">
        <h4 className="font-semibold">Participants</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Alice <span className="text-xs text-green-500">● online</span></li>
          <li>Bob <span className="text-xs text-slate-400">● offline</span></li>
        </ul>
      </aside>

      <section className="md:col-span-3 leetcode-card p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map(m => (
            <div key={m.id} className={`p-3 rounded ${m.author === 'You' ? 'bg-indigo-50 self-end' : 'bg-slate-50'} max-w-xl`}> 
              <div className="text-sm text-slate-700">{m.text}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">{m.time} {m.read && <span className="text-indigo-600">✓✓</span>}</div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <TypingIndicator />
          <div className="flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)} className="flex-1 px-4 py-2 border rounded" placeholder="Type a message..." />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
