'use client'

import { Track } from '@/types';
import { createContext, useContext, useState } from 'react';

type PlayerContextProps = {
  selectedSong: Track | null;
  setSelectedSong: (song: Track) => void;
  songs: Track[];
  setSongs: (songs: Track[]) => void;
};

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);
  const [songs, setSongs] = useState<Track[]>([]);

  return (
    <PlayerContext.Provider
      value={{
        selectedSong,
        setSelectedSong,
        songs,
        setSongs,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};