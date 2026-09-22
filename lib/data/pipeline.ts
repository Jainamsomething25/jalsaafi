export type StageStatus = "built" | "demo" | "roadmap";

export interface PipelineStage {
  id: string;
  index: number;
  name: string;
  tagline: string;
  description: string;
  status: StageStatus;
  statusLabel: string;
}

export const STATUS_STYLES: Record<
  StageStatus,
  { label: string; dot: string; text: string; ring: string }
> = {
  built: {
    label: "Built",
    dot: "bg-teal",
    text: "text-teal",
    ring: "ring-teal/30",
  },
  demo: {
    label: "Demo Data",
    dot: "bg-amber",
    text: "text-amber",
    ring: "ring-amber/30",
  },
  roadmap: {
    label: "Roadmap",
    dot: "bg-mist",
    text: "text-mist",
    ring: "ring-mist/30",
  },
};

export const pipelineStages: PipelineStage[] = [
  {
    id: "perceive",
    index: 1,
    name: "Perceive",
    tagline: "Find the spill",
    description:
      "Satellite SAR imagery and ship-mounted bots scan for oil slicks and extract GPS coordinates for response.",
    status: "demo",
    statusLabel: "Proof of Concept — detection not yet deployed",
  },
  {
    id: "predict",
    index: 2,
    name: "Predict",
    tagline: "Read the water",
    description:
      "A Random Forest model reads pH, temperature, and turbidity to predict whether water can support healthy fish life, and which species fit — with a confidence score.",
    status: "built",
    statusLabel: "Trained on real sensor data — 84.5% accuracy",
  },
  {
    id: "decide",
    index: 3,
    name: "Decide",
    tagline: "Plan the route",
    description:
      "Rule-based autonomous planning scores each slick by volume^1.3 ÷ distance and re-plans live as new spills appear — no manual control, no machine learning. Demonstrated in both single-boat and coordinated swarm modes.",
    status: "built",
    statusLabel: "Autonomous route optimization, demonstrated in simulation — manual override added just for tomorrow's live hardware demo",
  },
  {
    id: "act",
    index: 4,
    name: "Act",
    tagline: "Clean it up",
    description:
      "A floating platform with magnetic oleophilic sheets absorbs oil and is magnetically retrieved and reused.",
    status: "demo",
    statusLabel: "Physical prototype built — real telemetry wired; manual drive + conveyor override added for tomorrow's demo",
  },
  {
    id: "advise",
    index: 5,
    name: "Advise",
    tagline: "Tell the fisher",
    description:
      "A plain-language answer to \"can I fish here?\", generated from the bot's live data for the people who depend on these waters.",
    status: "demo",
    statusLabel: "Built — waiting on live sensor feed",
  },
];
