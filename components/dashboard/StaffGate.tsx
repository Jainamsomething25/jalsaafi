"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";

const REQUIRED_KEY = process.env.NEXT_PUBLIC_STAFF_KEY;

/**
 * Soft deterrent, not real security — the key is a public env var checked
 * client-side. If NEXT_PUBLIC_STAFF_KEY isn't set, the gate is a no-op so
 * nobody gets locked out by forgetting to configure it.
 *
 * Deliberately plain useState, no useSearchParams: reading the URL for a
 * `?key=` shortcut would force this route into a Suspense boundary, which
 * can hydrate out of step with DashboardClockProvider's ticking timer and
 * produce a hydration mismatch. A manual key entry is a fine tradeoff.
 */
export function StaffGate({ children }: { children: ReactNode }) {
  const [manualKey, setManualKey] = useState("");
  const [attempted, setAttempted] = useState(false);

  if (!REQUIRED_KEY) return <>{children}</>;
  if (attempted && manualKey === REQUIRED_KEY) return <>{children}</>;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
  }

  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <Lock className="h-6 w-6 text-teal" aria-hidden />
      <h2 className="font-display text-xl font-semibold text-foam">Staff access required</h2>
      <p className="max-w-sm text-sm text-mist">
        Soft gate for demo purposes, not real security — enter the staff key
        to continue.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="password"
          value={manualKey}
          onChange={(e) => setManualKey(e.target.value)}
          placeholder="Staff key"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foam placeholder:text-mist/40 focus:border-teal/50 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-oil transition-colors hover:bg-teal-dim"
        >
          Enter
        </button>
      </form>
      {attempted && manualKey !== REQUIRED_KEY ? (
        <p className="text-xs text-amber">Incorrect key.</p>
      ) : null}
    </div>
  );
}
