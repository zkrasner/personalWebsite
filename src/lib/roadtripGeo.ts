import { geoAlbersUsa, geoPath, type GeoPath } from "d3-geo";
import type { RoadTripStop } from "@/data/roadtrip";

// SVG viewbox dimensions tuned for an Albers USA projection of ~1100x650.
export const MAP_WIDTH = 1100;
export const MAP_HEIGHT = 650;

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
  t: number; // normalized position along the route polyline, 0..1
}

/**
 * Project stops to SVG x/y and compute each stop's normalized position along the route polyline.
 * t-values are derived from cumulative arc length along the projected route (not straight-line
 * stop-to-stop), so they stay in sync with the truck's path.getPointAtLength reference frame.
 */
export function computeStopPositions(
  stops: RoadTripStop[],
  route: [number, number][],
  projection: ReturnType<typeof buildProjection>,
): StopPosition[] {
  // Project the full route polyline.
  const projectedRoute = route.map((c) => projection(c) ?? [NaN, NaN]);

  // Cumulative arc lengths along the projected route.
  const cumLen: number[] = [0];
  for (let i = 1; i < projectedRoute.length; i++) {
    const dx = projectedRoute[i][0] - projectedRoute[i - 1][0];
    const dy = projectedRoute[i][1] - projectedRoute[i - 1][1];
    cumLen.push(cumLen[i - 1] + Math.hypot(dx, dy));
  }
  const total = cumLen[cumLen.length - 1] || 1;

  // Walk the route chronologically so repeated geographic visits (e.g. Ipswich
  // at start, return from Maine, and end) each match the correct occurrence
  // along the polyline rather than the first geographic neighbor.
  let searchStart = 0;
  return stops.map((s) => {
    const p = projection([s.lng, s.lat]);
    if (p === null) {
      console.warn(
        `computeStopPositions: stop "${s.id}" projected to null (lat=${s.lat}, lng=${s.lng})`,
      );
      return { id: s.id, x: NaN, y: NaN, t: 0 };
    }

    // Find the nearest projected route point at or after searchStart.
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

    return {
      id: s.id,
      x: round(p[0], 2),
      y: round(p[1], 2),
      t: round(cumLen[bestI] / total, 6),
    };
  });
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
