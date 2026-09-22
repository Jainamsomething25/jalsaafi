"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Radar } from "lucide-react";
import { useDashboardTick } from "@/components/dashboard/DashboardClockProvider";
import { totalDetectionCountForTick } from "@/lib/data/liveDetections";

interface Toast {
  id: number;
  message: string;
}

export function DetectionToast() {
  const tick = useDashboardTick();
  const prevCountRef = useRef<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const count = totalDetectionCountForTick(tick);
    const previous = prevCountRef.current;
    prevCountRef.current = count;

    if (previous === null || count <= previous) return;

    // Deferred to a macrotask rather than called synchronously in the effect
    // body — same pattern as an external-system callback, just on a 0ms timer.
    const toastId = Date.now();
    const showTimer = setTimeout(() => {
      setToasts((t) => [...t, { id: toastId, message: "New spill detected — queue updated" }]);
    }, 0);
    const hideTimer = setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== toastId));
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [tick]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl border border-teal/30 bg-navy/95 px-4 py-3 text-sm text-foam shadow-lg backdrop-blur-md"
          >
            <Radar className="h-4 w-4 text-teal" aria-hidden />
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
