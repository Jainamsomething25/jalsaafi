"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Tone = "teal" | "amber" | "magenta" | "mixed";

const TONE_COLORS: Record<Tone, [string, string]> = {
  teal: ["rgba(37,208,192,0.16)", "rgba(20,130,122,0.10)"],
  amber: ["rgba(245,166,35,0.14)", "rgba(37,208,192,0.08)"],
  magenta: ["rgba(255,61,154,0.10)", "rgba(37,208,192,0.10)"],
  mixed: ["rgba(37,208,192,0.14)", "rgba(245,166,35,0.10)"],
};

export function AmbientBackground({ tone = "teal" }: { tone?: Tone }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [colorA, colorB] = TONE_COLORS[tone];

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      if (orbARef.current) {
        gsap.to(orbARef.current, {
          y: 80,
          x: -30,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
      if (orbBRef.current) {
        gsap.to(orbBRef.current, {
          y: -60,
          x: 40,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-[0.15]" />
      <div
        ref={orbARef}
        className="absolute -left-24 top-0 h-80 w-80 rounded-full blur-[90px]"
        style={{ background: colorA }}
      />
      <div
        ref={orbBRef}
        className="absolute -right-16 bottom-0 h-96 w-96 rounded-full blur-[100px]"
        style={{ background: colorB }}
      />
    </div>
  );
}
