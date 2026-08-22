import { useState, useEffect, useRef, useCallback } from 'react';

export const useMentionAutocomplete = (inputValue, members, onSelectMention) => {
  const [mentionState, setMentionState] = useState({
    isActive: false,
    query: '',
    startIndex: -1,
  });
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Update mention state based on input value
  useEffect(() => {
    // We only trigger mention context if cursor is right after some text that starts with @
    // Because we don't have direct access to cursor position easily without ref, 
    // we assume the user is typing at the end of the string for simplicity,
    // OR we can find the last @ in the string.
    
    // Better regex: look for @ followed by any word characters at the end of the string.
    // Or if there's a match of an @ symbol that has no space after it.
    
    const lastAtSignIndex = inputValue.lastIndexOf('@');
    
    if (lastAtSignIndex !== -1) {
      // Ensure it's either the start of the string or preceded by a space
      if (lastAtSignIndex === 0 || inputValue[lastAtSignIndex - 1] === ' ' || inputValue[lastAtSignIndex - 1] === '\\n') {
        const queryStr = inputValue.slice(lastAtSignIndex + 1);
        
        // If there's a space after @, it means the mention typing is over
        if (!queryStr.includes(' ')) {
          setMentionState({
            isActive: true,
            query: queryStr,
            startIndex: lastAtSignIndex,
          });
          return;
        }
      }
    }
    
    setMentionState({ isActive: false, query: '', startIndex: -1 });
  }, [inputValue]);

  // Filter members when query or members change
  useEffect(() => {
    if (mentionState.isActive && members.length > 0) {
      const queryLower = mentionState.query.toLowerCase();
      const filtered = members.filter(member => 
        member.name.toLowerCase().includes(queryLower)
      );
      setFilteredMembers(filtered);
      setSelectedIndex(0); // Reset selection
    } else {
      setFilteredMembers([]);
    }
  }, [mentionState.isActive, mentionState.query, members]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!mentionState.isActive) return false;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredMembers.length);
      return true; // handled
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredMembers.length) % filteredMembers.length);
      return true; // handled
    }

    if ((e.key === 'Enter' || e.key === 'Tab') && filteredMembers.length > 0) {
      e.preventDefault();
      const selectedMember = filteredMembers[selectedIndex];
      if (selectedMember) {
        insertMention(selectedMember);
      }
      return true; // handled
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setMentionState({ isActive: false, query: '', startIndex: -1 });
      return true;
    }

    return false; // not handled
  }, [mentionState.isActive, filteredMembers, selectedIndex]);

  const insertMention = (member) => {
    const beforeMention = inputValue.slice(0, mentionState.startIndex);
    // Replace the @query with @MemberName 
    const newText = `${beforeMention}@${member.name} `;
    
    onSelectMention(newText, member);
    setMentionState({ isActive: false, query: '', startIndex: -1 });
  };

  return {
    isMentionActive: mentionState.isActive,
    filteredMembers,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    insertMention
  };
};
