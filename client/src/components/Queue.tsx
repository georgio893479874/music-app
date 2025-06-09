"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { Track } from "@/types";
import { useEffect, useState } from "react";

type QueueProps = {
  songs: Track[];
  selectedSong: Track | null;
  setSelectedSong: (song: Track) => void;
  onClose: () => void;
};

export default function Queue({
  songs,
  selectedSong,
  setSelectedSong,
  onClose,
}: QueueProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    if (selectedSong && songs.length > 0) {
      const idx = songs.findIndex((s) => s.id === selectedSong.id);
      if (idx !== -1) setCurrentSongIndex(idx);
    }
  }, [selectedSong, songs]);

  if (!selectedSong) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No song selected
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          <X />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#212121] text-white shadow-lg overflow-y-auto pb-24 pt-24">
      <div className="relative p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Up Next</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          <X className="cursor-pointer" />
        </button>
      </div>
      <div className="p-4 pb-14">
        <div className="mb-4">
          <h3 className="text-sm text-gray-400">Playing</h3>
          <div className="py-2 px-4 bg-[#1e1e1e] rounded-md flex items-center gap-4">
            <Image
              src={songs[currentSongIndex]?.coverImagePath || "/placeholder.png"}
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
              alt="cover"
            />
            <span className="text-blue-400 font-bold">
              {songs[currentSongIndex]?.title}
            </span>
            <br />
            <span className="text-sm text-gray-400">
              {songs[currentSongIndex]?.album?.artist?.name}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-400">Next</h3>
          <ul>
            {songs.slice(currentSongIndex + 1).map((song) => (
              <li
                key={song.id}
                className="py-2 border-b border-gray-700 flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedSong(song)}
              >
                <Image
                  src={song.coverImagePath || "/placeholder.png"}
                  width={40}
                  height={40}
                  alt="cover"
                />
                <div>
                  <span className="font-bold">{song.title}</span>
                  <br />
                  <span className="text-sm text-gray-400">
                    {song.album?.artist?.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}