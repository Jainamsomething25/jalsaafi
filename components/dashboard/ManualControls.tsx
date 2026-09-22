"use client";

import { useState, type ComponentType } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, OctagonX, Power } from "lucide-react";

type Direction = "forward" | "backward" | "left" | "right" | "stop";

interface ManualControlsProps {
  deviceUrl: string;
  conveyorOn: boolean | null;
}

export function ManualControls({ deviceUrl, conveyorOn }: ManualControlsProps) {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function send(path: string, label: string) {
    setSending(true);
    try {
      await fetch(`${deviceUrl}${path}`, { signal: AbortSignal.timeout(3000) });
      setLastCommand(label);
    } catch {
      setLastCommand(`${label} — failed, check connection`);
    } finally {
      setSending(false);
    }
  }

  const drive = (dir: Direction) => send(`/motor?dir=${dir}`, `Motor: ${dir}`);
  const toggleConveyor = () => {
    const next = conveyorOn ? "off" : "on";
    send(`/conveyor?state=${next}`, `Conveyor: ${next}`);
  };

  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-mist/60">
          Manual controls — drives the real boat
        </p>
        {sending ? <span className="text-[10px] text-mist/50">Sending…</span> : null}
      </div>
      <p className="mt-1 text-[11px] text-amber/80">
        Full autonomy runs in simulation only for now — these buttons move real hardware.
      </p>

      <div className="mt-4 flex flex-wrap items-start gap-8">
        <div className="grid w-[150px] grid-cols-3 grid-rows-3 gap-1.5">
          <span />
          <DriveButton icon={ArrowUp} onClick={() => drive("forward")} label="Forward" />
          <span />
          <DriveButton icon={ArrowLeft} onClick={() => drive("left")} label="Left" />
          <DriveButton icon={OctagonX} onClick={() => drive("stop")} label="Stop" danger />
          <DriveButton icon={ArrowRight} onClick={() => drive("right")} label="Right" />
          <span />
          <DriveButton icon={ArrowDown} onClick={() => drive("backward")} label="Backward" />
          <span />
        </div>

        <div className="flex flex-col items-start gap-2">
          <span className="text-xs text-mist/60">Oleophilic Sheet Conveyor</span>
          <button
            onClick={toggleConveyor}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              conveyorOn
                ? "bg-amber/15 text-amber hover:bg-amber/25"
                : "bg-teal/15 text-teal hover:bg-teal/25"
            }`}
          >
            <Power className="h-4 w-4" aria-hidden />
            {conveyorOn ? "Stop Conveyor" : "Start Conveyor"}
          </button>
          <span className="text-[10px] text-mist/50">
            Currently: {conveyorOn === null ? "unknown" : conveyorOn ? "running" : "stopped"}
          </span>
        </div>
      </div>

      {lastCommand ? <p className="mt-3 text-[11px] text-mist/50">Last command: {lastCommand}</p> : null}
    </div>
  );
}

function DriveButton({
  icon: Icon,
  onClick,
  label,
  danger,
}: {
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        danger ? "bg-amber/15 text-amber hover:bg-amber/25" : "bg-white/5 text-foam hover:bg-white/10"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
