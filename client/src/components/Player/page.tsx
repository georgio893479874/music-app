import { RefObject, useState } from "react";
import {
  BsFillPauseCircleFill,
  BsFillPlayCircleFill,
  BsFillSkipStartCircleFill,
  BsSkipEndCircleFill,
} from "react-icons/bs";
import { Album } from "@/app/album/[albumId]/page";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import {
  IoArrowUpOutline,
  IoLaptopOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  handleProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  progressBar: React.RefObject<HTMLInputElement | null>;
  audioPlayer: RefObject<HTMLAudioElement>;
  currentTime: number;
  duration: number;
}

interface Track {
  id: string;
  title: string;
  audioFilePath: string;
  duration: string;
  coverImagePath: string;
  album: Album;
}

const Player: React.FC<PlayerProps> = ({
  track,
  isPlaying,
  onPlayPauseToggle,
  onSkipNext,
  onSkipPrev,
  handleProgressChange,
  progressBar,
  audioPlayer,
  currentTime,
  duration,
}) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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

  return (
    <div className="lg:h-24 h-20 flex flex-col items-center justify-between p-4 bg-[#212121] text-white fixed lg:bottom-0 bottom-14 left-0 right-0 shadow-lg z-10">
      {track && (
        <>
          <div className="left-4 flex items-center gap-4 z-5 w-full">
            <img
              src={track.coverImagePath}
              className="lg:w-16 lg:h-16 w-12 h-12 rounded-sm"
              alt="cover image"
            />
            <div className="flex flex-col text-start">
              <div className="flex gap-2">
                <span className="text-base font-bold">
                  {track?.album?.artist?.name}
                </span>
                <div className="flex gap-2">
                  <PiDotsThreeOutlineFill className="text-white cursor-pointer hidden sm:flex" />
                </div>
              </div>
              <span className="text-xs text-gray-400">{track.title}</span>
              <span className="text-xs text-gray-500 lg:flex hidden">
                PLAYING FROM: {track?.album?.title}
              </span>
            </div>
          </div>
          <audio
            ref={audioPlayer}
            src={track.audioFilePath}
            onEnded={onSkipNext}
            preload="metadata"
          />
        </>
      )}
      <div className="flex items-center gap-4 fixed right-8 bottom-20 sm:right-auto sm:bottom-auto">
        <p className="md:flex hidden">{currentTime}</p>
        <BsFillSkipStartCircleFill
          onClick={onSkipPrev}
          className="text-2xl cursor-pointer text-gray-200"
        />
        {isPlaying ? (
          <BsFillPauseCircleFill
            onClick={onPlayPauseToggle}
            className="text-3xl cursor-pointer text-gray-200"
          />
        ) : (
          <BsFillPlayCircleFill
            onClick={onPlayPauseToggle}
            className="text-3xl cursor-pointer text-gray-200"
          />
        )}
        <BsSkipEndCircleFill
          onClick={onSkipNext}
          className="text-2xl cursor-pointer text-gray-200"
        />
        <p className="md:flex hidden">{duration}</p>
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
          {isMuted ? (
            <IoVolumeMuteOutline
              onClick={toggleMute}
              className="text-xl cursor-pointer text-gray-200"
              size={24}
            />
          ) : (
            <IoVolumeHighOutline
              onClick={toggleMute}
              className="text-xl cursor-pointer text-gray-200"
              size={24}
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
          <IoLaptopOutline
            className="text-xl cursor-pointer text-gray-200"
            size={24}
          />
          <IoArrowUpOutline
            className="text-xl cursor-pointer text-gray-200"
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
