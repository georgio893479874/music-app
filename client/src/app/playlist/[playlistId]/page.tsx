'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Track {
  id: string;
  title: string;
  duration: string;
}

interface Artist {
  id: string;
  name: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverPhoto: string;
  tracks: Track[];
  artist: Artist;
}

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  useEffect(() => {
    if (!playlistId) return;

    const fetchPlaylist = async () => {
      try {
        const response = await axios.get<Playlist>(`http://localhost:4521/playlist/${playlistId}`);
        setPlaylist(response.data);
      } 
      
      catch (error) {
        console.error(error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (!playlist) return;

  return (
    <div className="flex">
      <div className="text-white flex flex-col items-center py-12 px-4 flex-1 lg:ml-64">
        <Image
          src={playlist.coverPhoto}
          alt={playlist.name}
          width={256}
          height={256}
          className="rounded-lg border border-gray-600 mb-6 object-cover"
        />
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
        <div className="flex">
          <Link href={`/artist/${playlist.artist.id}`} passHref>
            <p className="text-sm text-gray-400">{playlist.artist.name}</p>
          </Link>
          <p className="text-3xl text-gray-400">·</p>
        </div>
        <button onClick={toggleFavorite} className="mt-4">
          <Heart
            className={`w-8 h-8 ${isFavorite ? "text-red-600 fill-red-600" : "text-gray-400"}`}
          />
        </button>
        <ul className="mt-6 w-full max-w-md">
          {playlist.tracks.map((track, index) => (
            <li
              key={track.id}
              className="py-2 border-b border-gray-700 flex justify-between"
            >
              <span>
                {index + 1}. {track.title}
              </span>
              <span className="text-gray-400">{track.duration}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
