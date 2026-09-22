"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    gsap.set(barRef.current, { scaleX: 0 });

    // Recreated per route: layout persists across navigation, so a stale
    // ScrollTrigger would keep measuring the previous page's document height.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(barRef.current, {
          scaleX: self.progress,
          duration: reducedMotion ? 0 : 0.1,
        });
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
    };
  }, [pathname, reducedMotion]);

  return (
    <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-white/5">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-teal"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
