export type DetectionSource = "Satellite SAR" | "Ship-mounted bot";

export interface Detection {
  id: string;
  lat: number;
  lon: number;
  estimatedVolumeL: number;
  source: DetectionSource;
}

/**
 * Demo data — Perceive is proof-of-concept, not a deployed detection feed.
 * Structured to match what a real SAR/bot pipeline would emit (id, coordinates,
 * estimated volume, source) so a live feed can replace this array directly.
 */
export const demoDetections: Detection[] = [
  { id: "SP-2291", lat: 19.0176, lon: 72.8562, estimatedVolumeL: 340, source: "Satellite SAR" },
  { id: "SP-2292", lat: 18.9498, lon: 72.8258, estimatedVolumeL: 85, source: "Ship-mounted bot" },
  { id: "SP-2293", lat: 19.0812, lon: 72.9089, estimatedVolumeL: 510, source: "Satellite SAR" },
  { id: "SP-2294", lat: 18.9633, lon: 72.7935, estimatedVolumeL: 62, source: "Ship-mounted bot" },
];
