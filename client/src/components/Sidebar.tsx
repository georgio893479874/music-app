"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, libraryItems, menuItems } from "@/constants";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ListMusic, PlusCircle } from "lucide-react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Playlist } from "@/types";

export default function Sidebar() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${API_URL}/playlist`, {
          params: { query: userId },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      }
    };
    fetchPlaylists();
  }, [API_URL, userId]);

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", coverFile);

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);
      return res.data.secure_url as string;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!userId || !newPlaylistName.trim()) return;

    const coverPhoto = (await uploadCover()) ?? "/placeholder";

    try {
      const res = await axios.post(`${API_URL}/playlist/create`, {
        name: newPlaylistName,
        userId,
        coverPhoto,
      });

      setNewPlaylistName("");
      setCoverFile(null);
      setCoverPreview(null);
      setIsModalOpen(false);
      router.push(`/playlist/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  return (
    <div className="hidden lg:flex flex-col h-screen bg-[#212121] text-gray-200">
      <nav className="mt-16">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <div className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2 hover:bg-[#2a2a2a] transition">
                  <span className="mr-4">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pl-6 pr-6 mt-4">
        <Accordion>
          <AccordionItem
            title={
              <div className="flex items-center">
                <ListMusic className="mr-2" />
                Library
              </div>
            }
          >
            <ul>
              {libraryItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.path}>
                    <div className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-2 hover:bg-[#2a2a2a] transition">
                      <span className="mr-4">{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionItem>
        </Accordion>
        <div className="mt-4">
          <div className="flex justify-between items-center px-6 mb-2">
            <h3 className="text-sm font-semibold uppercase">Your Playlists</h3>
            <button
              onClick={() => {
                if (!userId) {
                  alert("Please log in first.");
                  return;
                }
                setIsModalOpen(true);
              }}
              title="Create Playlist"
            >
              <PlusCircle className="text-gray-400 hover:text-white transition" />
            </button>
          </div>
          <ul>
            {playlists.map((pl) => (
              <li key={pl.id}>
                <Link href={`/playlist/${pl.id}`}>
                  <div className="flex items-center py-2 px-6 rounded-lg cursor-pointer mb-1 hover:bg-[#2a2a2a] transition">
                    <span className="mr-4">🎵</span>
                    {pl.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Create Playlist
            </Dialog.Title>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium">
                Cover photo (optional)
              </label>

              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCoverFile(file);
                  setCoverPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatePlaylist();
              }}
            >
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isUploading ? "Uploading..." : "Create"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
