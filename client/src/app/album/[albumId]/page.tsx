"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import Player from "@/components/Player/page";
import usePlayer from "@/hooks/UsePlayer";

interface Artist {
  id: string;
  name: string;
  coverPhoto: string;
}

interface Genre {
  id: string;
  name: string;
}

interface Track {
  id: string;
  title: string;
  audioFilePath: string;
  duration: string;
  coverImagePath: string;
  album: Album;
}

export interface Album {
  id: string;
  title: string;
  releaseDate: string;
  artistId: string;
  genreId: string;
  coverUrl: string;
  artist: Artist;
  genre: Genre;
  tracks: Track[];
}

export default function AlbumPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const {
    setIsPlaying,
    isPlaying,
    handleProgressChange,
    progressBar,
    skipEnd,
    audioPlayer,
    currentTime,
    duration,
    skipBegin,
  } = usePlayer({
    songs: album?.tracks || [],
    currentSongIndex,
    setCurrentSongIndex,
    repeatMode: "off",
  });

  useEffect(() => {
    if (album && album.tracks.length > 0 && currentSongIndex === 0) {
      setCurrentSongIndex(0);
      setTrack(album.tracks[0]);
    }
  }, [album]);

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbum = async () => {
      try {
        const response = await axios.get<Album>(
          `http://localhost:4521/album/${albumId}`
        );
        setAlbum(response.data);
        setTrack(response.data.tracks[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleTrackClick = async (trackIndex: number) => {
    setCurrentSongIndex(trackIndex);
    setIsPlaying(true);
    try {
      const response = await axios.get<Track>(
        `http://localhost:4521/track/${album?.tracks[trackIndex].id}`
      );
      setTrack(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!album) return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#323131] text-white">
      <Sidebar />
      <div className="flex flex-col items-center flex-1 py-12 px-4 lg:ml-64">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="rounded-lg border border-gray-700 mb-6 object-cover w-64 h-64 shadow-lg transition-transform transform hover:scale-105"
        />
        <h1 className="text-4xl font-extrabold text-center mb-2">{album.title}</h1>
        <Link href={`/artist/${album.artist.id}`} passHref>
          <p className="text-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
            {album.artist.name} · {new Date(album.releaseDate).toLocaleDateString()}
          </p>
        </Link>
        <button 
          onClick={toggleFavorite} 
          className="mt-4 p-2 rounded-full bg-[#2e2c2c] hover:bg-[#312e2e] transition-colors"
        >
          <Heart className={`w-8 h-8 ${isFavorite ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
        </button>
        <ul className="mt-6 w-full max-w-md divide-y divide-gray-700">
          {album.tracks?.map((track, index) => (
            <li
              key={track.id}
              className="py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-[#2e2c2c] rounded-lg transition-colors"
              onClick={() => handleTrackClick(index)}
            >
              <span className="font-medium">{index + 1}. {track.title}</span>
              <span className="text-gray-400">{track.duration}</span>
            </li>
          ))}
        </ul>
      </div>
      <Player
        isPlaying={isPlaying}
        track={track}
        onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
        onSkipNext={skipEnd}
        onSkipPrev={skipBegin}
        handleProgressChange={handleProgressChange}
        progressBar={progressBar}
        audioPlayer={audioPlayer}
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  );
}