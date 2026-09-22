"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChevronDown, Satellite } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .from(".hero-badge", {
          opacity: 0,
          y: -12,
          duration: reducedMotion ? 0.01 : 0.6,
        })
        .from(
          ".hero-word",
          {
            opacity: 0,
            y: reducedMotion ? 0 : 32,
            rotateX: reducedMotion ? 0 : -40,
            stagger: reducedMotion ? 0 : 0.08,
            duration: reducedMotion ? 0.01 : 0.9,
          },
          "-=0.3"
        )
        .from(
          ".hero-sub",
          { opacity: 0, y: reducedMotion ? 0 : 16, duration: reducedMotion ? 0.01 : 0.7 },
          "-=0.5"
        )
        .from(
          ".hero-cta",
          {
            opacity: 0,
            y: reducedMotion ? 0 : 16,
            stagger: reducedMotion ? 0 : 0.12,
            duration: reducedMotion ? 0.01 : 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-scroll-cue",
          { opacity: 0, duration: reducedMotion ? 0.01 : 0.6 },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const headline = ["Clean water,", "cleared", "autonomously."];

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-navy via-abyss to-oil px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0">
        <ErrorBoundary fallback={null}>
          <ParticleField />
        </ErrorBoundary>
      </div>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <span className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-teal">
          <Satellite className="h-3.5 w-3.5" aria-hidden />
          HKU AI+ Challenge — Smart City &amp; Biodiversity
        </span>

        <h1 className="font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foam sm:text-6xl md:text-7xl">
          {headline.map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block [transform-style:preserve-3d]"
            >
              {word}
              {i < headline.length - 1 ? " " : ""}
            </span>
          ))}
          <br />
          <span className="hero-word inline-block bg-gradient-to-r from-teal to-teal-dim bg-clip-text text-transparent">
            Meet JalSaafi.
          </span>
        </h1>

        <p className="hero-sub mt-7 max-w-2xl text-balance text-lg text-mist sm:text-xl">
          An AI pipeline that finds oil spills, reads the water, plans a
          route, and cleans it up — protecting the fish that 3 billion+
          people depend on for protein.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticLink href="/how-it-works" className="hero-cta">
            See the Pipeline
          </MagneticLink>
          <MagneticLink href="/problem" variant="outline" className="hero-cta">
            The Problem
          </MagneticLink>
        </div>
      </div>

      <button
        onClick={() =>
          document
            .getElementById("explore")
            ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })
        }
        className="hero-scroll-cue absolute bottom-8 z-10 flex flex-col items-center gap-2 text-mist/70 transition-colors hover:text-teal"
        aria-label="Scroll to explore more"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Explore
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" aria-hidden />
      </button>
    </section>
  );
}
