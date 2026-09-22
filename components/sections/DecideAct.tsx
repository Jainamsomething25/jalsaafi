"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const MODES = {
  solo: {
    label: "Solo boat",
    src: "/sim/jalsaafi_sim.html",
    caption:
      "Autonomous route optimization running in simulation — this is the same decision engine, not a mock-up of it.",
  },
  swarm: {
    label: "Swarm fleet",
    src: "/sim/jalsaafi_swarm.html",
    caption:
      "Multiple bots share the map and split slicks by distance + current workload — no bot double-books a slick. Roadmap item, demonstrated here in simulation.",
  },
} as const;

type Mode = keyof typeof MODES;

export function DecideAct() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("solo");
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  const active = MODES[mode];

  return (
    <section
      id="decide-act"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-navy via-navy to-abyss px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="magenta" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Stage 3 & 4 — Decide, Act"
          title="No manual control. It plans its own route."
          description="Rule-based autonomous planning scores every slick by volume^1.3 ÷ distance, plans a route, and re-plans live as new spills appear. Drive it yourself below."
        />

        <div className="section-reveal mx-auto mt-14 max-w-5xl">
          <div className="mb-4 flex justify-center gap-2">
            {(Object.keys(MODES) as Mode[]).map((key) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === key
                    ? "bg-teal/15 text-teal"
                    : "text-mist hover:bg-white/5 hover:text-foam"
                }`}
              >
                {MODES[key].label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-teal/25 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <iframe
              key={active.src}
              src={active.src}
              title={`JalSaafi autonomous cleanup simulator — ${active.label}`}
              className="h-[560px] w-full sm:h-[640px]"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-mist">
            <p>{active.caption}</p>
            <a
              href={active.src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-teal transition-colors hover:text-teal-dim"
            >
              Open full screen
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
