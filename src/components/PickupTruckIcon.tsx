// Embedded as an <image> inside the map's parent <svg>. Centered on (0, 0)
// so the map's transform places the truck's center at the route point.
// Source: cleaned silhouette of the actual road-trip truck at /roadtrip/truck.png.
const ASPECT = 256 / 118;

export default function PickupTruckIcon({ size = 32 }: { size?: number }) {
  const w = size;
  const h = size / ASPECT;
  return (
    <image
      href="/roadtrip/truck.png"
      x={-w / 2}
      y={-h / 2}
      width={w}
      height={h}
    />
  );
}
