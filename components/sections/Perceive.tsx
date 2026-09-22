"use client";

import { useRef } from "react";
import { Satellite, Ship, MapPin } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { demoDetections } from "@/lib/data/detections";

export function Perceive() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  return (
    <section
      id="perceive"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-abyss via-abyss to-navy px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="teal" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Stage 1 — Perceive"
          title="Find the spill before it spreads."
          description="Two detection modes feed GPS coordinates to the base station: satellite SAR imagery analyzed with ML, and bots mounted directly on oil cargo ships."
        />

        <div className="section-reveal mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] sm:p-8">
            <Satellite className="h-6 w-6 text-teal transition-transform duration-300 group-hover:scale-110" aria-hidden />
            <h3 className="font-display mt-4 text-lg font-semibold text-foam">
              Satellite SAR
            </h3>
            <p className="mt-2 text-sm text-mist">
              Synthetic-aperture radar imagery from satellites, analyzed with ML
              to locate slicks and extract coordinates.
            </p>
          </div>
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] sm:p-8">
            <Ship className="h-6 w-6 text-teal transition-transform duration-300 group-hover:scale-110" aria-hidden />
            <h3 className="font-display mt-4 text-lg font-semibold text-foam">
              Ship-mounted bots
            </h3>
            <p className="mt-2 text-sm text-mist">
              Bots mounted on oil cargo ships flag spills at the source, closer
              in time and space to where they start.
            </p>
          </div>
        </div>

        <div className="section-reveal mx-auto mt-8 max-w-4xl rounded-2xl border border-amber/25 bg-amber/[0.04] p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-foam">
              Live detections
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-amber ring-1 ring-amber/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
              </span>
              Demo Data — proof of concept, not yet deployed
            </span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-mist/60">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Coordinates</th>
                  <th className="pb-2 font-medium">Est. volume</th>
                  <th className="pb-2 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {demoDetections.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/10 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="py-3 font-mono text-mist">{d.id}</td>
                    <td className="py-3 text-mist">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-teal" aria-hidden />
                        {d.lat.toFixed(4)}, {d.lon.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3 text-foam">{d.estimatedVolumeL} L</td>
                    <td className="py-3 text-mist">{d.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
