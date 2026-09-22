import type { ReactNode } from "react";
import { ControlCenterHeader } from "@/components/dashboard/ControlCenterHeader";
import { StaffGate } from "@/components/dashboard/StaffGate";

export default function ControlCenterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-black">
      <ControlCenterHeader />
      <main className="flex-1">
        <StaffGate>{children}</StaffGate>
      </main>
    </div>
  );
}
