import type { Metadata } from "next";
import { Roadmap } from "@/components/sections/Roadmap";

export const metadata: Metadata = {
  title: "Roadmap — JalSaafi",
  description:
    "What's next for JalSaafi, from calibrating onboard sensors to swarm coordination.",
};

export default function RoadmapPage() {
  return <Roadmap />;
}
