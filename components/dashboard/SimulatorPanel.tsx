"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

const MODES = {
  solo: { label: "Solo boat", src: "/sim/jalsaafi_sim.html" },
  swarm: { label: "Swarm fleet", src: "/sim/jalsaafi_swarm.html" },
} as const;

type Mode = keyof typeof MODES;

export function SimulatorPanel() {
  const [mode, setMode] = useState<Mode>("solo");
  const active = MODES[mode];

  return (
    <DashboardPanel title="Route Planning Simulator" className="lg:col-span-2">
      <p className="text-xs text-mist/60">
        Algorithm demo — not connected to the real boat. See Live Boat
        Telemetry above for actual hardware data.
      </p>

      <div className="mt-3 flex gap-2">
        {(Object.keys(MODES) as Mode[]).map((key) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              mode === key
                ? "bg-teal/15 text-teal"
                : "text-mist hover:bg-white/5 hover:text-foam"
            }`}
          >
            {MODES[key].label}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-teal/20 bg-black">
        <iframe
          key={active.src}
          src={active.src}
          title={`Simulator — ${active.label}`}
          className="h-[420px] w-full"
          loading="lazy"
        />
      </div>

      <a
        href={active.src}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal-dim"
      >
        Open full screen
        <ExternalLink className="h-3 w-3" aria-hidden />
      </a>
    </DashboardPanel>
  );
}
