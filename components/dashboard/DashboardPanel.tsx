import type { ReactNode } from "react";

interface DashboardPanelProps {
  title: string;
  liveLabel?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardPanel({ title, liveLabel, children, className = "" }: DashboardPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-7 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-foam">{title}</h3>
        {liveLabel ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-teal">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            {liveLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
