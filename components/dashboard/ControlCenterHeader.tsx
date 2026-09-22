import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function ControlCenterHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-teal/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-widest text-foam">
            JALSAAFI
          </span>
          <span className="text-mist/30">/</span>
          <span className="text-sm tracking-widest text-teal">CONTROL CENTER</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 rounded-full border border-teal/30 px-3 py-1 text-[10px] uppercase tracking-widest text-teal sm:inline-flex">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Staff access
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-mist transition-colors hover:text-teal"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Exit to site
          </Link>
        </div>
      </div>
    </header>
  );
}
