"use client";
import { X, Music } from "lucide-react";
import Image from "next/image";
import { Track } from "@/types";

type QueueProps = {
  songs: Track[];
  selectedSong: Track | null;
  setSelectedSong: (song: Track) => void;
  onClose: () => void;
  isPlaying: boolean;
};

export default function Queue({
  songs,
  selectedSong,
  setSelectedSong,
  onClose,
  isPlaying,
}: QueueProps) {
  if (!selectedSong) {
    return (
      <div className="h-full bg-[#212121] rounded-2xl shadow-lg border border-[#292929] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Music className="w-14 h-14 text-gray-600" />
          <div className="text-lg text-gray-500 font-semibold">
            Пісню не вибрано
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-[#292929] rounded-xl text-gray-400 hover:text-white hover:bg-[#383838] transition"
          >
            <X className="inline mr-1" /> Закрити
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#212121] rounded-2xl shadow-lg p-0 relative border border-[#292929]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
      >
        <X />
      </button>
      <div className="px-7 pt-7 pb-3">
        <h2 className="text-[1.6rem] font-bold text-white tracking-tight mb-6">Music Queue</h2>
        <ul className="space-y-1">
          {songs.map((song) => {
            const isCurrent = song.id === selectedSong.id;
            return (
              <li
                key={song.id}
                className={`flex items-center rounded-xl cursor-pointer transition-all
                  ${isCurrent
                    ? "bg-gradient-to-r from-[#54e0c7] to-[#43a1fa] shadow-md"
                    : "hover:bg-[#292929]"
                  }`}
                style={{
                  padding: isCurrent ? "0.6rem 1rem" : "0.6rem 1.1rem",
                  marginLeft: isCurrent ? "-0.25rem" : "",
                  marginRight: isCurrent ? "-0.25rem" : "",
                }}
                onClick={() => setSelectedSong(song)}
              >
                <Image
                  src={song.coverImagePath || "/placeholder.png"}
                  width={38}
                  height={38}
                  className="rounded-lg object-cover"
                  alt="cover"
                  style={{
                    filter: isCurrent ? "brightness(1.2)" : "none",
                  }}
                />
                <div className={`flex-1 min-w-0 ml-4 ${isCurrent ? "text-white" : ""}`}>
                  <div className={`text-[1.04rem] font-semibold truncate ${isCurrent ? "text-white" : "text-[#f1f1f1]"}`}>
                    {song.title}
                  </div>
                  <div className={`text-xs truncate ${isCurrent ? "text-white/80" : "text-gray-400"}`}>
                    {song.album?.artist?.name}
                  </div>
                </div>
                <div className={`ml-auto text-xs font-semibold ${isCurrent ? "text-white/80" : "text-gray-400"}`}>
                  3.14
                </div>
                {!isCurrent && (
                  <span className="ml-4 text-gray-500 hover:text-gray-300 cursor-pointer">
                    <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                      <circle cx="11" cy="3.5" r="1.5" fill="currentColor"/>
                      <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
                      <circle cx="11" cy="18.5" r="1.5" fill="currentColor"/>
                    </svg>
                  </span>
                )}
                {isCurrent && (
                  <span className="ml-4 flex items-center">
                    {isPlaying ? (
                      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                        <rect x="6" y="5" width="3.5" height="12" rx="1.3" fill="#fff" opacity="0.8"/>
                        <rect x="12.5" y="5" width="3.5" height="12" rx="1.3" fill="#fff" opacity="0.8"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                        <polygon points="7,6 16,11 7,16" fill="#fff" opacity="0.8"/>
                      </svg>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}