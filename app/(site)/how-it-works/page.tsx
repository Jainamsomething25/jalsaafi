import type { Metadata } from "next";
import { PageSubNav } from "@/components/ui/PageSubNav";
import { AIPipeline } from "@/components/sections/AIPipeline";
import { Perceive } from "@/components/sections/Perceive";
import { Predict } from "@/components/sections/Predict";
import { DecideAct } from "@/components/sections/DecideAct";

export const metadata: Metadata = {
  title: "How It Works — JalSaafi",
  description:
    "The 5-stage AI pipeline behind JalSaafi: perceive, predict, decide, act, advise — including a live autonomous-routing simulator.",
};

const subNavItems = [
  { id: "pipeline", label: "Pipeline" },
  { id: "perceive", label: "Perceive" },
  { id: "predict", label: "Predict" },
  { id: "decide-act", label: "Decide & Act" },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageSubNav items={subNavItems} />
      <AIPipeline />
      <Perceive />
      <Predict />
      <DecideAct />
    </>
  );
}
