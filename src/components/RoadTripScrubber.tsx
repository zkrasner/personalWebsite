"use client";

import { useCallback, useRef } from "react";
import { clamp01, type StopPosition } from "@/lib/roadtripGeo";
import type { RoadTripStop } from "@/data/roadtrip";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface RoadTripScrubberProps {
  stops: RoadTripStop[];
  stopPositions: StopPosition[];
  progress: number;
  currentStopIndex: number;
  onProgressChange: (p: number) => void;
}

export default function RoadTripScrubber({
  stops,
  stopPositions,
  progress,
  currentStopIndex,
  onProgressChange,
}: RoadTripScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const progressFromPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clamp01((clientX - rect.left) / rect.width);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    onProgressChange(progressFromPointer(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    onProgressChange(progressFromPointer(e.clientX));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" && currentStopIndex > 0) {
      e.preventDefault();
      onProgressChange(stopPositions[currentStopIndex - 1].t);
    } else if (e.key === "ArrowRight" && currentStopIndex < stops.length - 1) {
      e.preventDefault();
      onProgressChange(stopPositions[currentStopIndex + 1].t);
    } else if (e.key === "Home") {
      e.preventDefault();
      onProgressChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onProgressChange(1);
    }
  };

  return (
    <div className="w-full select-none">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Road trip progress"
        aria-valuemin={0}
        aria-valuemax={stops.length - 1}
        aria-valuenow={currentStopIndex}
        aria-valuetext={stops[currentStopIndex]?.name ?? ""}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKey}
        className="relative h-2 bg-ink/15 rounded-full cursor-pointer focus-ring"
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
        {stopPositions.map((s, i) => (
          <div
            key={s.id}
            className={[
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-paper transition-transform pointer-events-none",
              i === currentStopIndex ? "w-4 h-4 bg-accent" : "w-3 h-3 bg-ink",
            ].join(" ")}
            style={{ left: `${s.t * 100}%` }}
            aria-hidden="true"
          />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-paper border-2 border-ink pointer-events-none"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
      {stops[currentStopIndex] && (
        <div className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink">
          <span className="text-muted">
            {formatDate(stops[currentStopIndex].date)}
          </span>
          <span className="mx-2 text-muted">·</span>
          {stops[currentStopIndex].name}
        </div>
      )}
    </div>
  );
}
