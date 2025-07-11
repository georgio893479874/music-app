"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";

type Playlist = {
  id: string;
  name: string;
  coverPhoto?: string;
};

export default function PlaylistsPopularPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    async function fetchPlaylists() {
      const userId = localStorage.getItem("userId");
      const res = await axios.get<Playlist[]>(
        `${API_URL}/recommendation/user/${userId}/popular-playlists`
      );
      setPlaylists(res.data);
    }
    fetchPlaylists();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "32px auto", padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>
        Popular Playlists
      </h1>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              width: 160,
              borderRadius: 14,
              background: "#fff",
              boxShadow: "0 2px 12px 0 rgba(43,143,229,0.07)",
              padding: 14,
              textAlign: "center",
            }}
          >
            <img
              src={playlist.coverPhoto}
              alt={playlist.name}
              style={{
                width: 132,
                height: 132,
                borderRadius: 10,
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
            <div style={{ fontWeight: 600 }}>{playlist.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
