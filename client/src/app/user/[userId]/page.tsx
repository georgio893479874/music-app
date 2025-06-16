"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "@/constants";

type User = {
  avatar: string | null;
  banner: string | null;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  isOnline?: boolean;
  followers?: number;
  following?: number;
  likes?: number;
  about?: string;
  pro?: boolean;
  badges?: {
    orange?: number;
    blue?: number;
    black?: number;
  };
};

type Playlist = {
  id: string;
  title: string;
  cover: string | null;
  tracks: number;
  plays: number;
  likes: number;
};

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"playlists" | "moodboards" | "likes" | "about">("playlists");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/user/${userId}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchPlaylists = async () => {
      setPlaylistsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/playlist`, {
          params: { query: userId },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      }
      setPlaylistsLoading(false);
    };
    fetchPlaylists();
  }, [API_URL, userId]);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.secure_url as string;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setUser((prev) => (prev ? { ...prev, avatar: uploadedUrl } : null));
        await fetch(`${API_URL}/user/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ avatar: uploadedUrl }),
        });
      }
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerPreview(URL.createObjectURL(file));
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setUser((prev) => (prev ? { ...prev, banner: uploadedUrl } : null));
        await fetch(`${API_URL}/user/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ banner: uploadedUrl }),
        });
      }
    }
  };

  const handleFollow = () => {};
  const handleMessage = () => {};

  if (loading)
    return <div className="flex justify-center items-center h-96 bg-[#f8fafd] text-black">Loading...</div>;
  if (!user)
    return <div className="text-center text-red-500 bg-[#f8fafd]">User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e9eafe] to-[#f8fafd] flex flex-col items-center">
      <div className="w-full relative h-60 md:h-72 flex-shrink-0 rounded-b-3xl overflow-hidden"
        style={{ background: "linear-gradient(90deg,#e9eafe 0%,#c8dafe 100%)" }}>
        {user.banner || bannerPreview ? (
          <Image
            src={bannerPreview || user.banner || ""}
            alt="Banner"
            fill
            className="object-cover w-full h-full"
          />
        ) : <div className="w-full h-full" />}
        <button
          className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow"
          onClick={() => bannerInputRef.current?.click()}
          title="Change banner"
        >
          <PhotoCamera />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={bannerInputRef}
          onChange={handleBannerChange}
        />
      </div>
      <div className="w-full max-w-5xl -mt-28 z-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 relative">
          <div className="relative group">
            <Avatar
              sx={{
                width: 160,
                height: 160,
                borderRadius: "24px",
                border: "8px solid #f8fafd",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                objectFit: "cover",
                fontSize: 50,
              }}
              src={avatarPreview ?? user?.avatar ?? undefined}
            >
              {user.firstname?.charAt(0)}
            </Avatar>
            <button
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
              onClick={() => fileInputRef.current?.click()}
              title="Change avatar"
            >
              <PhotoCamera />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>
              {user.pro && (
                <span className="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-lg text-xs ml-2">PRO</span>
              )}
            </div>
            <div className="text-gray-500">
              {user.about || "Музичний ентузіаст, слухає нове, створює плейлисти."}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-black text-white rounded-xl px-6 py-2 font-semibold hover:bg-gray-900 transition"
                onClick={handleFollow}
              >
                Follow
              </button>
              <button
                className="bg-white border border-gray-300 text-gray-900 rounded-xl px-6 py-2 font-semibold hover:bg-gray-100 transition"
                onClick={handleMessage}
              >
                Get in touch
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 ml-auto">
            <div className="flex gap-2 mb-2">
              {user.badges?.orange && (
                <span className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.badges.orange}
                </span>
              )}
              {user.badges?.blue && (
                <span className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.badges.blue}
                </span>
              )}
              {user.badges?.black && (
                <span className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.badges.black}
                </span>
              )}
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl text-gray-900">{user.followers || 0}</span>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl text-gray-900">{user.following || 0}</span>
                <span className="text-xs text-gray-500">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl text-gray-900">{user.likes || 0}</span>
                <span className="text-xs text-gray-500">Likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl mt-8 px-4">
        <div className="flex gap-8 border-b border-gray-200">
          <button
            className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
              activeTab === "playlists"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("playlists")}
          >
            Playlists{playlists ? ` ${playlists.length}` : ""}
          </button>
          <button
            className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
              activeTab === "moodboards"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("moodboards")}
          >
            Moodboards
          </button>
          <button
            className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
              activeTab === "likes"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </button>
          <button
            className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
              activeTab === "about"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </div>
      <div className="w-full max-w-5xl px-4 py-8">
        {activeTab === "playlists" && (
          playlistsLoading ? (
            <div className="text-gray-400 text-center">Loading playlists...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {playlists && playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <div key={playlist.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col">
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      {playlist.cover ? (
                        <Image
                          src={playlist.cover}
                          alt={playlist.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 font-bold text-2xl">{playlist.title}</div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 truncate">{playlist.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{playlist.tracks} tracks</span>
                      <span>🎵 {playlist.plays ?? 0}</span>
                      <span>❤️ {playlist.likes ?? 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400">No playlists yet.</div>
              )}
            </div>
          )
        )}
        {activeTab === "moodboards" && (
          <div className="text-center text-gray-400">Moodboards coming soon.</div>
        )}
        {activeTab === "likes" && (
          <div className="text-center text-gray-400">Liked playlists and tracks will appear here.</div>
        )}
        {activeTab === "about" && (
          <div className="max-w-2xl mx-auto text-gray-700 text-lg">
            <div className="mb-2"><span className="font-bold">About:</span> {user.about || "No bio yet."}</div>
            <div className="mb-2"><span className="font-bold">Email:</span> {user.email}</div>
            <div className="mb-2"><span className="font-bold">Role:</span> {user.role || "User"}</div>
            <div className="mb-2"><span className="font-bold">ID:</span> {user.id}</div>
          </div>
        )}
      </div>
    </div>
  );
}