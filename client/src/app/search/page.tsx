"use client";

"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { API_URL, genres } from "@/constants";
import Link from "next/link";
import { Album, Artist, Playlist, Track } from "@/types";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type SearchResult = Track | Album | Artist | Playlist;

function SearchPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") return;

    try {
      const { data } = await axios.get(
        `${API_URL}/search`,
        {
          params: { query },
        }
      );

      const results: SearchResult[] = [
        ...(data.tracks || []),
        ...(data.albums || []),
        ...(data.performers || []),
        ...(data.playlists || []),
      ];

      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => handleSearch(searchQuery), 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  return (
    <div className="flex-1">
      <div className="pb-4">
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
            {searchResults.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">
                No results found
              </p>
            ) : (
              <div className="space-y-6 flex flex-col gap-3">
                {searchResults.map((result: SearchResult) => {
                  if ("title" in result) {
                    if ("coverUrl" in result) {
                      return (
                        <Link
                          href={`/album/${result.id}`}
                          key={result.id}
                          passHref
                        >
                          <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                            <Image
                              src={result.coverUrl}
                              alt={result.title}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
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
                    } else {
                      return (
                        <div
                          key={result.id}
                          className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md"
                        >
                          <div>
                            <p className="text-lg font-semibold">
                              {result.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              {result.artistName}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  }
                  if ("name" in result) {
                    if ("photoUrl" in result) {
                      return (
                        <Link
                          href={`/performer/${result.id}`}
                          key={result.id}
                          passHref
                        >
                          <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                            <Image
                              src={result.coverPhoto}
                              alt={result.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-lg font-semibold">
                                {result.name}
                              </p>
                              <p className="text-sm text-gray-400">Artist</p>
                            </div>
                          </div>
                        </Link>
                      );
                    } else {
                      return (
                        <Link
                          href={`/playlist/${result.id}`}
                          key={result.id}
                          passHref
                        >
                          <div className="flex items-center gap-4 p-4 bg-[#312f2f] rounded-xl shadow-md cursor-pointer">
                            <Image
                              src={result.coverPhoto}
                              alt={result.name}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
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
