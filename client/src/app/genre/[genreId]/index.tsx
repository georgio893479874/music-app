"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { API_URL } from "@/constants";
import { Album, Genre } from "@/types";

const GenrePage = () => {
  const params = useParams();
  const genreId = Array.isArray(params.genreId) ? params.genreId[0] : params.genreId;
  const [genre, setGenre] = useState<Genre | null>(null);

  useEffect(() => {
    if (!genreId) return;
    const fetchGenre = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/genre/${genreId}`);
        setGenre(data);
      } catch (err) {
        console.error("Failed to load genre", err);
      }
    };
    fetchGenre();
  }, [genreId]);

  if (!genre) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <Head>
        <title>{genre.name} • Neon</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-[#f6f6f6] to-[#ffffff] pb-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">{genre.name}</h1>
          <p className="text-gray-600 mb-8">{genre.albums?.length || 0} albums</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(genre.albums || []).map((album: Album) => (
              <Link href={`/album/${album.id}`} key={album.id} passHref>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-lg h-44 w-full object-cover bg-gray-100">
                    {album.coverUrl ? (
                      <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold line-clamp-2 group-hover:underline">{album.title}</h3>
                    <p className="text-xs text-gray-500">{album.artist?.name || ''} • {new Date(album.releaseDate || Date.now()).getFullYear()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenrePage;