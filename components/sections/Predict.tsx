"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Thermometer, Waves, CircleCheck, CircleX, Fish } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { demoPredictions } from "@/lib/data/predictions";

export function Predict() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  const prediction = demoPredictions[active];

  return (
    <section
      id="predict"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-navy via-oil to-oil px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="teal" />
      <div className="relative z-10">
      <SectionHeader
        eyebrow="Stage 2 — Predict"
        title="Read the water, not just the spill."
        description="A Random Forest model reads pH, temperature, and turbidity to predict habitat suitability and the best-fit fish species — trained on real pond-sensor data, 84.5% accuracy (beat a neural network at 72.3%)."
      />

      <div className="section-reveal mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {demoPredictions.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setActive(i)}
              className={`whitespace-nowrap rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                i === active
                  ? "border-teal/40 bg-teal/10 text-foam"
                  : "border-white/10 bg-white/[0.02] text-mist hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-mist/60">
              Sensor reading
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-teal ring-1 ring-teal/30">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Real model output — precomputed, live feed pending
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={prediction.label}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
            >
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-black/20 py-4">
                  <Droplets className="h-4 w-4 text-teal" aria-hidden />
                  <span className="text-lg font-semibold text-foam">
                    {prediction.input.pH}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-mist/60">
                    pH
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-black/20 py-4">
                  <Thermometer className="h-4 w-4 text-teal" aria-hidden />
                  <span className="text-lg font-semibold text-foam">
                    {prediction.input.temperature_C}°C
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-mist/60">
                    Temp
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-black/20 py-4">
                  <Waves className="h-4 w-4 text-teal" aria-hidden />
                  <span className="text-lg font-semibold text-foam">
                    {prediction.input.turbidity_NTU}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-mist/60">
                    NTU
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foam">
                      {prediction.habitat_suitable ? (
                        <CircleCheck className="h-4 w-4 text-teal" aria-hidden />
                      ) : (
                        <CircleX className="h-4 w-4 text-amber" aria-hidden />
                      )}
                      Habitat suitable for fish?{" "}
                      {prediction.habitat_suitable ? "Yes" : "No"}
                    </span>
                    <span className="font-mono text-sm text-mist">
                      {Math.round(prediction.suitability_confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <ConfidenceBar
                      value={prediction.suitability_confidence}
                      reducedMotion={reducedMotion}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foam">
                      <Fish className="h-4 w-4 text-teal" aria-hidden />
                      Best-suited species: {prediction.best_suited_species}
                    </span>
                    <span className="font-mono text-sm text-mist">
                      {Math.round(prediction.species_confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <ConfidenceBar
                      value={prediction.species_confidence}
                      reducedMotion={reducedMotion}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs italic text-mist/60">{prediction.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}
