export interface BusinessPoint {
  title: string;
  detail: string;
}

export const businessModel: BusinessPoint[] = [
  {
    title: "Who deploys it",
    detail: "Port authorities, coast guards, and fisheries co-ops responding to spills near shipping lanes and fishing grounds.",
  },
  {
    title: "Why the unit cost is low",
    detail: "Magnetic oleophilic sheets are reused after magnetic retrieval instead of discarded like conventional sorbent booms, cutting the per-incident material cost.",
  },
  {
    title: "Why the labor cost is low",
    detail: "One base station launches an autonomous boat with no crew and no manual piloting once it's in the water.",
  },
  {
    title: "How it scales",
    detail: "A single boat proves the pipeline; the roadmap moves to multiple bots coordinating from shared base stations.",
  },
];
