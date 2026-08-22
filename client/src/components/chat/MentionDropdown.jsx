import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

const MentionDropdown = ({ members, selectedIndex, onSelect }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to selected item
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.children[selectedIndex]) {
      const activeItem = scrollRef.current.children[selectedIndex];
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="absolute bottom-full left-0 mb-2 w-72 max-h-64 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-xl z-50 flex flex-col custom-scrollbar">
      <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50/50 sticky top-0 z-10 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Mention a member
      </div>
      
      <ul ref={scrollRef} className="py-1">
        {members.length === 0 ? (
          <li className="px-4 py-3 text-sm text-zinc-500 text-center">
            No members found
          </li>
        ) : (
          members.map((member, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={member._id}
                onClick={() => onSelect(member)}
                onMouseEnter={() => {}} // Could sync with selectedIndex if wanted
                className={`px-3 py-2 mx-1 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm flex-shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-zinc-900 truncate">{member.name}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default MentionDropdown;
