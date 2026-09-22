"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ScrollRevealOptions {
  stagger?: number;
  y?: number;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  options?: ScrollRevealOptions
) {
  const reducedMotion = useReducedMotion();
  const stagger = options?.stagger ?? 0.1;
  const y = options?.y ?? 32;

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: reducedMotion ? 0 : y,
          duration: reducedMotion ? 0.01 : 0.7,
          delay: reducedMotion ? 0 : i * stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, selector, reducedMotion, stagger, y]);
}
