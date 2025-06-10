"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Track } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLyrics } from "@/hooks/UseLyrics";

interface FullscreenPlayerProps {
  onClose: () => void;
  selectedSong: Track;
  currentTime: number;
}

const FullscreenPlayer = ({
  onClose,
  selectedSong,
  currentTime,
}: FullscreenPlayerProps) => {
  const imageSrc = selectedSong?.coverImagePath || "/placeholder.png";

  const { lyrics, activeIndex } = useLyrics(selectedSong.id, currentTime);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lyricsContainerRef.current) return;
    const activeLine = lyricsContainerRef.current.querySelector(
      `.lyric-line.active`
    ) as HTMLDivElement | null;
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white flex flex-col items-center justify-center p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl hover:text-red-400 transition"
        aria-label="Close"
      >
        <X />
      </button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Image
          src={imageSrc}
          width={400}
          height={400}
          alt="Cover"
          className="rounded-2xl shadow-2xl border-4 border-white/10"
        />
      </motion.div>
      <motion.div
        className="text-center space-y-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold">{selectedSong.title}</h2>
        <p className="text-lg text-white/80">
          {selectedSong.album?.artist?.name || "Unknown Artist"}
        </p>
      </motion.div>
      <div
        ref={lyricsContainerRef}
        className="max-h-48 w-full max-w-xl overflow-y-auto px-6 py-4 bg-white/10 rounded-lg backdrop-blur-md"
        style={{ scrollbarWidth: "thin" }}
      >
        {lyrics.length === 0 && (
          <p className="text-center text-white/60 italic">Лірика відсутня</p>
        )}

        <AnimatePresence initial={false}>
          {lyrics.map((line, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.p
                key={line.id}
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={lineVariants}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`lyric-line cursor-default select-none transition-all duration-300 ${
                  isActive
                    ? "text-amber-400 font-semibold text-lg scale-105"
                    : "text-white/70"
                }`}
                style={{ transformOrigin: "center" }}
              >
                {line.text}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FullscreenPlayer;
