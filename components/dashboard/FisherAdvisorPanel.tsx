"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";
import { useDashboardTick } from "@/components/dashboard/DashboardClockProvider";
import { currentPredictionForTick } from "@/lib/useCurrentPrediction";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

function advisorMessage(
  habitatSuitable: boolean,
  confidence: number,
  species: string
): string {
  const pct = Math.round(confidence * 100);
  if (habitatSuitable) {
    return `Conditions look suitable for fish right now (${pct}% confidence). ${species} is the best-fit species for these readings — but this is a habitat-conditions check, not a food-safety certification.`;
  }
  return `Conditions look unsuitable for healthy fish life right now (${pct}% confidence). Best to hold off fishing here until readings improve.`;
}

export function FisherAdvisorPanel() {
  const tick = useDashboardTick();
  const prediction = currentPredictionForTick(tick);
  const reducedMotion = useReducedMotion();

  return (
    <DashboardPanel title="Fisher Advisor" liveLabel="Live">
      <AnimatePresence mode="wait">
        <motion.div
          key={prediction.label}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          className="flex gap-3 rounded-xl bg-black/20 p-4"
        >
          <MessageCircleQuestion className="h-5 w-5 shrink-0 text-teal" aria-hidden />
          <p className="text-sm text-mist">
            {advisorMessage(
              prediction.habitat_suitable,
              prediction.suitability_confidence,
              prediction.best_suited_species
            )}
          </p>
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 text-xs italic text-mist/50">
        Plain-language answer generated from the Water Quality panel&apos;s
        current reading.
      </p>
    </DashboardPanel>
  );
}
