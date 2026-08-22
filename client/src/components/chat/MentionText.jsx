import React from 'react';

const MentionText = ({ text, mentions = [] }) => {
  if (!mentions || mentions.length === 0 || !text) {
    return <>{text}</>;
  }

  // We want to split the text by `@Name` and replace with a span
  // Since multiple names might exist, we can build a regex
  
  // Sort by length descending so longer names match first
  const sortedMentions = [...mentions].sort((a, b) => b.name.length - a.name.length);
  
  // Escape names for regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const namesPattern = sortedMentions.map(m => escapeRegExp(`@${m.name}`)).join('|');
  const regex = new RegExp(`(${namesPattern})`, 'g');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const matchingMention = sortedMentions.find(m => `@${m.name}` === part);
        if (matchingMention) {
          return (
            <span 
              key={i} 
              className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-medium cursor-pointer hover:underline mx-0.5 inline-block"
              title={matchingMention.name}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export default MentionText;
