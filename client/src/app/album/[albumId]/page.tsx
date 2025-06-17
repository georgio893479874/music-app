"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayerContext } from "@/contexts/PlayerContext";
import Head from "next/head";
import ShareButton from "@/components/ShareButton";
import { Album } from "@/types";
import Image from "next/image";
import { fetchAlbumById } from "@/api/album";

export default function AlbumPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const { setSelectedSong } = usePlayerContext();

  useEffect(() => {
    if (!albumId) return;

     const fetchAlbum = async () => {
      try {
        const albumData = await fetchAlbumById(albumId as string);
        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (!album) return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <>
      <Head>
        <title>{`${album.title} - Album by ${album.artist.name} | Notent`}</title>
      </Head>
      <div className="flex bg-[#323131] text-white max-h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center flex-1 py-12 px-4">
          <Image
            src={album.coverUrl}
            alt={album.title}
            className="rounded-lg border border-gray-700 mb-6 object-cover shadow-lg transition-transform transform hover:scale-105"
            width={256}
            height={256}
          />
          <h1 className="text-4xl font-extrabold text-center mb-2">{album.title}</h1>
          <p className="text-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Link href={`/artist/${album.artist.id}`} passHref>
              {album.artist.name}
            </Link>{" "}
            · {new Date(album.releaseDate).toLocaleDateString()}{" "}
            · {album.tracks.length} songs
          </p>
          <ul className="mt-6 w-full max-w-md divide-y divide-gray-700">
            {album.tracks?.map((track, index) => (
              <li
                key={track.id}
                className="py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-[#2e2c2c] rounded-lg transition-colors"
                onClick={() => setSelectedSong(track)}
              >
                <span className="font-medium">
                  {index + 1}. {track.title}
                </span>
                <ShareButton trackId={track?.id}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
