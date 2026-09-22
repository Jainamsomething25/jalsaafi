"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX, Fish } from "lucide-react";
import { useDashboardTick } from "@/components/dashboard/DashboardClockProvider";
import { currentPredictionForTick, TICKS_PER_READING } from "@/lib/useCurrentPrediction";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

export function WaterQualityPanel() {
  const tick = useDashboardTick();
  const prediction = currentPredictionForTick(tick);
  const reducedMotion = useReducedMotion();
  const secondsToNext = TICKS_PER_READING - (tick % TICKS_PER_READING);

  return (
    <DashboardPanel title="Water Quality — Model Demo" liveLabel="Live">
      <p className="text-xs text-mist/60">
        Precomputed cycle through real trained-model outputs (ml/predict.py)
        — next reading in {secondsToNext}s. For live sensor input, connect a
        device in Live Boat Telemetry above.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={prediction.label}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          className="mt-4"
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-black/20 py-2.5">
              <div className="text-base font-semibold text-foam">{prediction.input.pH}</div>
              <div className="text-[9px] uppercase tracking-wider text-mist/60">pH</div>
            </div>
            <div className="rounded-lg bg-black/20 py-2.5">
              <div className="text-base font-semibold text-foam">
                {prediction.input.temperature_C}°C
              </div>
              <div className="text-[9px] uppercase tracking-wider text-mist/60">Temp</div>
            </div>
            <div className="rounded-lg bg-black/20 py-2.5">
              <div className="text-base font-semibold text-foam">
                {prediction.input.turbidity_NTU}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-mist/60">NTU</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-foam">
              {prediction.habitat_suitable ? (
                <CircleCheck className="h-4 w-4 text-teal" aria-hidden />
              ) : (
                <CircleX className="h-4 w-4 text-amber" aria-hidden />
              )}
              {prediction.habitat_suitable ? "Suitable" : "Not suitable"}
            </span>
            <span className="font-mono text-mist">
              {Math.round(prediction.suitability_confidence * 100)}%
            </span>
          </div>
          <div className="mt-1.5">
            <ConfidenceBar value={prediction.suitability_confidence} reducedMotion={reducedMotion} />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-foam">
              <Fish className="h-4 w-4 text-teal" aria-hidden />
              {prediction.best_suited_species}
            </span>
            <span className="font-mono text-mist">
              {Math.round(prediction.species_confidence * 100)}%
            </span>
          </div>
          <div className="mt-1.5">
            <ConfidenceBar value={prediction.species_confidence} reducedMotion={reducedMotion} />
          </div>
        </motion.div>
      </AnimatePresence>
    </DashboardPanel>
  );
}
