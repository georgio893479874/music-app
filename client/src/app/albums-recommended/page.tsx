"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";
import { Artist } from "@/types";

type Album = {
  id: string;
  title: string;
  coverUrl?: string;
  artist: Artist;
};

export default function AlbumsRecommendedPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      const userId = localStorage.getItem("userId");
      const res = await axios.get<Album[]>(
        `${API_URL}/recommendation/user/${userId}/recommended-albums`
      );
      setAlbums(res.data);
    }
    fetchAlbums();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "32px auto", padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>
        Recommended Albums
      </h1>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        {albums.map((album) => (
          <div
            key={album.id}
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
              src={album.coverUrl}
              alt={album.title}
              style={{
                width: 132,
                height: 132,
                borderRadius: 10,
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
            <div style={{ fontWeight: 600 }}>{album.title}</div>
            <div style={{ color: "#888", fontSize: 14 }}>
              {album.artist.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
