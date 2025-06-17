"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "@/constants";
import { Artist, Playlist } from "@/types";

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
};

type ArtistSubscription = {
  artist: Artist;
};

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<
    "playlists" | "moodboards" | "likes" | "about"
  >("playlists");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Artist[]>([]);
  const [showSubsModal, setShowSubsModal] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/user/${userId}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/user/${userId}/artist-subscriptions`)
      .then((res) => res.json())
      .then((data: ArtistSubscription[]) => setSubscriptions(data.map((sub) => sub.artist)));
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
  }, [userId]);

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
    return (
      <div className="flex justify-center items-center h-96 bg-[#181A20] text-white">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="text-center text-red-500 bg-[#181A20]">
        User not found
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tr from-[#181A20] to-[#23272F] flex flex-col items-center">
        <div
          className="w-full relative h-60 md:h-72 flex-shrink-0 rounded-b-3xl overflow-hidden"
          style={{
            background: "linear-gradient(90deg,#23272F 0%,#181A20 100%)",
          }}
        >
          {user.banner || bannerPreview ? (
            <Image
              src={bannerPreview || user.banner || ""}
              alt="Banner"
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full" />
          )}
          <button
            className="absolute top-4 right-4 bg-black/80 hover:bg-black/90 p-2 rounded-full shadow text-white"
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
          <div className="bg-[#191C23] rounded-3xl shadow-lg flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 relative border border-[#252A34]">
            <div className="relative group">
              <Avatar
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: "24px",
                  border: "8px solid #23272F",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.32)",
                  objectFit: "cover",
                  fontSize: 50,
                  backgroundColor: "#23272F",
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
                <h1 className="text-3xl font-bold text-white">
                  {user.firstname} {user.lastname}
                </h1>
              </div>
              <div className="text-gray-400">
                {user.about ||
                  "Музичний ентузіаст, слухає нове, створює плейлисти."}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-white/10 text-white rounded-xl px-6 py-2 font-semibold hover:bg-white/20 transition border border-white/10"
                  onClick={handleFollow}
                >
                  Follow
                </button>
                <button
                  className="bg-[#23272F] border border-gray-700 text-gray-300 rounded-xl px-6 py-2 font-semibold hover:bg-[#23272F]/80 transition"
                  onClick={handleMessage}
                >
                  Get in touch
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 ml-auto">
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl text-white">
                    {user.followers || 0}
                  </span>
                  <span className="text-xs text-gray-500">Followers</span>
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setShowSubsModal(true)}
                >
                  <span className="font-bold text-xl text-white">
                    {subscriptions.length}
                  </span>
                  <span className="text-xs text-gray-500">Following</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl text-white">
                    {user.likes || 0}
                  </span>
                  <span className="text-xs text-gray-500">Likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl mt-8 px-4">
          <div className="flex gap-8 border-b border-[#252A34]">
            <button
              className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
                activeTab === "playlists"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("playlists")}
            >
              Playlists{playlists ? ` ${playlists.length}` : ""}
            </button>
            <button
              className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
                activeTab === "moodboards"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("moodboards")}
            >
              Moodboards
            </button>
            <button
              className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
                activeTab === "likes"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("likes")}
            >
              Likes
            </button>
            <button
              className={`pb-3 font-semibold transition-colors duration-200 text-lg ${
                activeTab === "about"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
          </div>
        </div>
        <div className="w-full max-w-5xl px-4 py-8">
          {activeTab === "playlists" &&
            (playlistsLoading ? (
              <div className="text-gray-500 text-center">
                Loading playlists...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {playlists && playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-[#191C23] rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col border border-[#23272F]"
                    >
                      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-[#23272F] flex items-center justify-center">
                        {playlist.coverPhoto ? (
                          <Image
                            src={playlist.coverPhoto}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-gray-600 font-bold text-2xl">
                            {playlist.name}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1 text-white truncate">
                        {playlist.name}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>0 tracks</span>
                        <span>🎵 0</span>
                        <span>❤️ 0</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-600">
                    No playlists yet.
                  </div>
                )}
              </div>
            ))}
          {activeTab === "moodboards" && (
            <div className="text-center text-gray-600">
              Moodboards coming soon.
            </div>
          )}
          {activeTab === "likes" && (
            <div className="text-center text-gray-600">
              Liked playlists and tracks will appear here.
            </div>
          )}
          {activeTab === "about" && (
            <div className="max-w-2xl mx-auto text-gray-300 text-lg">
              <div className="mb-2">
                <span className="font-bold text-white">About:</span>{" "}
                {user.about || "No bio yet."}
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">Email:</span>{" "}
                {user.email}
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">Role:</span>{" "}
                {user.role || "User"}
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">ID:</span> {user.id}
              </div>
            </div>
          )}
        </div>
      </div>
      {showSubsModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowSubsModal(false)}
        >
          <div
            className="bg-[#181A20] p-8 rounded-2xl max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Your subscriptions
            </h2>
            {subscriptions.length === 0 && (
              <div className="text-gray-400 text-center">
                You are not subscribed to any artists yet
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-[#23272F] mb-2 relative">
                    {sub.coverPhoto && (
                      <Image
                        src={sub.coverPhoto}
                        alt={sub.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="text-white font-semibold text-lg">
                    {sub.name}
                  </div>
                  <div className="text-gray-400 text-xs">Performer</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
