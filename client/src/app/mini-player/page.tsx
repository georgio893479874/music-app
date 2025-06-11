"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BsFillPauseCircleFill,
  BsFillPlayCircleFill,
  BsFillSkipStartCircleFill,
  BsSkipEndCircleFill,
} from "react-icons/bs";

export default function MiniPlayerPage() {
  const [songTitle, setSongTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel("music-player");

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "status") {
        setSongTitle(payload.title);
        setAuthor(payload.author)
        setIsPlaying(payload.isPlaying);
        setCoverImagePath(payload.coverImagePath)
      }
    };

    const interval = setInterval(() => {
      channel.postMessage({ type: "request-status" });
    }, 1000);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, []);

  const sendCommand = (type: string, payload = {}) => {
    const channel = new BroadcastChannel("music-player");
    channel.postMessage({ type, payload });
    channel.close();
  };

  const togglePlay = () => sendCommand("toggle-play");
  const skipBack = () => sendCommand("skip-back");
  const skipNext = () => sendCommand("skip-next");

  return (
    <div className="w-full h-full flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center p-6 gap-6 w-full max-w-md text-center">
        {coverImagePath && (
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={coverImagePath}
              alt="cover"
              width={220}
              height={220}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="bg-black/40 px-4 py-3 rounded-xl shadow-md backdrop-blur-md w-full">
          <h2 className="text-2xl font-semibold mb-1">{songTitle}</h2>
          <p className="text-sm text-gray-300">{author}</p>
        </div>
        <div className="flex gap-8 items-center justify-center text-5xl text-white mt-2">
          <BsFillSkipStartCircleFill
            onClick={skipBack}
            className="cursor-pointer hover:text-gray-300 transition duration-200 ease-in-out"
            size={26}
          />
          {isPlaying ? (
            <BsFillPauseCircleFill
              onClick={togglePlay}
              className="cursor-pointer hover:text-gray-300 transition duration-200 ease-in-out scale-110"
              size={26}
            />
          ) : (
            <BsFillPlayCircleFill
              onClick={togglePlay}
              className="cursor-pointer hover:text-gray-300 transition duration-200 ease-in-out scale-110"
              size={26}
            />
          )}
          <BsSkipEndCircleFill
            onClick={skipNext}
            className="cursor-pointer hover:text-gray-300 transition duration-200 ease-in-out"
            size={26}
          />
        </div>
      </div>
    </div>
  );
}
