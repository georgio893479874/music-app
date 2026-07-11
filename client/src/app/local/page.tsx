"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, getUserId } from "@/constants";
import { Track } from "@/types";
import ListOfSongs from "@/components/ListOfSongs/ListOfSongs";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function LocalPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const { setSongs, setSelectedSong } = usePlayerContext();
  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserTracks = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Track[]>(`${API_URL}/track/user/${userId}`);
        setTracks(res.data);
      } catch (error) {
        console.error("Failed to load local tracks:", error);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTracks();
  }, [userId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setMessage("Please select an audio file.");
      setAudioFile(null);
      return;
    }
    setMessage("");
    setAudioFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setMessage("You must be logged in to upload tracks.");
      return;
    }
    if (!audioFile) {
      setMessage("Please choose an audio file to upload.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading audio...");

      const formData = new FormData();
      formData.append("file", audioFile);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Audio upload failed");
      }

      const uploadData = await uploadRes.json();
      const audioUrl =
        uploadData.secure_url || uploadData.url || uploadData.secureUrl;
      if (!audioUrl) {
        throw new Error("Upload response did not include a valid audio URL");
      }

      const createRes = await axios.post<Track>(`${API_URL}/track/create`, {
        title: title.trim() || audioFile.name,
        audioFilePath: audioUrl,
        artistName,
        userId,
      });

      const updatedTracks = [createRes.data, ...tracks];
      setTracks(updatedTracks);
      setTitle("");
      setAudioFile(null);
      setMessage("Track added successfully.");
      setSongs(updatedTracks);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Failed to upload track.");
    } finally {
      setUploading(false);
    }
  };

  const handleSongSelect = (song: Track) => {
    setSongs(tracks);
    setSelectedSong(song);
  };

  return (
    <div className="bg-[#212121] text-white min-h-screen px-4 py-6 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl border border-gray-800 bg-neutral-900 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white">Local Files</h1>
          <p className="text-gray-400 mt-2">
            Here you can review your uploaded songs and add them to the player.
          </p>

          {!userId ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-700 bg-neutral-950 p-6 text-gray-300">
              You need to log in to view and upload your local songs.
            </div>
          ) : (
            <form
              className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]"
              onSubmit={handleUpload}
            >
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Song Title
                    </label>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Title of the track"
                      className="w-full rounded-2xl border border-gray-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Song Artist
                    </label>
                    <input
                      value={title}
                      onChange={(event) => setArtistName(event.target.value)}
                      placeholder="Artist of the track"
                      className="w-full rounded-2xl border border-gray-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Song Album
                    </label>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Album of the track"
                      className="w-full rounded-2xl border border-gray-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Audio file
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-200 file:mr-4 file:rounded-full file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </div>

                {message && <p className="text-sm text-gray-300">{message}</p>}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Cover file
                  </label>
                  <input
                    type="file"
                    className="w-full text-sm text-gray-200 file:mr-4 file:rounded-full file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </div>
                {message && <p className="text-sm text-gray-300">{message}</p>}
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  disabled={uploading || !audioFile}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload and Add"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="rounded-3xl border border-gray-800 bg-neutral-900 p-8 shadow-lg">
          {loading ? (
            <div className="text-gray-400">Loading your local songs...</div>
          ) : tracks.length === 0 ? (
            <div className="text-gray-400">No local songs uploaded yet.</div>
          ) : (
            <ListOfSongs
              coverPhoto={
                tracks[0]?.coverImagePath || "/noimg.png"
              }
              name="Uploaded songs"
              description="Tracks you uploaded to your local library. Click a song to play it."
              tracks={tracks}
              showFavoriteButton={false}
              onSongClick={handleSongSelect}
              favoritesCount={tracks.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}
