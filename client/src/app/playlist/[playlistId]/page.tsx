'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Playlist } from '@/types';
import ListOfSongs from '@/components/ListOfSongs';
import { usePlayerContext } from '@/contexts/PlayerContext';

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { setSelectedSong } = usePlayerContext();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  useEffect(() => {
    if (!playlistId) return;

    const fetchPlaylist = async () => {
      try {
        const response = await axios.get<Playlist>(`http://localhost:4521/playlist/${playlistId}`);
        setPlaylist(response.data);
      } 
      catch (error) {
        console.error(error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (!playlist) return null;

  return (
    <ListOfSongs
      coverPhoto={playlist.coverPhoto}
      name={playlist.name}
      description={playlist.description}
      tracks={playlist.tracks}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      label="Playlist"
      showFavoriteButton={true} 
      onSongClick={setSelectedSong}
    />
  );
}