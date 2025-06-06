'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { Track } from "@/types";
import ListOfSongs from "@/components/ListOfSongs";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Player from "@/components/Player";
import { usePlayerContext } from "@/contexts/PlayerContext";

export interface FavoriteResponse {
  track: Track;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const { setSelectedSong } = usePlayerContext();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/favorite`);
        setFavorites(res.data.map((fav: FavoriteResponse) => fav.track));
      } catch {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, []);

  console.log(favorites)

  return (
    <div className="flex min-h-screen bg-[#212121] text-white">
      <Sidebar/>
      <Header/>
      <div className="flex-1">
        {favorites.length === 0 ? (
          <p className="text-gray-400 text-center justify-center">You haven&#39;t added any favorites yet</p>
        ) : (
          <ListOfSongs
            coverPhoto="/favorite-cover.jpg"
            name="Favorite Songs"
            tracks={favorites}
            label="Favorites"
            showFavoriteButton={false}
            onSongClick={setSelectedSong}
          />
        )}
      </div>
      <Player/>
    </div>
  );
}