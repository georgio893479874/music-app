import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerService } from "@/types";
import { useRef, useState, useEffect } from "react";

const usePlayer = ({
  songs,
  currentSongIndex,
  setCurrentSongIndex,
  repeatMode,
}: PlayerService) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const { setSelectedSong } = usePlayerContext();

  useEffect(() => {
    if (typeof window !== "undefined" && audioPlayer.current === null) {
      audioPlayer.current = new window.Audio();
    }
  }, []);

  useEffect(() => {
    const audio = audioPlayer.current;

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [audioPlayer]);

  useEffect(() => {
    const audio = audioPlayer.current;

    if ("mediaSession" in navigator && songs.length > 0) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: songs[currentSongIndex].title,
        artwork: [
          { src: songs[currentSongIndex].coverImagePath, type: "image/jpg" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        if (audio) {
          audio.play();
          setIsPlaying(true);
        }
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        if (audio) {
          audio.pause();
        }
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (audio) {
          audio.currentTime = 0;
        }
        if (currentSongIndex > 0) {
          setCurrentSongIndex(currentSongIndex - 1);
        }
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (audio) {
          audio.currentTime = 0;
        }
        if (currentSongIndex < songs.length - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
        }
      });

      navigator.mediaSession.setActionHandler("seekbackward", () => {
        if (audio) {
          audio.currentTime = Math.max(audio.currentTime - 10, 0);
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", () => {
        if (audio) {
          audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
        }
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setIsPlaying(false);
      });
    }

    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
      }
    };
  }, [songs, currentSongIndex, setCurrentSongIndex, setIsPlaying]);

  useEffect(() => {
    const loadSong = async () => {
      if (songs.length > 0) {
        const song = songs[currentSongIndex];
        if (audioPlayer.current) {
          const previousTime = audioPlayer.current.currentTime;
          audioPlayer.current.src = song.audioFilePath;
          audioPlayer.current.load();
          audioPlayer.current.currentTime = previousTime;
          if (isPlaying) {
            audioPlayer.current.play();
          }
        }
      }
    };
    loadSong();
  }, [currentSongIndex, songs, isPlaying]);

  useEffect(() => {
    const audio = audioPlayer.current;

    if (audio) {
      const handleEnded = () => {
        if (repeatMode === "one") {
          audio.currentTime = 0;
          audio.play();
        } else if (repeatMode === "all") {
          if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            setSelectedSong(songs[currentSongIndex + 1]);
          } else {
            setCurrentSongIndex(0);
          }
          audio.currentTime = 0;
        } else {
          if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            setSelectedSong(songs[currentSongIndex + 1]);
          } else {
            setCurrentSongIndex(0);
            setSelectedSong(songs[0]);
          }
          audio.currentTime = 0;
        }
      };

      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [
    currentSongIndex,
    setCurrentSongIndex,
    songs,
    repeatMode,
    setSelectedSong,
  ]);

  const togglePlayPause = () => {
    const audio = audioPlayer.current;
    if (isPlaying) {
      if (audio) {
        audio.pause();
      }
    } else {
      if (audio) {
        audio.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioPlayer.current) {
      const newTime = Number(e.target.value);
      audioPlayer.current.currentTime = newTime;
      if (progressBar.current) {
        progressBar.current.value = String(newTime);
      }
      setCurrentTime(newTime);
    }
  };

  const skipBegin = () => {
    if (currentSongIndex > 0) {
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prevIndex);
      setSelectedSong(songs[prevIndex]);
    }
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0;
    }
  };

  const skipEnd = () => {
    if (currentSongIndex < songs.length - 1) {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
      setSelectedSong(songs[nextIndex]);
    }
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0;
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    progressBar,
    audioPlayer,
    togglePlayPause,
    handleProgressChange,
    skipBegin,
    skipEnd,
    currentFormatted: formatTime(currentTime),
    durationFormatted: formatTime(duration),
    repeatMode,
    setIsPlaying,
    setCurrentSongIndex,
  };
};

export default usePlayer;
