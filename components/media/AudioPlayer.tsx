"use client";

import { useEffect, useRef, useState } from "react";
import { MUSIC_TRACKS } from "@/lib/musicTracks";

interface AudioPlayerProps {
  audioType: "music" | "voice";
  audioUrl?: string;
  musicTrack?: string;
}

export default function AudioPlayer({
  audioType,
  audioUrl,
  musicTrack,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const src =
    audioType === "music"
      ? MUSIC_TRACKS[musicTrack || "romantic-piano"]
      : audioUrl;

  useEffect(() => {
    if (!src) return;
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setHasInteracted(true);
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!src) return null;

  return (
    <button
      onClick={togglePlay}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.8)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {isPlaying ? (
        <div
          style={{
            display: "flex",
            gap: "3px",
            alignItems: "flex-end",
            height: "20px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "3px",
                background: "white",
                borderRadius: "2px",
                animation: `bounce${i} 0.8s ease-in-out infinite`,
                height: `${i * 5 + 5}px`,
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      ) : (
        <span style={{ color: "white", fontSize: "20px" }}>♪</span>
      )}
    </button>
  );
}
