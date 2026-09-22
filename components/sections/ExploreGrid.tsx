"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { exploreCards } from "@/lib/data/explore";

export function ExploreGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, ".section-reveal", { stagger: 0.06 });

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-oil via-abyss to-abyss px-6 py-24 sm:py-32"
    >
      <AmbientBackground tone="mixed" />
      <div className="relative z-10 mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exploreCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="section-reveal group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-14px_rgba(37,208,192,0.5)]"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-foam">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-mist">{card.description}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
