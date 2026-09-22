"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Droplets, ExternalLink } from "lucide-react";
import { siteRoutes } from "@/lib/data/routes";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-abyss/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foam"
          onClick={() => setOpen(false)}
        >
          <Droplets className="h-4 w-4 text-teal" aria-hidden />
          JALSAAFI
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {siteRoutes.map((route) => {
            const isActive =
              route.href === "/" ? pathname === "/" : pathname.startsWith(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal/10 text-teal"
                    : "text-mist hover:bg-white/5 hover:text-foam"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            href="/control-center"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/10"
          >
            Control Center
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foam lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/5 bg-abyss px-6 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {siteRoutes.map((route) => {
              const isActive =
                route.href === "/" ? pathname === "/" : pathname.startsWith(route.href);
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-teal/10 text-teal" : "text-mist hover:bg-white/5 hover:text-foam"
                    }`}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/control-center"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-1.5 rounded-lg border border-teal/40 px-3 py-2.5 text-sm font-medium text-teal"
              >
                Control Center
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
