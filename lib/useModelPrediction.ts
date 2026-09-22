"use client";

import { useEffect, useState } from "react";
import type { WaterPrediction } from "@/lib/data/predictions";

type ModelApiResponse = Omit<WaterPrediction, "label">;

/** Calls the local ml/api.py wrapper around the real trained model — see
 * that file for how to run it. Polls on an interval rather than only when
 * ph/temperature/turbidity change: real sensor readings can sit frozen at
 * the same value (e.g. an unwired sensor), and an effect keyed on those
 * values would then never re-fire to retry after a transient API outage. */
export function useModelPrediction(
  apiUrl: string,
  ph: number | null,
  temperature: number | null,
  turbidity: number | null,
  pollMs = 4000
) {
  const [prediction, setPrediction] = useState<WaterPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl || ph === null || temperature === null || turbidity === null) {
      return;
    }

    let cancelled = false;

    async function run() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      try {
        const r = await fetch(
          `${apiUrl}/predict?ph=${ph}&temperature=${temperature}&turbidity=${turbidity}`,
          { signal: controller.signal }
        );
        if (!r.ok) throw new Error(`API returned ${r.status}`);
        const data = (await r.json()) as ModelApiResponse;
        if (cancelled) return;
        setPrediction({ label: "Live reading", ...data });
        setError(null);
      } catch {
        if (cancelled) return;
        setError("Could not reach the model API — run `python ml/api.py` on the same machine.");
      } finally {
        clearTimeout(timeoutId);
      }
    }

    run();
    const id = setInterval(run, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [apiUrl, ph, temperature, turbidity, pollMs]);

  return { prediction, error };
}
