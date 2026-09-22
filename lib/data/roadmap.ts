export interface RoadmapItem {
  term: "Near-term" | "Mid-term" | "Long-term";
  title: string;
  detail: string;
}

export const roadmapItems: RoadmapItem[] = [
  {
    term: "Near-term",
    title: "Calibrate turbidity sensing",
    detail: "Measure a real voltage-to-NTU curve for the onboard sensor and stream live ESP32 telemetry into the dashboard.",
  },
  {
    term: "Near-term",
    title: "Field-test the oleophilic sheet conveyor",
    detail: "Validate absorption and magnetic-retrieval cycles on real spills, not just bench tests.",
  },
  {
    term: "Mid-term",
    title: "Deploy the satellite pipeline",
    detail: "Move Perceive from proof-of-concept to a running SAR-imagery pipeline that feeds coordinates to a base station automatically.",
  },
  {
    term: "Mid-term",
    title: "Days-to-safe forecasting",
    detail: "Extend the water-quality model from a point-in-time reading to a forecast of when conditions return to safe.",
  },
  {
    term: "Mid-term",
    title: "Swarm coordination on real hardware",
    detail: "The load-balanced multi-bot coordination is already demonstrated in simulation (see How It Works). Next is validating it across real, physically coordinated boats.",
  },
];
