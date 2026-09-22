"use client";

import { useRef } from "react";
import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { currentApproach, jalsaafiApproach } from "@/lib/data/problem";

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-navy via-navy to-abyss px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="amber" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="The Problem"
          title="Oil spills outrun manual cleanup."
          description="Contaminated water poisons fish and threatens food security for the 3 billion+ people who rely on fish as a protein source — while current cleanup stays slow, manual, expensive, and non-autonomous."
        />

        <div className="section-reveal mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] sm:p-8">
            <h3 className="font-display text-lg font-semibold text-mist">
              Current approach
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {currentApproach.map((row) => (
                <li key={row.label} className="flex gap-3 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-mist/40" aria-hidden />
                  <div>
                    <span className="font-medium text-mist">{row.label}: </span>
                    <span className="text-mist/70">{row.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="group rounded-2xl border border-teal/25 bg-teal/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:bg-teal/[0.07] hover:shadow-[0_0_40px_-12px_rgba(37,208,192,0.5)] sm:p-8">
            <h3 className="font-display text-lg font-semibold text-foam">
              JalSaafi
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {jalsaafiApproach.map((row) => (
                <li key={row.label} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
                  <div>
                    <span className="font-medium text-foam">{row.label}: </span>
                    <span className="text-mist">{row.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
