import { Camera, Film } from "lucide-react";
import type { MediaSlot } from "@/lib/data/prototype";

export function PlaceholderMedia({ slot }: { slot: MediaSlot }) {
  if (slot.src) {
    return slot.kind === "video" ? (
      <video
        src={slot.src}
        controls
        className="h-full w-full rounded-xl object-cover"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slot.src}
        alt={slot.caption}
        className="h-full w-full rounded-xl object-cover"
      />
    );
  }

  const Icon = slot.kind === "video" ? Film : Camera;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-mist/25 bg-white/[0.02] text-mist/50">
      <Icon className="h-6 w-6" aria-hidden />
      <span className="text-xs uppercase tracking-[0.15em]">
        {slot.kind} coming soon
      </span>
    </div>
  );
}
