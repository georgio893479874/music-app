"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Track } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface FullscreenPlayerProps {
  onClose: () => void;
  selectedSong: Track;
}

const FullscreenPlayer = ({
  onClose,
  selectedSong,
}: FullscreenPlayerProps) => {
  const imageSrc = selectedSong?.coverImagePath || "/placeholder.png"
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)();

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      if (!analyser || !ctx || !dataArrayRef.current) return;
      analyser.getByteFrequencyData(dataArrayRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      dataArrayRef.current.forEach((val, i) => {
        const barHeight = (val / 255) * canvas.height;
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
        ctx.fillRect(
          i * barWidth,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      audioCtx.close();
    };
  }, [selectedSong]);

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
        <X/>
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
      <canvas ref={canvasRef} width={400} height={150} className="mb-4" />
    </motion.div>
  );
};

export default FullscreenPlayer;
