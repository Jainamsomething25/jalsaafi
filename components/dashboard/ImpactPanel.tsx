"use client";

import { useDashboardTick } from "@/components/dashboard/DashboardClockProvider";
import { totalDetectionCountForTick } from "@/lib/data/liveDetections";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

const RECOVERY_RATE_L_PER_TICK = 0.6;

function formatUptime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ImpactPanel() {
  const tick = useDashboardTick();
  const recovered = (tick * RECOVERY_RATE_L_PER_TICK).toFixed(1);
  const detections = totalDetectionCountForTick(tick);

  return (
    <DashboardPanel title="Impact — This Session" liveLabel="Live">
      <p className="text-xs text-mist/60">
        Simulated patrol totals since this page loaded — not a real-world
        deployment metric.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="font-display text-2xl font-semibold text-teal">{recovered}</div>
          <div className="mt-1 text-[9px] uppercase tracking-wider text-mist/60">
            Litres recovered
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-semibold text-teal">{detections}</div>
          <div className="mt-1 text-[9px] uppercase tracking-wider text-mist/60">
            Spills flagged
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-semibold text-teal">
            {formatUptime(tick)}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-wider text-mist/60">
            Session uptime
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
