"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { Track } from "@/types";

interface PodcastSearchResult {
  id: string;
  title: string;
  description?: string;
  host?: string;
  coverUrl?: string | null;
  audioFilePath?: string | null;
  source?: string;
}

interface SavedPodcast {
  id: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  host?: {
    id: string;
    name: string;
  } | null;
  episodes?: Array<{
    id: string;
    title: string;
    audioFilePath?: string | null;
  }>;
}

export default function PodcastPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PodcastSearchResult[]>([]);
  const [savedPodcasts, setSavedPodcasts] = useState<SavedPodcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setSelectedSong } = usePlayerContext();

  const buildTrackFromPodcast = (
    podcast: PodcastSearchResult | SavedPodcast,
  ): Track => {
    const audioFilePath =
      "audioFilePath" in podcast && podcast.audioFilePath
        ? podcast.audioFilePath
        : (podcast as SavedPodcast).episodes?.find(
            (episode) => episode.audioFilePath,
          )?.audioFilePath || "";

    const hostName =
      "host" in podcast && typeof podcast.host === "string"
        ? podcast.host
        : (podcast as SavedPodcast).host?.name || "Unknown host";

    return {
      id: podcast.id,
      title: podcast.title,
      audioFilePath,
      coverImagePath: podcast.coverUrl || undefined,
      artistName: hostName,
      album: {
        id: podcast.id,
        title: podcast.title,
        releaseDate: "",
        artistId: podcast.id,
        genreId: "",
        coverUrl: podcast.coverUrl || "",
        artist: {
          id: podcast.id,
          name: hostName,
          coverPhoto: "",
          avatar: "",
        },
        genre: {
          id: "",
          name: "Podcast",
        },
        tracks: [],
        artistName: hostName,
      } as Track["album"],
    } as Track;
  };

  const handlePodcastClick = (podcast: PodcastSearchResult | SavedPodcast) => {
    setSelectedSong(buildTrackFromPodcast(podcast));
    setMessage(`Відтворюється: ${podcast.title}`);
  };

  const searchPodcasts = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.get(`${API_URL}/podcast/search`, {
        params: { query },
      });
      setResults(data || []);
    } catch (error) {
      console.error(error);
      setMessage("Не вдалося знайти подкасти");
    } finally {
      setLoading(false);
    }
  };

  const importPodcast = async (item: PodcastSearchResult) => {
    try {
      await axios.post(`${API_URL}/podcast/import-from-archive`, {
        query: item.title,
      });
      setMessage(`Імпортовано: ${item.title}`);
      await loadSavedPodcasts();
    } catch (error) {
      console.error(error);
      setMessage("Не вдалося імпортувати подкаст");
    }
  };

  const loadSavedPodcasts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/podcast`);
      setSavedPodcasts(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSavedPodcasts();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Podcasts</h1>
      <div className="mb-4 flex gap-2">
        <input
          className="w-full rounded border border-white/20 bg-black/30 px-3 py-2"
          placeholder="Search in Web Archive"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && searchPodcasts()}
        />
        <button
          className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-500"
          onClick={searchPodcasts}
          disabled={loading}
        >
          {loading ? "Пошук..." : "Шукати"}
        </button>
      </div>

      {message ? (
        <p className="mb-4 text-sm text-green-400">{message}</p>
      ) : null}

      <div className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Imported podcasts</h2>
        <div className="space-y-3">
          {savedPodcasts.length === 0 ? (
            <p className="text-sm text-white/60">
              There are no podcasts yet
            </p>
          ) : (
            savedPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="cursor-pointer rounded border border-white/10 bg-white/5 p-4"
                onClick={() => handlePodcastClick(podcast)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{podcast.title}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {podcast.description || "Без опису"}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Хост: {podcast.host?.name || "Невідомо"}
                    </p>
                    <p className="mt-2 text-xs text-white/40">
                      Епізодів: {podcast.episodes?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer rounded border border-white/10 bg-white/5 p-4"
            onClick={() => handlePodcastClick(item)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{item.title}</h2>
                <p className="mt-1 text-sm text-white/70">
                  {item.description || "Без опису"}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Хост: {item.host || "Невідомо"}
                </p>
              </div>
              <button
                className="rounded bg-green-600 px-3 py-2 text-sm hover:bg-green-500"
                onClick={(event) => {
                  event.stopPropagation();
                  importPodcast(item);
                }}
              >
                Import
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
