'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Playlist } from '@/types';
import ListOfSongs from '@/components/ListOfSongs';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { API_URL, getUserId } from '@/constants';

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { setSelectedSong } = usePlayerContext();
  const userId = getUserId();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  useEffect(() => {
    if (!playlistId || !userId) return;

    const fetchData = async () => {
      try {
        const [playlistRes, isFavRes, countRes] = await Promise.all([
          axios.get<Playlist>(`${API_URL}/playlist/${playlistId}`),
          axios.get<boolean>(`${API_URL}/playlist/${playlistId}/likes/is-favorite`, { params: { userId } }),
          axios.get<number>(`${API_URL}/playlist/${playlistId}/likes/count`),
        ]);
        setPlaylist(playlistRes.data);
        setIsFavorite(isFavRes.data);
        setFavoritesCount(countRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [playlistId, userId]);

  const toggleFavorite = async () => {
    if (!userId || !playlistId) return;

    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/playlist/${playlistId}/like`, { params: { userId } });
        setIsFavorite(false);
        setFavoritesCount((count) => count - 1);
      } else {
        await axios.post(`${API_URL}/playlist/${playlistId}/like`, { userId });
        setIsFavorite(true);
        setFavoritesCount((count) => count + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      favoritesCount={favoritesCount}
    />
  );
}