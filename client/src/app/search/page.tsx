"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { PiBellRingingFill } from "react-icons/pi";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "axios";
import { genres } from "@/constants";
import Link from "next/link";
import { Album, Artist, Playlist, Track } from "@/types";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type SearchResult = Track | Album | Artist | Playlist;

export default function SearchPage() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/search`,
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
    <div className="flex-1 lg:ml-64">
      <div className="flex items-center p-6 absolute top-0 left-0 w-full z-50">
        <div className="w-full max-w-[650px] mx-auto">
          <div className="flex gap-4 lg:ml-40">
            <button className="p-3 bg-black bg-opacity-40 rounded-2xl transition duration-200">
              <IoArrowBackOutline size={26} style={{ color: "white" }} />
            </button>
            <div className="relative w-full">
              <input
                type="text"
                className="p-4 pl-10 bg-black bg-opacity-40 text-white placeholder-gray-500 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-white w-full backdrop-blur-lg"
                placeholder="Search songs, albums, or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                size={20}
              />
            </div>
            <button className="p-3 bg-black bg-opacity-40 rounded-2xl transition duration-200 hidden md:flex">
              <PiBellRingingFill size={25} style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </div>
      <div className="pt-28 px-6 mb-20">
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
                    width={250}
                    height={250}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {searchQuery && (
          <div className="mt-6 bg-[#232222] text-white rounded-2xl p-6 shadow-lg">
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
