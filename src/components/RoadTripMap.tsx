"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";
import statesTopo from "us-atlas/states-10m.json";
import {
  buildPathBuilder,
  buildProjection,
  MAP_HEIGHT,
  MAP_WIDTH,
  projectRoute,
  type StopPosition,
} from "@/lib/roadtripGeo";
import { roadtrip } from "@/data/roadtrip";
import PickupTruckIcon from "@/components/PickupTruckIcon";

interface RoadTripMapProps {
  progress: number; // 0..1 along the route
  currentStopIndex: number;
  stopPositions: StopPosition[];
  onProgressChange: (p: number) => void;
}

export default function RoadTripMap({
  progress,
  currentStopIndex,
  stopPositions,
  onProgressChange,
}: RoadTripMapProps) {
  const routePathRef = useRef<SVGPathElement>(null);
  const [routeLength, setRouteLength] = useState(0);
  const [truck, setTruck] = useState({ x: 0, y: 0, angle: 0, facing: 1 });

  const { statesPath, routeD } = useMemo(() => {
    const path = buildPathBuilder();
    const projection = buildProjection();
    const allStates = feature(
      statesTopo as unknown as Topology,
      (statesTopo as unknown as Topology).objects.states,
    ) as unknown as FeatureCollection;
    const states: FeatureCollection = {
      type: "FeatureCollection",
      features: allStates.features.filter(
        (f) => f.id !== "02" && f.id !== "15",
      ),
    };
    return {
      statesPath: path(states) ?? "",
      routeD: projectRoute(roadtrip.route, path, projection),
    };
  }, []);

  useEffect(() => {
    if (routePathRef.current) {
      setRouteLength(routePathRef.current.getTotalLength());
    }
  }, [routeD]);

  useEffect(() => {
    const path = routePathRef.current;
    if (!path || routeLength === 0) return;
    const t = progress * routeLength;
    const here = path.getPointAtLength(t);
    const ahead = path.getPointAtLength(Math.min(t + 1, routeLength));
    const dx = ahead.x - here.x;
    const dy = ahead.y - here.y;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const facing = Math.cos((angleDeg * Math.PI) / 180) < 0 ? -1 : 1;
    const visibleAngle = facing === -1 ? angleDeg - 180 : angleDeg;
    setTruck({ x: here.x, y: here.y, angle: visibleAngle, facing });
  }, [progress, routeLength]);

  const traveledOffset = routeLength * (1 - progress);

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="Map of the United States showing the road trip route"
    >
      <path
        d={statesPath}
        fill="var(--color-warm)"
        stroke="var(--color-ink)"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d={routeD}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.2"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        ref={routePathRef}
        d={routeD}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={routeLength || undefined}
        strokeDashoffset={traveledOffset || undefined}
      />
      {/* Wide invisible click target along the route so users can scrub by clicking the trail */}
      <path
        d={routeD}
        fill="none"
        stroke="transparent"
        strokeWidth="14"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ cursor: "pointer" }}
        onPointerDown={(e) => {
          const path = routePathRef.current;
          const svg = e.currentTarget.ownerSVGElement;
          if (!path || !svg || routeLength === 0) return;
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const ctm = svg.getScreenCTM();
          if (!ctm) return;
          const local = pt.matrixTransform(ctm.inverse());
          // Brute-force nearest length-along-path. ~400 samples is fast and
          // accurate to a few SVG units on a ~5000-unit route.
          const samples = 400;
          let bestT = 0;
          let bestD = Infinity;
          for (let i = 0; i <= samples; i++) {
            const t = (i / samples) * routeLength;
            const p = path.getPointAtLength(t);
            const dx = p.x - local.x;
            const dy = p.y - local.y;
            const d = dx * dx + dy * dy;
            if (d < bestD) {
              bestD = d;
              bestT = t;
            }
          }
          onProgressChange(bestT / routeLength);
        }}
      />
      {stopPositions.map((s: StopPosition, i: number) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={i === currentStopIndex ? 5 : 3}
          fill={
            i === currentStopIndex ? "var(--color-accent)" : "var(--color-ink)"
          }
          stroke="var(--color-paper)"
          strokeWidth="1.5"
        />
      ))}
      <g
        transform={`translate(${truck.x}, ${truck.y}) rotate(${truck.angle}) scale(${truck.facing}, 1)`}
      >
        <PickupTruckIcon size={32} />
      </g>
    </svg>
  );
}
