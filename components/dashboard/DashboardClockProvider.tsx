"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useDashboardClock } from "@/lib/useDashboardClock";

const DashboardClockContext = createContext(0);

export function DashboardClockProvider({ children }: { children: ReactNode }) {
  const tick = useDashboardClock();
  return (
    <DashboardClockContext.Provider value={tick}>
      {children}
    </DashboardClockContext.Provider>
  );
}

export function useDashboardTick(): number {
  return useContext(DashboardClockContext);
}
