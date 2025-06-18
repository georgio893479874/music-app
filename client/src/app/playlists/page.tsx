"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Playlist = {
  id: string;
  name: string;
  coverPhoto: string;
};

const PlaylistGallery = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverPhotoURL, setCoverPhotoURL] = useState<string | null>(null);

  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${API_URL}/playlist`, {
          params: { query: userId },
        });
        setPlaylists(res.data);
      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    };
    if (userId) fetchPlaylists();
  }, [API_URL, userId]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newPlaylistName.trim()) return;

    let uploadedCover = coverPhotoURL;
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      uploadedCover = data.url;
      setUploading(false);
    }

    try {
      const res = await axios.post(`${API_URL}/playlist/create`, {
        name: newPlaylistName,
        userId,
        coverPhoto: uploadedCover || "/placeholder",
      });

      setNewPlaylistName("");
      setFile(null);
      setCoverPhotoURL(null);
      setIsModalOpen(false);
      router.push(`/playlist/${res.data.id}`);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
      padding: "32px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700 }}>Мої плейлисти</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "linear-gradient(90deg, #6366f1 0%, #a21caf 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 20px 0 #0002"
          }}
        >
          Create a playlist
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "30px",
          background: "#0001",
          borderRadius: 18,
          padding: 32,
        }}
      >
        {playlists.map((playlist) => (
          <div key={playlist.id} style={{
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.7)",
            boxShadow: "0 2px 16px 0 #0001",
            transition: "transform 0.15s cubic-bezier(.4,0,.2,1)",
            cursor: "pointer",
          }}
            onClick={() => router.push(`/playlist/${playlist.id}`)}
          >
            <img
              src={playlist.coverPhoto || "/placeholder.jpg"}
              alt={playlist.name}
              style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                borderBottom: "1px solid #ddd",
              }}
            />
            <div style={{ padding: "18px 14px 10px" }}>
              <div style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#23272f",
                marginBottom: 6,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}>{playlist.name}</div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 6px 32px 0 #0003",
            padding: 36,
            minWidth: 420,
            width: "100%",
            maxWidth: 460
          }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>Новий плейлист</h2>
            <form onSubmit={handleCreatePlaylist}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  The name of the playlist
                  <span style={{ color: "#a21caf", marginLeft: 3 }}>*</span>
                </label>
                <input
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  placeholder="Введіть назву"
                  style={{
                    width: "100%",
                    padding: 12,
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                  required
                />
                <small style={{ color: "#888" }}>
                  Your unique name for the playlist
                </small>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 6,
                  display: "block"
                }}>
                  Playlist cover
                </label>
                <div
                  style={{
                    border: "2px dashed #c4b5fd",
                    borderRadius: 10,
                    background: "#fafaff",
                    padding: "24px 0",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s"
                  }}
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                        setCoverPhotoURL(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                  {coverPhotoURL ? (
                    <img
                      src={coverPhotoURL}
                      style={{
                        maxWidth: "130px",
                        maxHeight: "130px",
                        borderRadius: 12,
                        margin: "0 auto"
                      }}
                      alt="Обкладинка"
                    />
                  ) : (
                    <div>
                      <svg style={{ width: 38, height: 38, opacity: 0.5 }} viewBox="0 0 24 24" fill="none"><path d="M12 5v14m7-7H5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" /></svg>
                      <div style={{ color: "#6366f1", fontWeight: 500, marginTop: 8 }}>
                        Click to select or drag photos
                      </div>
                      <div style={{ fontSize: 13, color: "#a3a3a3" }}>Upload an image (max 5MB)</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  style={{
                    padding: "10px 22px",
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    color: "#6366f1"
                  }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    background: uploading ? "#a5b4fc" : "linear-gradient(90deg,#6366f1 0%,#a21caf 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    boxShadow: "0 1px 10px 0 #0002",
                    cursor: uploading ? "not-allowed" : "pointer"
                  }}
                  disabled={uploading}
                >
                  {uploading ? "Loading..." : "Create playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistGallery;