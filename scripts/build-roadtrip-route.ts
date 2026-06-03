// Build script: fetch real driving routes from OSRM for each consecutive stop pair.
// Re-run with: npx tsx scripts/build-roadtrip-route.ts
// Output: src/data/roadtripRoute.ts

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { roadtrip } from "../src/data/roadtrip.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";
const THROTTLE_MS = 250;
const OUTPUT_PATH = join(__dirname, "../src/data/roadtripRoute.ts");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Perpendicular distance from point p to the line segment (a, b) in lat/lng cartesian space. */
function perpendicularDistance(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) {
    return Math.hypot(p[0] - a[0], p[1] - a[1]);
  }
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const cx = a[0] + t * dx;
  const cy = a[1] + t * dy;
  return Math.hypot(p[0] - cx, p[1] - cy);
}

function douglasPeucker(
  points: [number, number][],
  tolerance: number,
): [number, number][] {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist > tolerance) {
    const left = douglasPeucker(points.slice(0, index + 1), tolerance);
    const right = douglasPeucker(points.slice(index), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  return [start, end];
}

async function fetchSegment(
  coords: [number, number][],
): Promise<[number, number][] | null> {
  const coordStr = coords.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `${OSRM_BASE}/${coordStr}?overview=simplified&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    code: string;
    routes?: Array<{ geometry: { coordinates: [number, number][] } }>;
  };
  if (json.code !== "Ok" || !json.routes?.length) {
    return null;
  }
  const routeCoords = json.routes[0].geometry.coordinates;
  if (!routeCoords?.length) return null;
  // Round each coordinate to 4 decimal places (~11m precision).
  return routeCoords.map(
    ([lng, lat]) =>
      [Number(lng.toFixed(4)), Number(lat.toFixed(4))] as [number, number],
  );
}

async function main() {
  const stops = roadtrip.stops;
  const allCoords: [number, number][] = [];
  let fallbacks = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    const fromCoord: [number, number] = [from.lng, from.lat];
    const toCoord: [number, number] = [to.lng, to.lat];
    const waypointCoords: [number, number][] = to.waypoints ?? [];
    const segmentCoords: [number, number][] = [
      fromCoord,
      ...waypointCoords,
      toCoord,
    ];

    // Skip same-location segments (e.g. wedding at the same coords as ipswich-end).
    if (
      segmentCoords.length === 2 &&
      segmentCoords[0][0] === segmentCoords[1][0] &&
      segmentCoords[0][1] === segmentCoords[1][1]
    ) {
      console.log(`  [skip] Segment ${from.id} → ${to.id}: same coords`);
      continue;
    }

    let segment: [number, number][] | null = null;
    try {
      segment = await fetchSegment(segmentCoords);
    } catch (err) {
      console.warn(
        `  [WARN] Segment ${from.id} → ${to.id}: fetch error: ${err}. Using straight line.`,
      );
    }

    if (!segment) {
      console.warn(
        `  [WARN] Segment ${from.id} → ${to.id}: OSRM returned no route. Using straight line.`,
      );
      segment = [fromCoord, toCoord];
      fallbacks++;
    } else {
      console.log(
        `  [OK]   Segment ${from.id} → ${to.id}: ${segment.length} points`,
      );
    }

    // Append coords; skip first point of each subsequent segment to avoid duplicates.
    const startIdx = allCoords.length === 0 ? 0 : 1;
    for (let j = startIdx; j < segment.length; j++) {
      allCoords.push(segment[j]);
    }

    if (i < stops.length - 2) {
      await sleep(THROTTLE_MS);
    }
  }

  console.log(`\nRaw point count (after OSRM simplified): ${allCoords.length}`);
  console.log(`Fallback segments: ${fallbacks}`);

  // Douglas-Peucker post-pass to further reduce point count.
  const DP_TOLERANCE = 0.01; // ~1km
  const simplified = douglasPeucker(allCoords, DP_TOLERANCE);
  console.log(
    `After Douglas-Peucker (tol=${DP_TOLERANCE}°): ${simplified.length} points`,
  );

  const coordLines = simplified
    .map(([lng, lat]) => `  [${lng}, ${lat}]`)
    .join(",\n");

  const output = `// Auto-generated by scripts/build-roadtrip-route.ts. Do not edit manually.
// Re-run with: npx tsx scripts/build-roadtrip-route.ts
export const route: [number, number][] = [
${coordLines},
];
`;

  writeFileSync(OUTPUT_PATH, output, "utf8");
  console.log(`\nWrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
