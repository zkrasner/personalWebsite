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
import { rentalPaths } from "@/data/roadtripRentalPaths";
import PickupTruckIcon from "@/components/PickupTruckIcon";

function bezierPoint(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  bx: number,
  by: number,
  t: number,
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: mt * mt * ax + 2 * mt * t * cx + t * t * bx,
    y: mt * mt * ay + 2 * mt * t * cy + t * t * by,
  };
}

function bezierAngle(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  bx: number,
  by: number,
  t: number,
): number {
  const mt = 1 - t;
  const dx = 2 * mt * (cx - ax) + 2 * t * (bx - cx);
  const dy = 2 * mt * (cy - ay) + 2 * t * (by - cy);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

type FlightArc = {
  id: string;
  pathD: string;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
};

type RentalPathData = {
  id: string;
  pathD: string;
  projected: { x: number; y: number }[];
  cumLen: number[];
  totalLen: number;
};

type ActiveTransit =
  | { kind: "flight"; arc: FlightArc; subT: number; emoji: string }
  | {
      kind: "rental";
      rental: RentalPathData;
      subT: number;
      emoji: string;
      roundTrip: boolean;
    };

interface RoadTripMapProps {
  progress: number; // 0..1 along the route
  currentStopIndex: number;
  stopPositions: StopPosition[];
  onProgressChange: (p: number) => void;
  showFlights?: boolean;
}

export default function RoadTripMap({
  progress,
  currentStopIndex,
  stopPositions,
  onProgressChange,
  showFlights = true,
}: RoadTripMapProps) {
  const routePathRef = useRef<SVGPathElement>(null);
  const [routeLength, setRouteLength] = useState(0);
  const [truck, setTruck] = useState({
    x: 0,
    y: 0,
    angle: 0,
    facing: 1,
    len: 0,
  });

  const {
    statesPath,
    routeD,
    flightArcs,
    flightArcsForRender,
    rentalPathsData,
  } = useMemo(() => {
    const path = buildPathBuilder();
    const projection = buildProjection();
    const allStates = feature(
      statesTopo as unknown as Topology,
      (statesTopo as unknown as Topology).objects.states,
    ) as unknown as FeatureCollection;
    const states: FeatureCollection = {
      type: "FeatureCollection",
      features: allStates.features.filter((f) => f.id !== "02"),
    };

    // Flight arcs — Bezier curves for flight stops only.
    const arcs: FlightArc[] = roadtrip.stops
      .filter((s) => s.kind === "flight" && s.flightFrom)
      .map((s): FlightArc | null => {
        const a = projection(s.flightFrom!);
        const b = projection([s.lng, s.lat]);
        if (!a || !b) return null;
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.hypot(dx, dy) || 1;
        const mx = a[0] + dx / 2;
        const my = a[1] + dy / 2;
        const nx = -dy / len;
        const ny = dx / len;
        // Bow toward "north" (negative y in SVG). If the natural perpendicular points down, flip.
        const bowSign = ny < 0 ? 1 : -1;
        const cx = mx + nx * len * 0.15 * bowSign;
        const cy = my + ny * len * 0.15 * bowSign;
        return {
          id: s.id,
          pathD: `M${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`,
          ax: a[0],
          ay: a[1],
          bx: b[0],
          by: b[1],
          cx,
          cy,
        };
      })
      .filter((a): a is FlightArc => a !== null);

    // Dedupe: round trips produce two arcs tracing identical Beziers.
    // Keep one per unordered endpoint pair for rendering, but keep all arcs
    // for the plane animation (which looks up arcs by flight id).
    const seen = new Set<string>();
    const uniqueArcs: FlightArc[] = [];
    for (const arc of arcs) {
      const key = [
        `${arc.ax.toFixed(2)},${arc.ay.toFixed(2)}`,
        `${arc.bx.toFixed(2)},${arc.by.toFixed(2)}`,
      ]
        .sort()
        .join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueArcs.push(arc);
    }

    // Rental paths — real driving polylines.
    const rentalPathsData: RentalPathData[] = roadtrip.stops
      .filter((s) => s.kind === "rental" && rentalPaths[s.id])
      .map((s): RentalPathData | null => {
        const raw = rentalPaths[s.id];
        const projected: { x: number; y: number }[] = [];
        for (const c of raw) {
          const p = projection(c);
          if (p) projected.push({ x: p[0], y: p[1] });
        }
        if (projected.length < 2) return null;
        const cumLen: number[] = [0];
        for (let i = 1; i < projected.length; i++) {
          const dx = projected[i].x - projected[i - 1].x;
          const dy = projected[i].y - projected[i - 1].y;
          cumLen.push(cumLen[i - 1] + Math.hypot(dx, dy));
        }
        const totalLen = cumLen[cumLen.length - 1] || 0;
        if (totalLen === 0) return null;
        const pathD = projected
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
          .join(" ");
        return { id: s.id, pathD, projected, cumLen, totalLen };
      })
      .filter((p): p is RentalPathData => p !== null);

    return {
      statesPath: path(states) ?? "",
      routeD: projectRoute(roadtrip.route, path, projection),
      flightArcs: arcs, // every flight — used by plane animation
      flightArcsForRender: uniqueArcs, // deduped — used for drawing arcs
      rentalPathsData,
    };
  }, []);

  // Completion t-values: a flight arc darkens once progress passes the LATEST
  // flight stop sharing those endpoints (so round-trip pairs only darken after
  // the return leg). Rentals darken once progress passes the rental's own t.
  const arcCompletionT = useMemo(() => {
    const result: Record<string, number> = {};
    const keyOf = (arc: FlightArc) =>
      [
        `${arc.ax.toFixed(2)},${arc.ay.toFixed(2)}`,
        `${arc.bx.toFixed(2)},${arc.by.toFixed(2)}`,
      ]
        .sort()
        .join("|");
    // Bucket every flight stop's t by endpoint key.
    const byKey: Record<string, number> = {};
    flightArcs.forEach((a) => {
      const idx = roadtrip.stops.findIndex((s) => s.id === a.id);
      if (idx === -1) return;
      const t = stopPositions[idx]?.t ?? 0;
      const k = keyOf(a);
      byKey[k] = Math.max(byKey[k] ?? 0, t);
    });
    flightArcsForRender.forEach((a) => {
      result[a.id] = byKey[keyOf(a)] ?? 0;
    });
    return result;
  }, [flightArcs, flightArcsForRender, stopPositions]);

  const rentalCompletionT = useMemo(() => {
    const result: Record<string, number> = {};
    rentalPathsData.forEach((rp) => {
      const idx = roadtrip.stops.findIndex((s) => s.id === rp.id);
      if (idx === -1) return;
      result[rp.id] = stopPositions[idx]?.t ?? 0;
    });
    return result;
  }, [rentalPathsData, stopPositions]);

  const activeFlight = useMemo((): ActiveTransit | null => {
    if (!showFlights || stopPositions.length === 0) return null;
    let beforeIdx = 0;
    for (let i = 1; i < stopPositions.length; i++) {
      if (progress <= stopPositions[i].t) {
        beforeIdx = i - 1;
        break;
      }
      beforeIdx = i;
    }
    const afterIdx = Math.min(beforeIdx + 1, stopPositions.length - 1);
    const afterStop = roadtrip.stops[afterIdx];
    const after = stopPositions[afterIdx];
    const before = stopPositions[beforeIdx];
    const span = after.t - before.t || 1;
    const subT = Math.max(0, Math.min(1, (progress - before.t) / span));

    if (afterStop?.kind === "flight") {
      const arc = flightArcs.find((a) => a.id === afterStop.id);
      if (!arc) return null;
      return { kind: "flight", arc, subT, emoji: afterStop.emoji ?? "✈️" };
    }
    if (afterStop?.kind === "rental") {
      const rental = rentalPathsData.find((r) => r.id === afterStop.id);
      if (!rental) return null;
      return {
        kind: "rental",
        rental,
        subT,
        emoji: afterStop.emoji ?? "🚗",
        roundTrip: afterStop.roundTrip === true,
      };
    }
    return null;
  }, [progress, stopPositions, flightArcs, rentalPathsData, showFlights]);

  useEffect(() => {
    if (routePathRef.current) {
      setRouteLength(routePathRef.current.getTotalLength());
    }
  }, [routeD]);

  useEffect(() => {
    const path = routePathRef.current;
    if (!path || routeLength === 0 || stopPositions.length === 0) return;
    // Find bracket using all stops. Flight stops have inherited polylineT so
    // the lerp naturally keeps the truck parked through flight-only brackets.
    let beforeIdx = 0;
    for (let i = 1; i < stopPositions.length; i++) {
      if (progress <= stopPositions[i].t) {
        beforeIdx = i - 1;
        break;
      }
      beforeIdx = i;
    }
    const before = stopPositions[beforeIdx];
    const after =
      stopPositions[Math.min(beforeIdx + 1, stopPositions.length - 1)];
    const span = after.t - before.t || 1;
    const subT = Math.max(0, Math.min(1, (progress - before.t) / span));
    const lenStart = before.polylineT * routeLength;
    const lenEnd = after.polylineT * routeLength;
    const truckLen = lenStart + subT * (lenEnd - lenStart);

    const here = path.getPointAtLength(truckLen);
    const ahead = path.getPointAtLength(Math.min(truckLen + 1, routeLength));
    const dx = ahead.x - here.x;
    const dy = ahead.y - here.y;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const facing = Math.cos((angleDeg * Math.PI) / 180) < 0 ? -1 : 1;
    const visibleAngle = facing === -1 ? angleDeg - 180 : angleDeg;
    setTruck({
      x: here.x,
      y: here.y,
      angle: visibleAngle,
      facing,
      len: truckLen,
    });
  }, [progress, routeLength, stopPositions]);

  const traveledOffset = routeLength - truck.len;

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
          const targetLen = bestT;
          let resultT = stopPositions[0]?.t ?? 0;
          for (let i = 1; i < stopPositions.length; i++) {
            const before = stopPositions[i - 1];
            const after = stopPositions[i];
            const lenStart = before.polylineT * routeLength;
            const lenEnd = after.polylineT * routeLength;
            if (lenEnd <= lenStart) continue; // zero-range bracket (flight-only segment)
            if (targetLen <= lenEnd) {
              const subT = Math.max(
                0,
                Math.min(1, (targetLen - lenStart) / (lenEnd - lenStart)),
              );
              resultT = before.t + subT * (after.t - before.t);
              break;
            }
            resultT = after.t;
          }
          onProgressChange(resultT);
        }}
      />
      {showFlights &&
        flightArcsForRender.map((arc) => (
          <path
            key={arc.id}
            d={arc.pathD}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={
              progress >= (arcCompletionT[arc.id] ?? 0) ? 0.6 : 0.25
            }
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      {showFlights &&
        rentalPathsData.map((rp) => (
          <path
            key={rp.id}
            d={rp.pathD}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={
              progress >= (rentalCompletionT[rp.id] ?? 0) ? 0.75 : 0.35
            }
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      {stopPositions.map((s: StopPosition, i: number) => {
        const stop = roadtrip.stops[i];
        if (stop?.kind === "flight" && !showFlights) return null;
        return (
          <circle
            key={s.id}
            cx={s.x}
            cy={s.y}
            r={i === currentStopIndex ? 5 : 3}
            fill={
              i === currentStopIndex
                ? "var(--color-accent)"
                : "var(--color-ink)"
            }
            stroke="var(--color-paper)"
            strokeWidth="1.5"
          />
        );
      })}
      <g
        transform={`translate(${truck.x}, ${truck.y}) rotate(${truck.angle}) scale(${truck.facing}, 1)`}
      >
        <PickupTruckIcon size={32} />
      </g>
      {activeFlight &&
        (() => {
          if (activeFlight.kind === "flight") {
            const { arc, subT, emoji } = activeFlight;
            const pt = bezierPoint(
              arc.ax,
              arc.ay,
              arc.cx,
              arc.cy,
              arc.bx,
              arc.by,
              subT,
            );
            const angle = bezierAngle(
              arc.ax,
              arc.ay,
              arc.cx,
              arc.cy,
              arc.bx,
              arc.by,
              subT,
            );
            return (
              <text
                x={pt.x}
                y={pt.y}
                transform={`rotate(${angle + 45} ${pt.x} ${pt.y})`}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="22"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {emoji}
              </text>
            );
          }
          // Rental car along the polyline. Round-trip drives go out and back;
          // one-way (default) drives go directly from origin to destination.
          const { rental, subT, emoji, roundTrip } = activeFlight;
          const forward = roundTrip ? subT <= 0.5 : true;
          const polyT = roundTrip
            ? forward
              ? subT * 2
              : (1 - subT) * 2
            : subT;
          const targetLen = polyT * rental.totalLen;
          let segIdx = 1;
          for (let i = 1; i < rental.cumLen.length; i++) {
            if (targetLen <= rental.cumLen[i]) {
              segIdx = i;
              break;
            }
            segIdx = i;
          }
          const segStart = rental.projected[segIdx - 1];
          const segEnd = rental.projected[segIdx];
          const segLen = rental.cumLen[segIdx] - rental.cumLen[segIdx - 1] || 1;
          const segT = Math.max(
            0,
            Math.min(1, (targetLen - rental.cumLen[segIdx - 1]) / segLen),
          );
          const x = segStart.x + segT * (segEnd.x - segStart.x);
          const y = segStart.y + segT * (segEnd.y - segStart.y);
          const tangentAngle =
            (Math.atan2(segEnd.y - segStart.y, segEnd.x - segStart.x) * 180) /
            Math.PI;
          // Motion direction (forward along polyline first half, reversed second half).
          const motionAngle = forward ? tangentAngle : tangentAngle + 180;
          // Same idea as the truck's facing/visibleAngle, but the car emoji
          // naturally faces WEST (the truck PNG faces east), so the flip
          // polarity is inverted: scale(-1, 1) when motion is east-ish.
          const facingFlip =
            Math.cos((motionAngle * Math.PI) / 180) > 0 ? -1 : 1;
          const visibleAngle =
            facingFlip === -1 ? motionAngle : motionAngle + 180;
          return (
            <text
              x={0}
              y={0}
              transform={`translate(${x}, ${y}) rotate(${visibleAngle}) scale(${facingFlip}, 1)`}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="22"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {emoji}
            </text>
          );
        })()}
    </svg>
  );
}
