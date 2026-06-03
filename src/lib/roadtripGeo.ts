import { geoAlbersUsa, geoPath, type GeoPath } from "d3-geo";
import type { RoadTripStop } from "@/data/roadtrip";

// SVG viewbox dimensions tuned for an Albers USA projection of ~1100x650.
export const MAP_WIDTH = 1100;
export const MAP_HEIGHT = 650;

// Fixed scrub-distance allocated per flight stop so the scrubber advances
// a small, uniform amount through each flight bracket (instead of a
// calendar-date-dependent amount).
const FLIGHT_DISTANCE_UNITS = 100;

export function buildProjection() {
  return geoAlbersUsa()
    .scale(1300)
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
}

export function buildPathBuilder(): GeoPath {
  return geoPath(buildProjection());
}

export function projectRoute(
  route: [number, number][],
  path: GeoPath,
  projection: ReturnType<typeof buildProjection>,
): string {
  // GeoJSON LineString. Albers USA returns null for points outside its supported region;
  // we filter to be safe (no Alaska/Hawaii in the road trip).
  const coordinates = route.filter((c) => projection(c) !== null);
  const lineString = { type: "LineString" as const, coordinates };
  return path(lineString) ?? "";
}

export interface StopPosition {
  id: string;
  x: number;
  y: number;
  // 0..1 along the projected ground polyline.
  // Flight stops inherit the polylineT of the most recent ground stop before them.
  polylineT: number;
  // 0..1 along the scrubber (distance-based, not calendar-based).
  t: number;
}

export function computeStopPositions(
  stops: RoadTripStop[],
  route: [number, number][],
  projection: ReturnType<typeof buildProjection>,
): StopPosition[] {
  // Project the ground polyline (used for polylineT lookups).
  const projectedRoute = route.map((c) => projection(c) ?? [NaN, NaN]);

  // Cumulative arc lengths along the projected route.
  const cumLen: number[] = [0];
  for (let i = 1; i < projectedRoute.length; i++) {
    const dx = projectedRoute[i][0] - projectedRoute[i - 1][0];
    const dy = projectedRoute[i][1] - projectedRoute[i - 1][1];
    cumLen.push(cumLen[i - 1] + Math.hypot(dx, dy));
  }
  const totalLen = cumLen[cumLen.length - 1] || 1;

  // First pass: project each stop and derive polylineT.
  // Flight stops inherit the polylineT of the most recent ground stop.
  let searchStart = 0;
  let lastGroundPolylineT = 0;

  const partials = stops.map((s) => {
    const p = projection([s.lng, s.lat]);
    const xy = p === null ? { x: NaN, y: NaN } : { x: p[0], y: p[1] };

    if (s.kind === "flight" || s.kind === "rental") {
      return { id: s.id, x: xy.x, y: xy.y, polylineT: lastGroundPolylineT };
    }

    if (p === null) {
      console.warn(
        `computeStopPositions: stop "${s.id}" projected to null (lat=${s.lat}, lng=${s.lng})`,
      );
      return { id: s.id, x: NaN, y: NaN, polylineT: lastGroundPolylineT };
    }

    // Ground stop: find the nearest polyline point at or after searchStart.
    let bestI = searchStart;
    let bestD = Infinity;
    for (let i = searchStart; i < projectedRoute.length; i++) {
      const d = Math.hypot(
        projectedRoute[i][0] - p[0],
        projectedRoute[i][1] - p[1],
      );
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    searchStart = bestI;
    const polylineT = cumLen[bestI] / totalLen;
    lastGroundPolylineT = polylineT;
    return { id: s.id, x: xy.x, y: xy.y, polylineT };
  });

  // Second pass: build cumulative scrub-distance (in normalized polylineT space).
  // When two consecutive stops share the same polylineT (flight bracket with no driving),
  // use a fixed small step so flight stops still advance the scrubber.
  const flightStep = FLIGHT_DISTANCE_UNITS / totalLen;
  const cumDist: number[] = [0];
  for (let i = 1; i < partials.length; i++) {
    const delta = partials[i].polylineT - partials[i - 1].polylineT;
    const step = delta === 0 ? flightStep : delta;
    cumDist.push(cumDist[i - 1] + step);
  }
  const totalCum = cumDist[cumDist.length - 1] || 1;

  return partials.map((p, i) => ({
    id: p.id,
    x: round(p.x, 2),
    y: round(p.y, 2),
    polylineT: round(p.polylineT, 6),
    t: round(cumDist[i] / totalCum, 6),
  }));
}

function round(x: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(x * f) / f;
}

export function nearestStopIndex(
  progress: number,
  stops: StopPosition[],
): number {
  if (stops.length === 0) return -1;
  let best = 0;
  let bestDist = Math.abs(stops[0].t - progress);
  for (let i = 1; i < stops.length; i++) {
    const d = Math.abs(stops[i].t - progress);
    if (d <= bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
