"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  BsFillPauseCircleFill,
  BsFillPlayCircleFill,
  BsFillSkipStartCircleFill,
  BsSkipEndCircleFill,
} from "react-icons/bs";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { usePlayerContext } from "@/contexts/PlayerContext";
import usePlayer from "@/hooks/UsePlayer";
import {
  Expand,
  List,
  Music,
  PictureInPicture2,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import FullscreenPlayer from "./FullscreenPlayer";
import { API_URL } from "@/constants";

const Player = ({ onQueueToggle }: { onQueueToggle: () => void }) => {
  const { selectedSong, songs, setSongs } = usePlayerContext();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const lastLoggedTrackId = useRef<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const {
    isPlaying,
    togglePlayPause,
    audioPlayer,
    progressBar,
    currentTime,
    duration,
    currentFormatted,
    durationFormatted,
    skipBegin,
    skipEnd,
    handleProgressChange,
  } = usePlayer({
    songs,
    currentSongIndex,
    setCurrentSongIndex,
    repeatMode,
  });

  useEffect(() => {
    if (selectedSong?.album?.id) {
      fetchSongs(selectedSong.album.id);
    }
  }, [selectedSong, audioPlayer]);

  useEffect(() => {
    if (selectedSong && audioPlayer.current) {
      audioPlayer.current.src = selectedSong.audioFilePath;
      audioPlayer.current.load();
      audioPlayer.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, [selectedSong, audioPlayer]);

  useEffect(() => {
    const logListeningHistory = async () => {
      if (!selectedSong) return;

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      if (selectedSong.id !== lastLoggedTrackId.current) {
        try {
          await axios.post(`${API_URL}/history`, {
            userId,
            trackId: selectedSong.id,
          });
          lastLoggedTrackId.current = selectedSong.id;
        } catch (error) {
          console.error("❌ Failed to add to history:", error);
        }
      }
    };

    if (selectedSong && audioPlayer.current) {
      audioPlayer.current.src = selectedSong.audioFilePath;
      audioPlayer.current.load();
      audioPlayer.current
        .play()
        .then(() => {
          logListeningHistory();
        })
        .catch((error) => {
          console.error("Failed to play audio:", error);
        });
    }
  }, [selectedSong]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!selectedSong) return;
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      if (!userId) return;
      try {
        const res = await axios.get(
          `${API_URL}/favorite`
        );
        type Favorite = { track: { id: string }; userId: string };
        const isFav = res.data.some(
          (fav: Favorite) =>
            fav.track.id === selectedSong.id && fav.userId === userId
        );
        setIsFavorite(isFav);
      } catch {
        setIsFavorite(false);
      }
    };
    checkFavorite();
  }, [selectedSong]);

  useEffect(() => {
    if (selectedSong?.album?.id) {
      const isAlbumLoaded = songs.some(
        (song) => song.album?.id === selectedSong.album?.id
      );
      if (!isAlbumLoaded) {
        fetchSongs(selectedSong.album.id);
      }
    }
  }, [selectedSong, songs]);

  useEffect(() => {
    if (selectedSong) {
      const isAlbumLoaded = songs.some(
        (song) => song.album?.id === selectedSong.album?.id
      );
      if (!isAlbumLoaded && selectedSong.album?.id) {
        fetchSongs(selectedSong.album.id);
      }

      const index = songs.findIndex((s) => s.id === selectedSong.id);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    }
  }, [selectedSong, songs]);

  const fetchSongs = async (albumId: string) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/album/${albumId}`
      );
      if (data?.tracks?.length > 0) {
        setSongs(data.tracks);
      }
    } catch (error) {
      console.error("Failed to load songs:", error);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = Number(e.target.value);
    setVolume(volumeValue);
    if (audioPlayer.current && !isMuted) {
      audioPlayer.current.volume = volumeValue;
    }
  };

  const toggleMute = () => {
    if (audioPlayer.current) {
      if (isMuted) {
        audioPlayer.current.volume = volume;
      } else {
        setVolume(audioPlayer.current.volume);
        audioPlayer.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  const toggleRepeatMode = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );
  };

  const shuffleSongs = () => {
    if (!isShuffling) {
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      setSongs(shuffledSongs);
      setCurrentSongIndex(0);
    } else {
      fetchSongs(selectedSong?.album?.id || "");
    }
    setIsShuffling(!isShuffling);
  };

  const toggleFavorite = async () => {
    try {
      if (!selectedSong) return;
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      if (!userId) {
        alert("Auth Error!");
        return;
      }
      if (isFavorite) {
        await axios.delete(
          `${API_URL}/favorite?userId=${userId}&trackId=${selectedSong.id}`
        );
        setIsFavorite(false);
      } else {
        await axios.post(`${API_URL}/favorite`, {
          trackId: selectedSong.id,
          userId,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleExpand = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="lg:h-24 h-20 flex flex-col items-center justify-between p-4 bg-[#212121] text-white shadow-lg z-10">
        <div className="left-4 flex items-center gap-4 z-5 w-full">
          {selectedSong?.coverImagePath ? (
            <Image
              src={selectedSong.coverImagePath}
              width={64}
              height={64}
              className="lg:w-16 lg:h-16 w-12 h-12 rounded-sm"
              alt="cover"
            />
          ) : (
            <div className="flex items-center justify-center bg-[#181818] lg:w-16 lg:h-16 w-12 h-12 rounded-sm">
              <Music className="text-gray-400 w-8 h-8" />
            </div>
          )}
          <div className="flex flex-col text-start">
            <div className="flex gap-2">
              <span className="text-base font-bold">
                {selectedSong?.album?.artist.name}
              </span>
              <div className="gap-2 hidden sm:flex">
                {isFavorite ? (
                  <FaHeart
                    className="text-white cursor-pointer"
                    onClick={toggleFavorite}
                  />
                ) : (
                  <FaRegHeart
                    className="text-white cursor-pointer"
                    onClick={toggleFavorite}
                  />
                )}
                <PiDotsThreeOutlineFill className="text-white cursor-pointer hidden sm:flex" />
              </div>
            </div>
            <span className="text-xs text-gray-400">{selectedSong?.title}</span>
            <span className="text-xs text-gray-500 lg:flex hidden">
              PLAYING FROM: {selectedSong?.album?.title}
            </span>
          </div>
        </div>
        <audio ref={audioPlayer} preload="metadata" />
        <div className="flex items-center gap-4 fixed right-8 bottom-20 sm:right-auto sm:bottom-auto">
          <p className="md:flex hidden">{currentFormatted}</p>
          <Shuffle
            onClick={shuffleSongs}
            className={`text-xl cursor-pointer ${
              isShuffling ? "text-blue-400" : "text-gray-400"
            } sm:flex hidden`}
          />
          <BsFillSkipStartCircleFill
            onClick={skipBegin}
            className="text-2xl cursor-pointer text-gray-200"
          />
          {isPlaying ? (
            <BsFillPauseCircleFill
              onClick={togglePlayPause}
              className="text-3xl cursor-pointer text-gray-200"
            />
          ) : (
            <BsFillPlayCircleFill
              onClick={togglePlayPause}
              className="text-3xl cursor-pointer text-gray-200"
            />
          )}
          <BsSkipEndCircleFill
            onClick={skipEnd}
            className="text-2xl cursor-pointer text-gray-200"
          />
          <div
            onClick={toggleRepeatMode}
            className="cursor-pointer sm:flex hidden"
          >
            {repeatMode === "off" && <Repeat className="text-gray-400" />}
            {repeatMode === "one" && <Repeat1 className="text-blue-400" />}
            {repeatMode === "all" && <Repeat className="text-blue-400" />}
          </div>
          <p className="md:flex hidden">{durationFormatted}</p>
        </div>
        <div className="flex-col items-center lg:mb-2 w-full max-w-md md:flex hidden">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            ref={progressBar}
            className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundSize: `${(currentTime / (duration || 1)) * 100}% 100%`,
              backgroundImage: "linear-gradient(to right, white, white)",
            }}
          />
        </div>
        <div className="fixed right-4 gap-4 items-center lg:mt-5 lg:flex hidden">
          <div className="flex gap-4 items-center">
            {isMuted || volume == 0 ? (
              <IoVolumeMuteOutline
                onClick={toggleMute}
                className="text-xl cursor-pointer text-gray-200"
              />
            ) : (
              <IoVolumeHighOutline
                onClick={toggleMute}
                className="text-xl cursor-pointer text-gray-200"
              />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
            />
            <List
              className="text-xl cursor-pointer text-gray-200"
              onClick={onQueueToggle}
            />
            <Expand
              className="text-xl cursor-pointer text-gray-200"
              onClick={handleExpand}
            />
            <PictureInPicture2
              className="text-xl cursor-pointer text-gray-200"
            />
          </div>
        </div>
      </div>
      {isFullscreen && selectedSong && (
        <FullscreenPlayer
          onClose={handleCloseFullscreen}
          selectedSong={selectedSong}
          currentTime={currentTime}
        />
      )}
    </>
  );
};

export default Player;
