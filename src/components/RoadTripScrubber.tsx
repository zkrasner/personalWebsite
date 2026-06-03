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
  showFlights?: boolean;
  onShowFlightsChange?: (v: boolean) => void;
}

export default function RoadTripScrubber({
  stops,
  stopPositions,
  progress,
  currentStopIndex,
  onProgressChange,
  showFlights = true,
  onShowFlightsChange = () => {},
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
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      // Build the navigable index list. When flights are hidden, only ground stops are navigable.
      const navIndices: number[] = [];
      stopPositions.forEach((_, i) => {
        const isFlight = stops[i]?.kind === "flight";
        if (!isFlight || showFlights) navIndices.push(i);
      });
      const cursor = navIndices.indexOf(currentStopIndex);
      if (cursor === -1) return;
      const nextCursor =
        e.key === "ArrowLeft"
          ? Math.max(0, cursor - 1)
          : Math.min(navIndices.length - 1, cursor + 1);
      const target = navIndices[nextCursor];
      onProgressChange(stopPositions[target].t);
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
        className="py-3 -my-3 cursor-pointer focus-ring rounded-full"
        style={{ touchAction: "none" }}
      >
        <div
          ref={trackRef}
          aria-hidden="true"
          className="relative h-2 bg-ink/15 rounded-full"
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
          {stopPositions.map((s, i) => {
            const stop = stops[i];
            const isFlight = stop?.kind === "flight";
            const isRental = stop?.kind === "rental";
            // Hide flight/rental notches when flights are hidden — except for
            // park rentals (e.g. Hawaii Volcanoes) which keep showing their park glyph.
            if ((isFlight || isRental) && !showFlights && !stop?.isPark)
              return null;

            // Determine glyph to display above the notch.
            // Priority: park glyph > flight emoji. Rentals get no glyph (unless they're also parks).
            let glyph: string | null = null;
            if (stop?.isPark) glyph = stop.parkIcon ?? "🏞️";
            else if (isFlight) glyph = stop.emoji ?? "✈️";

            return (
              <div key={s.id}>
                <div
                  className={[
                    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-paper transition-transform pointer-events-none",
                    i === currentStopIndex
                      ? "w-4 h-4 bg-accent"
                      : "w-3 h-3 bg-ink",
                  ].join(" ")}
                  style={{ left: `${s.t * 100}%` }}
                  aria-hidden="true"
                />
                {glyph && (
                  <span
                    aria-hidden="true"
                    className="absolute -translate-x-1/2 text-[10px] text-ink pointer-events-none"
                    style={{ left: `${s.t * 100}%`, top: "-14px" }}
                  >
                    {glyph}
                  </span>
                )}
              </div>
            );
          })}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-paper border-2 border-ink pointer-events-none"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        {stops[currentStopIndex] ? (
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink">
            <span className="text-muted">
              {formatDate(stops[currentStopIndex].date)}
            </span>
            <span className="mx-2 text-muted">·</span>
            {stops[currentStopIndex].name}
          </div>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={() => onShowFlightsChange(!showFlights)}
          className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-ink rounded-card text-xs font-semibold uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-paper focus-ring shrink-0"
          aria-label={showFlights ? "Hide flights" : "Show flights"}
          aria-pressed={showFlights}
        >
          {showFlights ? "Hide" : "Show"} ✈️
        </button>
      </div>
    </div>
  );
}
