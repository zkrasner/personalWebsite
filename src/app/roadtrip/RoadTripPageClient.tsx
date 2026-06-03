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
} from "@/lib/roadtripGeo";

export default function RoadTripPageClient() {
  const [progress, setProgress] = useState(0);

  const stopPositions = useMemo(
    () =>
      computeStopPositions(roadtrip.stops, roadtrip.route, buildProjection()),
    [],
  );

  const currentStopIndex = useMemo(
    () => nearestStopIndex(progress, stopPositions),
    [progress, stopPositions],
  );

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        <section className="max-w-[1100px] mx-auto px-8 pt-28 pb-12 max-md:pt-20">
          <h1 className="font-heading font-black text-4xl leading-[0.95] tracking-tight mb-3 max-md:text-3xl">
            Road Trip
          </h1>
          <p className="font-heading italic text-lg text-muted">
            {roadtrip.intro}
          </p>
        </section>

        <section className="max-w-[1100px] mx-auto px-8 pb-6">
          <RoadTripMap
            progress={progress}
            currentStopIndex={currentStopIndex}
            stopPositions={stopPositions}
            onProgressChange={setProgress}
          />
        </section>

        <section className="max-w-[1100px] mx-auto px-8 pb-24">
          <RoadTripScrubber
            stops={roadtrip.stops}
            stopPositions={stopPositions}
            progress={progress}
            currentStopIndex={currentStopIndex}
            onProgressChange={setProgress}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
