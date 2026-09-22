import { demoDetections, type Detection } from "@/lib/data/detections";

/** Deterministic pseudo-random in [0, 1), seeded by an integer. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const BASE_LAT = 19.02;
const BASE_LON = 72.86;

/**
 * Generates the next synthetic detection in the feed. Perceive is already
 * labeled proof-of-concept, not a deployed feed — this only simulates a feed
 * growing over time so the dashboard demo doesn't sit static.
 */
export function generateDetection(index: number): Detection {
  const seed = index + 1;
  const lat = BASE_LAT + (seededRandom(seed) - 0.5) * 0.2;
  const lon = BASE_LON + (seededRandom(seed * 2.7) - 0.5) * 0.2;
  const volume = Math.round(40 + seededRandom(seed * 5.3) * 500);
  const source = seededRandom(seed * 7.1) > 0.5 ? "Satellite SAR" : "Ship-mounted bot";

  return {
    id: `SP-${3000 + index}`,
    lat,
    lon,
    estimatedVolumeL: volume,
    source,
  };
}

export const liveDetectionSeed: Detection[] = demoDetections;

const TICKS_PER_DETECTION = 8;
const MAX_EXTRA_DETECTIONS = 8;
const VISIBLE_ROWS = 6;

function extraDetectionCountForTick(tick: number): number {
  return Math.min(MAX_EXTRA_DETECTIONS, Math.floor(tick / TICKS_PER_DETECTION));
}

/** Pure function of tick — safe to call during render, no Math.random() at call time. */
export function detectionsForTick(tick: number): Detection[] {
  const extra = Array.from({ length: extraDetectionCountForTick(tick) }, (_, i) =>
    generateDetection(i)
  );
  return [...liveDetectionSeed, ...extra].slice(-VISIBLE_ROWS).reverse();
}

export function totalDetectionCountForTick(tick: number): number {
  return liveDetectionSeed.length + extraDetectionCountForTick(tick);
}
