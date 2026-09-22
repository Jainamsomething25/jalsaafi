import type { Metadata } from "next";
import { Problem } from "@/components/sections/Problem";

export const metadata: Metadata = {
  title: "The Problem — JalSaafi",
  description:
    "Oil spills threaten food security for 3 billion+ people who rely on fish for protein, while cleanup stays slow, manual, and expensive.",
};

export default function ProblemPage() {
  return <Problem />;
}
