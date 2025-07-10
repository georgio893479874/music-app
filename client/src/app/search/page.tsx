"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import axios from "axios";
import { API_URL, genres } from "@/constants";
import Link from "next/link";
import { Album, Artist, Playlist, Track } from "@/types";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useRouter, useParams } from "next/navigation";

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

function SearchResultsBeautiful({
  filteredResults,
  playSong,
}: {
  filteredResults: SearchResult[];
  playSong: (track: Track) => void;
}) {
  const songs = filteredResults.filter(isTrack);
  const albums = filteredResults.filter(isAlbum);
  const artists = filteredResults.filter(isArtist);

  function splitInColumns<T>(arr: T[], cols = 2): T[][] {
    const out: T[][] = Array.from({ length: cols }, () => []);
    arr.forEach((item, i) => {
      out[i % cols].push(item);
    });
    return out;
  }

  const songCols = splitInColumns(songs, 2);
  const albumCols = splitInColumns(albums, 2);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl py-8 px-6 shadow-lg min-h-[500px]">
      {songs.length > 0 && (
        <div>
          <h3 className="uppercase text-[#50e3c2] text-sm font-bold tracking-wide mb-2 pl-1">
            Songs
          </h3>
          <div className="grid grid-cols-2 gap-x-8">
            {songCols.map((col, colIdx) => (
              <div key={colIdx}>
                {col.map((result: Track) => (
                  <div
                    className="flex items-center py-2 px-2 rounded-lg hover:bg-[#f7f7f7] transition group"
                    key={result.id}
                    onClick={() => playSong(result)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={result.coverImagePath || "/noimg.png"}
                      alt={result.title}
                      width={45}
                      height={45}
                      className="rounded-md object-cover shadow"
                    />
                    <div className="flex-1 ml-4 overflow-hidden">
                      <div className="font-medium text-[#3a3a3a] group-hover:text-[#222] leading-tight truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-[#b2b2b2] truncate">
                        {result.artistName}
                      </div>
                    </div>
                    <button className="ml-auto p-2 rounded-full hover:bg-[#ededed]">
                      <span className="text-2xl text-[#b2b2b2]">+</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {albums.length > 0 && (
        <div className="mt-8">
          <h3 className="uppercase text-[#50e3c2] text-sm font-bold tracking-wide mb-2 pl-1">
            Album
          </h3>
          <div className="grid grid-cols-2 gap-x-8">
            {albumCols.map((col, colIdx) => (
              <div key={colIdx}>
                {col.map((result: Album) => (
                  <Link href={`/album/${result.id}`} key={result.id} passHref>
                    <div className="flex items-center py-2 px-2 rounded-lg hover:bg-[#f7f7f7] transition group cursor-pointer">
                      <Image
                        src={result.coverUrl || "/noimg.png"}
                        alt={result.title}
                        width={45}
                        height={45}
                        className="rounded-md object-cover shadow"
                      />
                      <div className="flex-1 ml-4 overflow-hidden">
                        <div className="font-medium text-[#3a3a3a] group-hover:text-[#222] leading-tight truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-[#b2b2b2] truncate">
                          {result.artistName}
                        </div>
                      </div>
                      <button className="ml-auto p-2 rounded-full hover:bg-[#ededed]">
                        <span className="text-2xl text-[#b2b2b2]">+</span>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {artists.length > 0 && (
        <div className="mt-8">
          <h3 className="uppercase text-[#50e3c2] text-sm font-bold tracking-wide mb-2 pl-1">
            Artist
          </h3>
          <div className="flex flex-wrap gap-3">
            {artists.map((result: Artist) => (
              <Link href={`/artist/${result.id}`} key={result.id} passHref>
                <div className="px-5 py-2 rounded-full bg-[#f0f0f0] text-[#b2b2b2] font-medium text-sm hover:bg-[#e0e0e0] cursor-pointer transition">
                  {result.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSource, setSearchSource] = useState<SearchSource>("all");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { setSelectedSong } = usePlayerContext();
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (
      params.id &&
      typeof params.id === "string" &&
      params.id.startsWith("yt_ch_")
    ) {
      const channelId = params.id.replace("yt_ch_", "");
      axios
        .post(`${API_URL}/import/artist`, { youtubeChannelId: channelId })
        .then((res) => {
          router.replace(`/artist/${res.data.id}`);
        });
    }
  }, [params.id, router]);

  const handleSearch = async (query: string, source: SearchSource) => {
    if (query.trim() === "") return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const { data } = await axios.get(`${API_URL}/search`, {
        params: { query, source },
        signal: controller.signal,
      });
      const results: SearchResult[] = [
        ...(data.tracks || []),
        ...(data.albums || []),
        ...(data.performers || []),
        ...(data.playlists || []),
      ];
      setSearchResults(results);
    } catch (error) {
      if (axios.isCancel(error)) {
      } else {
        console.error(error);
      }
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

  const filteredResults = searchResults.filter((result) => {
    if (resultFilter === "all") return true;
    if (resultFilter === "albums") return isAlbum(result);
    if (resultFilter === "tracks") return isTrack(result);
    if (resultFilter === "artists") return isArtist(result);
    if (resultFilter === "playlists") return isPlaylist(result);
    return true;
  });

  function playSong(track: Track) {
    setSelectedSong(track);
  }

  const uniqueFilteredResults = filteredResults.filter(
    (item, index, self) => self.findIndex((v) => v.id === item.id) === index
  );

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-[#f6f6f6] to-[#eaeaea]">
      <div className="pb-4 pt-10">
        <div className="mb-8 flex flex-wrap items-center gap-4 justify-center">
          <div>
            <label
              htmlFor="search-source"
              className="text-[#868686] mr-2 font-medium"
            >
              Search in:
            </label>
            <select
              id="search-source"
              className="rounded-md px-2 py-1 bg-[#f2f2f2] text-[#333] border border-[#e1e1e1]"
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value as SearchSource)}
            >
              <option value="all">All</option>
              <option value="local">Local</option>
              <option value="youtube">YouTube Music</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="result-filter"
              className="text-[#868686] mr-2 font-medium"
            >
              Show:
            </label>
            <select
              id="result-filter"
              className="rounded-md px-2 py-1 bg-[#f2f2f2] text-[#333] border border-[#e1e1e1]"
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
            <h2 className="text-xl font-semibold text-[#333] mb-4 text-center">
              Explore Genres
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
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
          <div className="mt-6 flex justify-center">
            {uniqueFilteredResults.length === 0 ? (
              <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl py-16 px-6 shadow-lg text-gray-500 text-center text-lg">
                No results found
              </div>
            ) : (
              <SearchResultsBeautiful
                filteredResults={uniqueFilteredResults}
                playSong={playSong}
              />
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
