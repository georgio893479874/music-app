'use client'

import { PlayerContextProps, Track } from '@/types';
import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState<Track | undefined>(undefined);

  return (
    <PlayerContext.Provider value={{ selectedSong, setSelectedSong }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
};
