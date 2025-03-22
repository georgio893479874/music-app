import { useRef, useState, useEffect } from "react";

export interface Track {
  id: string;
  title: string;
  audioFilePath: string;
  authorId?: string;
  duration: string;
  coverImagePath: string;
}

interface IControlsService {
  songs: Track[];
  currentSongIndex: number;
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
  repeatMode: "off" | "one" | "all";
}

const usePlayer = ({
  songs,
  currentSongIndex,
  setCurrentSongIndex,
  repeatMode,
}: IControlsService) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useRef<HTMLAudioElement>(new Audio());
  const progressBar = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioPlayer.current = new Audio();
    }
  }, []);

  useEffect(() => {
    const audio = audioPlayer.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (progressBar.current) {
        progressBar.current.value = String(audio.currentTime);
        setDuration(audioPlayer.current.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (progressBar.current) {
        progressBar.current.max = String(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
        audio.play();
        setIsPlaying(true);
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audio.pause();
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        audio.currentTime = 0;
        if (currentSongIndex > 0) {
          setCurrentSongIndex(currentSongIndex - 1);
        }
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        audio.currentTime = 0;
        if (currentSongIndex < songs.length - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
        }
      });

      navigator.mediaSession.setActionHandler("seekbackward", () => {
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
      });

      navigator.mediaSession.setActionHandler("seekforward", () => {
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        audio.pause();
        audio.currentTime = 0;
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
        audioPlayer.current.pause();
        const previousTime = audioPlayer.current.currentTime;
        audioPlayer.current.src = song.audioFilePath;
        audioPlayer.current.load();
        audioPlayer.current.currentTime = previousTime;

        if (isPlaying) {
          audioPlayer.current.play();
        }
      }
    };

    loadSong();
  }, [currentSongIndex, songs, isPlaying]);

  useEffect(() => {
    const audio = audioPlayer.current;

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all") {
        if (currentSongIndex < songs.length - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
        } else {
          setCurrentSongIndex(0);
        }
        audio.currentTime = 0;
      } else {
        if (currentSongIndex < songs.length - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
        } else {
          setCurrentSongIndex(0);
        }
        audio.currentTime = 0;
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, setCurrentSongIndex, songs, repeatMode]);

  const togglePlayPause = () => {
    const audio = audioPlayer.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = value;
    }
    setCurrentTime(value);
  };

  const skipBegin = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
    audioPlayer.current.currentTime = 0;
  };

  const skipEnd = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
    audioPlayer.current.currentTime = 0;
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