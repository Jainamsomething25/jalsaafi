"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { roadmapItems, type RoadmapItem } from "@/lib/data/roadmap";

const TERM_STYLES: Record<RoadmapItem["term"], string> = {
  "Near-term": "text-teal ring-teal/30",
  "Mid-term": "text-amber ring-amber/30",
  "Long-term": "text-mist ring-mist/30",
};

export function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.06 });

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-abyss via-navy to-oil px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="mixed" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Roadmap"
          title="What's next, in order."
          description="From calibrating the sensors already on the boat to coordinating a swarm of them."
        />

        <div className="section-reveal mx-auto mt-14 flex max-w-3xl flex-col gap-4">
          {roadmapItems.map((item, i) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-x-0 hover:translate-y-[-2px] hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-start sm:gap-6"
            >
              <span className="text-xs font-mono text-mist/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-base font-semibold text-foam">
                    {item.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${TERM_STYLES[item.term]}`}
                  >
                    {item.term}
                  </span>
                </div>
                <p className="mt-2 text-sm text-mist">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
