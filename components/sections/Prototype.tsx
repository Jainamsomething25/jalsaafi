"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { hardwareSpecs, mediaSlots } from "@/lib/data/prototype";

export function Prototype() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.06 });

  return (
    <section
      id="prototype"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-abyss via-abyss to-oil px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="amber" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="The Prototype"
          title="Built, not just designed."
          description="A floating platform with magnetic oleophilic sheets, ESP32 control, and a full sensor suite."
        />

        <div className="section-reveal mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
          {mediaSlots.map((slot) => (
            <div key={slot.id} className="group flex flex-col gap-2">
              <div className="aspect-video overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
                <PlaceholderMedia slot={slot} />
              </div>
              <span className="text-sm text-mist">{slot.caption}</span>
            </div>
          ))}
        </div>

        <div className="section-reveal mx-auto mt-14 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
          <h3 className="font-display text-lg font-semibold text-foam">
            Hardware spec
          </h3>
          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {hardwareSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-1 border-t border-white/10 pt-3 transition-colors hover:border-teal/30"
              >
                <dt className="text-xs uppercase tracking-wider text-teal">
                  {spec.label}
                </dt>
                <dd className="text-sm text-mist">{spec.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
