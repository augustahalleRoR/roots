"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon, PauseIcon, DownloadIcon } from "@/components/icons";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// A stitched-in-the-mockup audio player: real playback of an <audio>
// element, with a decorative bar track (not a literal waveform) whose
// fill reflects real progress.
export function AudioPlayer({
  src,
  label,
  caption,
}: {
  src: string;
  label: string;
  caption?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function seek(e: React.MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  }

  // Static bar heights, computed once, purely decorative -- gives the
  // "waveform" look the mockup uses without pretending to analyze audio.
  const bars = useMemo(
    () => Array.from({ length: 46 }, (_, i) => 6 + ((i * 37) % 18)),
    []
  );

  return (
    <div className="border border-line bg-paper-warm p-4 sm:p-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moss-deep text-paper transition-colors hover:bg-ink"
        >
          {playing ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4 translate-x-[1px]" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-moss-deep">
            {label}
          </p>
          <button
            onClick={seek}
            aria-label="Seek"
            className="mt-2 flex h-6 w-full items-end gap-[2px]"
          >
            {bars.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className={`w-full rounded-full transition-colors ${
                  i / bars.length <= progress ? "bg-moss-deep" : "bg-line"
                }`}
              />
            ))}
          </button>
        </div>
        <p className="hidden shrink-0 font-mono text-[11px] tabular-nums text-ink-soft sm:block">
          {formatTime(current)} / {formatTime(duration)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        {caption && (
          <p className="text-sm italic text-ink-soft">{caption}</p>
        )}
        <a
          href={src}
          download
          className="ml-auto flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-indigo hover:text-ink"
        >
          Download audio <DownloadIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
