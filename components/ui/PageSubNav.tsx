"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface SubNavItem {
  id: string;
  label: string;
}

export function PageSubNav({ items }: { items: SubNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const elements = items
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sticky top-16 z-30 border-b border-white/5 bg-abyss/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-2.5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() =>
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })
              }
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-teal/15 text-teal"
                  : "text-mist/70 hover:bg-white/5 hover:text-mist"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
