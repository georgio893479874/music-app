"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { API_URL, genres } from "@/constants";
import Link from "next/link";
import { Album, Artist, Playlist, Track } from "@/types";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { usePlayerContext } from "@/contexts/PlayerContext";

type SearchResult = Track | Album | Artist | Playlist;

function isTrack(item: SearchResult): item is Track {
  return (item as Track).audioFilePath !== undefined;
}
function isAlbum(item: SearchResult): item is Album {
  return (item as Album).coverUrl !== undefined;
}
function isArtist(item: SearchResult): item is Artist {
  return (
    typeof (item as Artist).coverPhoto === "string" &&
    typeof (item as Artist).name === "string" &&
    !("title" in item)
  );
}
function isPlaylist(item: SearchResult): item is Playlist {
  return (
    typeof (item as Playlist).coverPhoto === "string" &&
    typeof (item as Playlist).name === "string" &&
    Array.isArray((item as Playlist).tracks)
  );
}

type SearchSource = "all" | "local" | "youtube";
type ResultFilter = "all" | "albums" | "tracks" | "artists" | "playlists";

function SearchPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSource, setSearchSource] = useState<SearchSource>("all");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { setSongs, setSelectedSong } = usePlayerContext();

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (query: string, source: SearchSource) => {
    if (query.trim() === "") return;

    try {
      const { data } = await axios.get(`${API_URL}/search`, {
        params: { query, source },
      });
      const results: SearchResult[] = [
        ...(data.tracks || []),
        ...(data.albums || []),
        ...(data.performers || []),
        ...(data.playlists || []),
      ];
      console.log(data.performers);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(
        () => handleSearch(searchQuery, searchSource),
        500
      );
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchSource]);

  // Фільтрація результатів по типу
  const filteredResults = searchResults.filter((result) => {
    if (resultFilter === "all") return true;
    if (resultFilter === "albums") return isAlbum(result);
    if (resultFilter === "tracks") return isTrack(result);
    if (resultFilter === "artists") return isArtist(result);
    if (resultFilter === "playlists") return isPlaylist(result);
    return true;
  });

  const playSong = async (track: Track) => {
    if (track.type === "yt" && track.audioFilePath.startsWith("http")) {
      try {
        const { data } = await axios.get(`${API_URL}/import/audio`, {
          params: { url: track.audioFilePath },
        });
        if (data.streamUrl) {
          const ytTrack = { ...track, audioFilePath: data.streamUrl };
          setSongs([ytTrack]);
          setSelectedSong(ytTrack);
        }
      } catch {
        alert("Не вдалося отримати аудіо з YouTube");
      }
    } else {
      setSongs([track]);
      setSelectedSong(track);
    }
  };

  return (
    <div className="flex-1">
      <div className="pb-4">
        {/* Перемикачі */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="search-source" className="text-white mr-2">
              Search in:
            </label>
            <select
              id="search-source"
              className="rounded-md px-2 py-1 bg-[#212121] text-white"
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value as SearchSource)}
            >
              <option value="all">All</option>
              <option value="local">Local</option>
              <option value="youtube">YouTube Music</option>
            </select>
          </div>
          <div>
            <label htmlFor="result-filter" className="text-white mr-2">
              Show:
            </label>
            <select
              id="result-filter"
              className="rounded-md px-2 py-1 bg-[#212121] text-white"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value as ResultFilter)}
            >
              <option value="all">All</option>
              <option value="albums">Albums</option>
              <option value="tracks">Tracks</option>
              <option value="artists">Artists</option>
              <option value="playlists">Playlists</option>
            </select>
          </div>
        </div>
        {!searchQuery && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Explore Genres
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {genres.map((genre, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105"
                >
                  <Image
                    src={genre.image}
                    alt="genre cover"
                    className="object-cover"
                    width={275}
                    height={275}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {searchQuery && (
          <div className="mt-6 text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              Search Results
            </h2>
            {filteredResults.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">
                No results found
              </p>
            ) : (
              <div className="space-y-6 flex flex-col gap-3">
                {filteredResults.map((result: SearchResult) => {
                  if (isTrack(result)) {
                    return (
                      <div
                        key={result.id}
                        className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer"
                        onClick={() => playSong(result)}
                      >
                        {result.coverImagePath ? (
                          <Image
                            src={result.coverImagePath}
                            alt={result.title}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        ) : (
                          <div className="w-[50px] h-[50px] bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-semibold">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {result.artistName}
                          </p>
                          {result.type === "yt" && (
                            <span className="px-2 py-1 bg-red-600 text-white rounded text-xs ml-2">
                              YouTube
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  if (isAlbum(result)) {
                    return (
                      <Link
                        href={`/album/${result.id}`}
                        key={result.id}
                        passHref
                      >
                        <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                          {result.coverUrl ? (
                            <Image
                              src={result.coverUrl}
                              alt={result.title}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                          ) : (
                            <div className="w-[50px] h-[50px] bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="text-lg font-semibold">
                              {result.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              {result.artistName}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  if (isArtist(result)) {
                    return (
                      <Link
                        href={`/artist/${result.id}`}
                        key={result.id}
                        passHref
                      >
                        <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                          {result.coverPhoto ? (
                            <Image
                              src={result.coverPhoto}
                              alt={result.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-[40px] h-[40px] bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="text-lg font-semibold">
                              {result.name}
                            </p>
                            <p className="text-sm text-gray-400">Artist</p>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  if (isPlaylist(result)) {
                    return (
                      <Link
                        href={`/playlist/${result.id}`}
                        key={result.id}
                        passHref
                      >
                        <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                          {result.coverPhoto ? (
                            <Image
                              src={result.coverPhoto}
                              alt={result.name}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                          ) : (
                            <div className="w-[50px] h-[50px] bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="text-lg font-semibold">
                              {result.name}
                            </p>
                            <p className="text-sm text-gray-400">Playlist</p>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
