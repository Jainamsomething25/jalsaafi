"use client";

import { useRef } from "react";
import { Fish } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const species = [
  "Karpio", "Katla", "Koi", "Magur", "Pangas",
  "Prawn", "Rui", "Shrimp", "Silver Cup", "Sing", "Tilapia",
];

export function Biodiversity() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.08 });

  return (
    <section
      id="biodiversity"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-abyss via-navy to-navy px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="teal" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Biodiversity"
          title="Cleaner water protects more than one species."
          description="The Predict model was trained across eleven freshwater species — cleanup and water-quality monitoring both work in service of the habitats they depend on."
        />

        <div className="section-reveal mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {species.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/[0.04] px-4 py-1.5 text-sm text-mist transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/50 hover:bg-teal/[0.1] hover:text-foam"
            >
              <Fish className="h-3.5 w-3.5 text-teal" aria-hidden />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
