import { fetchLyrics } from '@/api/lyrics';
import { useEffect, useState } from 'react';

interface LyricLine {
  id: string;
  text: string;
  timestamp: number;
}

export function useLyrics(trackId: string, currentTime: number) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    fetchLyrics(trackId).then(setLyrics);
  }, [trackId]);

  useEffect(() => {
    if (!lyrics.length) return;

    const index = lyrics.findIndex((line, i) =>
      currentTime >= line.timestamp &&
      (i === lyrics.length - 1 || currentTime < lyrics[i + 1].timestamp)
    );
    setActiveIndex(index);
  }, [currentTime, lyrics]);

  return { lyrics, activeIndex };
}
