import type { Metadata } from "next";
import { Prototype } from "@/components/sections/Prototype";

export const metadata: Metadata = {
  title: "The Prototype — JalSaafi",
  description:
    "The physical JalSaafi platform: magnetic oleophilic sheets, ESP32 control, sensor suite, and hardware spec.",
};

export default function PrototypePage() {
  return <Prototype />;
}
