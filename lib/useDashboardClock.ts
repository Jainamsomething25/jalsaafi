"use client";

import { useEffect, useState } from "react";

/**
 * Ticks once per intervalMs after mount. Starts at 0 on both server and
 * client so there's no hydration mismatch — the "live" motion only begins
 * once the client takes over.
 */
export function useDashboardClock(intervalMs = 1000): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
}
