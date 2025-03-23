"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/Sidebar/page";
import { FaPlay, FaPause } from "react-icons/fa";
import Link from "next/link";
import ShareButton from "@/components/ShareButton/page";

interface Artist {
  id: string;
  name: string;
  coverPhoto: string;
}

interface Album {
  id: string;
  title: string;
  releaseDate: string;
  coverUrl: string;
}

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const { data: artistData } = await axios.get(
          `http://localhost:4521/performer/${artistId}`
        );
        setArtist(artistData);

        const { data: albumData } = await axios.get(
          `http://localhost:4521/album?artistId=${artistId}`
        );
        setAlbums(albumData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArtistData();
  }, [artistId]);

  const handlePlay = async () => {
    try {
      const { data: songs } = await axios.get(
        `http://localhost:4521/track?artistId=${artistId}`
      );
      if (songs.length > 0) {
        setPlaying(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePause = () => setPlaying(false);

  if (!artist)
    return <p className="text-center text-white text-xl">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-[#323131] text-white pb-10">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="relative w-full h-[400px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={artist.coverPhoto}
            alt={artist.name}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <ShareButton />
          </div>
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-2 sm:gap-4">
            <button
              className="w-12 h-12 flex justify-center items-center bg-[#272727] text-white rounded-full transition"
              onClick={playing ? handlePause : handlePlay}
            >
              {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>
            <h1 className="text-2xl sm:text-5xl font-bold text-white">
              {artist.name}
            </h1>
          </div>
        </div>
        <div className="mt-12 p-4">
          <h1 className="text-4xl font-bold mb-6">Albums</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link href={`/album/${album.id}`} key={album.id} passHref>
                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      className="w-full h-auto object-cover transition duration-300 group-hover:brightness-50"
                      src={album.coverUrl}
                      alt={album.title}
                    />
                    <div className="absolute inset-0 flex justify-between items-end p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
                        <FaPlay size={16} />
                      </button>
                      <ShareButton />
                    </div>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold transition duration-300 group-hover:underline">
                    {album.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(album.releaseDate).getFullYear()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
