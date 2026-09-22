"use client";

import { useRef, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";

export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = (event: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: relX * 0.25,
      y: relY * 0.4,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };

  return { ref, onPointerMove, onPointerLeave };
}
