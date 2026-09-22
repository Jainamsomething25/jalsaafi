"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useMagnetic } from "@/lib/useMagnetic";
import { magneticBase, magneticVariants } from "@/components/ui/MagneticButton";

interface MagneticLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

export function MagneticLink({
  children,
  variant = "solid",
  className = "",
  ...props
}: MagneticLinkProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`${magneticBase} ${magneticVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
