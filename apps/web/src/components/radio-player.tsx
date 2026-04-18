"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from "lucide-react";

/** URL stream — akan diambil dari env variable */
const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";

/** Status player */
type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

/**
 * RadioPlayer — Persistent audio player
 * Ditempatkan di root layout agar tidak re-mount saat navigasi halaman.
 * Menggunakan HTML5 Audio API untuk streaming.
 */
export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "Suara Nabawiy Radio",
    speaker: "Menunggu siaran...",
  });

  /** Inisialisasi audio element */
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener("playing", () => setStatus("playing"));
    audio.addEventListener("pause", () => setStatus("paused"));
    audio.addEventListener("waiting", () => setStatus("loading"));
    audio.addEventListener("error", () => setStatus("error"));

    return () => {
      audio.pause();
      audio.src = "";
      audio.load();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Toggle play/pause */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === "playing") {
      audio.pause();
      return;
    }

    try {
      setStatus("loading");

      if (!audio.src && STREAM_URL) {
        audio.src = STREAM_URL;
      }

      if (!STREAM_URL) {
        // Jika belum ada stream URL, tampilkan pesan
        setMetadata({
          title: "Stream Belum Dikonfigurasi",
          speaker: "Silakan set NEXT_PUBLIC_STREAM_URL di .env",
        });
        setStatus("error");
        return;
      }

      await audio.play();
    } catch {
      setStatus("error");
    }
  }, [status]);

  /** Handle volume */
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    },
    []
  );

  /** Toggle mute */
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  /** Render ikon play/pause berdasarkan status */
  const renderPlayIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case "playing":
        return <Pause className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5 ml-0.5" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={status === "loading"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-brand-primary-dark transition-all hover:bg-brand-glow hover:shadow-lg hover:shadow-brand-primary/20 disabled:opacity-50"
          aria-label={status === "playing" ? "Pause" : "Play"}
        >
          {renderPlayIcon()}
        </button>

        {/* Metadata */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            {status === "playing" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-live/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-live">
                <span className="pulse-live inline-block h-1.5 w-1.5 rounded-full bg-live" />
                Live
              </span>
            )}
            <Radio className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="truncate text-sm font-medium text-foreground">
            {metadata.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {metadata.speaker}
          </p>
        </div>

        {/* Volume Control */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-secondary accent-brand-primary"
            aria-label="Volume"
          />
        </div>

        {/* Status Indicator */}
        {status === "error" && (
          <div className="hidden rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive lg:block">
            Gagal terhubung ke stream
          </div>
        )}
      </div>
    </div>
  );
}
