import type { Metadata } from "next";
import { DashboardClockProvider } from "@/components/dashboard/DashboardClockProvider";
import { DetectionToast } from "@/components/dashboard/DetectionToast";
import { LiveOperationsPanel } from "@/components/dashboard/LiveOperationsPanel";
import { SimulatorPanel } from "@/components/dashboard/SimulatorPanel";
import { WaterQualityPanel } from "@/components/dashboard/WaterQualityPanel";
import { FisherAdvisorPanel } from "@/components/dashboard/FisherAdvisorPanel";
import { SatellitePanel } from "@/components/dashboard/SatellitePanel";
import { ImpactPanel } from "@/components/dashboard/ImpactPanel";

export const metadata: Metadata = {
  title: "Control Center — JalSaafi",
  description:
    "Staff control center: live boat telemetry and real model predictions, water-quality demo, satellite detection feed, fisher advisor, and session impact totals.",
};

export default function ControlCenterPage() {
  return (
    <DashboardClockProvider>
      <DetectionToast />
      <section className="relative px-6 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
              Operator View
            </span>
            <h1 className="font-display mt-3 text-3xl font-semibold text-foam sm:text-4xl">
              Fleet Control Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-mist">
              Built for the staff running a JalSaafi deployment. Connect a
              real ESP32 device below to pull live telemetry and run it
              through the actual trained model — everything else on this page
              is clearly marked demo data pending live hardware.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <LiveOperationsPanel />
            <SimulatorPanel />
            <WaterQualityPanel />
            <FisherAdvisorPanel />
            <SatellitePanel />
            <ImpactPanel />
          </div>
        </div>
      </section>
    </DashboardClockProvider>
  );
}
