import React from 'react';

interface LyricLine {
  id: string;
  text: string;
  timestamp: number;
}

interface Props {
  lyrics: LyricLine[];
  activeIndex: number;
}

export const LyricsDisplay: React.FC<Props> = ({ lyrics, activeIndex }) => {
  return (
    <div className="overflow-y-auto max-h-96 p-4">
      {lyrics.map((line, i) => (
        <div
          key={line.id}
          className={`text-center transition-all duration-300 ${
            i === activeIndex ? 'text-blue-500 text-xl font-semibold' : 'text-gray-400'
          }`}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
