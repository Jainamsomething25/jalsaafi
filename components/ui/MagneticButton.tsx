"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useMagnetic } from "@/lib/useMagnetic";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline";
}

export const magneticBase =
  "relative inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";
export const magneticVariants = {
  solid: "bg-teal text-oil hover:bg-teal-dim",
  outline: "border border-mist/40 text-foam hover:border-teal hover:text-teal",
};

export function MagneticButton({
  children,
  variant = "solid",
  className = "",
  ...props
}: MagneticButtonProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`${magneticBase} ${magneticVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
