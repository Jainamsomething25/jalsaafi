"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, CircleX, Fish, Wifi, WifiOff } from "lucide-react";
import { useEsp32Telemetry } from "@/lib/useEsp32Telemetry";
import { useModelPrediction } from "@/lib/useModelPrediction";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { ManualControls } from "@/components/dashboard/ManualControls";

function StatusDot({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-teal">
      <Wifi className="h-3 w-3" aria-hidden /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-mist/50">
      <WifiOff className="h-3 w-3" aria-hidden /> Offline
    </span>
  );
}

export function LiveOperationsPanel() {
  const [deviceInput, setDeviceInput] = useState("");
  const [apiInput, setApiInput] = useState("http://localhost:8000");
  const [deviceUrl, setDeviceUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const reducedMotion = useReducedMotion();

  const { telemetry, connected, error: deviceError } = useEsp32Telemetry(deviceUrl);
  const { prediction, error: modelError } = useModelPrediction(
    apiUrl,
    telemetry.ph,
    telemetry.tempC,
    telemetry.turbidityNtu
  );

  function handleConnect(e: FormEvent) {
    e.preventDefault();
    setDeviceUrl(deviceInput.trim().replace(/\/$/, ""));
    setApiUrl(apiInput.trim().replace(/\/$/, ""));
  }

  return (
    <DashboardPanel title="Live Boat Telemetry" liveLabel={connected ? "Live" : undefined} className="lg:col-span-2">
      <form onSubmit={handleConnect} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="device-url" className="text-xs text-mist/60">
            ESP32 device address
          </label>
          <input
            id="device-url"
            type="text"
            placeholder="http://192.168.1.50"
            value={deviceInput}
            onChange={(e) => setDeviceInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-foam placeholder:text-mist/40 focus:border-teal/50 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="api-url" className="text-xs text-mist/60">
            Model API address (ml/api.py)
          </label>
          <input
            id="api-url"
            type="text"
            placeholder="http://localhost:8000"
            value={apiInput}
            onChange={(e) => setApiInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-foam placeholder:text-mist/40 focus:border-teal/50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-teal px-4 py-1.5 text-sm font-medium text-oil transition-colors hover:bg-teal-dim"
        >
          Connect
        </button>
      </form>

      {!deviceUrl ? (
        <p className="mt-4 text-sm text-mist/60">
          Enter the ESP32&apos;s IP address on your local network and click Connect.
          Your browser must be on the same WiFi as the device, and this page
          must be loaded over plain HTTP — fetching from an HTTPS page (e.g.
          the deployed site) is blocked as mixed content.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-mist">
              Device: <StatusDot ok={connected} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-mist">
              Model API: <StatusDot ok={!!prediction} />
            </span>
          </div>

          {deviceError && !connected ? (
            <p className="mt-2 text-xs text-amber">{deviceError}</p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Reading label="pH" value={telemetry.ph} />
            <Reading label="Temp" value={telemetry.tempC} suffix="°C" />
            <Reading
              label="Turbidity"
              value={telemetry.turbidityNtu}
              suffix=" NTU"
              note={telemetry.turbidityCalibrated === false ? "uncalibrated" : undefined}
            />
            <Reading label="Distance" value={telemetry.ultrasonicCm} suffix=" cm" />
            <Reading label="Wind" value={telemetry.windSpeedMs} suffix=" m/s" />
            <Reading
              label="Oil detected"
              value={telemetry.oilDetected === null ? null : telemetry.oilDetected ? "Yes" : "No"}
            />
          </div>

          {connected ? (
            <ManualControls deviceUrl={deviceUrl} conveyorOn={telemetry.conveyorOn} />
          ) : null}

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-wider text-mist/60">
              Real model prediction — live sensor input, not precomputed
            </p>
            {!apiUrl ? (
              <p className="mt-2 text-sm text-mist/50">Model API address not set.</p>
            ) : modelError ? (
              <p className="mt-2 text-sm text-amber">{modelError}</p>
            ) : !prediction ? (
              <p className="mt-2 text-sm text-mist/50">Waiting for a live reading…</p>
            ) : (
              <div className="mt-3 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foam">
                      {prediction.habitat_suitable ? (
                        <CircleCheck className="h-4 w-4 text-teal" aria-hidden />
                      ) : (
                        <CircleX className="h-4 w-4 text-amber" aria-hidden />
                      )}
                      {prediction.habitat_suitable ? "Suitable" : "Not suitable"}
                    </span>
                    <span className="font-mono text-sm text-mist">
                      {Math.round(prediction.suitability_confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ConfidenceBar value={prediction.suitability_confidence} reducedMotion={reducedMotion} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foam">
                      <Fish className="h-4 w-4 text-teal" aria-hidden />
                      {prediction.best_suited_species}
                    </span>
                    <span className="font-mono text-sm text-mist">
                      {Math.round(prediction.species_confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ConfidenceBar value={prediction.species_confidence} reducedMotion={reducedMotion} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardPanel>
  );
}

function Reading({
  label,
  value,
  suffix = "",
  note,
}: {
  label: string;
  value: number | string | null;
  suffix?: string;
  note?: string;
}) {
  return (
    <div className="rounded-lg bg-black/20 py-2.5 text-center">
      <div className="text-base font-semibold text-foam">
        {value === null ? "—" : `${value}${suffix}`}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-mist/60">{label}</div>
      {note ? <div className="text-[9px] text-amber">{note}</div> : null}
    </div>
  );
}
