import { demoPredictions, type WaterPrediction } from "@/lib/data/predictions";

export const TICKS_PER_READING = 6;

export function currentPredictionForTick(tick: number): WaterPrediction {
  const index = Math.floor(tick / TICKS_PER_READING) % demoPredictions.length;
  return demoPredictions[index];
}
