"use client";

import { useEffect, useState } from "react";

export interface Esp32Telemetry {
  ph: number | null;
  tempC: number | null;
  turbidityNtu: number | null;
  turbidityCalibrated: boolean | null;
  ultrasonicCm: number | null;
  windSpeedMs: number | null;
  oilDetected: boolean | null;
  conveyorOn: boolean | null;
}

const EMPTY: Esp32Telemetry = {
  ph: null,
  tempC: null,
  turbidityNtu: null,
  turbidityCalibrated: null,
  ultrasonicCm: null,
  windSpeedMs: null,
  oilDetected: null,
  conveyorOn: null,
};

/** Polls a live ESP32 device's HTTP endpoints. Requires the browser to be on
 * the same network as the device, and the page itself loaded over plain
 * HTTP — fetching http:// from an https:// page is blocked as mixed content. */
export function useEsp32Telemetry(baseUrl: string, pollMs = 3000) {
  const [telemetry, setTelemetry] = useState<Esp32Telemetry>(EMPTY);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baseUrl) {
      const resetTimer = setTimeout(() => {
        setConnected(false);
        setTelemetry(EMPTY);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    let cancelled = false;

    async function poll() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      try {
        const [ph, temp, turb, ultra, wind, oil, conveyor] = await Promise.all([
          fetch(`${baseUrl}/ph`, { signal: controller.signal }).then((r) => r.json()),
          fetch(`${baseUrl}/temp`, { signal: controller.signal }).then((r) => r.json()),
          fetch(`${baseUrl}/turbidity`, { signal: controller.signal }).then((r) => r.json()),
          fetch(`${baseUrl}/ultrasonic`, { signal: controller.signal }).then((r) => r.json()),
          fetch(`${baseUrl}/wind`, { signal: controller.signal }).then((r) => r.json()),
          fetch(`${baseUrl}/oil_detected`, { signal: controller.signal }).then((r) => r.text()),
          fetch(`${baseUrl}/conveyor`, { signal: controller.signal }).then((r) => r.json()),
        ]);
        if (cancelled) return;
        setTelemetry({
          ph: typeof ph.ph === "number" ? ph.ph : null,
          tempC: typeof temp.temp === "number" ? temp.temp : null,
          turbidityNtu: typeof turb.ntu === "number" ? turb.ntu : null,
          turbidityCalibrated: typeof turb.calibrated === "boolean" ? turb.calibrated : null,
          ultrasonicCm: typeof ultra.distance === "number" ? ultra.distance : null,
          windSpeedMs: typeof wind.windspeed === "number" ? wind.windspeed : null,
          oilDetected: oil.trim() === "true",
          conveyorOn: typeof conveyor.conveyor === "boolean" ? conveyor.conveyor : null,
        });
        setConnected(true);
        setError(null);
      } catch {
        if (cancelled) return;
        setConnected(false);
        setError("Could not reach the device — check the IP and that you're on the same network.");
      } finally {
        clearTimeout(timeoutId);
      }
    }

    poll();
    const id = setInterval(poll, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [baseUrl, pollMs]);

  return { telemetry, connected, error };
}
