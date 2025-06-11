"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
  bannerUrl?: string;
  role?: string;
};

type Playlist = { id: string; title: string };
type Song = { id: string; title: string };

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "settings" | "playlists">(
    "profile"
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const [{ data: u }, { data: pls }, { data: songs }] = await Promise.all(
          [
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/playlists`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/songs`
            ),
          ]
        );

        setUser(u);
        setForm({
          firstname: u.firstname,
          lastname: u.lastname,
          email: u.email,
        });
        setPlaylists(pls);
        setAvailableSongs(songs);
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
      }
    })();
  }, [userId]);

  const refreshPlaylists = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/playlists`
    );
    setPlaylists(data);
  };

  const handleCreate = async () => {
    if (!newTitle) return;
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/playlists`, {
      title: newTitle,
      userId,
    });
    setNewTitle("");
    refreshPlaylists();
  };

  const handleEdit = (p: Playlist) => {
    setEditingId(p.id);
    setEditTitle(p.title);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists/${editingId}`,
      { title: editTitle }
    );
    setEditingId(null);
    refreshPlaylists();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/playlists/${id}`);
    if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
    refreshPlaylists();
  };

  const openPlaylist = async (p: Playlist) => {
    setSelectedPlaylist(p);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists/${p.id}/songs`
    );
    setPlaylistSongs(data);
  };

  const addSongToPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists/${selectedPlaylist.id}/songs`,
      { songId }
    );
    openPlaylist(selectedPlaylist);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, form, {
      withCredentials: true,
    });
    setUser({ ...user!, ...form });
    setEditMode(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      {/* Banner and avatar */}
      <div className="relative h-56 bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-lg">
        {bannerPreview || user.bannerUrl ? (
          <Image
            src={bannerPreview || user.bannerUrl!}
            alt="Banner"
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full" />
        )}
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-3 right-3"
        >
          <PhotoCamera className="text-white" />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleBannerChange}
        />
      </div>

      <div className="flex items-center space-x-6 -mt-20 px-6">
        <div className="relative">
          <Avatar
            src={avatarPreview || user.avatarUrl}
            sx={{ width: 160, height: 160 }}
          />
          <button
            className="absolute bottom-0 right-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoCamera />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h1 className="text-4xl">
            {user.firstname} {user.lastname}
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="mt-8 border-b border-gray-700 flex space-x-8 px-6">
        {(["profile", "settings", "playlists"] as const).map((t) => (
          <button
            key={t}
            className={`pb-2 ${tab === t ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-6 px-6 pb-8">
        {tab === "profile" && (
          <ul>
            <li>
              <b>First name:</b> {user.firstname}
            </li>
            <li>
              <b>Last name:</b> {user.lastname}
            </li>
            <li>
              <b>Email:</b> {user.email}
            </li>
            <li>
              <b>Role:</b> {user.role}
            </li>
            <li>
              <b>ID:</b> {user.id}
            </li>
          </ul>
        )}
        {tab === "settings" &&
          (editMode ? (
            <div className="flex flex-col space-y-4">
              {(
                ["firstname", "lastname", "email"] as (keyof typeof form)[]
              ).map((field) => (
                <div key={field}>
                  <label className="block capitalize">{field}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleFormChange}
                    className="w-full bg-gray-800 p-2 rounded"
                  />
                </div>
              ))}
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 px-4 py-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-700 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 px-4 py-2"
            >
              Edit profile
            </button>
          ))}
        {tab === "playlists" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl">Ваші плейлисти</h2>
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded"
                >
                  {editingId === pl.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-gray-700 p-2 rounded"
                    />
                  ) : (
                    <span>{pl.title}</span>
                  )}
                  <div className="space-x-2">
                    {editingId === pl.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="text-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400"
                        >
                          X
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(pl)}
                          className="text-blue-300"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(pl.id)}
                          className="text-red-500"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => openPlaylist(pl)}
                          className="text-white"
                        >
                          Open
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-4 flex space-x-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="New playlist"
                  className="bg-gray-700 p-2 rounded flex-1"
                />
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </div>
            {selectedPlaylist && (
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedPlaylist.title}
                </h3>
                <ul className="list-disc ml-5">
                  {playlistSongs.map((s) => (
                    <li key={s.id}>{s.title}</li>
                  ))}
                </ul>
                <select
                  onChange={(e) => addSongToPlaylist(e.target.value)}
                  className="mt-2 bg-gray-700 p-2 rounded"
                >
                  <option value="">Add song...</option>
                  {availableSongs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
