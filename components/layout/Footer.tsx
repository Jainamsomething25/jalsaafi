"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { siteRoutes } from "@/lib/data/routes";

export function Footer() {
  const reducedMotion = useReducedMotion();

  return (
    <footer className="relative border-t border-white/10 bg-oil px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-foam">JalSaafi</p>
          <p className="mt-2 max-w-xs text-sm text-mist">
            Built for the HKU AI+ Challenge, Smart City &amp; Biodiversity track.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
          {siteRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-teal">
              {route.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
          }
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 px-4 py-2 text-sm text-mist transition-colors hover:border-teal/40 hover:text-teal"
        >
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          Top of page
        </button>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs leading-relaxed text-mist/50">
        <p>
          AI tools used: scikit-learn (Random Forest water-quality model,
          trained on real pond-sensor data) and Claude Code (site
          development assistance).
        </p>
      </div>
    </footer>
  );
}
