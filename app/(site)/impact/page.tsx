import type { Metadata } from "next";
import { PageSubNav } from "@/components/ui/PageSubNav";
import { Impact } from "@/components/sections/Impact";
import { Business } from "@/components/sections/Business";
import { Biodiversity } from "@/components/sections/Biodiversity";

export const metadata: Metadata = {
  title: "Impact — JalSaafi",
  description:
    "Real model accuracy, the business case for autonomous cleanup, and why biodiversity is the point.",
};

const subNavItems = [
  { id: "impact", label: "Impact" },
  { id: "business", label: "Business" },
  { id: "biodiversity", label: "Biodiversity" },
];

export default function ImpactPage() {
  return (
    <>
      <PageSubNav items={subNavItems} />
      <Impact />
      <Business />
      <Biodiversity />
    </>
  );
}
