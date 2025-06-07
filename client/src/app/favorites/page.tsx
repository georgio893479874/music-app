"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Track } from "@/types";
import ListOfSongs from "@/components/ListOfSongs";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const { setSelectedSong } = usePlayerContext();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/favorite`
        );
        type FavoriteResponse = { track: Track };
        setFavorites(res.data.map((fav: FavoriteResponse) => fav.track));
      } catch {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="bg-[#212121] text-white">
      {favorites.length === 0 ? (
        <p className="text-gray-400 text-center justify-center">
          You haven&#39;t added any favorites yet
        </p>
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
  );
}
