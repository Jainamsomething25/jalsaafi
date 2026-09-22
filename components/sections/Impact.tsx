"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { impactStats } from "@/lib/data/impact";

export function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-oil via-navy to-navy px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="mixed" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Impact"
          title="The scale, and what's actually built."
          description="Numbers for the scale of the problem and what's already working — not projected deployment metrics."
        />

        <div className="section-reveal mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.04]"
            >
              <div className="font-display text-4xl font-semibold text-teal sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-sm font-medium text-foam">{stat.label}</p>
              <p className="mt-1 text-xs text-mist/70">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
