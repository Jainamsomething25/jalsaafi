"use client";

import { useEffect, useRef } from "react";
import {
  Satellite,
  Brain,
  Route,
  Ship,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { pipelineStages, STATUS_STYLES } from "@/lib/data/pipeline";

const STAGE_ICONS: Record<string, LucideIcon> = {
  perceive: Satellite,
  predict: Brain,
  decide: Route,
  act: Ship,
  advise: MessageCircleQuestion,
};

export function AIPipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current && !reducedMotion) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".pipeline-stage").forEach((stage) => {
        gsap.from(stage, {
          opacity: 0,
          y: reducedMotion ? 0 : 40,
          duration: reducedMotion ? 0.01 : 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-abyss via-oil to-oil px-6 py-28 sm:py-36"
    >
      <AmbientBackground tone="mixed" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-teal">
          The Spine
        </span>
        <h2 className="font-display mt-4 text-balance text-4xl font-semibold text-foam sm:text-5xl">
          One pipeline, five stages.
        </h2>
        <p className="mt-5 text-balance text-lg text-mist">
          From satellite to fisher, JalSaafi&apos;s pipeline perceives a
          spill, predicts water safety, decides a route, acts to clean it,
          and advises the people who rely on these waters.
        </p>
      </div>

      <div className="relative mx-auto mt-20 max-w-2xl">
        <svg
          className="pointer-events-none absolute left-6 top-0 hidden h-full w-6 sm:block"
          viewBox="0 0 24 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 0 L12 100"
            stroke="rgba(159,184,196,0.15)"
            strokeWidth="2"
          />
          <path
            ref={lineRef}
            d="M12 0 L12 100"
            stroke="#25d0c0"
            strokeWidth="2"
          />
        </svg>

        <ol className="flex flex-col gap-14 sm:pl-20">
          {pipelineStages.map((stage) => {
            const Icon = STAGE_ICONS[stage.id];
            const style = STATUS_STYLES[stage.status];
            return (
              <li key={stage.id} className="pipeline-stage relative">
                <span
                  className="absolute -left-20 top-0 hidden h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-navy sm:flex"
                  aria-hidden
                >
                  <Icon className="h-5 w-5 text-teal" />
                </span>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-14px_rgba(37,208,192,0.5)] sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-mist/60">
                      0{stage.index}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-foam">
                      {stage.name}
                    </h3>
                    <span className="text-sm text-mist">
                      — {stage.tagline}
                    </span>
                    <span
                      className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${style.text} ${style.ring}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        aria-hidden
                      />
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-4 text-mist">{stage.description}</p>
                  <p className="mt-3 text-sm italic text-mist/60">
                    {stage.statusLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
