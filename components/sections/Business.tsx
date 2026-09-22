"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { businessModel } from "@/lib/data/business";

export function Business() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  return (
    <section
      id="business"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-navy via-abyss to-abyss px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="teal" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Business & Deployment"
          title="Reusable hardware, no crew."
          description="The economics come from what autonomy and reusable oleophilic sheets remove from a cleanup: crew time and disposable sorbents."
        />

        <div className="section-reveal mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {businessModel.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] sm:p-8"
            >
              <h3 className="font-display text-lg font-semibold text-foam">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-mist">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
