"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion as useFramerReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export function AnimatedCounter({ value, suffix = "", duration = 1.4 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = useFramerReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;

    const durationMs = reducedMotion ? 0 : duration * 1000;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = durationMs <= 0 ? 1 : Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reducedMotion]);

  return (
    <span ref={ref}>
      {formatValue(display)}
      {suffix}
    </span>
  );
}
