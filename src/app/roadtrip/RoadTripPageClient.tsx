"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoadTripMap from "@/components/RoadTripMap";
import RoadTripScrubber from "@/components/RoadTripScrubber";
import { roadtrip } from "@/data/roadtrip";
import {
  buildProjection,
  computeStopPositions,
  nearestStopIndex,
  type StopPosition,
} from "@/lib/roadtripGeo";

export default function RoadTripPageClient() {
  const [progress, setProgress] = useState(0);
  const [showFlights, setShowFlights] = useState(true);

  const stopPositions = useMemo(
    () =>
      computeStopPositions(roadtrip.stops, roadtrip.route, buildProjection()),
    [],
  );

  const currentStopIndex = useMemo(() => {
    if (showFlights) {
      return nearestStopIndex(progress, stopPositions);
    }
    // Map ground-only positions back to their original index.
    const groundMap: { pos: StopPosition; originalIndex: number }[] = [];
    stopPositions.forEach((p, i) => {
      if (roadtrip.stops[i].kind !== "flight") {
        groundMap.push({ pos: p, originalIndex: i });
      }
    });
    const groundIdx = nearestStopIndex(
      progress,
      groundMap.map((g) => g.pos),
    );
    return groundIdx === -1 ? -1 : groundMap[groundIdx].originalIndex;
  }, [progress, stopPositions, showFlights]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        <section className="max-w-[1100px] mx-auto px-8 pt-28 pb-12 grid grid-cols-[1fr_320px] gap-16 items-start max-md:grid-cols-1 max-md:pt-20 max-md:gap-10">
          <div>
            <h1 className="font-heading font-black text-4xl leading-[0.95] tracking-tight mb-1 max-md:text-3xl max-sm:text-2xl">
              Road
              <span className="block text-accent">Trip</span>
            </h1>
            <p className="font-heading italic text-lg text-muted mt-6 pt-4 border-t-2 border-ink">
              {roadtrip.intro}
            </p>
            <p className="mt-6 text-base leading-[1.75] text-body max-w-[540px]">
              {roadtrip.body}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
            {roadtrip.stats.map((stat, i) => {
              const isLast = i === roadtrip.stats.length - 1;
              // Render digits big and any trailing suffix (s, k+, +, etc.) smaller
              // so the suffix doesn't read as a capital letter in Playfair's bold.
              const match = stat.value.match(/^([\d.]+)(.*)$/);
              const digits = match ? match[1] : stat.value;
              const suffix = match ? match[2] : "";
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center ${
                    isLast ? "col-span-2" : ""
                  }`}
                >
                  <dt className="font-heading font-black text-3xl text-accent leading-none">
                    {digits}
                    {suffix && (
                      <span className="text-lg font-bold align-baseline">
                        {suffix}
                      </span>
                    )}
                  </dt>
                  <dd className="text-xs uppercase tracking-[0.08em] text-muted mt-2">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section className="max-w-[1100px] mx-auto px-8 pb-6">
          <RoadTripMap
            progress={progress}
            currentStopIndex={currentStopIndex}
            stopPositions={stopPositions}
            onProgressChange={setProgress}
            showFlights={showFlights}
          />
        </section>

        <section className="max-w-[1100px] mx-auto px-8 pb-24">
          <RoadTripScrubber
            stops={roadtrip.stops}
            stopPositions={stopPositions}
            progress={progress}
            currentStopIndex={currentStopIndex}
            onProgressChange={setProgress}
            showFlights={showFlights}
            onShowFlightsChange={setShowFlights}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
