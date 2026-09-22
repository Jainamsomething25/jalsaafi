"use client";

import { motion } from "framer-motion";

export function ConfidenceBar({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-teal"
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
