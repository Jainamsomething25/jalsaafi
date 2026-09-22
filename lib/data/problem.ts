export interface ComparisonRow {
  label: string;
  status: string;
}

export const currentApproach: ComparisonRow[] = [
  { label: "Detection", status: "Manual reports, hours to days after a spill starts" },
  { label: "Response", status: "Human-crewed boats and booms, weather-limited" },
  { label: "Cost", status: "Disposable sorbents, high per-incident cost" },
  { label: "Fisher guidance", status: "Little to no real-time water-safety information" },
];

export const jalsaafiApproach: ComparisonRow[] = [
  { label: "Detection", status: "Satellite + ship-mounted scanning for GPS coordinates" },
  { label: "Response", status: "Autonomous boat, no manual control once launched" },
  { label: "Cost", status: "Reusable magnetic oleophilic sheets, magnetically retrieved and cleaned" },
  { label: "Fisher guidance", status: "Plain-language \"can I fish here?\" from live data" },
];
