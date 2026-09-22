"use client";

import { useDashboardTick } from "@/components/dashboard/DashboardClockProvider";
import { detectionsForTick } from "@/lib/data/liveDetections";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";

const LAT_RANGE: [number, number] = [18.9, 19.15];
const LON_RANGE: [number, number] = [72.75, 72.97];
const CENTER = 50;
const FACE_RADIUS = 46;

function project(lat: number, lon: number) {
  // Map lat/lon into the 0-100 square, then pull points slightly toward the
  // center so they read clearly inside the circular radar face rather than
  // clipping at its edge.
  const rawX = ((lon - LON_RANGE[0]) / (LON_RANGE[1] - LON_RANGE[0])) * 100;
  const rawY = 100 - ((lat - LAT_RANGE[0]) / (LAT_RANGE[1] - LAT_RANGE[0])) * 100;
  const x = CENTER + (rawX - CENTER) * 0.8;
  const y = CENTER + (rawY - CENTER) * 0.8;
  return { x, y };
}

const RINGS = [FACE_RADIUS * 0.33, FACE_RADIUS * 0.66, FACE_RADIUS];

export function SatellitePanel() {
  const tick = useDashboardTick();
  const detections = detectionsForTick(tick);

  return (
    <DashboardPanel title="Satellite Detection" liveLabel="Live feed">
      <p className="text-xs text-mist/60">
        Demo data — Perceive is proof-of-concept, not a deployed feed. New
        contacts simulate a growing detection queue.
      </p>

      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[260px] overflow-hidden rounded-full border border-teal/25 bg-black shadow-[0_0_50px_-10px_rgba(37,208,192,0.45)]">
        <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Radar display of demo spill detections">
          <defs>
            <radialGradient id="radar-face" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0a3a50" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020a10" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="sweep-fade" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#25d0c0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#25d0c0" stopOpacity="0" />
            </radialGradient>
            <clipPath id="radar-clip">
              <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS} />
            </clipPath>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS} fill="url(#radar-face)" />

          {RINGS.map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="rgba(37,208,192,0.18)"
              strokeWidth="0.4"
            />
          ))}
          <line x1={CENTER - FACE_RADIUS} y1={CENTER} x2={CENTER + FACE_RADIUS} y2={CENTER} stroke="rgba(37,208,192,0.12)" strokeWidth="0.3" />
          <line x1={CENTER} y1={CENTER - FACE_RADIUS} x2={CENTER} y2={CENTER + FACE_RADIUS} stroke="rgba(37,208,192,0.12)" strokeWidth="0.3" />

          <g clipPath="url(#radar-clip)">
            <g>
              <path
                d={`M ${CENTER} ${CENTER} L ${CENTER + FACE_RADIUS} ${CENTER} A ${FACE_RADIUS} ${FACE_RADIUS} 0 0 0 ${CENTER + FACE_RADIUS * Math.cos((-38 * Math.PI) / 180)} ${CENTER + FACE_RADIUS * Math.sin((-38 * Math.PI) / 180)} Z`}
                fill="url(#sweep-fade)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${CENTER} ${CENTER}`}
                  to={`360 ${CENTER} ${CENTER}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <line x1={CENTER} y1={CENTER} x2={CENTER + FACE_RADIUS} y2={CENTER} stroke="#25d0c0" strokeWidth="0.6" opacity="0.9">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${CENTER} ${CENTER}`}
                  to={`360 ${CENTER} ${CENTER}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
            </g>

            {detections.map((d, i) => {
              const { x, y } = project(d.lat, d.lon);
              const isNewest = i === 0;
              return (
                <g key={d.id}>
                  {isNewest && (
                    <circle cx={x} cy={y} r="3" fill="none" stroke="#25d0c0" strokeWidth="0.5" opacity="0.6">
                      <animate attributeName="r" values="2;7" dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isNewest ? 2 : 1.4}
                    fill={d.source === "Satellite SAR" ? "#25d0c0" : "#f5a623"}
                  />
                </g>
              );
            })}
          </g>

          <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS} fill="none" stroke="rgba(37,208,192,0.35)" strokeWidth="0.6" />
        </svg>

        <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 font-mono text-[7px] uppercase tracking-widest text-teal/80">
          <span className="h-1 w-1 animate-pulse rounded-full bg-teal" />
          Scanning
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2 font-mono text-[7px] uppercase tracking-widest text-teal/50">
          Sector 4 · JS-01
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-mist/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Satellite SAR
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Ship-mounted bot
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {detections.slice(0, 3).map((d, i) => (
          <div
            key={d.id}
            className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
              i === 0 ? "bg-teal/[0.08] text-foam" : "bg-black/20 text-mist"
            }`}
          >
            <span className="font-mono">{d.id}</span>
            <span>{d.estimatedVolumeL} L</span>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
